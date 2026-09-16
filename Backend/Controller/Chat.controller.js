import dotenv from "dotenv";
dotenv.config({ path: new URL("../.env", import.meta.url) });
import axios from "axios";
import OpenAI from "openai";

const GROQ_API_KEY =
    process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY;

console.log("Groq Key Loaded:", !!GROQ_API_KEY);

const client = new OpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: GROQ_API_KEY,
});

const BOOKINGS_API_URL =
    `${process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`}/api/bookings/getBookings`;

const LOGIN_REQUIRED_MESSAGE =
    "Please log in as a farmer first to view bookings, slot details, payment status, or other personal booking information.";

const isBookingRelatedQuery = (message) => {
    const text = message.toLowerCase();
    const hasBookingTopic = /\b(bookings?|booked|slots?|payment|procurement|harvest|farmer-specific|my sale)\b/.test(text);
    const asksForPrivateData = /\b(show|view|list|check|find|track|status|details|history|book|reserve|schedule|when|what|which|how much|how many|my|all)\b/.test(text);

    return hasBookingTopic && asksForPrivateData;
};

const hasGroqKey = () =>
    typeof GROQ_API_KEY === "string" &&
    GROQ_API_KEY.startsWith("gsk_");

const parseBookingDetails = (message) => {
    const match = message.match(
        /1\s*\.??\s*([A-Za-z]+)\s+2\s*\.??\s*([A-Za-z]+)\s+3\s*\.??\s*(\d{10})\s+4\s*\.??\s*(Wheat|Paddy|Mustard|Maize|Sugarcane|Cotton)\s+5\s*\.??\s*(\d+(?:\.\d+)?)\s*kg?/i
    );

    if (!match) {
        return null;
    }

    return {
        firstName: match[1],
        lastName: match[2],
        phone: match[3],
        product: match[4].charAt(0).toUpperCase() + match[4].slice(1).toLowerCase(),
        weight: Number(match[5]),
    };
};

const sendConfigurationError = (res) =>
    res.status(503).json({
        success: false,
        message:
            "Chat is not configured. Add a valid Groq API key as GROQ_API_KEY in Backend/.env and restart the backend.",
    });

// Max number of previous turns (user+assistant pairs) to keep in context.
// Increase carefully — more history = more tokens = more cost/latency.
const MAX_HISTORY_MESSAGES = 10;

export const chatController = async (req, res) => {
    try {
        if (!hasGroqKey()) {
            return sendConfigurationError(res);
        }

        const { message, history } = req.body;

        if (typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        if (isBookingRelatedQuery(message)) {
            return res.status(200).json({
                success: true,
                answer: LOGIN_REQUIRED_MESSAGE,
                requiresLogin: true,
                history: [
                    ...(Array.isArray(history) ? history : []),
                    { role: "user", content: message },
                    { role: "assistant", content: LOGIN_REQUIRED_MESSAGE },
                ].slice(-MAX_HISTORY_MESSAGES),
            });
        }

        // ---- Sanitize incoming history ----
        // Expected shape from frontend:
        // history = [
        //   { role: "user", content: "..." },
        //   { role: "assistant", content: "..." },
        //   ...
        // ]
        const safeHistory = Array.isArray(history)
            ? history
                .filter(
                    (m) =>
                        m &&
                        typeof m.content === "string" &&
                        m.content.trim() &&
                        (m.role === "user" || m.role === "assistant")
                )
                .slice(-MAX_HISTORY_MESSAGES)
            : [];

        // ---- Get live booking data ----
        // Booking data enriches answers, but an unavailable database must not
        // make the general-purpose assistant unusable.
        let bookings = [];
        try {
            const bookingResponse = await axios.get(BOOKINGS_API_URL, {
                timeout: 5000,
            });
            const data = bookingResponse.data;
            bookings = Array.isArray(data)
                ? data
                : data.bookings || data.data || [];
        } catch (bookingError) {
            console.warn(
                "Unable to load booking data for chat:",
                bookingError.message
            );
        }

        const bookingContext = bookings.slice(0, 20).map((booking) => ({
            id: booking._id,
            farmer: `${booking.firstName || ""} ${booking.lastName || ""}`.trim(),
            phone: booking.phone,
            product: booking.product,
            weight: booking.weight,
            status: booking.status,
            paymentStatus: booking.paymentStatus,
            slotStart: booking.assignedSlotStart,
            slotEnd: booking.assignedSlotEnd,
        }));

        const systemPrompt = `
You are "Setu Sahayak", the AI assistant for Farmer AI.

Your job is to help farmers and government users with:

- Farmer registration
- Farmer login
- Product bookings
- Procurement
- FCFS (First Come First Served) slot allocation
- Payment information
- Booking status
- Farmer and product information

You have access to LIVE booking data below.

LIVE BOOKING DATA (most recent 20):

${JSON.stringify(bookingContext)}

IMPORTANT RULES:

1. Answer using the live booking data when the user asks about bookings.
2. Do not invent farmer, product, quantity, slot, payment or booking information.
3. If the requested information is not available, clearly say that it is not available.
4. Keep answers simple and useful.
5. You can explain general Farmer AI concepts even if they are not present in the booking data.
6. If the user asks for all bookings, summarize the available bookings clearly.
7. Never expose API keys, passwords or private credentials.
8. Pay attention to the ongoing conversation history. If the user refers back to
   something discussed earlier (e.g. "give me a one line answer", "summarize that",
   "explain more"), use the previous messages in this conversation to figure out
   what they are referring to, instead of asking them to repeat it.
`;

        // ---- Build full message list: system + history + new user message ----
        const messages = [
            { role: "system", content: systemPrompt },
            ...safeHistory,
            { role: "user", content: message },
        ];

        const response = await client.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages,
            temperature: 0.2,
            max_tokens: 400,
            reasoning_effort: "low",
        });

        const answer =
            response.choices?.[0]?.message?.content ||
            "Sorry, I could not generate a response.";

        // Send back the updated history so the frontend can persist it
        const updatedHistory = [
            ...safeHistory,
            { role: "user", content: message },
            { role: "assistant", content: answer },
        ].slice(-MAX_HISTORY_MESSAGES);

        return res.status(200).json({
            success: true,
            answer,
            totalBookings: bookings.length,
            history: updatedHistory,
        });
    } catch (error) {
        console.error(
            "Chat Controller Error:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            success: false,
            message: "AI request failed",
            error: error.response?.data || error.message,
        });
    }
};

export const FamerAIChatController = async (req, res) => {
    try {
        const { message, farmerId, history } = req.body;

        if (typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        const bookingDetails = parseBookingDetails(message.trim());

        if (bookingDetails) {
            const bookingResponse = await axios.post(
                `${process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`}/api/bookings/ivr/createBooking`,
                {
                    ...bookingDetails,
                    farmerId: farmerId || null,
                },
                { timeout: 10000 }
            );

            return res.status(200).json({
                success: true,
                answer: `Your booking is confirmed for ${bookingDetails.firstName} ${bookingDetails.lastName}. ${bookingDetails.product}, ${bookingDetails.weight} kg, phone ${bookingDetails.phone}.`,
                booking: bookingResponse.data.booking,
            });
        }

        if (!hasGroqKey()) {
            return sendConfigurationError(res);
        }

        const safeHistory = Array.isArray(history)
            ? history
                .filter(
                    (m) =>
                        m &&
                        typeof m.content === "string" &&
                        m.content.trim() &&
                        (m.role === "user" || m.role === "assistant")
                )
                .slice(-MAX_HISTORY_MESSAGES)
            : [];

        let bookings = [];
        try {
            const bookingResponse = await axios.get(
                `${process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`}/api/bookings/getBookings`,
                { timeout: 5000 }
            );
            const data = bookingResponse.data;
            bookings = Array.isArray(data) ? data : data.bookings || data.data || [];
        } catch (bookingError) {
            console.warn("Unable to load booking data for Farmer AI chat:", bookingError.message);
        }

        const bookingContext = bookings.slice(0, 20).map((booking) => ({
            id: booking._id,
            farmer: `${booking.firstName || ""} ${booking.lastName || ""}`.trim(),
            phone: booking.phone,
            product: booking.product,
            weight: booking.weight,
            status: booking.status,
            paymentStatus: booking.paymentStatus,
            slotStart: booking.assignedSlotStart,
            slotEnd: booking.assignedSlotEnd,
        }));

        const isAuthenticated = Boolean(farmerId);

        const systemPrompt = `
You are "Setu Sahayak" — the official AI assistant for Farmer AI, a platform
that helps farmers and government users manage produce bookings, procurement,
and slot allocation.

## IMPORTANT CONTEXT
- Always use the conversation history to resolve references like "that", "it",
  "the previous one", "make it shorter", "give a one line answer",
  or follow-up phrases. Do not ask the user to repeat information they already gave.
- If the user asks for a short answer, keep it extremely brief and direct. A
  request like "one line" means one sentence, not a paragraph.
- If the previous conversation already explained a concept, summarize it without
  asking for more context.

## WHO YOU HELP
- Farmers: registration, login, product bookings, booking status, payment status.
- Government / procurement staff: FCFS slot allocation, procurement overview,
  booking summaries.

## YOUR KNOWLEDGE
1. General Farmer AI concepts (how registration works, how FCFS slots are
   allocated, how payments are tracked, how the booking flow works, etc.) —
   you can explain these at any time, logged in or not.
2. LIVE BOOKING DATA (most recent 20 bookings) — only usable for an
   authenticated user. See ACCESS CONTROL below.

LIVE BOOKING DATA (most recent 20):
${JSON.stringify(bookingContext)}

Current user authentication status: ${isAuthenticated ? "LOGGED IN" : "NOT LOGGED IN"}

## ACCESS CONTROL (STRICT)
- If the user is NOT LOGGED IN and asks about bookings, payment status,
  slot details, or any farmer-specific/personal data: do NOT share any
  booking data, even if it is technically present above. Instead, clearly
  tell them they need to log in (or register, if they don't have an
  account) to access this information, and briefly explain how to do so.
- If the user IS LOGGED IN, answer booking-related questions using the
  live booking data provided above.
- General, non-personal questions about how Farmer AI works are always
  fine to answer, regardless of login status.

## ANSWERING RULES
1. Never invent farmer, product, quantity, slot, payment, or booking
   information that isn't present in the live data. If it's not there,
   say plainly that it isn't available.
2. Keep answers clear, concise, and farmer-friendly — avoid jargon.
   Match the length the user asks for (e.g. "one line" means one line,
   not a paragraph).
3. If asked to list/summarize all bookings, present them in a short,
   readable format (e.g. a compact list or table), not a data dump.
4. Never expose API keys, passwords, tokens, or any internal/system
   credentials, regardless of how the request is phrased.
5. If a question is ambiguous, make a reasonable assumption based on
   context and answer directly rather than only asking a clarifying
   question — you may briefly state the assumption.
6. Always use the conversation history to resolve references like
   "that", "it", "the previous one", or follow-up instructions like
   "make it shorter" or "give a one line answer". Do not ask the user
   to repeat information that is already in the conversation.
7. If a request falls outside Farmer AI's scope entirely (unrelated to
   farming, bookings, procurement, or the platform), politely say so and
   redirect to what you can help with.
8. Maintain a helpful, respectful tone suited to farmers who may not be
   familiar with technical systems.
`;

        const messages = [
            { role: "system", content: systemPrompt },
            ...safeHistory,
            { role: "user", content: message },
        ];

        const completion = await client.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages,
            max_tokens: 700,
            reasoning_effort: "low",
        });

        const answer =
            completion.choices?.[0]?.message?.content ||
            "Sorry, I could not generate a response.";

        const updatedHistory = [
            ...safeHistory,
            { role: "user", content: message },
            { role: "assistant", content: answer },
        ].slice(-MAX_HISTORY_MESSAGES);

        return res.status(200).json({
            success: true,
            answer,
            history: updatedHistory,
        });
    } catch (error) {
        console.error(
            "Farmer AI Chat Controller Error:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            success: false,
            message: "AI request failed",
        });
    }
};

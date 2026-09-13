import "dotenv/config";
import axios from "axios";
import OpenAI from "openai";

console.log(
    "OpenRouter Key Loaded:",
    !!process.env.OPENROUTER_API_KEY
);

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

const BOOKINGS_API_URL =
    "http://localhost:3000/api/bookings/getBookings";

export const chatController = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        // Get live booking data
        const bookingResponse = await axios.get(
            BOOKINGS_API_URL
        );

        const data = bookingResponse.data;

        const bookings = Array.isArray(data)
            ? data
            : data.bookings || data.data || [];

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

LIVE BOOKING DATA:

${JSON.stringify(bookings, null, 2)}

IMPORTANT RULES:

1. Answer using the live booking data when the user asks about bookings.
2. Do not invent farmer, product, quantity, slot, payment or booking information.
3. If the requested information is not available, clearly say that it is not available.
4. Keep answers simple and useful.
5. You can explain general Farmer AI concepts even if they are not present in the booking data.
6. If the user asks for all bookings, summarize the available bookings clearly.
7. Never expose API keys, passwords or private credentials.
`;

        const response =
            await client.chat.completions.create({
                model: "openai/gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt,
                    },
                    {
                        role: "user",
                        content: message,
                    },
                ],
                temperature: 0.2,
                max_tokens: 700,
            });

        const answer =
            response.choices?.[0]?.message?.content ||
            "Sorry, I could not generate a response.";

        return res.status(200).json({
            success: true,
            answer,
            totalBookings: bookings.length,
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
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        const systemPrompt = `
You are "Setu Sahayak", the AI assistant for Farmer AI.

Your job is to help farmers with:
- Farmer registration and login
- Product bookings and procurement slots
- FCFS (First Come First Served) slot allocation
- Payment information and booking status
- General Farmer AI information

===========================
BOOKING A NEW SLOT
===========================

When the user says anything like "book a slot", "book a new slot", "I want to book",
or similar, do the following:

1. Immediately ask for ALL of the following details together, in a single message,
   as a clear list. Do NOT ask one field at a time across multiple messages.

   Required details:
   - First name
   - Last name
   - Phone number (10 digits)
   - Product (must be one of: Wheat, Paddy, Mustard, Maize, Sugarcane, Cotton)
   - Weight in kg (must be a number, at least 1)

   Example of how to ask:
   "Sure! To book your slot, please share the following details in one message:
   1. First name
   2. Last name
   3. Phone number (10 digits)
   4. Product (Wheat / Paddy / Mustard / Maize / Sugarcane / Cotton)
   5. Weight in kg"

2. Wait for the user's reply. Extract as many of the 5 fields as you can from
   whatever they send, even if it's informal or out of order
   (e.g. "Ramesh Kumar 9876543210 wheat 500kg" should be parsed correctly).

3. If ANY field is still missing or invalid after their reply, ask ONLY for the
   missing/invalid fields — do not re-ask for fields you already have.

4. Once ALL 5 fields are known and valid, call the book_slot tool immediately.
   Do not ask for confirmation first — book it directly.

5. After the tool returns a successful result, confirm the booking clearly to
   the user, restating: name, product, weight, phone, and booking status.

6. If the tool returns an error (e.g. invalid phone, invalid product, or the
   booking API failed), explain the specific problem in simple terms and ask
   the user to correct only that field.

===========================
RULES
===========================
- Never invent or guess field values the user hasn't provided.
- Phone numbers must be exactly 10 digits, digits only.
- Product must exactly match one of: Wheat, Paddy, Mustard, Maize, Sugarcane, Cotton.
  If the user gives a different spelling or crop, clarify or map it to the closest
  valid option, but never silently substitute one.
- Weight must be a positive number in kg.
- Keep responses short, clear, and friendly — this is for farmers, avoid jargon.
- Never expose API keys, internal errors, or system details to the user.
- For anything unrelated to booking (general questions, existing booking status,
  payments, FCFS explanation), answer normally without asking for booking fields.
`;

        const res = await client.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: message
                }
            ]
        });

        const answer =
            res.choices?.[0]?.message?.content ||
            "Sorry, I could not generate a response.";

        return res.status(200).json({
            success: true,
            answer,
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
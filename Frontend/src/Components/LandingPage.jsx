import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Phone,
  ChevronDown,
  Volume2,
  Tractor,
  ShieldCheck,
  Landmark,
  ArrowRight,
  Wheat,
  Truck,
  Users,
  IndianRupee,
  Sprout,
  Menu,
  X,
  MessageCircle,
  Send,
  VolumeX,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Chatbot popup — "Setu Sahayak" ("bridge assistant", echoing "Fasal Setu" /
// harvest bridge). Built with the same lucide icon set and brand-* tokens
// as the rest of the page rather than a new visual language.
// ---------------------------------------------------------------------------

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const FAQ_RESPONSES = [
  {
    keywords: ["register", "registration", "enrol", "sign up"],
    reply:
      "Tap 'Farmer Registration' on the homepage banner to register. You'll need your Aadhaar number and basic land details to complete the form.",
  },
  {
    keywords: ["login", "log in", "sign in", "account"],
    reply:
      "Use 'Login As' on the homepage — Farmer, Staff, or Admin login are all listed there depending on who you are.",
  },
  {
    keywords: ["centre", "center", "procurement", "sell", "harvest"],
    reply:
      "Fasal Setu connects you directly with procurement centres so you can sell your paddy. Once registered, your dashboard will show nearby centres and current procurement details.",
  },
  {
    keywords: ["price", "rate", "value", "payment"],
    reply:
      "Procurement values and quantities are shown in the 'Procurement Details' section on the homepage. For payment status on your own sale, check your farmer dashboard after logging in.",
  },
  {
    keywords: ["contact", "helpline", "phone", "number", "call", "support"],
    reply: "You can call us directly at 09513886363 for farmer support and procurement-related queries.",
  },
  {
    keywords: ["hi", "hello", "hey", "namaskar", "namaste"],
    reply:
      "Hello! I'm Setu Sahayak. Ask me about farmer registration, login, procurement centres, or payments.",
  },
];

const DEFAULT_REPLY =
  "I couldn't quite match that to a topic I know — try asking about registration, login, procurement centres, or payments. For anything else, call 09513886363.";

const HINDI_TRANSLATIONS = {
  "Fasal Setu — A Smarter Way To Sell Your Harvest": "फसल सेतु — अपनी उपज बेचने का बेहतर तरीका",
  "A Smarter Way To Sell Your Harvest": "अपनी उपज बेचने का बेहतर तरीका",
  "Decrease text size": "अक्षर छोटे करें",
  "Increase text size": "अक्षर बड़े करें",
  "Screen reader support": "स्क्रीन रीडर सहायता",
  "Select Language": "भाषा चुनें",
  NOTICE: "सूचना",
  "Fasal Setu — Please check the latest updates on paddy procurement and farmer registration before proceeding.": "फसल सेतु — आगे बढ़ने से पहले धान खरीद और किसान पंजीकरण की नवीनतम जानकारी देखें।",
  "For Farmers": "किसानों के लिए",
  "Sell Your Harvest,": "अपनी उपज बेचें,",
  "The Smarter Way": "बेहतर तरीके से",
  "Register as a farmer on Fasal Setu and connect directly with procurement centres to sell your paddy with ease and transparency.": "फसल सेतु पर किसान के रूप में पंजीकरण करें और आसानी व पारदर्शिता के साथ धान बेचने के लिए खरीद केंद्रों से सीधे जुड़ें।",
  "Farmer Registration": "किसान पंजीकरण",
  "Farmer services & profile": "किसान सेवाएं और प्रोफाइल",
  "Staff Login": "कर्मचारी लॉगिन",
  "Government Officials": "सरकारी अधिकारी",
  "System administration": "सिस्टम प्रशासन",
  "LOGIN AS": "लॉगिन करें",
  "Secure Farmer Portal": "सुरक्षित किसान पोर्टल",
  "Procurement Details": "खरीद विवरण",
  "Procurement Bookings": "खरीद बुकिंग",
  "Offered Quantity": "प्रस्तावित मात्रा",
  "Procurement Value": "खरीद मूल्य",
  "Completed Quantity": "पूरी की गई मात्रा",
  "Farmers Benefitted": "लाभान्वित किसान",
  "Loading...": "लोड हो रहा है...",
  "Unable to load live procurement details.": "लाइव खरीद विवरण लोड नहीं हो सका।",
  "Important Links": "महत्वपूर्ण लिंक",
  "Farmer Login": "किसान लॉगिन",
  "Admin Login": "एडमिन लॉगिन",
  "Government Login": "सरकारी लॉगिन",
  Contact: "संपर्क",
  "Available for farmer support and procurement": "किसान सहायता और खरीद संबंधी",
  "related queries.": "प्रश्नों के लिए उपलब्ध।",
  "Connecting farmers directly to procurement centres.": "किसानों को सीधे खरीद केंद्रों से जोड़ना।",
  "© 2026 Fasal Setu. All Rights Reserved.": "© 2026 फसल सेतु। सर्वाधिकार सुरक्षित।",
};

const BENGALI_TRANSLATIONS = {
  "Fasal Setu — A Smarter Way To Sell Your Harvest": "ফসল সেতু — ফসল বিক্রির আরও স্মার্ট উপায়",
  "A Smarter Way To Sell Your Harvest": "ফসল বিক্রির আরও স্মার্ট উপায়",
  "Decrease text size": "লেখার আকার ছোট করুন",
  "Increase text size": "লেখার আকার বড় করুন",
  "Screen reader support": "স্ক্রিন রিডার সহায়তা",
  "Select Language": "ভাষা নির্বাচন করুন",
  NOTICE: "বিজ্ঞপ্তি",
  "Fasal Setu — Please check the latest updates on paddy procurement and farmer registration before proceeding.": "ফসল সেতু — এগিয়ে যাওয়ার আগে ধান সংগ্রহ এবং কৃষক নিবন্ধনের সর্বশেষ তথ্য দেখুন।",
  "For Farmers": "কৃষকদের জন্য",
  "Sell Your Harvest,": "আপনার ফসল বিক্রি করুন,",
  "The Smarter Way": "আরও স্মার্ট উপায়ে",
  "Register as a farmer on Fasal Setu and connect directly with procurement centres to sell your paddy with ease and transparency.": "ফসল সেতুতে কৃষক হিসেবে নিবন্ধন করুন এবং সহজে ও স্বচ্ছতার সঙ্গে ধান বিক্রির জন্য সংগ্রহ কেন্দ্রগুলোর সঙ্গে সরাসরি যোগাযোগ করুন।",
  "Farmer Registration": "কৃষক নিবন্ধন",
  "Farmer services & profile": "কৃষক পরিষেবা ও প্রোফাইল",
  "Staff Login": "কর্মী লগইন",
  "Government Officials": "সরকারি কর্মকর্তা",
  "System administration": "সিস্টেম প্রশাসন",
  "LOGIN AS": "লগইন করুন",
  "Secure Farmer Portal": "নিরাপদ কৃষক পোর্টাল",
  "Procurement Details": "সংগ্রহের বিবরণ",
  "Procurement Bookings": "সংগ্রহ বুকিং",
  "Offered Quantity": "প্রস্তাবিত পরিমাণ",
  "Procurement Value": "সংগ্রহের মূল্য",
  "Completed Quantity": "সম্পন্ন পরিমাণ",
  "Farmers Benefitted": "উপকৃত কৃষক",
  "Loading...": "লোড হচ্ছে...",
  "Unable to load live procurement details.": "লাইভ সংগ্রহের বিবরণ লোড করা যায়নি।",
  "Important Links": "গুরুত্বপূর্ণ লিঙ্ক",
  "Farmer Login": "কৃষক লগইন",
  "Admin Login": "অ্যাডমিন লগইন",
  "Government Login": "সরকারি লগইন",
  Contact: "যোগাযোগ",
  "Available for farmer support and procurement": "কৃষক সহায়তা ও সংগ্রহ সংক্রান্ত",
  "related queries.": "প্রশ্নের জন্য উপলব্ধ।",
  "Connecting farmers directly to procurement centres.": "কৃষকদের সরাসরি সংগ্রহ কেন্দ্রের সঙ্গে যুক্ত করা।",
  "© 2026 Fasal Setu. All Rights Reserved.": "© ২০২৬ ফসল সেতু। সর্বস্বত্ব সংরক্ষিত।",
};

function getBotReply(userText) {
  const text = userText.toLowerCase();
  const match = FAQ_RESPONSES.find((entry) =>
    entry.keywords.some((k) => text.includes(k))
  );
  return match ? match.reply : DEFAULT_REPLY;
}

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    {
      from: "bot",
      text:
        "Namaskar! I'm Setu Sahayak, your Fasal Setu AI assistant. Ask me about farmers, bookings, procurement, FCFS slots, payments, or anything about Farmer AI.",
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef(null);

  // Keep the chat API on the same configurable backend used by the rest of
  // the app instead of hard-coding localhost for each environment.
  const API_URL = `${API_BASE_URL}/api/chats/chat`;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, open]);


  const sendMessage = async (text) => {
    const trimmed = text.trim();

    if (!trimmed || isTyping) return;

    setMessages((prev) => [
      ...prev,
      {
        from: "user",
        text: trimmed,
      },
    ]);

    setInput("");
    setIsTyping(true);

    try {
      console.log("================================");
      console.log("CHATBOT REQUEST");
      console.log("URL:", API_URL);
      console.log("MESSAGE:", trimmed);
      console.log("================================");

      const response = await axios.post(
        API_URL,
        {
          message: trimmed,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      console.log("BACKEND RESPONSE:", response.data);

      const data = response.data;

      // Axios does NOT use response.ok
      if (!data.success) {
        throw new Error(
          data.message || "AI request failed"
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text:
            data.answer ||
            "No answer received from AI.",
        },
      ]);
    } catch (error) {
      console.error("CHATBOT ERROR:", error);

      let errorMessage =
        "Sorry, I'm unable to connect to the Farmer AI server right now.";

      if (error.response) {
        console.error(
          "STATUS:",
          error.response.status
        );

        console.error(
          "DATA:",
          error.response.data
        );

        errorMessage =
          error.response.data?.message ||
          `Backend error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage =
          "Cannot connect to Farmer AI backend. Make sure Node.js is running on port 3000.";
      } else {
        errorMessage =
          error.message ||
          "Something went wrong.";
      }

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: errorMessage,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };


  const quickPrompts = [
    "Show all bookings",
    "Which farmers booked wheat?",
    "Explain FCFS",
    "Payment status",
  ];


  return (
    <>
      {/* Launcher */}

      <button
        onClick={() => setOpen(!open)}
        aria-label={
          open
            ? "Close chat assistant"
            : "Open chat assistant"
        }
        className="brand-gradient fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl md:bottom-7 md:right-7"
      >
        {open ? (
          <X size={24} />
        ) : (
          <MessageCircle size={24} />
        )}
      </button>


      {/* Chat */}

      {open && (
        <div className="fixed bottom-24 right-5 z-[60] flex h-[70vh] max-h-[560px] w-[92vw] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl md:bottom-28 md:right-7">

          {/* Header */}

          <div className="brand-gradient flex items-center gap-3 px-5 py-4">

            <div className="grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white">
              <Sprout size={20} />
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold text-white">
                Setu Sahayak
              </p>

              <p className="text-[11px] text-white/80">
                Farmer AI Assistant
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>

          </div>


          {/* Messages */}

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-brand-bg px-4 py-4"
          >

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.from === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-6 shadow-sm ${
                    m.from === "user"
                      ? "rounded-br-sm bg-brand-teal text-white"
                      : "rounded-bl-sm border border-gray-200 bg-white text-gray-700"
                  }`}
                >
                  {m.text}
                </div>

              </div>
            ))}


            {/* Typing */}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-gray-200 bg-white px-4 py-3 shadow-sm">

                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />

                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />

                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />

                </div>
              </div>
            )}

          </div>


          {/* Quick prompts */}

          <div className="flex flex-wrap gap-2 border-t border-gray-100 bg-white px-4 py-3">

            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                disabled={isTyping}
                className="rounded-full bg-brand-mint px-3 py-1.5 text-xs font-semibold text-brand-green hover:brightness-95 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}

          </div>


          {/* Input */}

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-gray-200 bg-white p-3"
          >

            <input
              type="text"
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              placeholder="Ask Setu Sahayak..."
              disabled={isTyping}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-mint disabled:bg-gray-100"
            />

            <button
              type="submit"
              disabled={
                !input.trim() || isTyping
              }
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-teal text-white hover:bg-brand-deep disabled:opacity-40"
            >
              <Send size={16} />
            </button>

          </form>

        </div>
      )}
    </>
  );
}

function LandingPage() {
  const pageRef = useRef(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [language, setLanguage] = useState("English");
  const [fontScale, setFontScale] = useState(100);
  const [logoError, setLogoError] = useState(false);
  const [farmer, setFarmer] = useState(null);
  const [procurementBookings, setProcurementBookings] = useState([]);
  const [procurementLoading, setProcurementLoading] = useState(true);
  const [procurementError, setProcurementError] = useState("");
  const [isReading, setIsReading] = useState(false);
  const t = (text) => {
    if (language === "हिंदी") {
      return HINDI_TRANSLATIONS[text] || text;
    }

    if (language === "বাংলা") {
      return BENGALI_TRANSLATIONS[text] || text;
    }

    return text;
  };

  const togglePageReading = () => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    const pageText = pageRef.current?.innerText?.trim();

    if (!pageText) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(pageText);
    utterance.lang =
      language === "हिंदी"
        ? "hi-IN"
        : language === "বাংলা"
          ? "bn-IN"
          : "en-IN";
    utterance.rate = 0.95;
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsReading(true);
  };

  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  // useEffect(() => {
  //   const storedFarmer = axios.get()
  //   if (storedFarmer) {
  //     setFarmer(JSON.parse(storedFarmer));
  //   }
  // }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale}%`;
  }, [fontScale]);

  useEffect(() => {
    const loadProcurementBookings = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/procurement/bookings`
        );
        setProcurementBookings(response.data?.bookings || []);
      } catch (error) {
        console.error("Failed to load procurement details:", error);
        setProcurementError("Unable to load live procurement details.");
      } finally {
        setProcurementLoading(false);
      }
    };

    loadProcurementBookings();
  }, []);

  const languages = ["English", "हिंदी", "বাংলা"];

  const loginOptions = [
    {
      icon: Tractor,
      title: "Farmer Login",
      description: "Farmer services & profile",
      link: "/farmer-aadhar",
      bg: "bg-brand-mint",
      color: "text-brand-green",
    },
    {
      icon: ShieldCheck,
      title: "Staff Login",
      description: "Government Officials",
      link: "/government-aadhar",
      bg: "bg-sky-100",
      color: "text-brand-teal",
    },
    {
      icon: Landmark,
      title: "Admin Login",
      description: "System administration",
      link: "/admin-aadhar",
      bg: "bg-amber-100",
      color: "text-amber-600",
    },
  ];

  const totalOfferedQuantity = procurementBookings.reduce(
    (total, booking) => total + Number(booking.offeredQuantity || 0),
    0
  );
  const totalProcurementValue = procurementBookings.reduce(
    (total, booking) => total + Number(booking.procurementAmount || 0),
    0
  );
  const completedQuantity = procurementBookings
    .filter((booking) => booking.decision === "Accepted")
    .reduce(
      (total, booking) => total + Number(booking.verifiedQuantity || 0),
      0
    );
  const uniqueFarmers = new Set(
    procurementBookings.map((booking) => booking.farmerId || booking.farmerPhone)
  ).size;

  const stats = [
    {
      title: "Procurement Bookings",
      value: procurementLoading ? "Loading..." : procurementBookings.length.toLocaleString("en-IN"),
      icon: Users,
    },
    {
      title: "Offered Quantity",
      value: procurementLoading ? "Loading..." : `${totalOfferedQuantity.toLocaleString("en-IN")} kg`,
      icon: Wheat,
    },
    {
      title: "Procurement Value",
      value: procurementLoading ? "Loading..." : `₹${totalProcurementValue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
    },
    {
      title: "Completed Quantity",
      value: procurementLoading ? "Loading..." : `${completedQuantity.toLocaleString("en-IN")} kg`,
      icon: Truck,
    },
    {
      title: "Farmers Benefitted",
      value: procurementLoading ? "Loading..." : uniqueFarmers.toLocaleString("en-IN"),
      icon: Sprout,
    },
  ];

  return (
    <div ref={pageRef} className="min-h-screen bg-brand-bg text-gray-800">

      {/* =====================================================
          TOP CONTACT STRIP
      ===================================================== */}

      <div className="brand-gradient px-4 py-2 text-sm text-white">

        <div className="mx-auto flex max-w-[1300px] flex-col items-center justify-between gap-1 sm:flex-row">

          <span className="font-medium tracking-wide">
            {t("Fasal Setu — A Smarter Way To Sell Your Harvest")}
          </span>

          <a
            href="tel:09513886363"
            className="flex items-center gap-2 font-semibold transition-colors hover:text-brand-mint"
          >
            <Phone size={14} />
            09513886363
          </a>

        </div>

      </div>


      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 bg-white shadow-sm">

        <div className="mx-auto flex max-w-[1300px] items-center justify-between px-5 py-3">

          {/* LOGO + TITLE */}

          <div className="flex items-center gap-3">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center">
              {logoError ? (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-mint text-brand-green">
                  <Sprout size={28} />
                </div>
              ) : (
                <img
                  src="/logo-icon.png"
                  alt="Fasal Setu logo"
                  className="h-14 w-14 object-contain"
                  onError={() => setLogoError(true)}
                />
              )}
            </div>

            <div>

              <h1 className="text-2xl font-extrabold leading-tight text-brand-deep md:text-3xl">
                {t("Fasal Setu")}
              </h1>

              <p className="text-xs font-semibold text-brand-teal md:text-sm">
                {t("A Smarter Way To Sell Your Harvest")}
              </p>

            </div>

          </div>


          {/* DESKTOP ACTIONS */}

          <div className="hidden items-center gap-2 md:flex">

            <button
              onClick={() => setFontScale((s) => Math.max(80, s - 10))}
              aria-label={t("Decrease text size")}
              className="rounded border border-gray-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              A-
            </button>

            <button
              onClick={() => setFontScale((s) => Math.min(120, s + 10))}
              aria-label={t("Increase text size")}
              className="rounded border border-gray-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              A+
            </button>

            <button
              onClick={togglePageReading}
              aria-label={t("Screen reader support")}
              className="rounded border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
            >
              {isReading ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>


            {/* LANGUAGE DROPDOWN */}

            <div className="relative">

              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 rounded bg-brand-teal px-4 py-2 text-sm font-semibold text-white hover:bg-brand-deep"
              >
                <span>{language}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    langOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {langOpen && (

                <div className="absolute right-0 top-[46px] z-[100] w-40 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">

                  {languages.map((lang) => (

                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setLangOpen(false);
                      }}
                      className={`block w-full px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-brand-mint ${
                        language === lang
                          ? "bg-brand-mint text-brand-green"
                          : "text-gray-700"
                      }`}
                    >
                      {lang}
                    </button>

                  ))}

                </div>

              )}

            </div>

          </div>


          {/* MOBILE MENU BUTTON */}

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle menu"
            className="rounded-lg bg-brand-teal p-2 text-white md:hidden"
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>


        {/* MOBILE PANEL */}

        {mobileMenu && (

          <div className="space-y-3 border-t border-gray-100 px-5 py-4 md:hidden">

            <div className="flex items-center gap-2">

              <button
                onClick={() => setFontScale((s) => Math.max(80, s - 10))}
                className="flex-1 rounded border border-gray-300 py-2 text-sm font-semibold"
              >
                A-
              </button>

              <button
                onClick={() => setFontScale((s) => Math.min(120, s + 10))}
                className="flex-1 rounded border border-gray-300 py-2 text-sm font-semibold"
              >
                A+
              </button>

              <button
                onClick={togglePageReading}
                aria-label={t("Screen reader support")}
                className="flex-1 rounded border border-gray-300 py-2 text-sm"
              >
                {isReading ? (
                  <VolumeX size={16} className="mx-auto" />
                ) : (
                  <Volume2 size={16} className="mx-auto" />
                )}
              </button>

            </div>

            <div>

              <p className="mb-2 text-xs font-semibold uppercase text-gray-400">
                {t("Select Language")}
              </p>

              <div className="flex gap-2">

                {languages.map((lang) => (

                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`flex-1 rounded-lg py-2 text-sm font-semibold ${
                      language === lang
                        ? "bg-brand-teal text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {lang}
                  </button>

                ))}

              </div>

            </div>

          </div>

        )}

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-[1300px] px-4 py-6">


        {/* =====================================================
            NOTICE
        ===================================================== */}

        <div className="mb-6 overflow-hidden rounded-lg border border-amber-200 bg-amber-50 shadow-sm">

          <div className="flex items-center">

            <div className="shrink-0 bg-amber-500 px-5 py-3 text-sm font-bold text-white">
              {t("NOTICE")}
            </div>

            <div className="overflow-hidden px-5 py-3">

              <p className="whitespace-nowrap text-sm font-medium text-amber-900">
                {t("Fasal Setu — Please check the latest updates on paddy procurement and farmer registration before proceeding.")}
              </p>

            </div>

          </div>

        </div>


        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">


          {/* ===================================================
              FARMER REGISTRATION BANNER
          =================================================== */}

          <div className="group relative min-h-[420px] overflow-hidden rounded-2xl shadow-lg">

            {/* BRAND BACKDROP (gradient + sunrise-over-fields motif, no external image) */}

            <div className="absolute inset-0 brand-gradient transition-transform duration-700 group-hover:scale-105">

              {/* SUN GLOW */}

              <div className="absolute -top-12 right-16 h-64 w-64 rounded-full bg-amber-300 opacity-30 blur-3xl" />
              <div className="absolute right-24 top-6 h-28 w-28 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 opacity-70 blur-md" />

              {/* TERRACED FIELD WAVES */}

              <svg
                className="absolute bottom-0 left-0 h-2/5 w-full"
                viewBox="0 0 800 200"
                preserveAspectRatio="none"
              >
                <path d="M0,120 C150,80 350,150 800,90 L800,200 L0,200 Z" fill="rgba(255,255,255,0.10)" />
                <path d="M0,150 C200,110 400,170 800,120 L800,200 L0,200 Z" fill="rgba(255,255,255,0.14)" />
                <path d="M0,180 C250,150 500,190 800,150 L800,200 L0,200 Z" fill="rgba(255,255,255,0.20)" />
              </svg>

            </div>

            {/* GRADIENT OVERLAY FOR TEXT LEGIBILITY */}

            <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/90 via-brand-deep/30 to-transparent" />

            {/* FLOATING ICON */}

            <div className="rice-float absolute right-8 top-8 rounded-full bg-white/90 p-4 shadow-xl">
              <Wheat size={32} className="text-brand-green" />
            </div>

            {/* HERO CONTENT */}

            <div className="absolute bottom-0 left-0 right-0 p-7 text-white md:p-10">

              <span className="inline-block rounded-full bg-brand-green px-4 py-1.5 text-xs font-bold uppercase tracking-wide">
                {t("For Farmers")}
              </span>

              <h2 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
                {t("Sell Your Harvest,")}
                <br />
                {t("The Smarter Way")}
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/90 md:text-base">
                {t("Register as a farmer on Fasal Setu and connect directly with procurement centres to sell your paddy with ease and transparency.")}
              </p>

              <div className="mt-6">

                <Link
                  to="/farmer-register"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3 text-sm font-bold text-brand-deep shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-brand-mint"
                >
                  {t("Farmer Registration")}
                  <ArrowRight size={16} />
                </Link>

              </div>

            </div>

          </div>


          {/* ===================================================
              LOGIN AS
          =================================================== */}

          <aside className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="brand-gradient px-5 py-4">

              <h2 className="text-sm font-bold tracking-wide text-white">
                {t("LOGIN AS")}
              </h2>

            </div>

            {loginOptions.map((option) => {
              const Icon = option.icon;

              return (

                <Link
                  to={option.link}
                  key={option.title}
                  className="group flex items-center gap-3 border-b border-gray-100 px-4 py-5 transition-all duration-200 hover:bg-brand-bg"
                >

                  <div
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${option.bg} ${option.color} transition-transform duration-200 group-hover:scale-110`}
                  >
                    <Icon size={20} />
                  </div>

                  <div className="flex-1">

                    <p className="text-sm font-semibold text-gray-700 group-hover:text-brand-deep">
                      {t(option.title)}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-400">
                      {t(option.description)}
                    </p>

                  </div>

                  <ArrowRight
                    size={16}
                    className="text-gray-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-brand-teal"
                  />

                </Link>

              );
            })}

            <div className="bg-brand-bg px-5 py-3 text-center">
              <p className="text-[11px] text-gray-500">
                {t("Secure Farmer Portal")}
              </p>
            </div>

          </aside>

        </section>


        {/* =====================================================
              PROCUREMENT DETAILS
        ===================================================== */}

        <section className="mt-10">

          <div className="mb-5">

            <h2 className="text-2xl font-bold text-brand-deep">
              {t("Procurement Details")}
            </h2>

            <div className="mt-2 h-1 w-16 rounded bg-brand-green" />

          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

            {procurementError && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2 lg:col-span-5">
                {t(procurementError)}
              </p>
            )}

            {stats.map((stat) => {
              const Icon = stat.icon;

              return (

                <div
                  key={stat.title}
                  className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-mint text-brand-green transition-transform duration-300 group-hover:scale-110">
                    <Icon size={20} />
                  </div>

                  <p className="mt-4 text-xs font-bold uppercase tracking-wide text-gray-400">
                    {t(stat.title)}
                  </p>

                  <p className="mt-2 text-xl font-bold text-brand-deep">
                    {stat.value}
                  </p>

                </div>

              );
            })}

          </div>

        </section>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="mt-12 bg-brand-deep text-white">

        <div className="mx-auto grid max-w-[1300px] gap-10 px-5 py-12 md:grid-cols-3">

          {/* ABOUT */}

          <div>

            <div className="flex items-center gap-3">

              <img
                src="/logo-icon.png"
                alt="Fasal Setu logo"
                className="h-10 w-10 object-contain"
                onError={(e) => (e.target.style.display = "none")}
              />

              <h3 className="text-lg font-bold">
                Fasal Setu
              </h3>

            </div>

            <p className="mt-4 text-sm leading-7 text-white/70">
              {t("A Smarter Way To Sell Your Harvest")}
              <br />
              {t("Connecting farmers directly to procurement centres.")}
            </p>

          </div>


          {/* LINKS */}

          <div>

            <h3 className="font-bold">
                {t("Important Links")}
            </h3>

            <div className="mt-4 space-y-3 text-sm text-white/70">

              <Link to="/farmer-register" className="block hover:text-white">
                {t("Farmer Registration")}
              </Link>

              <Link to="/farmer-aadhar" className="block hover:text-white">
                {t("Farmer Login")}
              </Link>

              <Link to="/admin-aadhar" className="block hover:text-white">
                {t("Admin Login")}
              </Link>

              <Link to="/government-aadhar" className="block hover:text-white">
                {t("Government Login")}
              </Link>

            </div>

          </div>


          {/* CONTACT */}

          <div>

            <h3 className="font-bold">
              {t("Contact")}
            </h3>

            <a
              href="tel:09513886363"
              className="mt-4 flex items-center gap-2 text-lg font-semibold text-white hover:text-brand-mint"
            >
              <Phone size={18} />
              09513886363
            </a>

            <p className="mt-3 text-sm leading-7 text-white/70">
              {t("Available for farmer support and procurement")}
              <br />
              {t("related queries.")}
            </p>

          </div>

        </div>


        {/* COPYRIGHT */}

        <div className="border-t border-white/10">

          <div className="mx-auto flex max-w-[1300px] flex-col justify-between gap-3 px-5 py-5 text-xs text-white/50 md:flex-row">

            <p>
              {t("© 2026 Fasal Setu. All Rights Reserved.")}
            </p>

            <p>
              Empowering Farmers Through Technology
            </p>

          </div>

        </div>

      </footer>

      <ChatBot />

    </div>
  );
}

export default LandingPage;

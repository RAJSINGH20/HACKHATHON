import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  Sprout,
  Tractor,
  Wallet,
  CloudSun,
  Bell,
  MapPin,
  Calendar,
  Droplet,
  Wheat,
  IndianRupee,
  CheckCircle2,
  Clock3,
  ChevronRight,
  Sun,
  Phone,
  Package,
  Menu,
  X,
  User,
  AlertCircle,
  Building2,
  XCircle,
  ClipboardCheck,
  Bot,
  Send,
  LoaderCircle,
  QrCode,
} from "lucide-react";

// ======================================================
// API
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

// ======================================================
// STATIC UI-ONLY DATA
// ======================================================

const SERVICES = [
  {
    name: "Soil testing",
    icon: Droplet,
    rotate: "-rotate-1",
    section: "testing",
  },
  {
    name: "Equipment rental",
    icon: Tractor,
    rotate: "rotate-1",
    section: "equipment",
  },
  {
    name: "Mandi delivery",
    icon: Package,
    rotate: "-rotate-1",
    section: "delivery",
  },
  {
    name: "Irrigation support",
    icon: CloudSun,
    rotate: "rotate-1",
    section: "irrigation",
  },
];

const SERVICE_DETAILS = {
  testing: {
    title: "Soil testing",
    items: [
      {
        name: "Basic soil health check",
        note: "Nutrient levels, pH — results in 3 days",
      },
      {
        name: "Advanced lab panel",
        note: "Includes micronutrients — results in 7 days",
      },
    ],
  },
  equipment: {
    title: "Equipment rental",
    items: [
      {
        name: "Tractor (half day)",
        note: "Available at Sector 12 center",
      },
      {
        name: "Rotavator",
        note: "Available at Rampur Mandi",
      },
      {
        name: "Seed drill",
        note: "Available on request, 2 day notice",
      },
    ],
  },
  delivery: {
    title: "Mandi delivery",
    items: [
      {
        name: "Same-day mandi slot",
        note: "Book before 8 AM for same-day pickup",
      },
      {
        name: "Next-day mandi slot",
        note: "Standard delivery window",
      },
    ],
  },
  irrigation: {
    title: "Irrigation support",
    items: [
      {
        name: "Drip irrigation setup",
        note: "Subsidized under current scheme",
      },
      {
        name: "Water pump service",
        note: "Technician visit within 48 hours",
      },
    ],
  },
};

// ======================================================
// HELPERS
// ======================================================

const formatINR = (value = 0) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (value) => {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "—";

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatTime = (value) => {
  if (!value) return "—";

  return new Date(value).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ======================================================
// NORMALIZE BOOKING
// ======================================================

const normalizeBooking = (booking) => ({
  id: booking._id || booking.id,

  name:
    booking.name ||
    booking.farmerName ||
    booking.userName ||
    booking.user?.name ||
    `${booking.firstName || ""} ${booking.lastName || ""}`.trim() ||
    "Farmer",

  phone:
    booking.phone ||
    booking.farmerPhone ||
    booking.mobile ||
    booking.contactNumber ||
    null,

  service: booking.service || booking.product || "Booking",

  product: booking.product || booking.service || null,

  quantity:
    booking.quantity ??
    booking.weight ??
    booking.offeredQuantity ??
    0,

  unit: booking.unit || "kg",

  offeredQuantity:
    booking.offeredQuantity ??
    booking.weight ??
    booking.quantity ??
    0,

  verifiedQuantity: booking.verifiedQuantity ?? null,

  qualityGrade: booking.qualityGrade ?? null,

  decision:
    booking.decision ||
    booking.procurementDecision ||
    "Pending",

  ratePerKg:
    booking.ratePerKg ??
    booking.rate ??
    booking.price ??
    0,

  procurementAmount:
    booking.procurementAmount ??
    booking.amount ??
    0,

  paymentStatus: booking.paymentStatus || "Pending",

  rejectionReason: booking.rejectionReason || "",

  status: booking.status || "Pending",

  slotStart:
    booking.slotStart ||
    booking.assignedSlotStart ||
    null,

  slotEnd:
    booking.slotEnd ||
    booking.assignedSlotEnd ||
    null,

  procurementCenter:
    booking.procurementCenter ||
    booking.officeName ||
    booking.centerName ||
    null,

  procurementAddress:
    booking.address ||
    booking.procurementAddress ||
    null,

  procurementPhone:
    booking.contactPhone ||
    booking.procurementPhone ||
    null,

  date:
    booking.date ||
    booking.createdAt ||
    null,

  createdAt: booking.createdAt || null,

  checkedAt: booking.checkedAt || null,

  raw: booking,
});

// ======================================================
// UI COMPONENTS
// ======================================================

const StatusPill = ({ status }) => {
  const normalized = String(status || "").toLowerCase();

  const accepted =
    normalized === "accepted" ||
    normalized === "paid" ||
    normalized === "confirmed";

  const rejected = normalized === "rejected";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
        accepted
          ? "bg-green-100 text-green-800"
          : rejected
          ? "bg-red-100 text-red-800"
          : "bg-amber-100 text-amber-800"
      }`}
    >
      {accepted ? (
        <CheckCircle2 size={12} />
      ) : rejected ? (
        <XCircle size={12} />
      ) : (
        <Clock3 size={12} />
      )}

      {status || "Pending"}
    </span>
  );
};

const ProcurementDecisionPill = ({ decision }) => {
  if (decision === "Accepted") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">
        <CheckCircle2 size={12} />
        Accepted
      </span>
    );
  }

  if (decision === "Rejected") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold">
        <XCircle size={12} />
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
      <Clock3 size={12} />
      Pending verification
    </span>
  );
};

const Modal = ({ title, onClose, children }) => (
  <div
    className="fixed inset-0 bg-green-950/60 flex items-center justify-center z-[100] p-5"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-2xl shadow-2xl px-7 py-8 w-full max-w-lg relative max-h-[85vh] overflow-y-auto"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        className="absolute top-4 right-4 text-stone-500 hover:text-stone-800"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={20} />
      </button>

      <h3 className="font-serif text-xl text-green-900 mb-5">
        {title}
      </h3>

      {children}
    </div>
  </div>
);

const DetailRow = ({ label, value }) =>
  value !== null &&
  value !== undefined &&
  value !== "" ? (
    <div className="flex items-center justify-between gap-4 py-1.5 border-b border-stone-100 last:border-0">
      <span className="text-xs text-stone-500">
        {label}
      </span>

      <span className="text-sm font-medium text-stone-800 text-right">
        {value}
      </span>
    </div>
  ) : null;

const PendingBookingQr = ({ booking, farmer }) => {
  const qrValue = farmer?.id && booking?.id
    ? JSON.stringify({
        type: "fasal-setu-farmer-booking",
        bookingId: booking.id,
        farmerId: farmer.id,
        farmerName: booking.name,
        farmerPhone: booking.phone,
        product: booking.product,
        quantity: booking.offeredQuantity,
      })
    : "";

  return (
    <div className="mt-4 flex flex-col items-center gap-4 rounded-xl border border-green-200 bg-green-50/70 p-4 sm:flex-row sm:items-start">
      <div className="rounded-lg border border-stone-200 bg-white p-2 shadow-sm">
        {qrValue ? (
          <QRCodeSVG value={qrValue} size={128} includeMargin />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center bg-stone-100 text-center text-xs text-stone-500">
            QR unavailable
          </div>
        )}
      </div>
      <div className="text-center sm:text-left">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-green-800">
          <QrCode size={14} /> Pending booking QR
        </div>
        <h5 className="font-serif text-base text-green-950">Scan to start this booking</h5>
        <p className="mt-1 text-xs leading-relaxed text-stone-600">
          This code is unique to this pending {booking.product} booking.
        </p>
        <p className="mt-2 text-xs text-stone-500">Show it only to the authorised procurement centre operator.</p>
      </div>
    </div>
  );
};

// ======================================================
// MAIN COMPONENT
// ======================================================

const Farmer_Dashboard = () => {
  const navigate = useNavigate();
  const { users } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const [showPayments, setShowPayments] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ====================================================
  // AI AGENT STATE
  // ====================================================

  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const [aiHistory, setAiHistory] = useState([]);

  const [aiMessages, setAiMessages] = useState([
    {
      from: "bot",
      text:
        "Namaste! 👋 I'm Kisan AI.\n\nAsk me about your bookings, crops, procurement, payments, slots or Farmer AI.",
    },
  ]);

  // ====================================================
  // FETCH FARMER BOOKINGS
  // ====================================================

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/api/bookings/getBookings`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : data.bookings || [];

      const normalized = list.map(normalizeBooking);

      setBookings(normalized);
    } catch (err) {
      console.error(
        "Failed to fetch farmer bookings:",
        err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        navigate("/farmer-login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Couldn't load your bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ====================================================
  // AI CHAT
  // ====================================================

  const sendAIMessage = async (text = aiInput) => {
    const message = text.trim();

    if (!message || aiTyping) return;

    setAiMessages((prev) => [
      ...prev,
      {
        from: "user",
        text: message,
      },
    ]);

    setAiInput("");
    setAiTyping(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/chats/FamerAIChatController`,
        {
          message: message,
          history: aiHistory,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 60000,
        }
      );

      const data = response.data;

      if (!data.success) {
        throw new Error(
          data.message || "AI request failed"
        );
      }

      setAiHistory(data.history || []);

      setAiMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text:
            data.answer ||
            "Sorry, I couldn't generate an answer.",
        },
      ]);

      if (data.booking) {
        fetchBookings();
      }
    } catch (error) {
      console.error("AI CHAT ERROR:", error);

      let errorMessage =
        "Sorry, I couldn't connect to Kisan AI.";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `Backend error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage =
          "Cannot connect to the Farmer AI server. Please make sure your backend is running on port 3000.";
      } else {
        errorMessage =
          error.message ||
          "Something went wrong.";
      }

      setAiMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: errorMessage,
        },
      ]);
    } finally {
      setAiTyping(false);
    }
  };

  // ====================================================
  // ACTIVE BOOKINGS
  // ====================================================

  const activeBookings = useMemo(() => {
    return bookings.filter(
      (booking) => booking.status !== "Cancelled"
    );
  }, [bookings]);

  const pendingBookings = useMemo(
    () => bookings.filter((booking) => booking.decision === "Pending"),
    [bookings]
  );

  const completedBookings = useMemo(
    () =>
      bookings.filter(
        (booking) => booking.decision !== "Pending"
      ),
    [bookings]
  );

  // ====================================================
  // PROCUREMENT BOOKING DATA
  // ====================================================

  const acceptedBookings = useMemo(() => {
    return bookings.filter(
      (booking) => booking.decision === "Accepted"
    );
  }, [bookings]);

  const totalAcceptedQuantity = useMemo(() => {
    return acceptedBookings.reduce(
      (sum, booking) =>
        sum +
        Number(booking.verifiedQuantity || 0),
      0
    );
  }, [acceptedBookings]);

  const totalProcurementAmount = useMemo(() => {
    return acceptedBookings.reduce(
      (sum, booking) =>
        sum +
        Number(booking.procurementAmount || 0),
      0
    );
  }, [acceptedBookings]);

  const totalPaidAmount = useMemo(() => {
    return acceptedBookings
      .filter(
        (booking) =>
          booking.paymentStatus === "Paid"
      )
      .reduce(
        (sum, booking) =>
          sum +
          Number(
            booking.procurementAmount || 0
          ),
        0
      );
  }, [acceptedBookings]);

  // ====================================================
  // STATS
  // ====================================================

  const STATS = [
    {
      key: "bookings",
      label: "Active bookings",
      value: String(activeBookings.length),
      icon: Calendar,
      from: "from-amber-400",
      to: "to-amber-600",
    },
    {
      key: "accepted",
      label: "Accepted quantity",
      value: `${totalAcceptedQuantity.toLocaleString(
        "en-IN"
      )} kg`,
      icon: Wheat,
      from: "from-green-500",
      to: "to-green-700",
    },
    {
      key: "payments",
      label: "Payments received",
      value: formatINR(totalPaidAmount),
      icon: Wallet,
      from: "from-emerald-500",
      to: "to-emerald-700",
    },
    {
      key: "procurement",
      label: "Procurement value",
      value: formatINR(totalProcurementAmount),
      icon: IndianRupee,
      from: "from-blue-500",
      to: "to-blue-700",
    },
  ];

  // ====================================================
  // NEW BOOKING
  // ====================================================

  const handleBookingClick = () => {
    navigate("/booking");
  };

  const handleProfile = () => {
    navigate("/FarmerProfile");
  };

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-stone-50 to-stone-100 font-sans text-stone-800 pb-16">

      {/* TOP BAR */}

      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-800 shadow-lg flex items-center justify-center text-white font-bold font-serif">
              F
            </div>

            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-semibold text-green-900">
                Farmer Dashboard
              </p>

              <p className="text-xs text-stone-500 flex items-center gap-1">
                <MapPin size={11} />
                Procurement & Farmer Portal
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="hidden sm:flex items-center gap-2 bg-gradient-to-br from-sky-400 to-sky-600 text-white text-xs font-semibold px-3 py-2 rounded-full shadow-md">
              <Sun size={14} />
              31°C, Clear
            </div>

            <button className="relative w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center">
              <Bell
                size={16}
                className="text-green-800"
              />

              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white" />
            </button>

            <button
              onClick={handleProfile}
              className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              <User size={16} />
              <span>Profile</span>
            </button>

            <button
              className="sm:hidden"
              onClick={() =>
                setMenuOpen((value) => !value)
              }
            >
              {menuOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>

          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6">

        {/* WELCOME */}

        <div className="relative mt-6 rounded-3xl overflow-hidden shadow-2xl">

          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80"
            alt="Wheat field"
            className="w-full h-56 sm:h-64 object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-green-950/85 via-green-950/50 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-center px-8">

            <p className="text-green-200 text-sm font-medium mb-1">
              Namaste 👋
            </p>

            <h1 className="font-serif text-3xl sm:text-4xl text-white mb-2">
              Farmer Dashboard
            </h1>

            <p className="text-green-100 text-sm max-w-sm">
              Your bookings, procurement,
              verification and payments —
              all in one place.
            </p>

          </div>
        </div>

        {/* STATS */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 -mt-8 relative z-10">

          {STATS.map(
            ({
              key,
              label,
              value,
              icon: Icon,
              from,
              to,
            }) => (
              <div
                key={key}
                className="bg-white rounded-2xl shadow-xl p-5 pt-8 relative"
              >

                <div
                  className={`absolute -top-5 left-5 w-12 h-12 rounded-2xl bg-gradient-to-br ${from} ${to} shadow-lg flex items-center justify-center`}
                >
                  <Icon
                    size={20}
                    className="text-white"
                  />
                </div>

                <p className="text-xs text-stone-500 mt-2">
                  {label}
                </p>

                <p className="text-xl font-bold text-green-900 font-serif mt-1">
                  {value}
                </p>

              </div>
            )
          )}

        </div>

        {/* QUICK SERVICES */}

        <div className="mt-12">

          <h2 className="font-serif text-xl text-green-900 mb-5">
            Quick services
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

            {SERVICES.map(
              ({
                name,
                icon: Icon,
                rotate,
                section,
              }) => (
                <button
                  key={section}
                  onClick={() =>
                    setActiveService(section)
                  }
                  className={`bg-white rounded-2xl shadow-lg p-5 text-left ${rotate} hover:rotate-0 hover:-translate-y-1 hover:shadow-2xl transition-transform`}
                >

                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-600 to-green-800 shadow-md flex items-center justify-center mb-3">
                    <Icon
                      size={18}
                      className="text-white"
                    />
                  </div>

                  <p className="text-sm font-semibold text-stone-800">
                    {name}
                  </p>

                  <span className="inline-flex items-center gap-0.5 text-xs text-green-700 font-semibold mt-2">
                    View options
                    <ChevronRight size={12} />
                  </span>

                </button>
              )
            )}

          </div>
        </div>

        {/* BOOKINGS */}

        <div className="mt-12 bg-white rounded-2xl shadow-lg p-6">

          <div className="flex items-center justify-between mb-4">

            <div>

              <h3 className="font-serif text-lg text-green-900">
                My procurement bookings
              </h3>

              <p className="text-xs text-stone-500 mt-1">
                Live data from government procurement
                records.
              </p>

            </div>

            <Wheat
              size={18}
              className="text-green-700"
            />

          </div>

          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-24 rounded-xl bg-stone-100 animate-pulse"
                />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="flex items-start gap-2 bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm">

              <AlertCircle
                size={16}
                className="mt-0.5 shrink-0"
              />

              <div className="flex-1">

                <p>{error}</p>

                <button
                  onClick={fetchBookings}
                  className="mt-1 text-xs font-semibold underline"
                >
                  Try again
                </button>

              </div>
            </div>
          )}

          {!loading &&
            !error &&
            bookings.length === 0 && (
              <div className="text-center py-10">

                <ClipboardCheck
                  size={35}
                  className="mx-auto text-stone-300 mb-3"
                />

                <p className="text-sm text-stone-500">
                  You don't have any procurement
                  booking yet.
                </p>

                <button
                  onClick={handleBookingClick}
                  className="mt-4 bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
                >
                  Book a new slot
                </button>

              </div>
            )}

          {!loading &&
            !error &&
            bookings.length > 0 && (
              <div className="space-y-8">

                {[
                  ["Pending", pendingBookings],
                  ["Completed", completedBookings],
                ].map(([sectionTitle, sectionBookings]) => (
                  <section key={sectionTitle}>
                    <h4 className="mb-3 font-serif text-base text-green-900">
                      {sectionTitle} bookings
                    </h4>

                    {sectionBookings.length === 0 ? (
                      <p className="rounded-xl bg-stone-50 px-4 py-5 text-sm text-stone-500">
                        No {sectionTitle.toLowerCase()} bookings.
                      </p>
                    ) : (
                      <div className="space-y-4">

                {sectionBookings.map((booking) => (
                  <div key={booking.id} className="rounded-xl border-l-4 border-green-600 bg-stone-50 p-4 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setSelectedBooking(booking)}
                      className="w-full text-left hover:bg-stone-100 transition-colors"
                    >

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 flex-1">

                        <div>
                          <p className="text-xs text-stone-400">
                            Product
                          </p>

                          <p className="text-sm font-semibold text-stone-800 mt-1">
                            {booking.product}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-stone-400">
                            Quantity
                          </p>

                          <p className="text-sm font-semibold text-stone-800 mt-1">
                            {Number(
                              booking.offeredQuantity || 0
                            ).toLocaleString("en-IN")}{" "}
                            kg
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-stone-400">
                            Procurement centre
                          </p>

                          <p className="text-sm font-semibold text-stone-800 mt-1">
                            {booking.procurementCenter ||
                              "Not assigned"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-stone-400">
                            Time slot
                          </p>

                          <p className="text-sm font-semibold text-stone-800 mt-1">
                            {booking.slotStart
                              ? formatTime(
                                  booking.slotStart
                                )
                              : "Not assigned"}
                          </p>
                        </div>

                      </div>

                      <div className="flex flex-wrap items-center gap-2">

                        <ProcurementDecisionPill
                          decision={
                            booking.decision
                          }
                        />

                        <StatusPill
                          status={
                            booking.paymentStatus
                          }
                        />

                        <ChevronRight
                          size={17}
                          className="text-stone-400"
                        />

                      </div>

                    </div>

                    {booking.decision ===
                      "Accepted" && (
                      <div className="mt-4 border-t border-green-200 pt-3 flex flex-wrap gap-x-7 gap-y-2 text-xs text-green-800">

                        <span>
                          <strong>
                            Verified:
                          </strong>{" "}
                          {Number(
                            booking.verifiedQuantity || 0
                          ).toLocaleString(
                            "en-IN"
                          )}{" "}
                          kg
                        </span>

                        <span>
                          <strong>
                            Grade:
                          </strong>{" "}
                          {booking.qualityGrade || "—"}
                        </span>

                        <span>
                          <strong>
                            Rate:
                          </strong>{" "}
                          ₹
                          {Number(
                            booking.ratePerKg || 0
                          )}
                          /kg
                        </span>

                        <span>
                          <strong>
                            Amount:
                          </strong>{" "}
                          {formatINR(
                            booking.procurementAmount
                          )}
                        </span>

                      </div>
                    )}

                    {booking.decision ===
                      "Rejected" && (
                      <div className="mt-4 border-t border-red-200 pt-3 text-xs text-red-800">

                        <strong>
                          Rejection reason:
                        </strong>{" "}
                        {booking.rejectionReason ||
                          "Lot rejected after verification"}

                      </div>
                    )}

                    </button>
                    {sectionTitle === "Pending" && (
                      <PendingBookingQr booking={booking} farmer={users.farmer} />
                    )}
                  </div>
                ))}

                      </div>
                    )}
                  </section>
                ))}

              </div>
            )}

          <button
            onClick={handleBookingClick}
            className="mt-5 bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md"
          >
            Book a new slot
          </button>

          <button
            onClick={fetchBookings}
            className="ml-2 mt-5 border border-green-700 text-green-700 hover:bg-green-50 px-5 py-2.5 rounded-lg text-sm font-semibold"
          >
            Refresh
          </button>

        </div>

        {/* PROCUREMENT SUMMARY */}

        {acceptedBookings.length > 0 && (
          <div className="mt-8 bg-green-900 rounded-2xl shadow-lg p-6 text-white">

            <div className="flex items-center gap-2 mb-5">

              <Building2 size={20} />

              <h3 className="font-serif text-lg">
                Procurement summary
              </h3>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <div className="bg-white/10 rounded-xl p-4">

                <p className="text-xs text-green-200">
                  Accepted quantity
                </p>

                <p className="text-xl font-bold mt-1">
                  {totalAcceptedQuantity.toLocaleString(
                    "en-IN"
                  )}{" "}
                  kg
                </p>

              </div>

              <div className="bg-white/10 rounded-xl p-4">

                <p className="text-xs text-green-200">
                  Procurement value
                </p>

                <p className="text-xl font-bold mt-1">
                  {formatINR(
                    totalProcurementAmount
                  )}
                </p>

              </div>

              <div className="bg-white/10 rounded-xl p-4">

                <p className="text-xs text-green-200">
                  Amount received
                </p>

                <p className="text-xl font-bold mt-1">
                  {formatINR(totalPaidAmount)}
                </p>

              </div>

            </div>

          </div>
        )}

        {/* HELP */}

        <div className="mt-8 bg-green-900 rounded-2xl shadow-lg p-6 flex items-center justify-between flex-wrap gap-4">

          <div>

            <p className="font-serif text-lg text-white">
              Need help?
            </p>

            <p className="text-sm text-green-200">
              Our helpline is open every day,
              7 AM – 8 PM.
            </p>

          </div>

          <a
            href="tel:18001801551"
            className="inline-flex items-center gap-2 bg-white text-green-900 px-5 py-2.5 rounded-lg text-sm font-bold shadow-md"
          >
            <Phone size={16} />
            1800-180-1551
          </a>

        </div>

      </div>

      {/* ==================================================
          SERVICE MODAL
      ================================================== */}

      {activeService && (
        <Modal
          title={
            SERVICE_DETAILS[activeService].title
          }
          onClose={() => setActiveService(null)}
        >

          <div className="space-y-3">

            {SERVICE_DETAILS[
              activeService
            ].items.map((item, index) => (

              <div
                key={index}
                className="bg-stone-50 rounded-xl px-4 py-3 border-l-4 border-green-600"
              >

                <p className="text-sm font-semibold text-stone-800">
                  {item.name}
                </p>

                <p className="text-xs text-stone-500 mt-0.5">
                  {item.note}
                </p>

              </div>

            ))}

          </div>

          <button
            onClick={() => {
              setActiveService(null);
              navigate("/booking");
            }}
            className="mt-5 w-full bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md"
          >
            Book this service
          </button>

        </Modal>
      )}

      {/* ==================================================
          BOOKING DETAIL MODAL
      ================================================== */}

      {selectedBooking && (
        <Modal
          title={
            selectedBooking.product ||
            "Procurement Booking"
          }
          onClose={() =>
            setSelectedBooking(null)
          }
        >

          <div className="flex items-center justify-between mb-4">

            <span className="text-xs text-stone-500">
              Procurement decision
            </span>

            <ProcurementDecisionPill
              decision={
                selectedBooking.decision
              }
            />

          </div>

          <div className="bg-stone-50 rounded-xl px-4 py-3">

            <DetailRow
              label="Farmer"
              value={selectedBooking.name}
            />

            <DetailRow
              label="Phone"
              value={selectedBooking.phone}
            />

            <DetailRow
              label="Product"
              value={selectedBooking.product}
            />

            <DetailRow
              label="Offered quantity"
              value={
                selectedBooking.offeredQuantity !=
                null
                  ? `${Number(
                      selectedBooking.offeredQuantity
                    ).toLocaleString(
                      "en-IN"
                    )} kg`
                  : null
              }
            />

            <DetailRow
              label="Verified quantity"
              value={
                selectedBooking.verifiedQuantity !=
                null
                  ? `${Number(
                      selectedBooking.verifiedQuantity
                    ).toLocaleString(
                      "en-IN"
                    )} kg`
                  : "Not checked"
              }
            />

            <DetailRow
              label="Quality grade"
              value={
                selectedBooking.qualityGrade
                  ? `Grade ${selectedBooking.qualityGrade}`
                  : "Not checked"
              }
            />

            <DetailRow
              label="Rate per kg"
              value={
                selectedBooking.ratePerKg
                  ? `₹${Number(
                      selectedBooking.ratePerKg
                    )}/kg`
                  : "Not decided"
              }
            />

            <DetailRow
              label="Procurement amount"
              value={
                selectedBooking.decision ===
                "Accepted"
                  ? formatINR(
                      selectedBooking.procurementAmount
                    )
                  : "₹0"
              }
            />

            <DetailRow
              label="Payment status"
              value={
                selectedBooking.paymentStatus
              }
            />

            <DetailRow
              label="Procurement centre"
              value={
                selectedBooking.procurementCenter
              }
            />

            <DetailRow
              label="Centre address"
              value={
                selectedBooking.procurementAddress
              }
            />

            <DetailRow
              label="Centre phone"
              value={
                selectedBooking.procurementPhone
              }
            />

            <DetailRow
              label="Appointment date"
              value={
                selectedBooking.slotStart
                  ? formatDate(
                      selectedBooking.slotStart
                    )
                  : "Not assigned"
              }
            />

            <DetailRow
              label="Appointment time"
              value={
                selectedBooking.slotStart
                  ? `${formatTime(
                      selectedBooking.slotStart
                    )} - ${formatTime(
                      selectedBooking.slotEnd
                    )}`
                  : "Not assigned"
              }
            />

            <DetailRow
              label="Booked on"
              value={
                selectedBooking.createdAt
                  ? formatDateTime(
                      selectedBooking.createdAt
                    )
                  : null
              }
            />

            <DetailRow
              label="Checked on"
              value={
                selectedBooking.checkedAt
                  ? formatDateTime(
                      selectedBooking.checkedAt
                    )
                  : null
              }
            />

          </div>

          {selectedBooking.decision ===
            "Accepted" && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">

              <div className="flex items-center gap-2 text-green-800 font-semibold text-sm">

                <CheckCircle2 size={17} />

                Procurement accepted

              </div>

              <p className="text-xs text-green-700 mt-2">

                Government procurement centre
                must buy{" "}

                <strong>
                  {Number(
                    selectedBooking.verifiedQuantity ||
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}{" "}
                  kg
                </strong>{" "}

                of{" "}

                <strong>
                  {selectedBooking.product}
                </strong>{" "}

                for{" "}

                <strong>
                  {formatINR(
                    selectedBooking.procurementAmount
                  )}
                </strong>.

              </p>

            </div>
          )}

          {selectedBooking.decision ===
            "Rejected" && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">

              <div className="flex items-center gap-2 text-red-800 font-semibold text-sm">

                <XCircle size={17} />

                Procurement rejected

              </div>

              <p className="text-xs text-red-700 mt-2">

                {selectedBooking.rejectionReason ||
                  "Lot rejected after verification."}

              </p>

            </div>
          )}

        </Modal>
      )}

      {/* ==================================================
          PAYMENTS MODAL
      ================================================== */}

      {showPayments && (
        <Modal
          title="Payments"
          onClose={() =>
            setShowPayments(false)
          }
        >

          {acceptedBookings.length === 0 ? (

            <p className="text-sm text-stone-500">
              No accepted procurement
              payments yet.
            </p>

          ) : (

            <div className="space-y-3">

              {acceptedBookings.map(
                (booking) => (

                  <div
                    key={booking.id}
                    className="bg-stone-50 rounded-xl px-4 py-3 border-l-4 border-green-600 flex items-center justify-between gap-4"
                  >

                    <div>

                      <p className="text-sm font-semibold text-stone-800">
                        {booking.product}
                      </p>

                      <p className="text-xs text-stone-500">

                        {Number(
                          booking.verifiedQuantity ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}{" "}
                        kg @ ₹
                        {Number(
                          booking.ratePerKg || 0
                        )}
                        /kg

                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-sm font-bold text-green-900">
                        {formatINR(
                          booking.procurementAmount
                        )}
                      </p>

                      <StatusPill
                        status={
                          booking.paymentStatus
                        }
                      />

                    </div>

                  </div>

                )
              )}

            </div>
          )}

          <div className="mt-4 pt-4 border-t border-stone-200 flex items-center justify-between">

            <span className="text-sm font-semibold text-stone-700">
              Total received
            </span>

            <span className="text-lg font-bold text-green-900 font-serif">
              {formatINR(totalPaidAmount)}
            </span>

          </div>

        </Modal>
      )}

      {/* ==================================================
          FLOATING KISAN AI
      ================================================== */}

      <div className="fixed bottom-6 right-6 z-[200]">

        {/* AI CHAT WINDOW */}

        {aiOpen && (
          <div className="absolute bottom-16 right-0 w-[350px] sm:w-[390px] max-w-[calc(100vw-30px)] bg-white rounded-2xl shadow-2xl border border-green-100 overflow-hidden">

            {/* HEADER */}

            <div className="bg-gradient-to-r from-green-900 to-green-600 px-4 py-4 text-white">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot size={22} />
                  </div>

                  <div>

                    <p className="font-semibold">
                      Kisan AI
                    </p>

                    <div className="flex items-center gap-1.5">

                      <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />

                      <p className="text-xs text-green-100">
                        Online • Farmer Assistant
                      </p>

                    </div>

                  </div>

                </div>

                <button
                  onClick={() => setAiOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center"
                >
                  <X size={17} />
                </button>

              </div>

            </div>

            {/* MESSAGES */}

            <div className="h-[380px] overflow-y-auto p-4 space-y-3 bg-stone-50">

              {aiMessages.map(
                (message, index) => (

                  <div
                    key={index}
                    className={`flex ${
                      message.from === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                        message.from === "user"
                          ? "bg-green-700 text-white rounded-br-sm"
                          : "bg-white text-stone-700 shadow-sm border border-stone-100 rounded-bl-sm"
                      }`}
                    >
                      {message.text}
                    </div>

                  </div>

                )
              )}

              {/* TYPING */}

              {aiTyping && (
                <div className="flex justify-start">

                  <div className="bg-white border border-stone-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3">

                    <div className="flex items-center gap-1">

                      <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce" />

                      <span
                        className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                        style={{
                          animationDelay:
                            "150ms",
                        }}
                      />

                      <span
                        className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                        style={{
                          animationDelay:
                            "300ms",
                        }}
                      />

                    </div>

                  </div>

                </div>
              )}

            </div>

            {/* QUICK QUESTIONS */}

            <div className="px-3 pt-3 bg-white">

              <div className="flex gap-2 overflow-x-auto pb-2">

                {[
                  "Show my bookings",
                  "Payment status",
                  "Explain FCFS",
                  "My product details",
                ].map((question) => (

                  <button
                    key={question}
                    onClick={() =>
                      sendAIMessage(question)
                    }
                    disabled={aiTyping}
                    className="whitespace-nowrap text-xs px-3 py-2 rounded-full border border-green-200 text-green-700 hover:bg-green-50 disabled:opacity-50"
                  >
                    {question}
                  </button>

                ))}

              </div>

            </div>

            {/* INPUT */}

            <div className="p-3 bg-white border-t border-stone-100">

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendAIMessage();
                }}
                className="flex items-center gap-2"
              >

                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) =>
                    setAiInput(e.target.value)
                  }
                  placeholder="Ask Kisan AI..."
                  disabled={aiTyping}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />

                <button
                  type="submit"
                  disabled={
                    !aiInput.trim() ||
                    aiTyping
                  }
                  className="w-10 h-10 rounded-xl bg-green-700 hover:bg-green-800 disabled:bg-stone-300 text-white flex items-center justify-center"
                >

                  {aiTyping ? (
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <Send size={18} />
                  )}

                </button>

              </form>

            </div>

          </div>
        )}

        {/* FLOATING BUTTON */}

        <button
          onClick={() =>
            setAiOpen((prev) => !prev)
          }
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-green-600 to-green-900 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-200"
          aria-label="Open Kisan AI"
        >

          {aiOpen ? (
            <X size={25} />
          ) : (
            <Bot size={25} />
          )}

          {!aiOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white animate-pulse" />
          )}

        </button>

      </div>

    </div>
  );
};

export default Farmer_Dashboard;
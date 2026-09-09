import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  Award,
  TrendingUp,
  Phone,
  Package,
  Menu,
  X,
  AlertCircle,
  Building2,
  XCircle,
  ClipboardCheck,
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

  service:
    booking.service ||
    booking.product ||
    "Booking",

  product:
    booking.product ||
    booking.service ||
    null,

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

  verifiedQuantity:
    booking.verifiedQuantity ?? null,

  qualityGrade:
    booking.qualityGrade ?? null,

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

  paymentStatus:
    booking.paymentStatus ||
    "Pending",

  rejectionReason:
    booking.rejectionReason || "",

  status:
    booking.status || "Pending",

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

  createdAt:
    booking.createdAt || null,

  checkedAt:
    booking.checkedAt || null,

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
      <span className="text-xs text-stone-500">{label}</span>
      <span className="text-sm font-medium text-stone-800 text-right">
        {value}
      </span>
    </div>
  ) : null;

// ======================================================
// MAIN COMPONENT
// ======================================================

const Farmer_Dashboard = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(null);

  const [showPayments, setShowPayments] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  // ACTIVE BOOKINGS
  // ====================================================

  const activeBookings = useMemo(() => {
    return bookings.filter(
      (booking) =>
        booking.status !== "Cancelled"
    );
  }, [bookings]);

  // ====================================================
  // PROCUREMENT BOOKING DATA
  // ====================================================

  const acceptedBookings = useMemo(() => {
    return bookings.filter(
      (booking) =>
        booking.decision === "Accepted"
    );
  }, [bookings]);

  const totalAcceptedQuantity = useMemo(() => {
    return acceptedBookings.reduce(
      (sum, booking) =>
        sum +
        Number(
          booking.verifiedQuantity || 0
        ),
      0
    );
  }, [acceptedBookings]);

  const totalProcurementAmount = useMemo(() => {
    return acceptedBookings.reduce(
      (sum, booking) =>
        sum +
        Number(
          booking.procurementAmount || 0
        ),
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
      value: String(
        activeBookings.length
      ),
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
      value: formatINR(
        totalPaidAmount
      ),
      icon: Wallet,
      from: "from-emerald-500",
      to: "to-emerald-700",
    },

    {
      key: "procurement",
      label: "Procurement value",
      value: formatINR(
        totalProcurementAmount
      ),
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

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-stone-50 to-stone-100 font-sans text-stone-800 pb-16">

      {/* ==================================================
          TOP BAR
      ================================================== */}

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
              className="sm:hidden"
              onClick={() =>
                setMenuOpen(
                  (value) => !value
                )
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

        {/* ==================================================
            WELCOME
        ================================================== */}

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

        {/* ==================================================
            STATS
        ================================================== */}

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

        {/* ==================================================
            QUICK SERVICES
        ================================================== */}

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
                    setActiveService(
                      section
                    )
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

        {/* ==================================================
            BOOKINGS
        ================================================== */}

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

          {/* LOADING */}

          {loading && (
            <div className="space-y-3">

              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="h-24 rounded-xl bg-stone-100 animate-pulse"
                  />
                )
              )}
            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="flex items-start gap-2 bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm">

              <AlertCircle
                size={16}
                className="mt-0.5 shrink-0"
              />

              <div className="flex-1">

                <p>{error}</p>

                <button
                  onClick={
                    fetchBookings
                  }
                  className="mt-1 text-xs font-semibold underline"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            !error &&
            bookings.length === 0 && (
              <div className="text-center py-10">

                <ClipboardCheck
                  size={35}
                  className="mx-auto text-stone-300 mb-3"
                />

                <p className="text-sm text-stone-500">
                  You don't have any
                  procurement booking yet.
                </p>

                <button
                  onClick={
                    handleBookingClick
                  }
                  className="mt-4 bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
                >
                  Book a new slot
                </button>
              </div>
            )}

          {/* BOOKINGS */}

          {!loading &&
            !error &&
            bookings.length > 0 && (
              <div className="space-y-4">

                {bookings.map(
                  (booking) => (
                    <button
                      key={booking.id}
                      type="button"
                      onClick={() =>
                        setSelectedBooking(
                          booking
                        )
                      }
                      className="w-full text-left bg-stone-50 rounded-xl p-4 border-l-4 border-green-600 shadow-sm hover:bg-stone-100 transition-colors"
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
                                booking.offeredQuantity ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}{" "}
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

                      {/* ACCEPTED SUMMARY */}

                      {booking.decision ===
                        "Accepted" && (
                        <div className="mt-4 border-t border-green-200 pt-3 flex flex-wrap gap-x-7 gap-y-2 text-xs text-green-800">

                          <span>
                            <strong>
                              Verified:
                            </strong>{" "}
                            {Number(
                              booking.verifiedQuantity ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}{" "}
                            kg
                          </span>

                          <span>
                            <strong>
                              Grade:
                            </strong>{" "}
                            {booking.qualityGrade ||
                              "—"}
                          </span>

                          <span>
                            <strong>
                              Rate:
                            </strong>{" "}
                            ₹
                            {Number(
                              booking.ratePerKg ||
                                0
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

                      {/* REJECTED SUMMARY */}

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
                  )
                )}
              </div>
            )}

          <button
            onClick={
              handleBookingClick
            }
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

        {/* ==================================================
            PROCUREMENT SUMMARY
        ================================================== */}

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
                  {formatINR(
                    totalPaidAmount
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            HELP
        ================================================== */}

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
            SERVICE_DETAILS[
              activeService
            ].title
          }
          onClose={() =>
            setActiveService(null)
          }
        >
          <div className="space-y-3">

            {SERVICE_DETAILS[
              activeService
            ].items.map(
              (item, index) => (
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
              )
            )}
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
              value={
                selectedBooking.name
              }
            />

            <DetailRow
              label="Phone"
              value={
                selectedBooking.phone
              }
            />

            <DetailRow
              label="Product"
              value={
                selectedBooking.product
              }
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
                <CheckCircle2
                  size={17}
                />
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
                </strong>
                .
              </p>
            </div>
          )}

          {selectedBooking.decision ===
            "Rejected" && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">

              <div className="flex items-center gap-2 text-red-800 font-semibold text-sm">
                <XCircle
                  size={17}
                />
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
          {acceptedBookings.length ===
          0 ? (
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
                          booking.ratePerKg ||
                            0
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
              {formatINR(
                totalPaidAmount
              )}
            </span>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Farmer_Dashboard;
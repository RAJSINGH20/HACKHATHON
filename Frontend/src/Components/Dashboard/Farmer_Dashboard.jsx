import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Sprout, Tractor, Wallet, CloudSun, Bell, MapPin, Calendar,
  Droplet, Wheat, IndianRupee, CheckCircle2, Clock3, ChevronRight,
  Sun, Award, TrendingUp, Phone, Package, Menu, X, AlertCircle,
} from "lucide-react";

// ---- Mock data (swap with real API data later) -----------------------------

const FARMER = { name: "Ramesh Kumar", village: "Rampur, Durgapur Block", landAcres: 4.5 };

const STATS_BASE = [
  { key: "land", label: "My land", value: "4.5 acres", icon: Sprout, from: "from-green-500", to: "to-green-700" },
  { key: "bookings", label: "Active bookings", value: null, icon: Calendar, from: "from-amber-400", to: "to-amber-600" },
  { key: "payments", label: "Payments received", value: "₹18,200", icon: Wallet, from: "from-emerald-500", to: "to-emerald-700" },
  { key: "health", label: "Crop health", value: "Good", icon: TrendingUp, from: "from-lime-500", to: "to-green-600" },
];

const SERVICES = [
  { name: "Soil testing", icon: Droplet, rotate: "-rotate-1", section: "testing" },
  { name: "Equipment rental", icon: Tractor, rotate: "rotate-1", section: "equipment" },
  { name: "Mandi delivery", icon: Package, rotate: "-rotate-1", section: "delivery" },
  { name: "Irrigation support", icon: CloudSun, rotate: "rotate-1", section: "irrigation" },
];

const SERVICE_DETAILS = {
  testing: {
    title: "Soil testing",
    items: [
      { name: "Basic soil health check", note: "Nutrient levels, pH — results in 3 days" },
      { name: "Advanced lab panel", note: "Includes micronutrients — results in 7 days" },
    ],
  },
  equipment: {
    title: "Equipment rental",
    items: [
      { name: "Tractor (half day)", note: "Available at Sector 12 center" },
      { name: "Rotavator", note: "Available at Rampur Mandi" },
      { name: "Seed drill", note: "Available on request, 2 day notice" },
    ],
  },
  delivery: {
    title: "Mandi delivery",
    items: [
      { name: "Same-day mandi slot", note: "Book before 8 AM for same-day pickup" },
      { name: "Next-day mandi slot", note: "Standard delivery window" },
    ],
  },
  irrigation: {
    title: "Irrigation support",
    items: [
      { name: "Drip irrigation setup", note: "Subsidized under current scheme" },
      { name: "Water pump service", note: "Technician visit within 48 hours" },
    ],
  },
};

const SALES = [
  { crop: "Wheat", weight: 500, rate: 22, date: "01 Sep 2026", status: "Paid" },
  { crop: "Wheat", weight: 600, rate: 22, date: "05 Sep 2026", status: "Pending" },
];

const LAND_DETAIL = {
  totalAcres: 4.5,
  plots: [
    { name: "Plot A", acres: 2.0, crop: "Wheat", soil: "Loamy" },
    { name: "Plot B", acres: 1.5, crop: "Mustard", soil: "Sandy loam" },
    { name: "Plot C", acres: 1.0, crop: "Fallow (next: Maize)", soil: "Clay loam" },
  ],
};

const formatINR = (n) => `₹${n.toLocaleString("en-IN")}`;

// Normalize whatever shape the backend returns into { service, date, status }
// so the UI doesn't break if field names differ slightly (e.g. product vs service).
const normalizeBooking = (b) => ({
  id: b._id || b.id,
  service: b.service || b.product || "Booking",
  date: b.date
    ? new Date(b.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : b.createdAt
    ? new Date(b.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—",
  status: b.status || "Pending",
});

// ---- Small building blocks -----------------------------------------------

const StatusPill = ({ status }) => {
  const paid = status === "Paid" || status === "Confirmed";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
        paid ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
      }`}
    >
      {paid ? <CheckCircle2 size={12} /> : <Clock3 size={12} />}
      {status}
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
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute top-4 right-4 text-stone-500 hover:text-stone-800"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={20} />
      </button>
      <h3 className="font-serif text-xl text-green-900 mb-5">{title}</h3>
      {children}
    </div>
  </div>
);

// ---- Main component --------------------------------------------------------

const Farmer_Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(null); // service key or null
  const [showLand, setShowLand] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const navigate = useNavigate();

  // ---- Dynamic bookings state ----
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);

  const fetchBookings = async () => {
    setBookingsLoading(true);
    setBookingsError(null);

    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/bookings/getBookings",
        { withCredentials: true }
      );

      // Handle either { bookings: [...] } or a raw array response.
      const list = Array.isArray(data) ? data : data.bookings || [];

      setBookings(list.map(normalizeBooking));
    } catch (err) {
      console.error("Failed to fetch bookings:", err);

      const status = err.response?.status;

      if (status === 401 || status === 403) {
        setBookingsError("Your session has expired. Please log in again.");
        navigate("/farmer-login");
        return;
      }

      setBookingsError(
        err.response?.data?.message ||
          "Couldn't load your bookings. Please try again."
      );
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBookingClick = () => {
    navigate("/booking");
  };

  const activeBookingsCount = bookings.filter(
    (b) => b.status !== "Cancelled"
  ).length;

  const STATS = STATS_BASE.map((s) =>
    s.key === "bookings"
      ? { ...s, value: bookingsLoading ? "…" : String(activeBookingsCount) }
      : s
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-stone-50 to-stone-100 font-sans text-stone-800 pb-16">
      {/* TOP BAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-800 shadow-lg flex items-center justify-center text-white font-bold font-serif">
              {FARMER.name.charAt(0)}
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-semibold text-green-900">{FARMER.name}</p>
              <p className="text-xs text-stone-500 flex items-center gap-1">
                <MapPin size={11} /> {FARMER.village}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-gradient-to-br from-sky-400 to-sky-600 text-white text-xs font-semibold px-3 py-2 rounded-full shadow-md">
              <Sun size={14} /> 31°C, Clear
            </div>
            <button className="relative w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center">
              <Bell size={16} className="text-green-800" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white" />
            </button>
            <button className="sm:hidden" onClick={() => setMenuOpen((v) => !v)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6">
        {/* WELCOME BANNER */}
        <div className="relative mt-6 rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80"
            alt="Wheat field at sunrise"
            className="w-full h-56 sm:h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-950/85 via-green-950/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-8">
            <p className="text-green-200 text-sm font-medium mb-1">Namaste 👋</p>
            <h1 className="font-serif text-3xl sm:text-4xl text-white mb-2">{FARMER.name}</h1>
            <p className="text-green-100 text-sm max-w-sm">
              Your fields, bookings, and payments — all in one place.
            </p>
          </div>
        </div>

        {/* STATS — raised 3D cards overlapping the banner. Land + Payments are clickable */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 -mt-8 relative z-10">
          {STATS.map(({ key, label, value, icon: Icon, from, to }) => {
            const clickable = key === "land" || key === "payments";
            const onClick =
              key === "land" ? () => setShowLand(true) :
              key === "payments" ? () => setShowPayments(true) :
              undefined;

            return (
              <button
                key={key}
                type="button"
                onClick={onClick}
                disabled={!clickable}
                className={`text-left bg-white rounded-2xl shadow-xl p-5 pt-8 relative hover:-translate-y-1 hover:shadow-2xl transition-transform ${
                  clickable ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div
                  className={`absolute -top-5 left-5 w-12 h-12 rounded-2xl bg-gradient-to-br ${from} ${to} shadow-lg flex items-center justify-center`}
                >
                  <Icon size={20} className="text-white" />
                </div>
                <p className="text-xs text-stone-500 mt-2">{label}</p>
                <p className="text-xl font-bold text-green-900 font-serif mt-1">{value}</p>
                {clickable && (
                  <span className="inline-flex items-center gap-0.5 text-xs text-green-700 font-semibold mt-2">
                    View details <ChevronRight size={12} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* QUICK SERVICES — each opens its own section detail */}
        <div className="mt-12">
          <h2 className="font-serif text-xl text-green-900 mb-5">Quick services</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {SERVICES.map(({ name, icon: Icon, rotate, section }) => (
              <button
                key={section}
                onClick={() => setActiveService(section)}
                className={`bg-white rounded-2xl shadow-lg p-5 text-left ${rotate} hover:rotate-0 hover:-translate-y-1 hover:shadow-2xl transition-transform`}
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-600 to-green-800 shadow-md flex items-center justify-center mb-3">
                  <Icon size={18} className="text-white" />
                </div>
                <p className="text-sm font-semibold text-stone-800">{name}</p>
                <span className="inline-flex items-center gap-0.5 text-xs text-green-700 font-semibold mt-2">
                  View options <ChevronRight size={12} />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* BOOKINGS + WEATHER/TIP ROW */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-green-900">My bookings</h3>
              <Wheat size={18} className="text-green-700" />
            </div>

            {/* Loading state */}
            {bookingsLoading && (
              <div className="space-y-3">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="h-14 rounded-xl bg-stone-100 animate-pulse"
                  />
                ))}
              </div>
            )}

            {/* Error state */}
            {!bookingsLoading && bookingsError && (
              <div className="flex items-start gap-2 bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <div>
                  <p>{bookingsError}</p>
                  <button
                    onClick={fetchBookings}
                    className="mt-1 text-xs font-semibold underline underline-offset-2"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!bookingsLoading && !bookingsError && bookings.length === 0 && (
              <p className="text-sm text-stone-500">
                You don't have any bookings yet.
              </p>
            )}

            {/* Loaded bookings */}
            {!bookingsLoading && !bookingsError && bookings.length > 0 && (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between bg-stone-50 rounded-xl px-4 py-3 border-l-4 border-green-600 shadow-sm"
                  >
                    <div>
                      <p className="text-sm font-semibold text-stone-800">{b.service}</p>
                      <p className="text-xs text-stone-500">{b.date}</p>
                    </div>
                    <StatusPill status={b.status} />
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleBookingClick}
              className="mt-5 bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md"
            >
              Book a new slot
            </button>
          </div>

          <div className="bg-gradient-to-br from-sky-500 to-sky-700 rounded-2xl shadow-lg p-6 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sun size={20} />
                <p className="font-serif text-lg">Today's tip</p>
              </div>
              <p className="text-sm text-sky-100 leading-relaxed">
                Clear skies expected all week — a good window for irrigation
                and applying fertilizer before the next rainfall.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 bg-white/15 rounded-lg px-3 py-2 w-fit">
              <Award size={14} />
              <span className="text-xs font-semibold">Good farming week ahead</span>
            </div>
          </div>
        </div>

        {/* MY SALES */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-green-900">My recent sales</h3>
            <Package size={18} className="text-green-700" />
          </div>
          <div className="divide-y divide-stone-100">
            {SALES.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-3 text-sm">
                <span className="text-stone-800 font-medium">{s.crop}</span>
                <span className="text-stone-500">{s.weight} kg</span>
                <span className="text-stone-500">₹{s.rate}/kg</span>
                <span className="text-stone-800 font-semibold flex items-center gap-1">
                  <IndianRupee size={12} />
                  {(s.weight * s.rate).toLocaleString("en-IN")}
                </span>
                <StatusPill status={s.status} />
              </div>
            ))}
          </div>
        </div>

        {/* HELPLINE STRIP */}
        <div className="mt-8 bg-green-900 rounded-2xl shadow-lg p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-serif text-lg text-white">Need help?</p>
            <p className="text-sm text-green-200">Our helpline is open every day, 7 AM – 8 PM.</p>
          </div>
          <a
            href="tel:18001801551"
            className="inline-flex items-center gap-2 bg-white text-green-900 px-5 py-2.5 rounded-lg text-sm font-bold shadow-md"
          >
            <Phone size={16} /> 1800-180-1551
          </a>
        </div>
      </div>

      {/* SERVICE DETAIL MODAL */}
      {activeService && (
        <Modal title={SERVICE_DETAILS[activeService].title} onClose={() => setActiveService(null)}>
          <div className="space-y-3">
            {SERVICE_DETAILS[activeService].items.map((item, i) => (
              <div key={i} className="bg-stone-50 rounded-xl px-4 py-3 border-l-4 border-green-600">
                <p className="text-sm font-semibold text-stone-800">{item.name}</p>
                <p className="text-xs text-stone-500 mt-0.5">{item.note}</p>
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

      {/* LAND DETAIL MODAL */}
      {showLand && (
        <Modal title="My land" onClose={() => setShowLand(false)}>
          <p className="text-sm text-stone-600 mb-4">
            Total land: <span className="font-semibold text-green-900">{LAND_DETAIL.totalAcres} acres</span>
          </p>
          <div className="space-y-3">
            {LAND_DETAIL.plots.map((plot, i) => (
              <div key={i} className="bg-stone-50 rounded-xl px-4 py-3 border-l-4 border-green-600">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-stone-800">{plot.name}</p>
                  <span className="text-xs text-stone-500">{plot.acres} acres</span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Crop: {plot.crop} · Soil: {plot.soil}
                </p>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* PAYMENTS DETAIL MODAL */}
      {showPayments && (
        <Modal title="Payments received" onClose={() => setShowPayments(false)}>
          <div className="space-y-3">
            {SALES.map((s, i) => (
              <div key={i} className="bg-stone-50 rounded-xl px-4 py-3 border-l-4 border-green-600 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-stone-800">{s.crop}</p>
                  <p className="text-xs text-stone-500">{s.weight} kg @ ₹{s.rate}/kg · {s.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-900">{formatINR(s.weight * s.rate)}</p>
                  <StatusPill status={s.status} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-stone-200 flex items-center justify-between">
            <span className="text-sm font-semibold text-stone-700">Total received</span>
            <span className="text-lg font-bold text-green-900 font-serif">
              {formatINR(SALES.filter((s) => s.status === "Paid").reduce((sum, s) => sum + s.weight * s.rate, 0))}
            </span>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Farmer_Dashboard;
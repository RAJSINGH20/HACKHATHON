import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Landmark,
  ShieldCheck,
  Wheat,
  Warehouse,
  Phone,
  Mail,
  MapPin,
  Search,
  IndianRupee,
  CheckCircle2,
  Clock3,
  Menu,
  ArrowLeft,
  BadgeCheck,
  Users,
  FileCheck2,
  BarChart3,
  Building2,
  XCircle,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
} from "lucide-react";

// ======================================================
// API
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

// ======================================================
// NAVIGATION
// ======================================================

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "controller", label: "Controller" },
  { id: "contact", label: "Contact" },
];

// ======================================================
// HELPERS
// ======================================================

const formatINR = (value = 0) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatNumber = (value = 0) =>
  Number(value || 0).toLocaleString("en-IN");

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
// COMPONENTS
// ======================================================

const TricolorBar = () => (
  <div className="h-1.5 w-full flex">
    <div className="flex-1 bg-orange-500" />
    <div className="flex-1 bg-white" />
    <div className="flex-1 bg-green-700" />
  </div>
);

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-slate-500">{label}</span>
      <Icon size={18} className="text-blue-800" />
    </div>

    <p className="text-2xl font-bold text-blue-900 font-serif">
      {value}
    </p>
  </div>
);

const DecisionPill = ({ decision }) => {
  if (decision === "Accepted") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
        <CheckCircle2 size={12} />
        Accepted
      </span>
    );
  }

  if (decision === "Rejected") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
        <XCircle size={12} />
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
      <Clock3 size={12} />
      Pending
    </span>
  );
};

const PaymentPill = ({ status }) => {
  if (status === "Paid") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
        <CheckCircle2 size={12} />
        Paid
      </span>
    );
  }

  if (status === "Processing") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
        <Clock3 size={12} />
        Processing
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
      <Clock3 size={12} />
      Pending
    </span>
  );
};

const GradePill = ({ grade }) => {
  if (!grade) {
    return (
      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
        Not checked
      </span>
    );
  }

  const accepted = grade === "A" || grade === "B";

  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
        accepted
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      Grade {grade}
    </span>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-5 py-2 border-b border-slate-100 last:border-0">
    <span className="text-xs text-slate-500">{label}</span>

    <span className="text-sm font-medium text-slate-800 text-right">
      {value ?? "—"}
    </span>
  </div>
);

// ======================================================
// CONTROLLER PAGE
// ======================================================

const ControllerPage = ({ onBack }) => {
  const [bookings, setBookings] = useState([]);
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [openSlot, setOpenSlot] = useState(null);

  const [formData, setFormData] = useState({});

  const [submitting, setSubmitting] = useState({});

  // ====================================================
  // FETCH ALL PROCUREMENT DATA
  // ====================================================

  const fetchProcurementData = async (
    showLoader = true
  ) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const [bookingResponse, dashboardResponse] =
        await Promise.all([
          axios.get(
            `${API_URL}/api/procurement/bookings`
          ),
          axios.get(
            `${API_URL}/api/procurement/dashboard`
          ),
        ]);

      setBookings(
        bookingResponse.data?.bookings || []
      );

      setDashboard(
        dashboardResponse.data?.dashboard || null
      );
    } catch (err) {
      console.error(
        "PROCUREMENT DATA ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load procurement data"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProcurementData();
  }, []);

  // ====================================================
  // SEARCH
  // ====================================================

  const filteredBookings = useMemo(() => {
    const query =
      searchQuery.toLowerCase().trim();

    if (!query) {
      return bookings;
    }

    return bookings.filter((booking) => {
      const data = [
        booking.farmerName,
        booking.farmerPhone,
        booking.product,
        booking.procurementCenter,
        booking.decision,
        booking.paymentStatus,
        booking.qualityGrade,
        booking.bookingId,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return data.includes(query);
    });
  }, [bookings, searchQuery]);

  // ====================================================
  // FORM
  // ====================================================

  const getForm = (booking) => {
    const current = formData[booking.bookingId] || {};

    return {
      verifiedQuantity:
        current.verifiedQuantity !== undefined
          ? current.verifiedQuantity
          : (booking.verifiedQuantity > 0
              ? booking.verifiedQuantity
              : booking.offeredQuantity),

      qualityGrade:
        current.qualityGrade ||
        booking.qualityGrade ||
        "A",

      ratePerKg:
        current.ratePerKg !== undefined
          ? current.ratePerKg
          : (booking.ratePerKg > 0 ? booking.ratePerKg : ""),

      rejectionReason:
        current.rejectionReason !== undefined
          ? current.rejectionReason
          : (booking.rejectionReason || ""),
    };
  };

  const updateForm = (
    bookingId,
    field,
    value
  ) => {
    setFormData((previous) => ({
      ...previous,
      [bookingId]: {
        ...(previous[bookingId] || {}),
        [field]: value,
      },
    }));
  };

  // ====================================================
  // SAVE CHECK
  // ====================================================

  const saveCheck = async (booking) => {
    const form = getForm(booking);

    const verifiedQuantity = Number(
      form.verifiedQuantity
    );

    const ratePerKg = Number(
      form.ratePerKg
    );

    if (
      !Number.isFinite(
        verifiedQuantity
      ) ||
      verifiedQuantity < 0 ||
      verifiedQuantity >
        Number(booking.offeredQuantity)
    ) {
      alert(
        `Verified quantity must be between 0 and ${booking.offeredQuantity} kg`
      );
      return;
    }

    if (!Number.isFinite(ratePerKg) || ratePerKg < 0) {
      alert("Enter a valid rate per kg");
      return;
    }

    try {
      setSubmitting((previous) => ({
        ...previous,
        [booking.bookingId]: true,
      }));

      await axios.post(
        `${API_URL}/api/procurement/bookings/${booking.bookingId}/check`,
        {
          verifiedQuantity,
          qualityGrade:
            form.qualityGrade || "A",
          ratePerKg,
        }
      );

      await fetchProcurementData(false);

      alert(
        "Quantity and quality check saved successfully"
      );
    } catch (err) {
      console.error(
        "SAVE CHECK ERROR:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to save check"
      );
    } finally {
      setSubmitting((previous) => ({
        ...previous,
        [booking.bookingId]: false,
      }));
    }
  };

  // ====================================================
  // ACCEPT
  // ====================================================

  const acceptBooking = async (booking) => {
    const form = getForm(booking);

    const verifiedQuantity = Number(
      form.verifiedQuantity
    );

    const qualityGrade = form.qualityGrade || "A";

    const ratePerKg = Number(
      form.ratePerKg
    );

    if (
      !Number.isFinite(
        verifiedQuantity
      ) ||
      verifiedQuantity <= 0 ||
      verifiedQuantity >
        Number(booking.offeredQuantity)
    ) {
      alert(
        `Verified quantity must be between 1 and ${booking.offeredQuantity} kg`
      );
      return;
    }

    if (!["A", "B"].includes(qualityGrade)) {
      alert(
        "Grade C cannot be accepted"
      );
      return;
    }

    if (
      !Number.isFinite(ratePerKg) ||
      ratePerKg <= 0
    ) {
      alert("Enter rate per kg");
      return;
    }

    try {
      setSubmitting((previous) => ({
        ...previous,
        [booking.bookingId]: true,
      }));

      await axios.patch(
        `${API_URL}/api/procurement/bookings/${booking.bookingId}/accept`,
        {
          verifiedQuantity,
          qualityGrade,
          ratePerKg,
        }
      );

      await fetchProcurementData(false);

      setOpenSlot(null);
    } catch (err) {
      console.error(
        "ACCEPT ERROR:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to accept procurement"
      );
    } finally {
      setSubmitting((previous) => ({
        ...previous,
        [booking.bookingId]: false,
      }));
    }
  };

  // ====================================================
  // REJECT
  // ====================================================

  const rejectBooking = async (booking) => {
    const form = getForm(booking);

    if (
      !form.rejectionReason?.trim()
    ) {
      alert(
        "Please enter rejection reason"
      );
      return;
    }

    try {
      setSubmitting((previous) => ({
        ...previous,
        [booking.bookingId]: true,
      }));

      await axios.patch(
        `${API_URL}/api/procurement/bookings/${booking.bookingId}/reject`,
        {
          qualityGrade:
            form.qualityGrade || "C",

          rejectionReason:
            form.rejectionReason,
        }
      );

      await fetchProcurementData(false);

      setOpenSlot(null);
    } catch (err) {
      console.error(
        "REJECT ERROR:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to reject procurement"
      );
    } finally {
      setSubmitting((previous) => ({
        ...previous,
        [booking.bookingId]: false,
      }));
    }
  };

  // ====================================================
  // DERIVED GODOWN STOCK
  // ====================================================

  const godownStock = useMemo(() => {
    const grouped = {};

    bookings
      .filter(
        (booking) =>
          booking.decision === "Accepted"
      )
      .forEach((booking) => {
        const crop =
          booking.product;

        if (!grouped[crop]) {
          grouped[crop] = {
            crop,
            qty: 0,
            source:
              booking.procurementCenter ||
              "Procurement Center",
            date:
              booking.checkedAt ||
              booking.slotStart,
            grade:
              booking.qualityGrade,
          };
        }

        grouped[crop].qty += Number(
          booking.verifiedQuantity || 0
        );
      });

    return Object.values(grouped);
  }, [bookings]);

  // ====================================================
  // PAYMENT DATA
  // ====================================================

  const salesRecords = useMemo(() => {
    return bookings.map((booking) => ({
      farmer:
        booking.farmerName,
      crop:
        booking.product,
      weight:
        booking.verifiedQuantity ||
        booking.offeredQuantity ||
        0,
      rate:
        booking.ratePerKg || 0,
      amount:
        booking.procurementAmount || 0,
      date:
        booking.checkedAt ||
        booking.createdAt,
      status:
        booking.paymentStatus || "Pending",
      decision:
        booking.decision,
    }));
  }, [bookings]);

  const filteredStock = useMemo(() => {
    const query =
      searchQuery.toLowerCase().trim();

    if (!query) return godownStock;

    return godownStock.filter((row) =>
      `${row.crop} ${row.source}`
        .toLowerCase()
        .includes(query)
    );
  }, [godownStock, searchQuery]);

  const filteredSales = useMemo(() => {
    const query =
      searchQuery.toLowerCase().trim();

    if (!query) return salesRecords;

    return salesRecords.filter((row) =>
      `${row.farmer} ${row.crop} ${row.status} ${row.decision}`
        .toLowerCase()
        .includes(query)
    );
  }, [salesRecords, searchQuery]);

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="min-h-screen bg-slate-50">
      <TricolorBar />

      {/* HEADER */}
      <div className="bg-blue-950 px-6 py-10">
        <div className="max-w-6xl mx-auto">

          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-200 text-sm mb-6 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to portal
          </button>

          <div className="flex items-center gap-4">
            <div className="bg-blue-900 p-3 rounded-xl border border-blue-800">
              <Warehouse
                size={28}
                className="text-orange-400"
              />
            </div>

            <div>
              <h1 className="font-serif text-3xl text-white">
                Procurement Control Center
              </h1>

              <p className="text-blue-200 text-sm mt-1">
                Live farmer bookings, quality verification,
                procurement and payments
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* OFFICIAL BADGE */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-300 text-amber-800 px-4 py-2 rounded-full text-xs font-semibold mb-6">
          <BadgeCheck size={15} />
          Official Government Portal — Verified Procurement Access
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-14">

        {/* REFRESH */}
        <div className="flex justify-end mb-5">
          <button
            onClick={() =>
              fetchProcurementData(false)
            }
            disabled={refreshing}
            className="inline-flex items-center gap-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-md text-sm font-semibold disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>

        {/* DASHBOARD STATS */}
        {!loading &&
          dashboard && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">

                <StatCard
                  label="Total procurement slots"
                  value={formatNumber(
                    dashboard.totalSlots
                  )}
                  icon={ClipboardCheck}
                />

                <StatCard
                  label="Pending checks"
                  value={formatNumber(
                    dashboard.pendingChecks
                  )}
                  icon={Clock3}
                />

                <StatCard
                  label="Accepted quantity"
                  value={`${formatNumber(
                    dashboard.acceptedQuantity
                  )} kg`}
                  icon={Wheat}
                />

                <StatCard
                  label="Procurement amount"
                  value={formatINR(
                    dashboard.procurementAmount
                  )}
                  icon={IndianRupee}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">

                <StatCard
                  label="Accepted lots"
                  value={formatNumber(
                    dashboard.acceptedSlots
                  )}
                  icon={CheckCircle2}
                />

                <StatCard
                  label="Rejected lots"
                  value={formatNumber(
                    dashboard.rejectedSlots
                  )}
                  icon={XCircle}
                />

                <StatCard
                  label="Paid amount"
                  value={formatINR(
                    dashboard.paidAmount
                  )}
                  icon={WalletIcon}
                />

                <StatCard
                  label="Total slots checked"
                  value={`${formatNumber(
                    dashboard.acceptedSlots +
                      dashboard.rejectedSlots
                  )}/${formatNumber(
                    dashboard.totalSlots
                  )}`}
                  icon={FileCheck2}
                />
              </div>
            </>
          )}

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 mb-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertIcon />
              <span className="text-sm">
                {error}
              </span>
            </div>

            <button
              onClick={() =>
                fetchProcurementData()
              }
              className="text-sm font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* PROCUREMENT SLOTS */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-10">

          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">

            <div>
              <div className="flex items-center gap-2">
                <ClipboardCheck
                  size={20}
                  className="text-blue-900"
                />

                <h3 className="font-serif text-lg text-blue-900">
                  Procurement Slots — Quality & Quantity Check
                </h3>
              </div>

              <p className="text-sm text-slate-500 mt-1">
                All data below is fetched from MongoDB.
                Check every farmer lot before accepting or rejecting.
              </p>
            </div>

            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                placeholder="Search farmer, crop..."
                className="pl-9 pr-3 py-2 rounded-md border border-slate-300 text-sm w-64 focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-28 rounded-xl bg-slate-100 animate-pulse"
                />
              ))}
            </div>
          )}

          {/* EMPTY */}
          {!loading &&
            !error &&
            filteredBookings.length === 0 && (
              <div className="py-14 text-center">
                <ClipboardCheck
                  size={40}
                  className="mx-auto text-slate-300 mb-3"
                />

                <p className="text-slate-500">
                  No procurement bookings found.
                </p>
              </div>
            )}

          {/* BOOKING LIST */}
          {!loading &&
            filteredBookings.length > 0 && (
              <div className="space-y-4">

                {filteredBookings.map(
                  (booking) => {
                    const isOpen =
                      openSlot ===
                      booking.bookingId;

                    const form =
                      getForm(booking);

                    const calculatedAmount =
                      Number(
                        form.verifiedQuantity ||
                          0
                      ) *
                      Number(
                        form.ratePerKg ||
                          0
                      );

                    const processing =
                      submitting[
                        booking.bookingId
                      ];

                    return (
                      <div
                        key={
                          booking.bookingId
                        }
                        className="border border-slate-200 rounded-xl overflow-hidden"
                      >

                        {/* SLOT HEADER */}

                        <div className="p-4 md:p-5">

                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-5 flex-1">

                              {/* FARMER */}
                              <div>
                                <p className="text-xs text-slate-400">
                                  Farmer
                                </p>

                                <p className="font-semibold text-slate-800 mt-1">
                                  {
                                    booking.farmerName
                                  }
                                </p>

                                <p className="text-xs text-slate-500 mt-1">
                                  {
                                    booking.farmerPhone
                                  }
                                </p>
                              </div>

                              {/* PRODUCT */}
                              <div>
                                <p className="text-xs text-slate-400">
                                  Crop
                                </p>

                                <p className="font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
                                  <Wheat
                                    size={14}
                                    className="text-green-700"
                                  />

                                  {
                                    booking.product
                                  }
                                </p>
                              </div>

                              {/* QUANTITY */}
                              <div>
                                <p className="text-xs text-slate-400">
                                  Offered quantity
                                </p>

                                <p className="font-semibold text-slate-800 mt-1">
                                  {formatNumber(
                                    booking.offeredQuantity
                                  )}{" "}
                                  kg
                                </p>
                              </div>

                              {/* CENTRE */}
                              <div>
                                <p className="text-xs text-slate-400">
                                  Procurement centre
                                </p>

                                <p className="font-semibold text-slate-800 mt-1">
                                  {
                                    booking.procurementCenter
                                  }
                                </p>
                              </div>

                              {/* SLOT */}
                              <div>
                                <p className="text-xs text-slate-400">
                                  Assigned slot
                                </p>

                                <p className="font-semibold text-slate-800 mt-1">
                                  {formatDate(
                                    booking.slotStart
                                  )}
                                </p>

                                <p className="text-xs text-slate-500 mt-1">
                                  {formatTime(
                                    booking.slotStart
                                  )}{" "}
                                  -{" "}
                                  {formatTime(
                                    booking.slotEnd
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* ACTIONS */}

                            <div className="flex flex-wrap items-center gap-2">

                              <DecisionPill
                                decision={
                                  booking.decision
                                }
                              />

                              <button
                                onClick={() =>
                                  setOpenSlot(
                                    isOpen
                                      ? null
                                      : booking.bookingId
                                  )
                                }
                                className="inline-flex items-center gap-2 bg-blue-950 hover:bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-semibold"
                              >
                                <ClipboardCheck
                                  size={15}
                                />

                                {booking.decision ===
                                "Pending"
                                  ? "Check"
                                  : "Review"}

                                {isOpen ? (
                                  <ChevronUp
                                    size={15}
                                  />
                                ) : (
                                  <ChevronDown
                                    size={15}
                                  />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* ACCEPTED SUMMARY */}

                          {booking.decision ===
                            "Accepted" && (
                            <div className="mt-4 border-t border-green-200 pt-4 bg-green-50 -mx-4 md:-mx-5 px-4 md:px-5 pb-1">

                              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">

                                <div>
                                  <p className="text-xs text-green-700">
                                    Verified quantity
                                  </p>

                                  <p className="font-bold text-green-900 mt-1">
                                    {formatNumber(
                                      booking.verifiedQuantity
                                    )}{" "}
                                    kg
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-green-700">
                                    Quality
                                  </p>

                                  <div className="mt-1">
                                    <GradePill
                                      grade={
                                        booking.qualityGrade
                                      }
                                    />
                                  </div>
                                </div>

                                <div>
                                  <p className="text-xs text-green-700">
                                    Rate
                                  </p>

                                  <p className="font-bold text-green-900 mt-1">
                                    ₹
                                    {Number(
                                      booking.ratePerKg ||
                                        0
                                    )}
                                    /kg
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-green-700">
                                    Centre must buy
                                  </p>

                                  <p className="font-bold text-green-900 mt-1">
                                    {formatNumber(
                                      booking.verifiedQuantity
                                    )}{" "}
                                    kg
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-green-700">
                                    Total amount
                                  </p>

                                  <p className="font-bold text-green-900 mt-1">
                                    {formatINR(
                                      booking.procurementAmount
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* REJECTED SUMMARY */}

                          {booking.decision ===
                            "Rejected" && (
                            <div className="mt-4 border-t border-red-200 pt-4 bg-red-50 -mx-4 md:-mx-5 px-4 md:px-5 pb-1">

                              <div className="flex flex-wrap gap-5 items-start">

                                <div>
                                  <p className="text-xs text-red-700">
                                    Quality
                                  </p>

                                  <div className="mt-1">
                                    <GradePill
                                      grade={
                                        booking.qualityGrade
                                      }
                                    />
                                  </div>
                                </div>

                                <div>
                                  <p className="text-xs text-red-700">
                                    Reason
                                  </p>

                                  <p className="text-sm font-medium text-red-900 mt-1">
                                    {booking.rejectionReason ||
                                      "Lot rejected after verification"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* CHECK PANEL */}

                        {isOpen && (
                          <div className="border-t border-slate-200 bg-slate-50 p-4 md:p-5">

                            <div className="grid md:grid-cols-4 gap-4">

                              {/* VERIFIED QUANTITY */}

                              <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                  Verified quantity (kg)
                                </label>

                                <input
                                  type="number"
                                  min="0"
                                  max={
                                    booking.offeredQuantity
                                  }
                                  value={
                                    form.verifiedQuantity
                                  }
                                  onChange={(e) =>
                                    updateForm(
                                      booking.bookingId,
                                      "verifiedQuantity",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2.5 rounded-md border border-slate-300 text-sm focus:outline-none focus:border-blue-700"
                                />

                                <p className="text-xs text-slate-400 mt-1">
                                  Maximum:{" "}
                                  {
                                    booking.offeredQuantity
                                  }{" "}
                                  kg
                                </p>
                              </div>

                              {/* QUALITY */}

                              <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                  Quality grade
                                </label>

                                <select
                                  value={
                                    form.qualityGrade
                                  }
                                  onChange={(e) =>
                                    updateForm(
                                      booking.bookingId,
                                      "qualityGrade",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2.5 rounded-md border border-slate-300 text-sm bg-white focus:outline-none focus:border-blue-700"
                                >
                                  <option value="A">
                                    Grade A — Acceptable
                                  </option>

                                  <option value="B">
                                    Grade B — Acceptable
                                  </option>

                                  <option value="C">
                                    Grade C — Reject
                                  </option>
                                </select>
                              </div>

                              {/* RATE */}

                              <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                  Rate per kg
                                </label>

                                <div className="relative">
                                  <IndianRupee
                                    size={15}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                  />

                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={
                                      form.ratePerKg
                                    }
                                    onChange={(e) =>
                                      updateForm(
                                        booking.bookingId,
                                        "ratePerKg",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter rate"
                                    className="w-full pl-9 pr-3 py-2.5 rounded-md border border-slate-300 text-sm focus:outline-none focus:border-blue-700"
                                  />
                                </div>
                              </div>

                              {/* AMOUNT */}

                              <div className="bg-white rounded-lg border border-slate-200 p-4">
                                <p className="text-xs text-slate-500">
                                  Procurement amount
                                </p>

                                <p className="text-xl font-bold text-blue-950 font-serif mt-1">
                                  {formatINR(
                                    calculatedAmount
                                  )}
                                </p>

                                <p className="text-xs text-slate-500 mt-1">
                                  {formatNumber(
                                    form.verifiedQuantity
                                  )}{" "}
                                  kg × ₹
                                  {Number(
                                    form.ratePerKg ||
                                      0
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* REJECTION REASON */}

                            {(form.qualityGrade ===
                              "C" ||
                              booking.decision ===
                                "Rejected") && (
                              <div className="mt-4">
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                  Rejection reason
                                </label>

                                <textarea
                                  rows={3}
                                  value={
                                    form.rejectionReason
                                  }
                                  onChange={(e) =>
                                    updateForm(
                                      booking.bookingId,
                                      "rejectionReason",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter reason for rejecting this lot"
                                  className="w-full px-3 py-2.5 rounded-md border border-slate-300 text-sm focus:outline-none focus:border-blue-700 resize-none"
                                />
                              </div>
                            )}

                            {/* ACTION BAR */}

                            <div className="flex flex-wrap items-center justify-between gap-4 mt-6">

                              <p className="text-xs text-slate-500">
                                Verify actual quantity and
                                quality before completing
                                the procurement decision.
                              </p>

                              <div className="flex flex-wrap gap-2">

                                {/* REJECT */}

                                <button
                                  onClick={() =>
                                    rejectBooking(
                                      booking
                                    )
                                  }
                                  disabled={
                                    processing
                                  }
                                  className="inline-flex items-center gap-2 border border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-50 px-4 py-2.5 rounded-md text-sm font-semibold"
                                >
                                  {processing ? (
                                    <Loader2
                                      size={16}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <XCircle
                                      size={16}
                                    />
                                  )}

                                  Reject
                                </button>

                                {/* SAVE CHECK */}

                                <button
                                  onClick={() =>
                                    saveCheck(
                                      booking
                                    )
                                  }
                                  disabled={
                                    processing
                                  }
                                  className="inline-flex items-center gap-2 border border-blue-200 text-blue-800 hover:bg-blue-50 disabled:opacity-50 px-4 py-2.5 rounded-md text-sm font-semibold"
                                >
                                  {processing ? (
                                    <Loader2
                                      size={16}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <ClipboardCheck
                                      size={16}
                                    />
                                  )}

                                  Save Check
                                </button>

                                {/* ACCEPT */}

                                <button
                                  onClick={() =>
                                    acceptBooking(
                                      booking
                                    )
                                  }
                                  disabled={
                                    processing ||
                                    form.qualityGrade ===
                                      "C"
                                  }
                                  className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-md text-sm font-semibold"
                                >
                                  {processing ? (
                                    <Loader2
                                      size={16}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <CheckCircle2
                                      size={16}
                                    />
                                  )}

                                  Accept & Confirm Buy
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            )}
        </div>

        {/* GODOWN STOCK */}

        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-10">

          <div className="flex items-center justify-between flex-wrap gap-4 mb-5">

            <div>
              <h3 className="font-serif text-lg text-blue-900">
                Godown Stock — Procurement Inflow
              </h3>

              <p className="text-sm text-slate-500">
                Stock calculated from accepted procurement
                records in MongoDB.
              </p>
            </div>

            <Warehouse
              size={20}
              className="text-blue-900"
            />
          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">

                  <th className="py-2 pr-4 font-medium">
                    Crop
                  </th>

                  <th className="py-2 pr-4 font-medium">
                    Quantity
                  </th>

                  <th className="py-2 pr-4 font-medium">
                    Source
                  </th>

                  <th className="py-2 pr-4 font-medium">
                    Date
                  </th>

                  <th className="py-2 pr-4 font-medium">
                    Quality
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredStock.map(
                  (row) => (
                    <tr key={row.crop}>

                      <td className="py-3 pr-4 flex items-center gap-2 text-slate-800 font-medium">
                        <Wheat
                          size={14}
                          className="text-green-700"
                        />

                        {row.crop}
                      </td>

                      <td className="py-3 pr-4 text-slate-700">
                        {formatNumber(
                          row.qty
                        )}{" "}
                        kg
                      </td>

                      <td className="py-3 pr-4 text-slate-600">
                        {row.source}
                      </td>

                      <td className="py-3 pr-4 text-slate-600">
                        {formatDate(
                          row.date
                        )}
                      </td>

                      <td className="py-3 pr-4">
                        <GradePill
                          grade={row.grade}
                        />
                      </td>
                    </tr>
                  )
                )}

                {filteredStock.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-slate-400"
                    >
                      No accepted stock available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FARMER SELLING RECORDS */}

        <div className="bg-white rounded-xl border border-slate-200 p-6">

          <div className="flex items-center justify-between flex-wrap gap-4 mb-5">

            <div>
              <h3 className="font-serif text-lg text-blue-900">
                Farmer Selling Records
              </h3>

              <p className="text-sm text-slate-500">
                Live records from accepted and rejected procurement
                transactions.
              </p>
            </div>

            <BarChart3
              size={20}
              className="text-blue-900"
            />
          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">

                  <th className="py-2 pr-4 font-medium">
                    Farmer
                  </th>

                  <th className="py-2 pr-4 font-medium">
                    Crop
                  </th>

                  <th className="py-2 pr-4 font-medium">
                    Quantity
                  </th>

                  <th className="py-2 pr-4 font-medium">
                    Rate / kg
                  </th>

                  <th className="py-2 pr-4 font-medium">
                    Amount
                  </th>

                  <th className="py-2 pr-4 font-medium">
                    Decision
                  </th>

                  <th className="py-2 pr-4 font-medium">
                    Payment
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredSales.map(
                  (row, index) => (
                    <tr key={index}>

                      <td className="py-3 pr-4 text-slate-800 font-medium">
                        {row.farmer}
                      </td>

                      <td className="py-3 pr-4 text-slate-600">
                        {row.crop}
                      </td>

                      <td className="py-3 pr-4 text-slate-600">
                        {formatNumber(
                          row.weight
                        )}{" "}
                        kg
                      </td>

                      <td className="py-3 pr-4 text-slate-600">
                        ₹
                        {Number(
                          row.rate || 0
                        )}
                      </td>

                      <td className="py-3 pr-4 text-slate-800 font-semibold">
                        {formatINR(
                          row.amount
                        )}
                      </td>

                      <td className="py-3 pr-4">
                        <DecisionPill
                          decision={
                            row.decision
                          }
                        />
                      </td>

                      <td className="py-3 pr-4">
                        <PaymentPill
                          status={
                            row.status
                          }
                        />
                      </td>
                    </tr>
                  )
                )}

                {filteredSales.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 text-center text-slate-400"
                    >
                      No farmer records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ======================================================
// SIMPLE ICON HELPERS
// ======================================================

const WalletIcon = (props) => (
  <WalletIconBase {...props} />
);

const WalletIconBase = ({
  size = 18,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 7V6a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h15v8a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V7" />
    <path d="M16 15h2" />
  </svg>
);

const AlertIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// ======================================================
// MAIN GOVT PAGE
// ======================================================

const GovtLogin = () => {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const [page, setPage] =
    useState("portal");

  const scrollTo = (id) => {
    setMenuOpen(false);

    const element =
      document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (page === "controller") {
    return (
      <ControllerPage
        onBack={() =>
          setPage("portal")
        }
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">

      <TricolorBar />

      {/* TOP BAR */}

      <div className="bg-blue-950 text-blue-100 text-xs px-6 py-1.5 flex justify-between max-w-6xl mx-auto w-full">

        <span>
          Government of India | Ministry of
          Agriculture &amp; Farmers Welfare
        </span>

        <span className="hidden sm:inline">
          Screen Reader | हिंदी
        </span>
      </div>

      {/* NAV */}

      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">

        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3.5">

          <button
            className="flex items-center gap-3"
            onClick={() =>
              scrollTo("home")
            }
          >
            <div className="bg-blue-950 p-2 rounded-lg">
              <Landmark
                size={22}
                className="text-orange-400"
              />
            </div>

            <div className="text-left leading-tight">

              <p className="font-serif text-lg font-bold text-blue-950">
                Krishi Procurement Portal
              </p>

              <p className="text-[11px] text-slate-500">
                Department of Agriculture,
                State Government
              </p>
            </div>
          </button>

          <nav className="hidden sm:flex gap-1 items-center">

            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                className="px-3 py-2 text-sm text-slate-700 hover:text-blue-900 font-medium"
                onClick={() =>
                  scrollTo(link.id)
                }
              >
                {link.label}
              </button>
            ))}
          </nav>

          <button
            className="sm:hidden text-blue-950"
            onClick={() =>
              setMenuOpen(
                (value) => !value
              )
            }
          >
            {menuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="sm:hidden flex flex-col border-t border-slate-200">

            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                className="text-left px-6 py-3 text-base text-slate-700"
                onClick={() =>
                  scrollTo(link.id)
                }
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* HOME */}

      <section
        id="home"
        className="max-w-6xl mx-auto px-6 py-16 md:py-20"
      >

        <div className="flex flex-wrap items-center gap-12">

          <div className="flex-1 min-w-[300px]">

            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">
              <ShieldCheck size={13} />
              Official Government Portal
            </div>

            <h1 className="font-serif text-4xl md:text-5xl leading-tight text-blue-950 mb-5">
              Agricultural Procurement &
              Farmer Welfare
            </h1>

            <p className="text-lg leading-relaxed text-slate-600 max-w-md mb-7">
              Monitor farmer procurement,
              verify quantity and quality,
              approve purchases and track
              procurement payments using
              live MongoDB records.
            </p>

            <button
              onClick={() =>
                setPage("controller")
              }
              className="bg-blue-950 hover:bg-blue-900 text-white px-6 py-3 rounded-md text-sm font-semibold"
            >
              Open Controller Panel
            </button>
          </div>

          <div className="flex-1 min-w-[280px] grid grid-cols-2 gap-4">

            <div className="bg-white rounded-xl border border-slate-200 p-5 col-span-2 flex items-center gap-4">

              <div className="bg-blue-950 p-3 rounded-lg">
                <Building2
                  size={22}
                  className="text-orange-400"
                />
              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Procurement system
                </p>

                <p className="text-xl font-bold text-blue-950 font-serif">
                  Live MongoDB Data
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">

              <Wheat
                size={20}
                className="text-green-700 mb-2"
              />

              <p className="text-sm text-slate-500">
                Farmer produce
              </p>

              <p className="text-xl font-bold text-blue-950 font-serif">
                Live
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">

              <ClipboardCheck
                size={20}
                className="text-green-700 mb-2"
              />

              <p className="text-sm text-slate-500">
                Procurement slots
              </p>

              <p className="text-xl font-bold text-blue-950 font-serif">
                Live
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}

      <section
        id="about"
        className="bg-white border-y border-slate-200 py-16 md:py-20"
      >

        <div className="max-w-4xl mx-auto px-6 text-center mb-10">

          <h2 className="font-serif text-3xl md:text-4xl text-blue-950 mb-3.5">
            About this portal
          </h2>

          <p className="text-base leading-relaxed text-slate-600 max-w-2xl mx-auto">
            The Procurement Control Center
            retrieves farmer bookings from the
            backend, assigns procurement centres
            and slots, verifies produce and saves
            acceptance, rejection, quantity, rate,
            amount and payment information in MongoDB.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-6 grid sm:grid-cols-3 gap-6">

          <div className="border border-slate-200 rounded-xl p-6">

            <FileCheck2
              size={22}
              className="text-blue-900 mb-3"
            />

            <h3 className="font-serif text-lg text-blue-950 mb-2">
              Transparent records
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              Every procurement decision is
              stored in the backend and can be
              audited later.
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-6">

            <BarChart3
              size={22}
              className="text-blue-900 mb-3"
            />

            <h3 className="font-serif text-lg text-blue-950 mb-2">
              Real-time monitoring
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              Procurement quantity and payment
              values are calculated from live data.
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-6">

            <ShieldCheck
              size={22}
              className="text-blue-900 mb-3"
            />

            <h3 className="font-serif text-lg text-blue-950 mb-2">
              Verified access
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              Procurement officers can verify
              quality and quantity before approval.
            </p>
          </div>
        </div>
      </section>

      {/* CONTROLLER */}

      <section
        id="controller"
        className="bg-blue-950 px-6 py-16 md:py-20"
      >

        <div className="max-w-2xl mx-auto text-center mb-10">

          <h2 className="font-serif text-3xl md:text-4xl text-white mb-3.5">
            Controller
          </h2>

          <p className="text-base leading-relaxed text-blue-200">
            Open the procurement control
            center to manage live farmer
            procurement data.
          </p>
        </div>

        <div className="max-w-md mx-auto">

          <button
            onClick={() =>
              setPage("controller")
            }
            className="w-full text-left bg-white rounded-xl px-7 py-8 hover:-translate-y-1 hover:shadow-xl transition-transform"
          >

            <div className="bg-blue-950 w-12 h-12 rounded-lg flex items-center justify-center mb-4">

              <Warehouse
                size={22}
                className="text-orange-400"
              />
            </div>

            <h3 className="font-serif text-xl text-blue-950 mb-2">
              Procurement Control Center
            </h3>

            <p className="text-sm leading-relaxed text-slate-600">
              View every live booking,
              inspect quantity and quality,
              accept or reject procurement,
              and calculate the amount payable
              to the farmer.
            </p>

            <span className="inline-block mt-4 text-sm font-semibold text-blue-900">
              Open panel →
            </span>
          </button>
        </div>
      </section>

      {/* FOOTER */}

      <footer
        id="contact"
        className="bg-blue-950 text-blue-100 px-6 pt-14 pb-6"
      >

        <div className="max-w-6xl mx-auto flex gap-12 flex-wrap pb-8 border-b border-blue-900">

          <div>

            <div className="flex items-center gap-2 font-serif text-lg font-bold text-white mb-2.5">

              <Landmark
                size={20}
                className="text-orange-400"
              />

              <span>
                Krishi Procurement Portal
              </span>
            </div>

            <p className="text-sm text-blue-300 max-w-xs leading-relaxed">
              Department of Agriculture,
              State Government —
              official procurement office.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 min-w-[200px]">

            <h4 className="text-xs text-blue-400 font-semibold mb-1">
              Reach us
            </h4>

            <a
              href="tel:18001801551"
              className="flex items-center gap-2 text-blue-100 no-underline text-sm"
            >
              <Phone size={16} />
              1800-180-1551
            </a>

            <a
              href="mailto:procurement@krishi.gov.in"
              className="flex items-center gap-2 text-blue-100 no-underline text-sm"
            >
              <Mail size={16} />
              procurement@krishi.gov.in
            </a>

            <span className="flex items-center gap-2 text-blue-100 text-sm">
              <MapPin size={16} />
              Krishi Bhawan, Block Office Road
            </span>
          </div>

          <div className="flex flex-col gap-2.5 min-w-[200px]">

            <h4 className="text-xs text-blue-400 font-semibold mb-1">
              Quick links
            </h4>

            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                className="text-left bg-transparent text-blue-100 text-sm p-0"
                onClick={() =>
                  scrollTo(link.id)
                }
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto text-xs text-blue-400 mt-5">
          © 2026 Department of Agriculture &
          Farmers Welfare. Official Government Portal.
        </div>
      </footer>
    </div>
  );
};

export default GovtLogin;
import React, { useState } from "react";
import {
  Landmark, ShieldCheck, Wheat, Warehouse, Phone, Mail, MapPin,
  Search, IndianRupee, CheckCircle2, Clock3, Menu, ArrowLeft,
  BadgeCheck, Users, FileCheck2, BarChart3, Building2,
} from "lucide-react";

// ---- Content -------------------------------------------------------------

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "controller", label: "Controller" },
  { id: "contact", label: "Contact" },
];

// ---- Procurement mock data (swap with real API data later) ----------------

const GODOWN_STOCK = [
  { crop: "Wheat", qty: 2400, source: "Sector 12 Procurement Center", date: "01 Sep 2026", grade: "A" },
  { crop: "Paddy", qty: 1800, source: "Rampur Mandi", date: "02 Sep 2026", grade: "A" },
  { crop: "Mustard", qty: 950, source: "Block Office Godown", date: "03 Sep 2026", grade: "B" },
  { crop: "Maize", qty: 1200, source: "Sector 12 Procurement Center", date: "04 Sep 2026", grade: "A" },
  { crop: "Wheat", qty: 3000, source: "Rampur Mandi", date: "05 Sep 2026", grade: "A" },
];

const FARMER_SALES = [
  { farmer: "Ramesh Kumar", crop: "Wheat", weight: 500, rate: 22, date: "01 Sep 2026", status: "Paid" },
  { farmer: "Sunita Devi", crop: "Paddy", weight: 300, rate: 19, date: "02 Sep 2026", status: "Paid" },
  { farmer: "Anil Yadav", crop: "Mustard", weight: 150, rate: 52, date: "03 Sep 2026", status: "Pending" },
  { farmer: "Manoj Singh", crop: "Maize", weight: 400, rate: 18, date: "04 Sep 2026", status: "Paid" },
  { farmer: "Geeta Sharma", crop: "Wheat", weight: 600, rate: 22, date: "05 Sep 2026", status: "Pending" },
  { farmer: "Vikram Chauhan", crop: "Paddy", weight: 250, rate: 19, date: "05 Sep 2026", status: "Paid" },
];

const formatINR = (n) => `₹${n.toLocaleString("en-IN")}`;

// ---- Small building blocks -----------------------------------------------

const TricolorBar = () => (
  <div className="h-1.5 w-full flex">
    <div className="flex-1 bg-orange-500" />
    <div className="flex-1 bg-white" />
    <div className="flex-1 bg-green-700" />
  </div>
);

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="bg-white rounded-xl p-5 border border-slate-200">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-slate-500">{label}</span>
      <Icon size={18} className="text-blue-800" />
    </div>
    <p className="text-2xl font-bold text-blue-900 font-serif">{value}</p>
  </div>
);

const StatusPill = ({ status }) => {
  const paid = status === "Paid";
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

const GradePill = ({ grade }) => (
  <span
    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
      grade === "A" ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-700"
    }`}
  >
    Grade {grade}
  </span>
);

// ---- Controller / procurement page -----------------------------------------

const ControllerPage = ({ onBack }) => {
  const [stockQuery, setStockQuery] = useState("");
  const [salesQuery, setSalesQuery] = useState("");

  const filteredStock = GODOWN_STOCK.filter((row) =>
    `${row.crop} ${row.source}`.toLowerCase().includes(stockQuery.toLowerCase())
  );
  const filteredSales = FARMER_SALES.filter((row) =>
    `${row.farmer} ${row.crop}`.toLowerCase().includes(salesQuery.toLowerCase())
  );

  const totalStockKg = GODOWN_STOCK.reduce((sum, r) => sum + r.qty, 0);
  const uniqueFarmers = new Set(FARMER_SALES.map((r) => r.farmer)).size;
  const totalPaid = FARMER_SALES.filter((r) => r.status === "Paid").reduce((sum, r) => sum + r.weight * r.rate, 0);
  const totalPending = FARMER_SALES.filter((r) => r.status === "Pending").reduce((sum, r) => sum + r.weight * r.rate, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <TricolorBar />
      <div className="bg-blue-950 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-200 text-sm mb-6 hover:text-white"
          >
            <ArrowLeft size={16} /> Back to portal
          </button>
          <div className="flex items-center gap-4">
            <div className="bg-blue-900 p-3 rounded-xl border border-blue-800">
              <Warehouse size={28} className="text-orange-400" />
            </div>
            <div>
              <h1 className="font-serif text-3xl text-white">Procurement Control Center</h1>
              <p className="text-blue-200 text-sm mt-1">Godown stock inflow and farmer selling records</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-6">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-300 text-amber-800 px-4 py-2 rounded-full text-xs font-semibold mb-6">
          <BadgeCheck size={15} />
          Official Government Portal — Verified Procurement Access
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total stock in godown" value={`${totalStockKg.toLocaleString("en-IN")} kg`} icon={Warehouse} />
          <StatCard label="Farmers this month" value={uniqueFarmers} icon={Users} />
          <StatCard label="Amount paid" value={formatINR(totalPaid)} icon={CheckCircle2} />
          <StatCard label="Payments pending" value={formatINR(totalPending)} icon={Clock3} />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-10">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
            <div>
              <h3 className="font-serif text-lg text-blue-900">Godown stock — procurement inflow</h3>
              <p className="text-sm text-slate-500">Produce received into the godown from procurement centers</p>
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={stockQuery}
                onChange={(e) => setStockQuery(e.target.value)}
                placeholder="Search crop or center"
                className="pl-9 pr-3 py-2 rounded-md border border-slate-300 text-sm w-56 focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
                  <th className="py-2 pr-4 font-medium">Crop</th>
                  <th className="py-2 pr-4 font-medium">Quantity</th>
                  <th className="py-2 pr-4 font-medium">Source / center</th>
                  <th className="py-2 pr-4 font-medium">Date received</th>
                  <th className="py-2 pr-4 font-medium">Quality</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStock.map((row, i) => (
                  <tr key={i}>
                    <td className="py-3 pr-4 flex items-center gap-2 text-slate-800 font-medium">
                      <Wheat size={14} className="text-green-700" /> {row.crop}
                    </td>
                    <td className="py-3 pr-4 text-slate-700">{row.qty.toLocaleString("en-IN")} kg</td>
                    <td className="py-3 pr-4 text-slate-600">{row.source}</td>
                    <td className="py-3 pr-4 text-slate-600">{row.date}</td>
                    <td className="py-3 pr-4"><GradePill grade={row.grade} /></td>
                  </tr>
                ))}
                {filteredStock.length === 0 && (
                  <tr><td colSpan={5} className="py-6 text-center text-slate-400">No matching stock records</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
            <div>
              <h3 className="font-serif text-lg text-blue-900">Farmer selling records</h3>
              <p className="text-sm text-slate-500">Weight and price for every sale recorded</p>
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={salesQuery}
                onChange={(e) => setSalesQuery(e.target.value)}
                placeholder="Search farmer or crop"
                className="pl-9 pr-3 py-2 rounded-md border border-slate-300 text-sm w-56 focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
                  <th className="py-2 pr-4 font-medium">Farmer</th>
                  <th className="py-2 pr-4 font-medium">Crop</th>
                  <th className="py-2 pr-4 font-medium">Weight</th>
                  <th className="py-2 pr-4 font-medium">Rate / kg</th>
                  <th className="py-2 pr-4 font-medium">Total amount</th>
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSales.map((row, i) => (
                  <tr key={i}>
                    <td className="py-3 pr-4 text-slate-800 font-medium">{row.farmer}</td>
                    <td className="py-3 pr-4 text-slate-600">{row.crop}</td>
                    <td className="py-3 pr-4 text-slate-600">{row.weight} kg</td>
                    <td className="py-3 pr-4 text-slate-600">₹{row.rate}</td>
                    <td className="py-3 pr-4 text-slate-800 font-semibold flex items-center gap-1">
                      <IndianRupee size={12} />
                      {(row.weight * row.rate).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{row.date}</td>
                    <td className="py-3 pr-4"><StatusPill status={row.status} /></td>
                  </tr>
                ))}
                {filteredSales.length === 0 && (
                  <tr><td colSpan={7} className="py-6 text-center text-slate-400">No matching sales records</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---- Main portal --------------------------------------------------------

const GovtLogin = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState("portal"); // portal | controller

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (page === "controller") return <ControllerPage onBack={() => setPage("portal")} />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <TricolorBar />

      {/* Top identity bar */}
      <div className="bg-blue-950 text-blue-100 text-xs px-6 py-1.5 flex justify-between max-w-6xl mx-auto w-full">
        <span>Government of India | Ministry of Agriculture &amp; Farmers Welfare</span>
        <span className="hidden sm:inline">Screen Reader | हिंदी</span>
      </div>

      {/* NAV */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3.5">
          <button
            className="flex items-center gap-3"
            onClick={() => scrollTo("home")}
          >
            <div className="bg-blue-950 p-2 rounded-lg">
              <Landmark size={22} className="text-orange-400" />
            </div>
            <div className="text-left leading-tight">
              <p className="font-serif text-lg font-bold text-blue-950">Krishi Procurement Portal</p>
              <p className="text-[11px] text-slate-500">Department of Agriculture, State Government</p>
            </div>
          </button>

          <nav className="hidden sm:flex gap-1 items-center">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                className="px-3 py-2 text-sm text-slate-700 hover:text-blue-900 font-medium"
                onClick={() => scrollTo(link.id)}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <button
            className="sm:hidden text-blue-950"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <Menu size={22} />
          </button>
        </div>

        {menuOpen && (
          <div className="sm:hidden flex flex-col border-t border-slate-200">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                className="text-left px-6 py-3 text-base text-slate-700"
                onClick={() => scrollTo(link.id)}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* HOME */}
      <section id="home" className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="flex flex-wrap items-center gap-12">
          <div className="flex-1 min-w-[300px]">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">
              <ShieldCheck size={13} /> Official Government Portal
            </div>
            <h1 className="font-serif text-4xl md:text-5xl leading-tight text-blue-950 mb-5">
              Agricultural Procurement &amp; Farmer Welfare
            </h1>
            <p className="text-lg leading-relaxed text-slate-600 max-w-md mb-7">
              Track procurement center intake, godown stock, and farmer payment records —
              all in one verified government control panel.
            </p>
            <button
              onClick={() => setPage("controller")}
              className="bg-blue-950 hover:bg-blue-900 text-white px-6 py-3 rounded-md text-sm font-semibold"
            >
              Open Controller Panel
            </button>
          </div>

          <div className="flex-1 min-w-[280px] grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 col-span-2 flex items-center gap-4">
              <div className="bg-blue-950 p-3 rounded-lg">
                <Building2 size={22} className="text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Procurement centers</p>
                <p className="text-xl font-bold text-blue-950 font-serif">42 active</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <Wheat size={20} className="text-green-700 mb-2" />
              <p className="text-sm text-slate-500">Districts covered</p>
              <p className="text-xl font-bold text-blue-950 font-serif">18</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <Users size={20} className="text-green-700 mb-2" />
              <p className="text-sm text-slate-500">Registered farmers</p>
              <p className="text-xl font-bold text-blue-950 font-serif">1,284</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="bg-white border-y border-slate-200 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl text-blue-950 mb-3.5">About this portal</h2>
          <p className="text-base leading-relaxed text-slate-600 max-w-2xl mx-auto">
            This portal is maintained by the Department of Agriculture to ensure transparent
            tracking of procurement operations — from the moment produce arrives at a
            center to the final payment made to the farmer.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-6 grid sm:grid-cols-3 gap-6">
          <div className="border border-slate-200 rounded-xl p-6">
            <FileCheck2 size={22} className="text-blue-900 mb-3" />
            <h3 className="font-serif text-lg text-blue-950 mb-2">Transparent records</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every batch received and every farmer payment is logged and auditable.
            </p>
          </div>
          <div className="border border-slate-200 rounded-xl p-6">
            <BarChart3 size={22} className="text-blue-900 mb-3" />
            <h3 className="font-serif text-lg text-blue-950 mb-2">Real-time monitoring</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Godown stock levels and payment status are tracked as they happen.
            </p>
          </div>
          <div className="border border-slate-200 rounded-xl p-6">
            <ShieldCheck size={22} className="text-blue-900 mb-3" />
            <h3 className="font-serif text-lg text-blue-950 mb-2">Verified access</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Only authorized government officials can view and manage procurement data.
            </p>
          </div>
        </div>
      </section>

      {/* CONTROLLER */}
      <section id="controller" className="bg-blue-950 px-6 py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-3.5">Controller</h2>
          <p className="text-base leading-relaxed text-blue-200">
            Open the procurement control panel to view live godown stock and farmer records.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <button
            onClick={() => setPage("controller")}
            className="w-full text-left bg-white rounded-xl px-7 py-8 hover:-translate-y-1 hover:shadow-xl transition-transform"
          >
            <div className="bg-blue-950 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Warehouse size={22} className="text-orange-400" />
            </div>
            <h3 className="font-serif text-xl text-blue-950 mb-2">Procurement Control Center</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Godown stock inflow from procurement centers and farmer selling records —
              weight, rate, and payment status.
            </p>
            <span className="inline-block mt-4 text-sm font-semibold text-blue-900">
              Open panel →
            </span>
          </button>
        </div>
      </section>

      {/* CONTACT / FOOTER */}
      <footer id="contact" className="bg-blue-950 text-blue-100 px-6 pt-14 pb-6">
        <div className="max-w-6xl mx-auto flex gap-12 flex-wrap pb-8 border-b border-blue-900">
          <div>
            <div className="flex items-center gap-2 font-serif text-lg font-bold text-white mb-2.5">
              <Landmark size={20} className="text-orange-400" />
              <span>Krishi Procurement Portal</span>
            </div>
            <p className="text-sm text-blue-300 max-w-xs leading-relaxed">
              Department of Agriculture, State Government — official procurement office.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 min-w-[200px]">
            <h4 className="text-xs text-blue-400 font-semibold mb-1">Reach us</h4>
            <a href="tel:18001801551" className="flex items-center gap-2 text-blue-100 no-underline text-sm">
              <Phone size={16} /> 1800-180-1551 (toll-free)
            </a>
            <a href="mailto:procurement@krishi.gov.in" className="flex items-center gap-2 text-blue-100 no-underline text-sm">
              <Mail size={16} /> procurement@krishi.gov.in
            </a>
            <span className="flex items-center gap-2 text-blue-100 text-sm">
              <MapPin size={16} /> Krishi Bhawan, Block Office Road
            </span>
          </div>

          <div className="flex flex-col gap-2.5 min-w-[200px]">
            <h4 className="text-xs text-blue-400 font-semibold mb-1">Quick links</h4>
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                className="text-left bg-transparent text-blue-100 text-sm p-0"
                onClick={() => scrollTo(link.id)}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => setPage("controller")}
              className="text-left bg-transparent text-blue-100 text-sm p-0"
            >
              Controller
            </button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto text-xs text-blue-400 mt-5">
          © 2026 Department of Agriculture &amp; Farmers Welfare. Official Government Portal.
        </div>
      </footer>
    </div>
  );
};

export default GovtLogin;
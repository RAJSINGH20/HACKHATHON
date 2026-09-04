import React, { useState } from "react";
import {
  Phone, Mail, MapPin, Menu, ArrowLeft,
  ShieldCheck, User, Landmark, Users, ClipboardList,
  Wheat, FileCheck2, BarChart3, Bell, Settings,
} from "lucide-react";

// ---- Content -------------------------------------------------------------

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "controller", label: "Controller" },
  { id: "contact", label: "Contact" },
];

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=700&q=80",
];

const ABOUT_STRIP = [
  { src: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=500&q=80", caption: "Soil testing camps" },
  { src: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=500&q=80", caption: "Irrigation support" },
  { src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=500&q=80", caption: "Harvest season" },
  { src: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=500&q=80", caption: "Equipment rental" },
  { src: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=500&q=80", caption: "Mandi delivery slots" },
  { src: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=500&q=80", caption: "Village outreach" },
];

const CONTROLLERS = [
  {
    key: "admin",
    title: "Admin Control",
    desc: "Manage farmer records, approve slot requests, and oversee field officers.",
    icon: ShieldCheck,
  },
  {
    key: "farmer",
    title: "Farmer Control",
    desc: "Book service slots, track requests, and update your farm profile.",
    icon: Users,
  },
  {
    key: "govt",
    title: "Govt Control",
    desc: "Monitor scheme rollout, review reports, and approve camp locations.",
    icon: Landmark,
  },
];

// ---- Controller pages ------------------------------------------------------

const ControllerHeader = ({ title, subtitle, icon: Icon, onBack }) => (
  <div className="bg-green-900 px-6 py-10">
    <div className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-green-200 text-sm mb-6 hover:text-white"
      >
        <ArrowLeft size={16} /> Back to dashboard
      </button>
      <div className="flex items-center gap-4">
        <div className="bg-green-800 p-3 rounded-xl">
          <Icon size={28} className="text-amber-400" />
        </div>
        <div>
          <h1 className="font-serif text-3xl text-stone-50">{title}</h1>
          <p className="text-green-200 text-sm mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  </div>
);

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="bg-white rounded-xl p-5 border border-stone-200">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-stone-500">{label}</span>
      <Icon size={18} className="text-green-700" />
    </div>
    <p className="text-2xl font-bold text-green-900 font-serif">{value}</p>
  </div>
);

const AdminControlPage = ({ onBack }) => (
  <div className="min-h-screen bg-stone-50">
    <ControllerHeader
      title="Admin Control"
      subtitle="Manage farmers, slots, and field officers"
      icon={ShieldCheck}
      onBack={onBack}
    />
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Registered farmers" value="1,284" icon={Users} />
        <StatCard label="Pending slot requests" value="37" icon={ClipboardList} />
        <StatCard label="Active field officers" value="12" icon={ShieldCheck} />
        <StatCard label="Camps this month" value="9" icon={BarChart3} />
      </div>
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h3 className="font-serif text-lg text-green-900 mb-4">Recent slot requests</h3>
        <div className="divide-y divide-stone-100">
          {[
            { name: "Ramesh Kumar", service: "Soil testing", status: "Pending" },
            { name: "Sunita Devi", service: "Equipment rental", status: "Approved" },
            { name: "Anil Yadav", service: "Mandi delivery slot", status: "Pending" },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between py-3 text-sm">
              <span className="text-stone-700">{row.name}</span>
              <span className="text-stone-500">{row.service}</span>
              <span
                className={
                  row.status === "Pending"
                    ? "text-amber-600 font-semibold"
                    : "text-green-700 font-semibold"
                }
              >
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const FarmerControlPage = ({ onBack }) => (
  <div className="min-h-screen bg-stone-50">
    <ControllerHeader
      title="Farmer Control"
      subtitle="Your slots, requests, and farm profile"
      icon={Users}
      onBack={onBack}
    />
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <StatCard label="Upcoming slots" value="2" icon={ClipboardList} />
        <StatCard label="Completed services" value="6" icon={FileCheck2} />
        <StatCard label="Farm land (acres)" value="4.5" icon={Wheat} />
      </div>
      <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
        <h3 className="font-serif text-lg text-green-900 mb-4">Your bookings</h3>
        <div className="divide-y divide-stone-100">
          {[
            { service: "Soil testing", date: "12 Sep 2026", status: "Confirmed" },
            { service: "Irrigation support", date: "20 Sep 2026", status: "Pending" },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between py-3 text-sm">
              <span className="text-stone-700">{row.service}</span>
              <span className="text-stone-500">{row.date}</span>
              <span
                className={
                  row.status === "Pending"
                    ? "text-amber-600 font-semibold"
                    : "text-green-700 font-semibold"
                }
              >
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </div>
      <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-md text-sm font-semibold">
        Book a new slot
      </button>
    </div>
  </div>
);

const GovtControlPage = ({ onBack }) => (
  <div className="min-h-screen bg-stone-50">
    <ControllerHeader
      title="Govt Control"
      subtitle="Scheme rollout, reports, and camp approvals"
      icon={Landmark}
      onBack={onBack}
    />
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Active schemes" value="5" icon={FileCheck2} />
        <StatCard label="Camps awaiting approval" value="4" icon={Bell} />
        <StatCard label="Blocks covered" value="18" icon={Landmark} />
        <StatCard label="Reports this quarter" value="22" icon={BarChart3} />
      </div>
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h3 className="font-serif text-lg text-green-900 mb-4">Camps awaiting approval</h3>
        <div className="divide-y divide-stone-100">
          {[
            { location: "Sector 12, Durgapur block", type: "Soil testing camp" },
            { location: "Rampur village", type: "Equipment demo" },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between py-3 text-sm">
              <span className="text-stone-700">{row.location}</span>
              <span className="text-stone-500">{row.type}</span>
              <button className="text-green-700 font-semibold hover:underline">Review</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ---- Main dashboard --------------------------------------------------------

const AdminDashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState("dashboard"); // dashboard | admin | farmer | govt

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (page === "admin") return <AdminControlPage onBack={() => setPage("dashboard")} />;
  if (page === "farmer") return <FarmerControlPage onBack={() => setPage("dashboard")} />;
  if (page === "govt") return <GovtControlPage onBack={() => setPage("dashboard")} />;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
      <style>{css}</style>

      {/* NAV */}
      <header className="sticky top-0 z-50 bg-stone-50/95 backdrop-blur border-b border-green-800/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3.5">
          <button
            className="flex items-center gap-2 font-serif text-xl font-bold text-green-900"
            onClick={() => scrollTo("home")}
          >
            <span className="text-2xl">🌾</span>
            <span>Kisaan Setu</span>
          </button>

          <nav className="hidden sm:flex gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                className="px-2 py-2 text-sm text-stone-700 hover:text-green-800"
                onClick={() => scrollTo(link.id)}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <button
            className="sm:hidden text-green-900"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <Menu size={22} />
          </button>
        </div>

        {menuOpen && (
          <div className="sm:hidden flex flex-col">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                className="text-left px-6 py-3 text-base text-stone-700 border-t border-green-800/10"
                onClick={() => scrollTo(link.id)}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* HOME */}
      <section id="home" className="max-w-6xl mx-auto px-6 py-16 md:py-20 flex flex-wrap items-center gap-12">
        <div className="flex-1 min-w-[300px]">
          <p className="text-green-700 text-sm font-semibold mb-3">For farmers, by farmers' side</p>
          <h1 className="font-serif text-4xl md:text-5xl leading-tight text-green-900 mb-5">
            Every field deserves a helping hand.
          </h1>
          <p className="text-lg leading-relaxed text-stone-600 max-w-md mb-7">
            Kisaan Setu connects you to soil testing, equipment rental, and mandi delivery
            slots — booked in minutes, from your own village.
          </p>
          <div className="flex gap-3.5 flex-wrap">
            <button
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-md text-sm font-semibold"
              onClick={() => scrollTo("controller")}
            >
              Go to Controller
            </button>
            <button
              className="border-2 border-green-900 text-green-900 px-6 py-3 rounded-md text-sm font-semibold"
              onClick={() => scrollTo("about")}
            >
              Learn more
            </button>
          </div>
        </div>

        <div className="flex-1 min-w-[280px] relative h-80 sm:h-96">
          <img
            src={HERO_IMAGES[0]}
            alt="A farmer tending crops in the field"
            className="absolute top-0 right-0 w-[78%] h-[82%] object-cover rounded-xl shadow-2xl"
          />
          <img
            src={HERO_IMAGES[1]}
            alt="Golden wheat field ready for harvest"
            className="absolute bottom-0 left-0 w-[58%] h-[58%] object-cover rounded-xl border-4 border-stone-50 shadow-xl"
          />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-16 md:py-20">
        <div className="max-w-2xl mx-auto px-6 text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl text-green-900 mb-3.5">
            What we do, season after season
          </h2>
          <p className="text-base leading-relaxed text-stone-600">
            We work with local agriculture offices to bring testing, machinery, and market
            access closer to the farm gate — no long queues, no lost workdays.
          </p>
        </div>

        <div className="marquee-wrap overflow-hidden w-full">
          <div className="marquee-track flex gap-5 w-max px-6">
            {[...ABOUT_STRIP, ...ABOUT_STRIP].map((item, i) => (
              <figure className="m-0 flex-none w-60" key={i}>
                <img
                  src={item.src}
                  alt={item.caption}
                  className="w-60 h-44 object-cover rounded-xl block"
                />
                <figcaption className="text-sm text-stone-600 mt-2">{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CONTROLLER */}
      <section id="controller" className="bg-green-900 px-6 py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl text-stone-50 mb-3.5">Controller</h2>
          <p className="text-base leading-relaxed text-green-200">
            Choose your role to open the right control panel.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-6">
          {CONTROLLERS.map(({ key, title, desc, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              className="text-left bg-stone-50 rounded-xl px-7 py-8 hover:-translate-y-1 hover:shadow-xl transition-transform"
            >
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Icon size={22} className="text-green-800" />
              </div>
              <h3 className="font-serif text-xl text-green-900 mb-2">{title}</h3>
              <p className="text-sm leading-relaxed text-stone-600">{desc}</p>
              <span className="inline-block mt-4 text-sm font-semibold text-green-700">
                Open →
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* CONTACT / FOOTER */}
      <footer id="contact" className="bg-stone-800 text-stone-100 px-6 pt-14 pb-6">
        <div className="max-w-6xl mx-auto flex gap-12 flex-wrap pb-8 border-b border-stone-100/15">
          <div>
            <div className="flex items-center gap-2 font-serif text-lg font-bold mb-2.5">
              <span className="text-2xl">🌾</span>
              <span>Kisaan Setu</span>
            </div>
            <p className="text-sm text-stone-400 max-w-xs leading-relaxed">
              A farmer services desk run with your local krishi office.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 min-w-[200px]">
            <h4 className="text-xs text-stone-400 font-semibold mb-1">Reach us</h4>
            <a href="tel:18001801551" className="flex items-center gap-2 text-stone-100 no-underline text-sm">
              <Phone size={16} /> 1800-180-1551 (toll-free)
            </a>
            <a href="mailto:help@kisaansetu.in" className="flex items-center gap-2 text-stone-100 no-underline text-sm">
              <Mail size={16} /> help@kisaansetu.in
            </a>
            <span className="flex items-center gap-2 text-stone-100 text-sm">
              <MapPin size={16} /> Krishi Bhawan, Block Office Road
            </span>
          </div>

          <div className="flex flex-col gap-2.5 min-w-[200px]">
            <h4 className="text-xs text-stone-400 font-semibold mb-1">Quick links</h4>
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                className="text-left bg-transparent text-stone-100 text-sm p-0"
                onClick={() => scrollTo(link.id)}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto text-xs text-stone-400 mt-5">
          © 2026 Kisaan Setu. Built for the farming community.
        </div>
      </footer>
    </div>
  );
};

const css = `
  .marquee-wrap {
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
    mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
  }
  .marquee-track {
    animation: scroll-marquee 34s linear infinite;
  }
  @keyframes scroll-marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  @media (prefers-reduced-motion: reduce) {
    .marquee-track { animation: none; }
  }
`;

export default AdminDashboard;
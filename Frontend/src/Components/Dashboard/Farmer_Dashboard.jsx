import React, { useState, useEffect } from "react";
import { Phone, Mail, MapPin, X, CheckCircle2, Menu } from "lucide-react";

// ---- Content -------------------------------------------------------------

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "booking", label: "Slot Booking" },
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

const SERVICES = ["Soil testing", "Equipment rental", "Mandi delivery slot", "Irrigation support"];

// ---- Component -------------------------------------------------------------

const Farmer_Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", service: SERVICES[0], date: "" });

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen]);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSubmitted(false);
    setForm({ name: "", phone: "", service: SERVICES[0], date: "" });
  };

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
              onClick={() => scrollTo("booking")}
            >
              Book a slot
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

      {/* SLOT BOOKING */}
      <section id="booking" className="bg-green-900 px-6 py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl text-stone-50 mb-3.5">Book your slot</h2>
          <p className="text-base leading-relaxed text-green-200">
            Choose what works for you — fill a quick form online, or speak to someone directly.
          </p>
        </div>

        <div className="max-w-3xl mx-auto flex gap-6 flex-wrap">
          <div className="flex-1 min-w-[320px] bg-stone-50 rounded-xl px-7 py-8">
            <h3 className="font-serif text-xl text-green-900 mb-3">Book online</h3>
            <p className="text-sm leading-relaxed text-stone-600 mb-5">
              Pick a service and a date. A field officer will confirm your slot by phone
              within one working day.
            </p>
            <button
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-md text-sm font-semibold"
              onClick={() => setModalOpen(true)}
            >
              Open booking form
            </button>
          </div>

          <div className="flex-1 min-w-[320px] bg-stone-50 rounded-xl px-7 py-8">
            <h3 className="font-serif text-xl text-green-900 mb-3">Call our toll-free line</h3>
            <p className="text-sm leading-relaxed text-stone-600 mb-5">
              Prefer to talk? Our helpline is open every day, 7 AM – 8 PM.
            </p>
            <a
              href="tel:18001801551"
              className="inline-flex items-center gap-2.5 text-2xl font-bold text-green-900 font-serif no-underline"
            >
              <Phone size={20} />
              <span>1800-180-1551</span>
            </a>
          </div>
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

      {/* BOOKING MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-green-950/60 flex items-center justify-center z-[100] p-5"
          onClick={closeModal}
        >
          <div
            className="bg-stone-50 rounded-xl px-7 py-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-stone-700"
              onClick={closeModal}
              aria-label="Close form"
            >
              <X size={20} />
            </button>

            {!submitted ? (
              <>
                <h3 className="font-serif text-xl text-green-900 mb-3">Book a slot</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                  <label className="flex flex-col gap-1.5 text-sm text-stone-600 font-semibold">
                    Full name
                    <input
                      className="px-3 py-2.5 rounded-md border border-green-700/40 text-base bg-white text-stone-800"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm text-stone-600 font-semibold">
                    Mobile number
                    <input
                      className="px-3 py-2.5 rounded-md border border-green-700/40 text-base bg-white text-stone-800"
                      required
                      type="tel"
                      pattern="[0-9]{10}"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="10-digit number"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm text-stone-600 font-semibold">
                    Service
                    <select
                      className="px-3 py-2.5 rounded-md border border-green-700/40 text-base bg-white text-stone-800"
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                    >
                      {SERVICES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm text-stone-600 font-semibold">
                    Preferred date
                    <input
                      className="px-3 py-2.5 rounded-md border border-green-700/40 text-base bg-white text-stone-800"
                      required
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                  </label>
                  <button
                    type="submit"
                    className="w-full mt-2 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-md text-sm font-semibold"
                  >
                    Confirm booking
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center flex flex-col items-center gap-2 pt-2">
                <CheckCircle2 size={40} className="text-green-700" />
                <h3 className="font-serif text-xl text-green-900">Slot requested</h3>
                <p className="text-sm leading-relaxed text-stone-600">
                  Thanks, {form.name}. We'll call {form.phone} to confirm your {form.service.toLowerCase()} slot on {form.date}.
                </p>
                <button
                  className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-md text-sm font-semibold"
                  onClick={closeModal}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
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

export default Farmer_Dashboard;
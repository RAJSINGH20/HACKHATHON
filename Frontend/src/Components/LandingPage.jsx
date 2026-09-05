import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CloudSun,
  FileText,
  Headphones,
  Leaf,
  Menu,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  ShoppingCart,
  Sprout,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";

const loginOptions = [
  {
    title: "Farmer Login",
    description: "Sell products, manage listings & track orders",
    icon: Sprout,
    link: "/farmer-login",
    color: "green",
  },
  {
    title: "Admin Login",
    description: "Manage farmers, products & platform",
    icon: ShieldCheck,
    link: "/admin-login",
    color: "blue",
  },
  {
    title: "Government Login",
    description: "Procure agricultural products directly",
    icon: ShoppingCart,
    link: "/government-login",
    color: "orange",
  },
];

const features = [
  {
    icon: Sprout,
    title: "Smart Farmer Marketplace",
    description:
      "Farmers can list their agricultural products and connect directly with buyers.",
  },
  {
    icon: MessageCircle,
    title: "AI-Powered Assistance",
    description:
      "Get instant assistance through an intelligent AI chatbot designed for farmers.",
  },
  {
    icon: PhoneCall,
    title: "Toll-Free Support",
    description:
      "Farmers who are not comfortable with technology can get help through a toll-free service.",
  },
  {
    icon: ShoppingCart,
    title: "Government Procurement",
    description:
      "Government departments can discover available agricultural products and purchase directly.",
  },
  {
    icon: TrendingUp,
    title: "Transparent Transactions",
    description:
      "Track product listings, purchases and payment information through one platform.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Platform",
    description:
      "Role-based access keeps farmer, admin and government operations separated and secure.",
  },
];

const steps = [
  {
    number: "01",
    title: "Register",
    description:
      "Create your account as a Farmer, Government official or Administrator.",
    icon: Users,
  },
  {
    number: "02",
    title: "List Products",
    description:
      "Farmers can upload their products with quantity, price and other details.",
    icon: FileText,
  },
  {
    number: "03",
    title: "Connect",
    description:
      "Government buyers can discover available agricultural products.",
    icon: ShoppingCart,
  },
  {
    number: "04",
    title: "Sell & Grow",
    description:
      "Complete the transaction and help create a more connected agricultural ecosystem.",
    icon: TrendingUp,
  },
];

const faqs = [
  {
    question: "What is Farmer AI?",
    answer:
      "Farmer AI is a digital agricultural platform that connects farmers, administrators and government buyers through a unified system.",
  },
  {
    question: "What if a farmer does not know how to use the website?",
    answer:
      "Farmers can use the toll-free assistance system to request support and book a service slot.",
  },
  {
    question: "Can government departments purchase products?",
    answer:
      "Yes. Government users can view available products and purchase agricultural products listed by farmers.",
  },
  {
    question: "Can farmers manage their products?",
    answer:
      "Yes. Farmers can add, update and manage their product listings through their dashboard.",
  },
];

function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <div className="min-h-screen bg-[#f8faf7] text-slate-900 overflow-hidden">
      {/* =========================================================
          NAVBAR
      ========================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
          <nav className="rounded-2xl border border-white/60 bg-white/90 backdrop-blur-xl shadow-lg shadow-green-900/5">
            <div className="flex h-16 items-center justify-between px-5">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white shadow-lg shadow-green-600/20">
                  <Leaf size={22} strokeWidth={2.5} />
                </div>

                <div>
                  <div className="text-lg font-extrabold tracking-tight text-slate-900">
                    Farmer<span className="text-green-600">AI</span>
                  </div>
                  <div className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400 sm:block">
                    Smart Agriculture
                  </div>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden items-center gap-8 md:flex">
                <a
                  href="#home"
                  className="text-sm font-semibold text-slate-600 transition hover:text-green-600"
                >
                  Home
                </a>

                <a
                  href="#features"
                  className="text-sm font-semibold text-slate-600 transition hover:text-green-600"
                >
                  Features
                </a>

                <a
                  href="#how-it-works"
                  className="text-sm font-semibold text-slate-600 transition hover:text-green-600"
                >
                  How It Works
                </a>

                <a
                  href="#about"
                  className="text-sm font-semibold text-slate-600 transition hover:text-green-600"
                >
                  About
                </a>
              </div>

              {/* Login */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => setLoginOpen(!loginOpen)}
                  className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700"
                >
                  Login
                  {loginOpen ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>

                {loginOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-100 bg-white p-3 shadow-2xl"
                  >
                    {loginOptions.map((option) => {
                      const Icon = option.icon;

                      return (
                        <Link
                          key={option.title}
                          to={option.link}
                          onClick={() => setLoginOpen(false)}
                          className="group flex items-center gap-4 rounded-xl p-3 transition hover:bg-green-50"
                        >
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600 transition group-hover:bg-green-600 group-hover:text-white">
                            <Icon size={21} />
                          </div>

                          <div className="flex-1">
                            <div className="font-bold text-slate-800">
                              {option.title}
                            </div>

                            <div className="mt-0.5 text-xs text-slate-500">
                              {option.description}
                            </div>
                          </div>

                          <ArrowRight
                            size={16}
                            className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-green-600"
                          />
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </div>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="rounded-xl border border-slate-200 p-2.5 md:hidden"
              >
                {mobileMenu ? <X size={21} /> : <Menu size={21} />}
              </button>
            </div>

            {/* Mobile navigation */}
            {mobileMenu && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="border-t border-slate-100 p-4 md:hidden"
              >
                <div className="flex flex-col gap-2">
                  {[
                    ["Home", "#home"],
                    ["Features", "#features"],
                    ["How It Works", "#how-it-works"],
                    ["About", "#about"],
                  ].map(([label, href]) => (
                    <a
                      key={label}
                      href={href}
                      onClick={() => setMobileMenu(false)}
                      className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-green-50 hover:text-green-600"
                    >
                      {label}
                    </a>
                  ))}

                  <div className="mt-2 border-t border-slate-100 pt-3">
                    <p className="mb-2 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Login as
                    </p>

                    {loginOptions.map((option) => {
                      const Icon = option.icon;

                      return (
                        <Link
                          key={option.title}
                          to={option.link}
                          onClick={() => setMobileMenu(false)}
                          className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-green-50"
                        >
                          <Icon size={19} className="text-green-600" />
                          <span className="text-sm font-semibold">
                            {option.title}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </nav>
        </div>
      </header>

      {/* =========================================================
          HERO
      ========================================================= */}
      <section
        id="home"
        className="relative min-h-[850px] pt-36 lg:min-h-[800px]"
      >
        {/* Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[-150px] top-[100px] h-[400px] w-[400px] rounded-full bg-green-200/40 blur-3xl" />
          <div className="absolute right-[-100px] top-[200px] h-[450px] w-[450px] rounded-full bg-lime-200/40 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-green-700">
                  AI-Powered Agriculture Platform
                </span>
              </div>

              <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Empowering
                <span className="block text-green-600">Farmers.</span>
                Connecting
                <span className="block text-slate-700">Opportunities.</span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                Farmer AI connects farmers, government buyers and
                administrators through one intelligent agricultural
                ecosystem.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/farmer-register"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-green-600/20 transition hover:-translate-y-0.5 hover:bg-green-700"
                >
                  Start as a Farmer
                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                >
                  Explore Platform
                </a>
              </div>

              {/* Trust points */}
              <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3">
                {[
                  "Farmer Friendly",
                  "AI Assisted",
                  "Secure Access",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-600"
                  >
                    <CheckCircle2 size={17} className="text-green-600" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Main card */}
              <div className="relative mx-auto max-w-[540px]">
                <div className="absolute -inset-5 rounded-[40px] bg-green-200/40 blur-2xl" />

                <div className="relative overflow-hidden rounded-[32px] border border-white bg-white p-4 shadow-2xl shadow-green-900/10">
                  {/* Image-like farm visual using CSS */}
                  <div className="relative h-[460px] overflow-hidden rounded-[25px] bg-gradient-to-b from-sky-100 via-green-100 to-green-600">
                    {/* Sun */}
                    <div className="absolute right-12 top-10 h-20 w-20 rounded-full bg-yellow-300/80 blur-[1px]" />

                    {/* Clouds */}
                    <div className="absolute left-10 top-16 h-5 w-24 rounded-full bg-white/70 blur-sm" />
                    <div className="absolute left-24 top-10 h-6 w-20 rounded-full bg-white/60 blur-sm" />

                    {/* Hills */}
                    <div className="absolute bottom-[150px] left-[-10%] h-52 w-[120%] rounded-[50%] bg-green-400" />
                    <div className="absolute bottom-[100px] left-[-20%] h-48 w-[140%] rounded-[50%] bg-green-600" />

                    {/* Farm rows */}
                    <div className="absolute bottom-[-20px] left-[-10%] h-56 w-[120%] rotate-[-5deg] bg-green-800/50" />

                    <div className="absolute bottom-12 left-[8%] right-[8%] flex gap-3 opacity-70">
                      {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div
                          key={item}
                          className="h-32 flex-1 rounded-full border-4 border-green-950/20"
                        />
                      ))}
                    </div>

                    {/* Farmer icon */}
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute bottom-28 left-1/2 -translate-x-1/2"
                    >
                      <div className="relative flex h-32 w-24 flex-col items-center">
                        <div className="absolute top-0 h-12 w-16 rounded-full bg-amber-700" />
                        <div className="absolute top-6 h-12 w-12 rounded-full bg-orange-200" />
                        <div className="absolute top-16 h-16 w-20 rounded-t-3xl bg-blue-700" />
                        <div className="absolute bottom-0 h-12 w-8 rounded-b-xl bg-slate-800" />
                        <div className="absolute bottom-0 right-1 h-12 w-8 rounded-b-xl bg-slate-800" />
                      </div>
                    </motion.div>

                    {/* Floating AI badge */}
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute left-5 top-6 rounded-2xl border border-white/70 bg-white/90 p-3 shadow-xl backdrop-blur"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                          <Zap size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            AI Assistant
                          </p>
                          <p className="text-[10px] text-green-600">
                            Online now
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Floating weather */}
                    <motion.div
                      animate={{ y: [0, 7, 0] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute right-5 top-28 rounded-2xl border border-white/70 bg-white/90 p-3 shadow-xl backdrop-blur"
                    >
                      <div className="flex items-center gap-2">
                        <CloudSun
                          size={23}
                          className="text-orange-500"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            Smart Farming
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Connected ecosystem
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Bottom label */}
                    <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/30 bg-slate-950/60 p-4 backdrop-blur-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-white/70">
                            FARMER AI PLATFORM
                          </p>
                          <p className="mt-1 text-lg font-bold text-white">
                            Technology for Better Agriculture
                          </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500 text-white">
                          <Sprout size={22} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating stats */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -bottom-5 -left-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                      <Users size={19} />
                    </div>
                    <div>
                      <p className="text-xl font-black text-slate-900">
                        3
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        User Panels
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  className="absolute -right-4 bottom-16 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                      <Headphones size={19} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">
                        Toll-Free
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Assistance
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          STATS
      ========================================================= */}
      <section className="border-y border-slate-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-100 sm:grid-cols-4">
          {[
            ["01", "Farmer Panel"],
            ["02", "Admin Panel"],
            ["03", "Government Panel"],
            ["24/7", "AI Assistance"],
          ].map(([number, label]) => (
            <div key={label} className="px-5 py-7 text-center">
              <p className="text-2xl font-black text-green-600">{number}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          FEATURES
      ========================================================= */}
      <section id="features" className="py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-green-600">
              Powerful Features
            </span>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Everything agriculture needs,
              <span className="text-green-600"> in one place.</span>
            </h2>

            <p className="mt-5 leading-7 text-slate-500">
              A simple, intelligent and connected platform built around the
              real needs of farmers and agricultural organizations.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-green-900/5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 transition group-hover:bg-green-600 group-hover:text-white">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-6 text-lg font-extrabold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {feature.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-xs font-bold text-green-600 opacity-0 transition group-hover:opacity-100">
                    Learn more
                    <ArrowRight size={14} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}
      <section
        id="how-it-works"
        className="relative overflow-hidden bg-slate-950 py-24 text-white sm:py-28"
      >
        <div className="absolute left-[-150px] top-[-150px] h-[400px] w-[400px] rounded-full bg-green-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-green-400">
              Simple Process
            </span>

            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              From farm to opportunity,
              <span className="text-green-400"> made simple.</span>
            </h2>

            <p className="mt-5 leading-7 text-slate-400">
              Farmer AI creates a straightforward digital journey for
              farmers, government buyers and administrators.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-black text-green-500/30">
                      {step.number}
                    </span>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                      <Icon size={21} />
                    </div>
                  </div>

                  <h3 className="mt-7 text-xl font-bold">{step.title}</h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          THREE PANELS
      ========================================================= */}
      <section id="about" className="py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Farmer */}
            <motion.div
              whileHover={{ y: -5 }}
              className="overflow-hidden rounded-3xl bg-green-600 p-8 text-white shadow-xl shadow-green-900/10"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <Sprout size={27} />
              </div>

              <p className="mt-8 text-xs font-black uppercase tracking-widest text-green-200">
                Farmer Panel
              </p>

              <h3 className="mt-3 text-3xl font-black">
                Sell your products with confidence.
              </h3>

              <p className="mt-4 text-sm leading-7 text-green-100">
                Add products, manage your listings and connect with
                potential government buyers.
              </p>

              <Link
                to="/farmer-register"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-green-700"
              >
                Register as Farmer
                <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Admin */}
            <motion.div
              whileHover={{ y: -5 }}
              className="rounded-3xl border border-blue-100 bg-blue-50 p-8 shadow-xl shadow-blue-900/5"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
                <ShieldCheck size={27} />
              </div>

              <p className="mt-8 text-xs font-black uppercase tracking-widest text-blue-600">
                Admin Panel
              </p>

              <h3 className="mt-3 text-3xl font-black text-slate-900">
                Manage the entire ecosystem.
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-500">
                Manage farmers, products, users and platform operations
                from one centralized dashboard.
              </p>

              <Link
                to="/admin-login"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white"
              >
                Admin Login
                <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Government */}
            <motion.div
              whileHover={{ y: -5 }}
              className="rounded-3xl border border-orange-100 bg-orange-50 p-8 shadow-xl shadow-orange-900/5"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white">
                <ShoppingCart size={27} />
              </div>

              <p className="mt-8 text-xs font-black uppercase tracking-widest text-orange-600">
                Government Panel
              </p>

              <h3 className="mt-3 text-3xl font-black text-slate-900">
                Discover and procure products.
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-500">
                Browse available agricultural products and purchase
                directly from registered farmers.
              </p>

              <Link
                to="/government-login"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white"
              >
                Government Login
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          TOLL FREE SECTION
      ========================================================= */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-green-50">
          <div className="grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:p-16">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white">
                <PhoneCall size={22} />
              </div>

              <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-green-600">
                Need Help?
              </p>

              <h2 className="mt-3 max-w-2xl text-3xl font-black text-slate-950 sm:text-4xl">
                Technology should be accessible to every farmer.
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                If a farmer is not comfortable using the website, they
                can use our assistance service to get help and book a
                service slot.
              </p>

              <Link
                to="/booking"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-600/20 hover:bg-green-700"
              >
                Book Assistance
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-xl">
              <div className="text-xs font-black uppercase tracking-widest text-slate-400">
                Assistance
              </div>

              <div className="mt-3 text-3xl font-black text-green-600">
                Toll-Free
              </div>

              <p className="mt-2 max-w-[230px] text-sm leading-6 text-slate-500">
                Get guidance when you need help accessing the digital
                platform.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-bold text-slate-700">
                <Headphones size={18} className="text-green-600" />
                Human + AI assistance
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FAQ
      ========================================================= */}
      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-green-600">
              FAQ
            </span>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950">
              Frequently asked questions
            </h2>
          </div>

          <div className="mt-12 space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50"
                >
                  <button
                    onClick={() =>
                      setActiveFaq(isOpen ? null : index)
                    }
                    className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                  >
                    <span className="font-bold text-slate-800">
                      {faq.question}
                    </span>

                    {isOpen ? (
                      <ChevronUp className="shrink-0 text-green-600" />
                    ) : (
                      <ChevronDown className="shrink-0 text-slate-400" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-sm leading-7 text-slate-500 sm:px-6">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-slate-950 px-6 py-16 text-center sm:px-12">
          <div className="mx-auto max-w-3xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500 text-white">
              <Leaf size={27} />
            </div>

            <h2 className="mt-7 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Let's build a smarter
              <span className="text-green-400"> agricultural future.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-400">
              Join the Farmer AI ecosystem and bring farmers, buyers and
              technology closer together.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/farmer-register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3.5 text-sm font-bold text-white hover:bg-green-600"
              >
                Join Farmer AI
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/farmer-login"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div>
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white">
                  <Leaf size={21} />
                </div>

                <span className="text-lg font-black">
                  Farmer<span className="text-green-600">AI</span>
                </span>
              </Link>

              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-500">
                An AI-powered agricultural ecosystem connecting farmers,
                government buyers and administrators.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900">Platform</h4>

              <div className="mt-4 space-y-3 text-sm text-slate-500">
                <a href="#features" className="block hover:text-green-600">
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="block hover:text-green-600"
                >
                  How It Works
                </a>
                <a href="#about" className="block hover:text-green-600">
                  About
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900">Accounts</h4>

              <div className="mt-4 space-y-3 text-sm text-slate-500">
                <Link
                  to="/farmer-login"
                  className="block hover:text-green-600"
                >
                  Farmer Login
                </Link>
                <Link
                  to="/admin-login"
                  className="block hover:text-green-600"
                >
                  Admin Login
                </Link>
                <Link
                  to="/government-login"
                  className="block hover:text-green-600"
                >
                  Government Login
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900">Support</h4>

              <div className="mt-4 space-y-3 text-sm text-slate-500">
                <Link
                  to="/booking"
                  className="block hover:text-green-600"
                >
                  Book Assistance
                </Link>

                <div className="flex items-center gap-2">
                  <MessageCircle size={15} />
                  AI Assistant
                </div>

                <div className="flex items-center gap-2">
                  <PhoneCall size={15} />
                  Toll-Free Support
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col justify-between gap-3 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row">
            <p>© 2026 Farmer AI. All rights reserved.</p>
            <p>
              Built for a smarter and more connected agricultural future.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
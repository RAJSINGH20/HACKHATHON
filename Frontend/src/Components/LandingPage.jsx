import React, { useState } from "react";

function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const farmerServices = [
    {
      icon: "📍",
      title: "Locate Your Purchase Centre",
    },
    {
      icon: "👨‍🌾",
      title: "Farmer Self Registration",
    },
    {
      icon: "📅",
      title: "Farmer Self Scheduling",
    },
    {
      icon: "❌",
      title: "Cancel Self Scheduling",
    },
    {
      icon: "📄",
      title: "Reg. Certificate Download",
    },
    {
      icon: "✏️",
      title: "Update Farmer Details",
    },
    {
      icon: "👤",
      title: "Farmer Profile",
    },
    {
      icon: "🔐",
      title: "Farmer eKYC",
    },
  ];

  const loginOptions = [
    {
      icon: "👨‍🌾",
      title: "Farmer Login",
      description: "Farmer services & profile",
      link: "/farmer-login",
      bg: "bg-green-100",
    },
    {
      icon: "🔐",
      title: "Admin Login",
      description: "System administration",
      link: "/admin-login",
      bg: "bg-blue-100",
    },
    {
      icon: "🏛️",
      title: "Government Login",
      description: "Government officials",
      link: "/government-login",
      bg: "bg-orange-100",
    },
  ];

  const procurementCards = [
    {
      icon: "🏢",
      title: "Centralized Procurement Centre",
      value: "40",
    },
    {
      icon: "🚚",
      title: "Mobile Purchase Centre",
      value: "15",
    },
    {
      icon: "🌾",
      title: "FPO / FPC Purchase Centre",
      value: "44",
    },
    {
      icon: "👩‍🌾",
      title: "SHG Purchase Centre",
      value: "00",
    },
    {
      icon: "🏘️",
      title: "Society Purchase Centre",
      value: "04",
    },
  ];

  const stats = [
    {
      title: "Registered Farmers",
      value: "22,52,712",
      icon: "👨‍🌾",
    },
    {
      title: "Procured Quantity",
      value: "49,16,744 MT",
      icon: "🌾",
    },
    {
      title: "Value Of Procured Paddy",
      value: "₹1,13,71,43,09,727",
      icon: "💰",
    },
    {
      title: "Dispatch To Rice Mill",
      value: "45,03,324 MT",
      icon: "🚛",
    },
    {
      title: "Farmers Benefitted",
      value: "14,03,908",
      icon: "🤝",
    },
  ];

  const quickAccess = [
    {
      icon: "📍",
      title: "Nearest Purchase Centre",
    },
    {
      icon: "👨‍🌾",
      title: "Farmer Registration",
    },
    {
      icon: "📅",
      title: "Self Scheduling",
    },
    {
      icon: "📄",
      title: "Download Certificate",
    },
  ];

  const campSchedule = [
    "Camps scheduled (agency wise including mCPC)",
    "Camps where farmers scheduled",
    "Farmers scheduled (agency wise including CPC and mCPC)",
    "Expected quantity of paddy sale (MT)",
  ];

  return (
    <div className="min-h-screen bg-[#f5f7f9] text-gray-800">

      {/* =====================================================
          TOP GOVERNMENT BAR
      ===================================================== */}

      <div className="bg-[#063b63] px-4 py-2 text-sm text-white">

        <div className="mx-auto flex max-w-[1450px] flex-col justify-between gap-2 md:flex-row">

          <div className="flex flex-wrap items-center gap-4">

            <span>
              Government of West Bengal
            </span>

            <span className="hidden text-white/40 md:block">
              |
            </span>

            <span>
              Department of Food & Supplies
            </span>

          </div>

          <div className="flex items-center gap-3">

            <span>
              ☎ 1800 345 5505 / 1967
            </span>

            <span className="rounded bg-white/10 px-2 py-1 text-xs">
              TOLL FREE
            </span>

          </div>

        </div>

      </div>


      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="bg-white shadow-sm">

        <div className="mx-auto flex max-w-[1450px] items-center justify-between px-5 py-5">

          {/* LOGO + TITLE */}

          <div className="flex items-center gap-4">

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-[#0875a5] bg-[#f5fbfd] text-4xl shadow-sm">
              🏛️  
            </div>

            <div>

              <h1 className="text-xl font-bold text-[#006da9] md:text-3xl">
                Government of West Bengal
              </h1>

              <h2 className="mt-1 text-sm font-semibold text-[#168347] md:text-lg">
                Department of Food & Supplies
              </h2>

              <p className="mt-1 text-xs font-medium text-gray-500 md:text-base">
                Online Paddy Procurement System
              </p>

            </div>

          </div>


          {/* DESKTOP ACTIONS */}

          <div className="hidden items-center gap-2 md:flex">

            <button className="rounded border border-gray-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50">
              A-
            </button>

            <button className="rounded border border-gray-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50">
              A+
            </button>

            <button className="rounded border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">
              🔊
            </button>

            <button className="rounded bg-[#006da9] px-4 py-2 text-sm font-semibold text-white hover:bg-[#005986]">
              বাংলা
            </button>


            {/* =================================================
                LOGIN DROPDOWN
            ================================================= */}

            <div className="relative">

              <button
                onClick={() => setLoginOpen(!loginOpen)}
                className="flex items-center gap-2 rounded bg-[#0072bc] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#005f9d]"
              >

                <span>
                  Login
                </span>

                <span
                  className={`text-[10px] transition-transform duration-200 ${
                    loginOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>

              </button>


              {/* DROPDOWN */}

              {loginOpen && (

                <div className="absolute right-0 top-[52px] z-[100] w-[290px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">

                  {/* Dropdown Header */}

                  <div className="bg-gradient-to-r from-[#006da9] to-[#0089c7] px-5 py-4">

                    <p className="text-xs font-medium uppercase tracking-wider text-white/80">
                      Login Portal
                    </p>

                    <h3 className="mt-1 text-lg font-bold text-white">
                      Select Login Type
                    </h3>

                  </div>


                  {/* LOGIN OPTIONS */}

                  <div className="p-2">

                    {loginOptions.map((option) => (

                      <a
                        href={option.link}
                        key={option.title}
                        className="group flex items-center gap-4 rounded-lg px-3 py-3 transition-all duration-200 hover:bg-[#eef8fc]"
                      >

                        {/* ICON */}

                        <div
                          className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${option.bg} text-xl transition-transform duration-200 group-hover:scale-110`}
                        >
                          {option.icon}
                        </div>


                        {/* TEXT */}

                        <div className="flex-1">

                          <p className="font-bold text-gray-800 group-hover:text-[#006da9]">
                            {option.title}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-500">
                            {option.description}
                          </p>

                        </div>


                        {/* ARROW */}

                        <span className="text-gray-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#006da9]">
                          →
                        </span>

                      </a>

                    ))}

                  </div>


                  <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 text-center">

                    <p className="text-[11px] text-gray-500">
                      Secure Government Portal
                    </p>

                  </div>

                </div>

              )}

            </div>

          </div>


          {/* MOBILE MENU BUTTON */}

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-lg bg-[#0072bc] px-4 py-2 text-2xl text-white md:hidden"
          >
            {mobileMenu ? "✕" : "☰"}
          </button>

        </div>


        {/* =====================================================
            NAVIGATION
        ===================================================== */}

        <nav className="bg-[#006da9]">

          {/* DESKTOP */}

          <div className="mx-auto hidden max-w-[1450px] items-center md:flex">

            {[
              "Home",
              "Old Site",
              "New Rice Mill",
              "PPS Enrolment Application",
              "Order & Circular for KMS 2025-26",
              "SOP",
              "FAQ",
              "Schedule Status",
            ].map((item, index) => (

              <a
                key={item}
                href="#"
                className="relative px-4 py-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#005b8e]"
              >

                {item}

                {(index === 2 || index === 3) && (
                  <span className="ml-2 text-xs">
                    ▼
                  </span>
                )}

              </a>

            ))}

          </div>


          {/* MOBILE */}

          {mobileMenu && (

            <div className="space-y-1 px-4 py-4 md:hidden">

              {[
                "Home",
                "Old Site",
                "New Rice Mill",
                "PPS Enrolment Application",
                "Order & Circular for KMS 2025-26",
                "SOP",
                "FAQ",
                "Schedule Status",
              ].map((item) => (

                <a
                  href="#"
                  key={item}
                  className="block rounded-lg px-4 py-3 text-sm font-semibold text-white hover:bg-[#005b8e]"
                >
                  {item}
                </a>

              ))}


              {/* MOBILE LOGIN */}

              <div className="border-t border-white/20 pt-3">

                <p className="px-4 pb-2 text-xs uppercase text-white/60">
                  Login Portal
                </p>

                {loginOptions.map((option) => (

                  <a
                    href={option.link}
                    key={option.title}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-white hover:bg-[#005b8e]"
                  >

                    <span>
                      {option.icon}
                    </span>

                    <span>
                      {option.title}
                    </span>

                  </a>

                ))}

              </div>

            </div>

          )}

        </nav>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-[1450px] px-4 py-5">


        {/* =====================================================
            NOTICE
        ===================================================== */}

        <div className="mb-5 overflow-hidden rounded-lg border border-yellow-300 bg-yellow-50 shadow-sm">

          <div className="flex items-center">

            <div className="shrink-0 bg-[#e6a900] px-5 py-3 text-sm font-bold text-white">
              NOTICE
            </div>

            <div className="overflow-hidden px-5 py-3">

              <p className="whitespace-nowrap text-sm font-medium text-yellow-900">
                Online Paddy Procurement System — Please check the latest
                notifications and updates before proceeding.
              </p>

            </div>

          </div>

        </div>


        {/* =====================================================
            HERO GRID
        ===================================================== */}

        <section className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)_260px]">


          {/* ===================================================
              FARMER SERVICES
          =================================================== */}

          <aside className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="bg-[#08a8d8] px-5 py-4">

              <h2 className="text-sm font-bold tracking-wide text-white">
                FARMER SERVICES
              </h2>

            </div>


            <div>

              {farmerServices.map((service, index) => (

                <a
                  href="#"
                  key={service.title}
                  className={`group flex items-center gap-3 border-b border-gray-100 px-4 py-4 text-sm font-medium transition-all duration-200 ${
                    index === 2
                      ? "bg-[#e7f6fb] text-[#006da9]"
                      : "text-gray-700 hover:bg-[#f0f9fc] hover:text-[#006da9]"
                  }`}
                >

                  <span className="text-lg transition-transform duration-200 group-hover:scale-110">
                    {service.icon}
                  </span>

                  <span>
                    {service.title}
                  </span>

                </a>

              ))}

            </div>

          </aside>


          {/* ===================================================
              HERO BANNER
          =================================================== */}

          <div className="group relative min-h-[450px] overflow-hidden rounded-xl shadow-lg">

            <img
              src="https://i.pinimg.com/474x/71/c2/2d/71c22dcb20e1d22a8737839675f6f875.jpg"
              alt="Paddy field"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />


            {/* DARK OVERLAY */}

            <div className="absolute inset-0 bg-gradient-to-t from-[#003b5c] via-[#004e6e]/30 to-transparent" />


            {/* FLOATING RICE */}

            <div className="absolute right-8 top-8 animate-bounce rounded-full bg-white/90 p-5 text-4xl shadow-xl">
              🌾
            </div>


            {/* HERO CONTENT */}

            <div className="absolute bottom-0 left-0 right-0 p-7 text-white md:p-10">

              <span className="inline-block rounded-full bg-[#efa900] px-4 py-1.5 text-xs font-bold uppercase tracking-wide">
                Online Paddy Procurement
              </span>

              <h2 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
                Empowering Farmers
                <br />
                Through Digital Procurement
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/90 md:text-base">
                Register as a farmer, schedule your paddy sale, locate
                procurement centres and track your procurement activities
                through one digital platform.
              </p>


              {/* BUTTONS */}

              <div className="mt-6 flex flex-wrap gap-3">

                <a
                  href="/farmer-login"
                  className="rounded-lg bg-[#0089c5] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-[#0075aa]"
                >
                  Farmer Registration
                </a>

                <a
                  href="#"
                  className="rounded-lg bg-white px-6 py-3 text-sm font-bold text-[#006da9] shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-gray-100"
                >
                  Self Scheduling
                </a>

              </div>

            </div>

          </div>


          {/* ===================================================
              LOGIN AS
          =================================================== */}

          <aside className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="bg-[#08a8d8] px-5 py-4">

              <h2 className="text-sm font-bold tracking-wide text-white">
                LOGIN AS
              </h2>

            </div>


            {loginOptions.map((option) => (

              <a
                href={option.link}
                key={option.title}
                className="group flex items-center gap-3 border-b border-gray-100 px-4 py-5 transition-all duration-200 hover:bg-[#eef8fc]"
              >

                <div
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${option.bg} text-lg transition-transform duration-200 group-hover:scale-110`}
                >
                  {option.icon}
                </div>

                <div>

                  <p className="text-sm font-semibold text-gray-700 group-hover:text-[#006da9]">
                    {option.title}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {option.description}
                  </p>

                </div>

              </a>

            ))}


            <div className="p-4">

              <a
                href="/login"
                className="block w-full rounded-lg bg-[#0072bc] py-3 text-center text-sm font-bold text-white hover:bg-[#005d98]"
              >
                Login Portal
              </a>

            </div>

          </aside>

        </section>


        {/* =====================================================
            DISTRICT REPORT
        ===================================================== */}

        <section className="mt-7 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>

              <h2 className="text-xl font-bold text-[#006da9]">
                Select District to see the report
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Procurement Centre & Rice Mill Details
              </p>

            </div>


            <select className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm outline-none focus:border-[#0072bc]">

              <option>
                Select District
              </option>

              <option>
                Bankura
              </option>

              <option>
                Birbhum
              </option>

              <option>
                Hooghly
              </option>

              <option>
                Murshidabad
              </option>

              <option>
                Nadia
              </option>

              <option>
                Paschim Bardhaman
              </option>

              <option>
                Purba Bardhaman
              </option>

            </select>

          </div>

        </section>


        {/* =====================================================
            PROCUREMENT CENTRE DETAILS
        ===================================================== */}

        <section className="mt-8">

          <div className="mb-5">

            <h2 className="text-2xl font-bold text-[#006da9]">
              Procurement Centre Details
            </h2>

            <div className="mt-2 h-1 w-16 rounded bg-[#08a8d8]" />

          </div>


          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

            {procurementCards.map((card) => (

              <div
                key={card.title}
                className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="flex items-start justify-between">

                  <div className="text-3xl transition-transform duration-300 group-hover:scale-110">
                    {card.icon}
                  </div>

                  <span className="rounded-full bg-[#e8f6fb] px-3 py-1 text-lg font-bold text-[#006da9]">
                    {card.value}
                  </span>

                </div>

                <h3 className="mt-5 text-sm font-semibold leading-6 text-gray-700">
                  {card.title}
                </h3>

              </div>

            ))}

          </div>

        </section>


        {/* =====================================================
            PROCUREMENT DETAILS
        ===================================================== */}

        <section className="mt-9">

          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">

            <div>

              <h2 className="text-2xl font-bold text-[#006da9]">
                Procurement Details For KMS
              </h2>

              <div className="mt-2 h-1 w-16 rounded bg-[#08a8d8]" />

            </div>


            <div className="flex items-center gap-3">

              <span className="text-sm text-gray-500">
                Select KMS
              </span>

              <select className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none">

                <option>
                  2025-2026
                </option>

                <option>
                  2024-2025
                </option>

                <option>
                  2023-2024
                </option>

              </select>

            </div>

          </div>


          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

            {stats.map((stat) => (

              <div
                key={stat.title}
                className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="text-3xl transition-transform duration-300 group-hover:scale-110">
                  {stat.icon}
                </div>

                <p className="mt-4 text-xs font-bold uppercase tracking-wide text-gray-400">
                  {stat.title}
                </p>

                <p className="mt-2 text-xl font-bold text-[#006da9]">
                  {stat.value}
                </p>

              </div>

            ))}

          </div>


          <div className="mt-3 text-right text-xs text-gray-400">
            Last Updated At: 27/02/2025 16:59:04
          </div>

        </section>


        {/* =====================================================
            CAMP SCHEDULE
        ===================================================== */}

        <section className="mt-9 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-200 px-6 py-5">

            <h2 className="text-xl font-bold text-[#006da9]">
              Camp Schedule in next 30 days
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View upcoming procurement camps and farmer schedules.
            </p>

          </div>


          <div className="grid md:grid-cols-2">

            {campSchedule.map((item, index) => (

              <a
                href="#"
                key={item}
                className="group flex items-center justify-between border-b border-gray-100 p-5 transition-all duration-200 hover:bg-[#f1f9fc]"
              >

                <div className="flex items-center gap-4">

                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#e8f6fb] font-bold text-[#0072bc]">
                    {index + 1}
                  </span>

                  <span className="text-sm font-medium text-gray-700 group-hover:text-[#006da9]">
                    {item}
                  </span>

                </div>

                <span className="text-gray-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#006da9]">
                  →
                </span>

              </a>

            ))}

          </div>

        </section>


        {/* =====================================================
            QUICK ACCESS
        ===================================================== */}

        <section className="mt-9">

          <div className="mb-5">

            <h2 className="text-2xl font-bold text-[#006da9]">
              Quick Access
            </h2>

            <div className="mt-2 h-1 w-16 rounded bg-[#08a8d8]" />

          </div>


          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {quickAccess.map((item) => (

              <a
                href="#"
                key={item.title}
                className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#08a8d8] hover:shadow-lg"
              >

                <span className="text-3xl transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </span>

                <span className="text-sm font-semibold text-gray-700 group-hover:text-[#006da9]">
                  {item.title}
                </span>

              </a>

            ))}

          </div>

        </section>


        {/* =====================================================
            FARMER EKYC
        ===================================================== */}

        <section className="mt-9 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="bg-[#006da9] px-6 py-4">

            <h2 className="font-bold text-white">
              Farmer eKYC
            </h2>

          </div>


          <div className="grid gap-7 p-6 lg:grid-cols-2">

            {/* REGISTRATION */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Enter Registration / Mobile Number
              </label>

              <div className="flex flex-col gap-2 sm:flex-row">

                <input
                  type="text"
                  placeholder="Enter Number"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#0072bc] focus:ring-1 focus:ring-[#0072bc]"
                />

                <button className="rounded-lg bg-[#0072bc] px-5 py-3 text-sm font-bold text-white hover:bg-[#005d98]">
                  Get Farmer Details
                </button>

              </div>

            </div>


            {/* AADHAAR */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Aadhaar Number
              </label>

              <div className="flex flex-col gap-2 sm:flex-row">

                <input
                  type="text"
                  placeholder="Enter Aadhaar Number"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#0072bc] focus:ring-1 focus:ring-[#0072bc]"
                />

                <button className="rounded-lg bg-[#008f54] px-5 py-3 text-sm font-bold text-white hover:bg-[#00783f]">
                  Get OTP
                </button>

              </div>

            </div>

          </div>

        </section>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="mt-10 bg-[#063b63] text-white">

        <div className="mx-auto grid max-w-[1450px] gap-10 px-5 py-12 md:grid-cols-3">

          {/* ABOUT */}

          <div>

            <h3 className="text-lg font-bold">
              Department of Food & Supplies
            </h3>

            <p className="mt-4 text-sm leading-7 text-white/70">
              Government of West Bengal
              <br />
              Online Paddy Procurement System
            </p>

          </div>


          {/* LINKS */}

          <div>

            <h3 className="font-bold">
              Important Links
            </h3>

            <div className="mt-4 space-y-3 text-sm text-white/70">

              <a href="#" className="block hover:text-white">
                Farmer Registration
              </a>

              <a href="#" className="block hover:text-white">
                Self Scheduling
              </a>

              <a href="#" className="block hover:text-white">
                Farmer Profile
              </a>

              <a href="#" className="block hover:text-white">
                Purchase Centre
              </a>

            </div>

          </div>


          {/* CONTACT */}

          <div>

            <h3 className="font-bold">
              Contact
            </h3>

            <p className="mt-4 text-sm leading-7 text-white/70">
              Khadyashree Bhawan
              <br />
              11A, Mirza Ghalib Street
              <br />
              Kolkata - 700087
              <br />
              West Bengal
            </p>

            <p className="mt-3 font-semibold">
              ☎ 1800 345 5505 / 1967
            </p>

          </div>

        </div>


        {/* COPYRIGHT */}

        <div className="border-t border-white/10">

          <div className="mx-auto flex max-w-[1450px] flex-col justify-between gap-3 px-5 py-5 text-xs text-white/50 md:flex-row">

            <p>
              © 2026 Food & Supplies Department, Government of West Bengal.
              All Rights Reserved.
            </p>

            <p>
              Designed & Developed by National Informatics Centre
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default LandingPage;
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Generates a unique Farmer AI Government ID, e.g. GOVT-7K2X9P4Q
const generateGovId = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0/I/1 to avoid confusion
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `GOVT-${code}`;
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { when: "beforeChildren", staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const GovtRegister = () => {
  const [form, setForm] = useState({
    officerName: "",
    email: "",
    phone: "",
    department: "",
    office: "",
    password: "",
    confirmPassword: "",
  });
  const [govId, setGovId] = useState(generateGovId);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRegenerateId = () => setGovId(generateGovId());

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(govId);
    } catch (err) {
      // Clipboard API may be unavailable; fail silently
    }
  };

  const validate = () => {
    const next = {};

    if (!form.officerName.trim()) {
      next.officerName = "Enter the officer's name";
    }

    if (!form.email.trim()) {
      next.email = "Enter an official email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Enter a valid email address";
    }

    if (!form.phone.trim()) {
      next.phone = "Enter a mobile number";
    } else if (!/^\d{10}$/.test(form.phone.trim())) {
      next.phone = "Enter a valid 10-digit mobile number";
    }

    if (!form.department.trim()) {
      next.department = "Enter the department name";
    }

    if (!form.office.trim()) {
      next.office = "Enter the office or district";
    }

    if (!form.password) {
      next.password = "Create a password";
    } else if (form.password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }

    if (form.confirmPassword !== form.password) {
      next.confirmPassword = "Passwords do not match";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Hook up to your registration API here
      console.log("Registering government account:", {
        ...form,
        password: undefined,
        confirmPassword: undefined,
        govId,
      });
      setSubmitted(true);
    }
  };

  const fieldClass = (name) =>
    `w-full px-4 py-3 rounded-xl border outline-none transition focus:ring-2 ${
      errors[name]
        ? "border-red-300 focus:ring-red-100"
        : "border-gray-200 focus:border-green-500 focus:ring-green-100"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50 px-4 py-8">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg bg-white/95 p-8 rounded-3xl shadow-xl border border-green-100"
      >
        {/* Icon */}
        <motion.div
          initial={{ rotate: -8, scale: 0.8, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.15 }}
          className="flex justify-center mb-4"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
            <span className="text-3xl">🏛️</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="text-3xl font-bold text-center text-green-700"
        >
          Government Registration
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="text-center text-gray-500 mt-2"
        >
          Create Farmer AI government account
        </motion.p>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mt-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
                className="w-14 h-14 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4"
              >
                <span className="text-2xl">✅</span>
              </motion.div>
              <p className="text-green-700 font-semibold">
                Government account created
              </p>
              <p className="text-gray-500 text-sm mt-1">
                You can now sign in with your Government ID and password.
              </p>

              <div className="mt-5 inline-block px-6 py-3 rounded-xl border border-green-200 bg-green-50/60">
                <p className="text-xs text-gray-500">Your Government ID</p>
                <p className="font-mono tracking-wide text-green-800 text-lg font-semibold">
                  {govId}
                </p>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Keep this ID safe — you'll need it along with your password to log in.
              </p>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => {
                  setForm({
                    officerName: "",
                    email: "",
                    phone: "",
                    department: "",
                    office: "",
                    password: "",
                    confirmPassword: "",
                  });
                  setGovId(generateGovId());
                  setSubmitted(false);
                }}
                className="mt-6 block mx-auto text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Register another account
              </motion.button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="mt-8 space-y-4"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Government ID (auto-generated) */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Government ID
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-3 border border-green-200 bg-green-50/60 rounded-xl font-mono tracking-wide text-green-800">
                    {govId}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="px-3 py-3 rounded-xl border border-gray-200 text-gray-500 hover:text-green-700 hover:border-green-300 transition text-sm font-medium"
                    title="Copy ID"
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={handleRegenerateId}
                    className="px-3 py-3 rounded-xl border border-gray-200 text-gray-500 hover:text-green-700 hover:border-green-300 transition text-sm font-medium"
                    title="Generate a new ID"
                  >
                    ↻
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Generated for you — save it, you'll use it to sign in.
                </p>
              </motion.div>

              {/* Officer Name */}
              <motion.div variants={itemVariants}>
                <label htmlFor="officerName" className="block text-sm font-medium text-gray-700 mb-1">
                  Officer Name
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  id="officerName"
                  name="officerName"
                  type="text"
                  placeholder="Officer Name"
                  value={form.officerName}
                  onChange={handleChange}
                  className={fieldClass("officerName")}
                />
                {errors.officerName && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.officerName}
                  </motion.p>
                )}
              </motion.div>

              {/* Official Email */}
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Official Email
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Official Email"
                  value={form.email}
                  onChange={handleChange}
                  className={fieldClass("email")}
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </motion.div>

              {/* Official Mobile */}
              <motion.div variants={itemVariants}>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Official Mobile Number
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Official Mobile Number"
                  value={form.phone}
                  onChange={handleChange}
                  className={fieldClass("phone")}
                />
                {errors.phone && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.phone}
                  </motion.p>
                )}
              </motion.div>

              {/* Department */}
              <motion.div variants={itemVariants}>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Department Name
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  id="department"
                  name="department"
                  type="text"
                  placeholder="Department Name"
                  value={form.department}
                  onChange={handleChange}
                  className={fieldClass("department")}
                />
                {errors.department && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.department}
                  </motion.p>
                )}
              </motion.div>

              {/* Office / District */}
              <motion.div variants={itemVariants}>
                <label htmlFor="office" className="block text-sm font-medium text-gray-700 mb-1">
                  Office / District
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  id="office"
                  name="office"
                  type="text"
                  placeholder="Office / District"
                  value={form.office}
                  onChange={handleChange}
                  className={fieldClass("office")}
                />
                {errors.office && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.office}
                  </motion.p>
                )}
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    className={`${fieldClass("password")} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                    tabIndex={-1}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </motion.div>

              {/* Confirm Password */}
              <motion.div variants={itemVariants}>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={fieldClass("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </motion.div>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold hover:from-green-600 hover:to-blue-600 transition"
              >
                Register Government Account
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-center text-sm text-gray-400 mt-6">
          🌱 Farmer AI • Government Portal
        </p>
      </motion.div>
    </div>
  );
};

export default GovtRegister;
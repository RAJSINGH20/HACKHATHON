import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
    transition: { when: "beforeChildren", staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const AdminRegister = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};

    if (!form.username.trim()) {
      next.username = "Enter a username";
    } else if (form.username.trim().length < 3) {
      next.username = "Username must be at least 3 characters";
    }

    if (!form.email.trim()) {
      next.email = "Enter an email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Enter a valid email address";
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
      console.log("Registering admin:", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f8f1] flex items-center justify-center p-4">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        {/* ================= HEADER ================= */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-gradient-to-r from-green-50 to-blue-50 p-8 md:p-10"
        >
          <motion.div variants={itemVariants}>
            <Link
              to="/admin-login"
              className="text-green-700 font-semibold hover:text-green-900"
            >
              ← Back to Login
            </Link>
          </motion.div>

          <div className="flex justify-between items-center mt-8">
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl font-bold text-green-900">
                Admin Registration
              </h1>

              <p className="text-gray-600 mt-2">
                Create an account to manage Farmer AI operations
              </p>
            </motion.div>

            <motion.div
              initial={{ rotate: -8, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
              className="hidden md:block text-7xl"
            >
              👨‍💼
            </motion.div>
          </div>
        </motion.div>

        {/* ================= BODY ================= */}

        <div className="px-8 md:px-12 py-10">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-lg mx-auto text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
                  className="text-7xl"
                >
                  ✅
                </motion.div>

                <h2 className="text-3xl font-bold text-green-800 mt-5">
                  Registration Complete!
                </h2>

                <p className="text-gray-500 mt-3">
                  Your admin account has been created successfully.
                </p>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/admin-login"
                    className="inline-block mt-8 bg-green-700 hover:bg-green-800 text-white px-10 py-4 rounded-xl font-semibold"
                  >
                    Go to Login
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="max-w-lg mx-auto"
              >
                <motion.h2 variants={itemVariants} className="text-2xl font-bold text-green-800">
                  Account Details
                </motion.h2>

                <motion.p variants={itemVariants} className="text-gray-500 mt-2">
                  Enter your username, email and a password
                </motion.p>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
                  {/* Username */}
                  <motion.div variants={itemVariants}>
                    <label
                      htmlFor="username"
                      className="block font-semibold text-gray-700 mb-2"
                    >
                      Username
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Choose a username"
                      value={form.username}
                      onChange={handleChange}
                      className={`w-full px-5 py-4 border rounded-xl outline-none transition focus:ring-2 ${
                        errors.username
                          ? "border-red-300 focus:ring-red-100"
                          : "border-gray-200 focus:border-green-500 focus:ring-green-100"
                      }`}
                    />
                    {errors.username && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.username}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Email */}
                  <motion.div variants={itemVariants}>
                    <label
                      htmlFor="email"
                      className="block font-semibold text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      className={`w-full px-5 py-4 border rounded-xl outline-none transition focus:ring-2 ${
                        errors.email
                          ? "border-red-300 focus:ring-red-100"
                          : "border-gray-200 focus:border-green-500 focus:ring-green-100"
                      }`}
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Password */}
                  <motion.div variants={itemVariants}>
                    <label
                      htmlFor="password"
                      className="block font-semibold text-gray-700 mb-2"
                    >
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
                        className={`w-full px-5 py-4 pr-16 border rounded-xl outline-none transition focus:ring-2 ${
                          errors.password
                            ? "border-red-300 focus:ring-red-100"
                            : "border-gray-200 focus:border-green-500 focus:ring-green-100"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm font-medium"
                        tabIndex={-1}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.password}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Confirm Password */}
                  <motion.div variants={itemVariants}>
                    <label
                      htmlFor="confirmPassword"
                      className="block font-semibold text-gray-700 mb-2"
                    >
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
                      className={`w-full px-5 py-4 border rounded-xl outline-none transition focus:ring-2 ${
                        errors.confirmPassword
                          ? "border-red-300 focus:ring-red-100"
                          : "border-gray-200 focus:border-green-500 focus:ring-green-100"
                      }`}
                    />
                    {errors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
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
                    className="w-full mt-2 bg-green-700 hover:bg-green-800 text-white py-4 rounded-xl font-semibold transition"
                  >
                    Register Admin
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ================= FOOTER ================= */}

        <div className="bg-[#eef7e9] px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌱</span>

            <div>
              <p className="font-semibold text-green-900">
                Empowering Farmers,
              </p>

              <p className="text-sm text-gray-600">Building a Better Future.</p>
            </div>
          </div>

          <div className="hidden md:block text-4xl">🚜 🌳 🌾</div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminRegister;
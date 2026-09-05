import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/admin_login`, {
        email: e.target.email.value,
        password: e.target.password.value,
      });

      // adjust based on your API's actual response shape
      if (res.data?.token) {
        localStorage.setItem("adminToken", res.data.token);
      }

      navigate("/admin-dashboard");
    } catch (err) {
      console.error("Error occurred while logging in admin:", err);
      setError(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50 px-4">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-green-100"
      >
        {/* Admin Icon */}
        <motion.div variants={itemVariants} className="flex justify-center mb-5">
          <motion.div
            initial={{ rotate: -8, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.15 }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center shadow-md"
          >
            <span className="text-3xl">👨‍💼</span>
          </motion.div>
        </motion.div>

        {/* Heading */}
        <motion.h1 variants={itemVariants} className="text-3xl font-bold text-center text-green-700">
          Admin Login
        </motion.h1>

        <motion.p variants={itemVariants} className="text-center text-gray-500 mt-2">
          Farmer AI Admin Panel
        </motion.p>

        {/* Form */}
        <motion.form variants={itemVariants} className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <motion.div
              variants={itemVariants}
              className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
            >
              {error}
            </motion.div>
          )}

          {/* Email */}
          <motion.div variants={itemVariants}>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Email
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="email"
              name="email"
              required
              placeholder="Enter Admin Email"
              className="w-full px-4 py-3 rounded-xl
              border border-blue-200
              bg-blue-50/40
              outline-none
              focus:border-green-400
              focus:ring-2 focus:ring-green-100
              transition"
            />
          </motion.div>

          {/* Password */}
          <motion.div variants={itemVariants}>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Password
            </label>

            <div className="relative">
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Enter Password"
                className="w-full px-4 py-3 pr-16 rounded-xl
                border border-blue-200
                bg-blue-50/40
                outline-none
                focus:border-green-400
                focus:ring-2 focus:ring-green-100
                transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </motion.div>

          {/* Forgot Password */}
          <motion.div variants={itemVariants} className="text-right">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-green-600 transition"
            >
              Forgot Password?
            </button>
          </motion.div>

          {/* Login Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl
            bg-gradient-to-r from-green-500 to-blue-500
            text-white font-semibold
            shadow-md hover:shadow-lg
            hover:from-green-600 hover:to-blue-600
            transition duration-300
            disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>

          {/* Register */}
          {/* <motion.div variants={itemVariants} className="text-center pt-1">
            <span className="text-sm text-gray-500">Don't have an account? </span>
            <Link
              to="/admin-register"
              className="text-sm font-semibold text-green-700 hover:text-green-800 transition"
            >
              Register
            </Link>
          </motion.div> */}
        </motion.form>

        {/* Footer */}
        <motion.p
          variants={itemVariants}
          className="text-center text-sm text-gray-400 mt-7"
        >
          🌾 Farmer AI • Admin Portal
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
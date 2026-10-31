import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

const FarmerLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const mobile = e.target.mobile.value;
    const password = e.target.password.value;

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/farmer_login`,
        {
          mobile,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (
        !res.data?.user?.id ||
        res.data.user.role !== "farmer"
      ) {
        throw new Error("The server did not return a valid farmer account.");
      }

      setAuthenticatedUser("farmer", res.data.user);
      navigate("/farmer-dashboard");
    } catch (err) {
      console.error(
        "Farmer login failed:",
        err.response?.status || err.message
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please check your credentials."
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

        <motion.div variants={itemVariants} className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center shadow-md">
            <span className="text-3xl">🌾</span>
          </div>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-3xl font-bold text-center text-green-700">
          Farmer Login
        </motion.h1>

        <motion.p variants={itemVariants} className="text-center text-gray-500 mt-2">
          Welcome to Farmer AI
        </motion.p>

        <motion.form variants={itemVariants} className="mt-8 space-y-5" onSubmit={handleSubmit}>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
              role="alert"
            >
              {error}
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Mobile Number
            </label>

            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="tel"
              name="mobile"
              required
              pattern="[0-9]{10}"
              maxLength="10"
              placeholder="Enter mobile number"
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50/40 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Password
            </label>

            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="password"
              name="password"
              required
              placeholder="Enter password"
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50/40 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="text-right">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-green-600 transition"
            >
              Forgot Password?
            </button>
          </motion.div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-md hover:shadow-lg hover:from-green-600 hover:to-blue-600 transition duration-300 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>

          <motion.div variants={itemVariants} className="text-center pt-1">
            <span className="text-sm text-gray-500">
              Don't have an account?{" "}
            </span>

            <Link
              to="/farmer-register"
              className="text-sm font-semibold text-green-700 hover:text-green-800 transition"
            >
              Register
            </Link>
          </motion.div>
        </motion.form>

        <motion.div variants={itemVariants} className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Not comfortable using the website?
          </p>

          <button
            type="button"
            className="mt-2 text-green-600 font-semibold hover:text-blue-600 transition"
          >
            📞 Call Toll-Free for Assistance
          </button>
        </motion.div>

        <motion.p variants={itemVariants} className="text-center text-sm text-gray-400 mt-6">
          🌱 Farmer AI • Empowering Farmers
        </motion.p>
      </motion.div>
    </div>
  );
};

export default FarmerLogin;
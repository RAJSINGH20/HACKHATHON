import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const FarmerLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

      if (res.data?.token) {
        localStorage.setItem("farmerToken", res.data.token);
      }

      navigate("/farmer-dashboard");
    } catch (err) {
      console.error("Farmer Login Error:", err);

      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-green-100">

        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center shadow-md">
            <span className="text-3xl">🌾</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-green-700">
          Farmer Login
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Welcome to Farmer AI
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Mobile Number
            </label>

            <input
              type="tel"
              name="mobile"
              required
              pattern="[0-9]{10}"
              maxLength="10"
              placeholder="Enter mobile number"
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50/40 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              required
              placeholder="Enter password"
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50/40 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition"
            />
          </div>

          <div className="text-right">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-green-600 transition"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-md hover:shadow-lg hover:from-green-600 hover:to-blue-600 transition duration-300 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center pt-1">
            <span className="text-sm text-gray-500">
              Don't have an account?{" "}
            </span>

            <Link
              to="/farmer-register"
              className="text-sm font-semibold text-green-700 hover:text-green-800 transition"
            >
              Register
            </Link>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Not comfortable using the website?
          </p>

          <button
            type="button"
            className="mt-2 text-green-600 font-semibold hover:text-blue-600 transition"
          >
            📞 Call Toll-Free for Assistance
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          🌱 Farmer AI • Empowering Farmers
        </p>
      </div>
    </div>
  );
};

export default FarmerLogin;
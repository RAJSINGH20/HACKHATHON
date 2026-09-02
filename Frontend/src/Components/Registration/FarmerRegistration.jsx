import React, { useState } from "react";
import { Link } from "react-router-dom";

// Generates a unique Farmer AI UID, e.g. FARM-7K2X9P4Q
const generateUid = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0/I/1 to avoid confusion
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `FARM-${code}`;
};

const FarmerRegister = () => {
  const [form, setForm] = useState({
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [uid, setUid] = useState(generateUid);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRegenerateUid = () => {
    setUid(generateUid());
  };

  const handleCopyUid = async () => {
    try {
      await navigator.clipboard.writeText(uid);
    } catch (err) {
      // Clipboard API may be unavailable; fail silently
    }
  };

  const validate = () => {
    const next = {};

    if (!form.phone.trim()) {
      next.phone = "Enter a mobile number";
    } else if (!/^\d{10}$/.test(form.phone.trim())) {
      next.phone = "Enter a valid 10-digit mobile number";
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
      console.log("Registering farmer:", {
        phone: form.phone,
        uid,
        password: form.password,
      });
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f8f1] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* ================= HEADER ================= */}

        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 md:p-10">
          <Link
            to="/farmer-login"
            className="text-green-700 font-semibold hover:text-green-900"
          >
            ← Back to Login
          </Link>

          <div className="flex justify-between items-center mt-8">
            <div>
              <h1 className="text-4xl font-bold text-green-900">
                Create Account
              </h1>

              <p className="text-gray-600 mt-2">
                Register to access Farmer AI procurement services
              </p>
            </div>

            <div className="hidden md:block text-7xl">🌾</div>
          </div>
        </div>

        {/* ================= BODY ================= */}

        <div className="px-8 md:px-12 py-10">
          {submitted ? (
            <div className="max-w-lg mx-auto text-center">
              <div className="text-7xl">✅</div>

              <h2 className="text-3xl font-bold text-green-800 mt-5">
                Registration Complete!
              </h2>

              <p className="text-gray-500 mt-3">
                Your Farmer AI account has been created successfully.
              </p>

              <div className="mt-5 inline-block px-6 py-3 rounded-xl border border-green-200 bg-green-50/60">
                <p className="text-xs text-gray-500">Your UID</p>
                <p className="font-mono tracking-wide text-green-800 text-lg font-semibold">
                  {uid}
                </p>
              </div>

              <p className="text-xs text-gray-400 mt-2">
                Keep this UID safe — you'll need it along with your password to log in.
              </p>

              <Link
                to="/farmer-login"
                className="inline-block mt-8 bg-green-700 hover:bg-green-800 text-white px-10 py-4 rounded-xl font-semibold"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <div className="max-w-lg mx-auto">
              <h2 className="text-2xl font-bold text-green-800">
                Account Details
              </h2>

              <p className="text-gray-500 mt-2">
                Enter your mobile number, UID and a password
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
                {/* Mobile Number */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block font-semibold text-gray-700 mb-2"
                  >
                    Mobile Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="Enter 10-digit mobile number"
                    value={form.phone}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 border rounded-xl outline-none transition focus:ring-2 ${
                      errors.phone
                        ? "border-red-300 focus:ring-red-100"
                        : "border-gray-200 focus:border-green-500 focus:ring-green-100"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* UID (auto-generated) */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">
                    Your Farmer AI UID
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-5 py-4 border border-green-200 bg-green-50/60 rounded-xl font-mono tracking-wide text-green-800">
                      {uid}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUid}
                      className="px-4 py-4 rounded-xl border border-gray-200 text-gray-500 hover:text-green-700 hover:border-green-300 transition text-sm font-medium"
                      title="Copy UID"
                    >
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={handleRegenerateUid}
                      className="px-4 py-4 rounded-xl border border-gray-200 text-gray-500 hover:text-green-700 hover:border-green-300 transition text-sm font-medium"
                      title="Generate a new UID"
                    >
                      ↻
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    This UID is generated for you — save it, you'll use it to sign in.
                  </p>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block font-semibold text-gray-700 mb-2"
                  >
                    Create Password
                  </label>
                  <div className="relative">
                    <input
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
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block font-semibold text-gray-700 mb-2"
                  >
                    Confirm Password
                  </label>
                  <input
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
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="bg-green-50 border border-green-100 p-5 rounded-xl">
                  <p className="font-semibold text-green-800">
                    🛡️ Your details are safe with us.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    We use secure authentication to keep your account and data protected.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-green-700 hover:bg-green-800 text-white py-4 rounded-xl font-semibold transition"
                >
                  Register
                </button>
              </form>
            </div>
          )}
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
      </div>
    </div>
  );
};

export default FarmerRegister;
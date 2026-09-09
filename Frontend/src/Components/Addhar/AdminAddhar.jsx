import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Sprout,
  Tractor,
  ShieldCheck,
  Leaf,
  Wheat,
  ArrowRight,
  Phone,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const API_URL = "http://localhost:3000/api/aadhaar/check";
const UIDAI_URL = "https://uidai.gov.in/";

export default function AdminAadhaarCheck() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notRegistered, setNotRegistered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotRegistered(false);

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.get(API_URL, {
        params: { phone },
      });

      if (!data.success) {
        setError(
          data.message || "Something went wrong. Please try again."
        );
        return;
      }

      if (data.registered) {
        navigate("/admin-login");
      } else {
        setNotRegistered(true);
      }
    } catch (err) {
      if (err.response) {
        setError(
          err.response.data?.message ||
            "Something went wrong. Please try again."
        );
      } else {
        setError("Could not reach the server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f8ee] px-4 flex items-center justify-center">

      {/* =====================================================
          BACKGROUND FARM LANDSCAPE
      ====================================================== */}

      <div className="absolute inset-0 pointer-events-none">

        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#dff4ff] via-[#eef8df] to-[#cde7a8]" />

        {/* Sun */}
        <motion.div
          className="absolute right-[12%] top-[10%] h-28 w-28 rounded-full bg-yellow-300/50 blur-sm"
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.45, 0.65, 0.45],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating leaves */}

        <motion.div
          className="absolute left-[8%] top-[18%] text-green-500/30"
          animate={{
            y: [0, -25, 0],
            rotate: [0, 15, -5, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Leaf size={85} strokeWidth={1} />
        </motion.div>

        <motion.div
          className="absolute right-[7%] top-[30%] text-green-600/20"
          animate={{
            y: [0, 30, 0],
            rotate: [0, -20, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Leaf size={110} strokeWidth={1} />
        </motion.div>

        {/* Wheat */}
        <motion.div
          className="absolute left-[3%] bottom-[8%] text-yellow-700/20"
          animate={{
            rotate: [-3, 3, -3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        >
          <Wheat size={150} strokeWidth={1} />
        </motion.div>

        <motion.div
          className="absolute right-[4%] bottom-[5%] text-yellow-700/20"
          animate={{
            rotate: [3, -3, 3],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
          }}
        >
          <Wheat size={130} strokeWidth={1} />
        </motion.div>

        {/* Farm field curves */}
        <div className="absolute bottom-[-180px] left-[-10%] h-[360px] w-[120%] rounded-[50%] bg-green-700/20" />
        <div className="absolute bottom-[-230px] left-[-15%] h-[380px] w-[130%] rounded-[50%] bg-green-800/15" />

        {/* Animated particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-green-500/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="relative z-10 w-full max-w-6xl">

        {/* Project branding */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-8 text-center"
        >
          <div className="mb-3 flex items-center justify-center gap-3">

            <motion.div
              whileHover={{
                rotateY: 180,
                scale: 1.1,
              }}
              transition={{ duration: 0.6 }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 shadow-xl shadow-green-700/30"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <Sprout
                size={30}
                className="text-white"
                strokeWidth={2}
              />
            </motion.div>

            <div className="text-left">
              <h1 className="text-2xl font-black tracking-tight text-green-950">
                Farmer AI
              </h1>

              <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-700">
                Smart Agriculture Platform
              </p>
            </div>
          </div>

          <p className="text-sm text-green-900/60">
            Secure farmer & administration verification system
          </p>
        </motion.div>

        {/* =====================================================
            3D CARD
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 50,
            rotateX: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
            rotateX: 0,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          whileHover={{
            rotateX: 1,
            rotateY: -1,
            scale: 1.005,
          }}
          className="mx-auto max-w-md"
          style={{
            perspective: "1200px",
          }}
        >

          <div
            className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white/75 p-8 shadow-[0_30px_80px_rgba(35,90,40,0.20)] backdrop-blur-2xl"
            style={{
              transformStyle: "preserve-3d",
            }}
          >

            {/* Top green glow */}
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-green-400/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-yellow-400/20 blur-3xl" />

            {/* Aadhaar icon */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.3,
                type: "spring",
                stiffness: 180,
              }}
              className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-green-600 via-emerald-600 to-green-800 shadow-xl shadow-green-700/30"
            >
              <ShieldCheck
                size={42}
                className="text-white"
                strokeWidth={1.8}
              />

              <motion.div
                className="absolute inset-0 rounded-3xl border-2 border-green-300/40"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.8, 0, 0.8],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                }}
              />
            </motion.div>

            {/* Heading */}
            <div className="relative mb-7 text-center">

              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                <CheckCircle2 size={13} />
                Secure Verification
              </div>

              <h2 className="text-3xl font-black tracking-tight text-green-950">
                Verify Aadhaar
              </h2>

              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-600">
                Enter your registered mobile number to securely
                continue to the Farmer AI administration panel.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="relative space-y-5">

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 flex items-center gap-2 text-sm font-bold text-green-950"
                >
                  <Phone size={15} className="text-green-600" />
                  Registered mobile number
                </label>

                <div className="group relative">

                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={(e) =>
                      setPhone(
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    placeholder="9876543210"
                    className="w-full rounded-2xl border border-green-200 bg-green-50/60 px-5 py-4 text-lg font-semibold tracking-wider text-green-950 outline-none transition-all placeholder:text-green-900/30 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                  />

                  <motion.div
                    className="pointer-events-none absolute bottom-0 left-0 h-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1.2 }}
                  />

                </div>

                <p className="mt-2 text-xs text-slate-500">
                  We'll use this number only to check your
                  registration status.
                </p>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                  role="alert"
                >
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{error}</span>
                </motion.div>
              )}

              {/* Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{
                  scale: 1.02,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-green-700 via-emerald-600 to-green-700 py-4 font-bold text-white shadow-xl shadow-green-700/25 transition-all disabled:cursor-not-allowed disabled:opacity-60"
              >

                {/* Shine */}
                <motion.div
                  className="absolute inset-y-0 -left-20 w-20 skew-x-[-20deg] bg-white/20"
                  animate={{
                    left: ["-20%", "120%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />

                {loading ? (
                  <>
                    <motion.div
                      className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    Checking...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={20} />

                    Check Aadhaar Status

                    <motion.span
                      animate={{
                        x: [0, 5, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    >
                      <ArrowRight size={19} />
                    </motion.span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Not registered */}
            {notRegistered && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  y: 0,
                }}
                className="mt-6 overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-5"
              >
                <div className="flex gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                    <Sprout
                      size={19}
                      className="text-amber-700"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-amber-900">
                      Aadhaar not registered
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-amber-800">
                      No Aadhaar registration was found for
                      this number. Please register through the
                      official UIDAI portal.
                    </p>

                    <a
                      href={UIDAI_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-200/70 px-3 py-2 text-xs font-bold text-amber-900 transition hover:bg-amber-300"
                    >
                      Visit UIDAI
                      <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Bottom login */}
            {/* <div className="relative mt-7 border-t border-green-900/10 pt-5 text-center">

              <p className="text-xs text-slate-500">
                Already verified?
              </p>

              <NavLink
                to="/admin-login"
                className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-green-700 transition hover:text-green-900"
              >
                Go to Admin Login
                <ArrowRight size={14} />
              </NavLink>

            </div> */}
          </div>
        </motion.div>

        {/* =====================================================
            FARMER FEATURES
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.7,
          }}
          className="mx-auto mt-8 flex max-w-md items-center justify-center gap-3"
        >

          <div className="flex items-center gap-2 rounded-full border border-green-200 bg-white/60 px-4 py-2 text-xs font-semibold text-green-800 shadow-sm backdrop-blur">
            <Sprout size={15} />
            Farmer First
          </div>

          <div className="flex items-center gap-2 rounded-full border border-green-200 bg-white/60 px-4 py-2 text-xs font-semibold text-green-800 shadow-sm backdrop-blur">
            <ShieldCheck size={15} />
            Secure
          </div>

          <div className="flex items-center gap-2 rounded-full border border-green-200 bg-white/60 px-4 py-2 text-xs font-semibold text-green-800 shadow-sm backdrop-blur">
            <Tractor size={15} />
            Smart Farming
          </div>

        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center text-[11px] font-medium tracking-wide text-green-950/40"
        >
          FARMER AI • DIGITAL AGRICULTURE • NEXUS PRIME
        </motion.p>

      </div>
    </div>
  );
}
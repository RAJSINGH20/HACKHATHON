import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Landmark,
  Wheat,
  Leaf,
  Phone,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  BadgeCheck,
} from "lucide-react";

const API_URL = "http://localhost:3000/api/aadhaar/check";
const UIDAI_URL = "https://uidai.gov.in/";

export default function GovtAadhaarCheck() {
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
        navigate("/government-login");
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
    <div className="relative min-h-screen overflow-hidden bg-[#eef5ed] px-4 py-8 flex items-center justify-center">

      {/* =====================================================
          GOVERNMENT / AGRICULTURE BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8f3ed] via-[#f7faf5] to-[#d8ead8]" />

        {/* Green government glow */}
        <motion.div
          className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
          }}
        />

        {/* Orange glow */}
        <motion.div
          className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-orange-400/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
          }}
        />

        {/* Ashoka-style circle */}
        <motion.div
          className="absolute left-[8%] top-[12%] flex h-32 w-32 items-center justify-center rounded-full border border-slate-400/10"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="h-20 w-20 rounded-full border border-slate-400/10" />
        </motion.div>

        {/* Floating agriculture leaves */}

        <motion.div
          className="absolute left-[4%] bottom-[20%] text-green-700/10"
          animate={{
            y: [0, -25, 0],
            rotate: [-10, 10, -10],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
          }}
        >
          <Leaf size={150} strokeWidth={1} />
        </motion.div>

        <motion.div
          className="absolute right-[4%] top-[20%] text-green-700/10"
          animate={{
            y: [0, 30, 0],
            rotate: [10, -10, 10],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        >
          <Leaf size={130} strokeWidth={1} />
        </motion.div>

        {/* Wheat */}
        <motion.div
          className="absolute bottom-[2%] right-[12%] text-yellow-700/10"
          animate={{
            rotate: [-4, 4, -4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        >
          <Wheat size={160} strokeWidth={1} />
        </motion.div>

        {/* Decorative lines */}
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-orange-400 via-white to-green-600 opacity-60" />

        {/* Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-emerald-600/20"
            style={{
              left: `${(i * 23) % 100}%`,
              top: `${(i * 31) % 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div className="relative z-10 w-full max-w-md">

        {/* =====================================================
            GOVERNMENT BRAND
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-7 text-center"
        >

          <div className="mb-3 flex items-center justify-center gap-3">

            {/* 3D Government Logo */}
            <motion.div
              whileHover={{
                rotateY: 180,
                scale: 1.08,
              }}
              transition={{
                duration: 0.7,
              }}
              className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-700 via-green-700 to-green-900 shadow-xl shadow-green-900/20"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <Landmark
                size={32}
                className="text-white"
                strokeWidth={1.7}
              />

              {/* 3D border */}
              <div className="absolute inset-1 rounded-xl border border-white/20" />
            </motion.div>

            <div className="text-left">
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                Farmer AI
              </h1>

              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-700">
                Government Portal
              </p>
            </div>

          </div>

          <p className="text-sm font-medium text-slate-600">
            Digital Agriculture & Farmer Welfare System
          </p>

        </motion.div>

        {/* =====================================================
            3D VERIFICATION CARD
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 60,
            rotateX: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
            rotateX: 0,
          }}
          transition={{
            duration: 0.9,
            ease: "easeOut",
          }}
          whileHover={{
            rotateX: 1,
            rotateY: -1,
            scale: 1.008,
          }}
          style={{
            perspective: "1200px",
          }}
        >

          <div
            className="relative overflow-hidden rounded-[30px] border border-white/80 bg-white/80 p-8 shadow-[0_35px_90px_rgba(20,70,45,0.18)] backdrop-blur-2xl"
            style={{
              transformStyle: "preserve-3d",
            }}
          >

            {/* Card glow */}
            <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-orange-400/10 blur-3xl" />

            {/* =================================================
                SECURITY ICON
            ================================================== */}

            <motion.div
              initial={{
                scale: 0,
                rotate: -20,
              }}
              animate={{
                scale: 1,
                rotate: 0,
              }}
              transition={{
                delay: 0.25,
                type: "spring",
                stiffness: 180,
              }}
              className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-to-br from-emerald-700 via-green-700 to-green-950 shadow-2xl shadow-green-900/25"
            >

              <ShieldCheck
                size={43}
                className="text-white"
                strokeWidth={1.6}
              />

              {/* Pulse */}
              <motion.div
                className="absolute inset-0 rounded-[24px] border-2 border-emerald-400/40"
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.8, 0, 0.8],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                }}
              />

            </motion.div>

            {/* =================================================
                HEADER
            ================================================== */}

            <div className="mb-7 text-center">

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
                <BadgeCheck size={14} />
                Official Verification
              </div>

              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                Verify Aadhaar
              </h2>

              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-600">
                Enter your registered mobile number to
                securely access the Government Farmer AI portal.
              </p>

            </div>

            {/* =================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Mobile input */}

              <div>

                <label
                  htmlFor="phone"
                  className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800"
                >
                  <Phone
                    size={15}
                    className="text-emerald-700"
                  />

                  Registered mobile number
                </label>

                <div className="relative">

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
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-4 text-lg font-semibold tracking-wider text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10"
                  />

                  {/* Animated green line */}
                  <motion.div
                    className="absolute bottom-0 left-5 right-5 h-1 origin-left rounded-full bg-gradient-to-r from-orange-400 via-white to-green-600"
                    initial={{
                      scaleX: 0,
                    }}
                    animate={{
                      scaleX: 1,
                    }}
                    transition={{
                      duration: 1.2,
                    }}
                  />

                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Your mobile number is used to verify your
                  registered government account.
                </p>

              </div>

              {/* =================================================
                  ERROR
              ================================================== */}

              {error && (
                <motion.div
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
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

              {/* =================================================
                  BUTTON
              ================================================== */}

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
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-800 py-4 font-bold text-white shadow-xl shadow-green-900/20 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {/* Shine animation */}
                <motion.div
                  className="absolute inset-y-0 -left-24 w-20 skew-x-[-20deg] bg-white/20"
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

            {/* =================================================
                NOT REGISTERED
            ================================================== */}

            {notRegistered && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  height: "auto",
                }}
                className="mt-6 overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-5"
              >

                <div className="flex gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                    <Leaf
                      size={20}
                      className="text-amber-700"
                    />
                  </div>

                  <div>

                    <p className="font-bold text-amber-900">
                      Aadhaar not registered
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-amber-800">
                      No Aadhaar registration was found for
                      this mobile number. Please register through
                      the official UIDAI portal.
                    </p>

                    <motion.a
                      href={UIDAI_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{
                        scale: 1.03,
                      }}
                      className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-200/70 px-3 py-2 text-xs font-bold text-amber-900"
                    >
                      Visit UIDAI
                      <ArrowRight size={14} />
                    </motion.a>

                  </div>

                </div>

              </motion.div>
            )}

            {/* =================================================
                GOVERNMENT LOGIN
            ================================================== */}

            <div className="mt-7 border-t border-slate-200 pt-5 text-center">

              <p className="text-xs text-slate-500">
                Already verified?
              </p>

              <NavLink
                to="/government-login"
                className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-emerald-700 transition hover:text-emerald-900"
              >
                Go to Government Login
                <ArrowRight size={14} />
              </NavLink>

            </div>

          </div>

        </motion.div>

        {/* =====================================================
            GOVERNMENT FEATURES
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.6,
            duration: 0.7,
          }}
          className="mt-7 flex flex-wrap justify-center gap-2"
        >

          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-white/60 px-4 py-2 text-xs font-bold text-emerald-800 shadow-sm backdrop-blur">
            <ShieldCheck size={14} />
            Secure
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-white/60 px-4 py-2 text-xs font-bold text-emerald-800 shadow-sm backdrop-blur">
            <Landmark size={14} />
            Government
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-white/60 px-4 py-2 text-xs font-bold text-emerald-800 shadow-sm backdrop-blur">
            <Wheat size={14} />
            Agriculture
          </div>

        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-5 text-center text-[10px] font-bold tracking-[0.18em] text-slate-500/60"
        >
          FARMER AI • GOVERNMENT PORTAL • DIGITAL AGRICULTURE
        </motion.p>

      </div>
    </div>
  );
}
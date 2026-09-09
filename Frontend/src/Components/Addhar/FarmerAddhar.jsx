import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Sprout,
  ShieldCheck,
  Leaf,
  Wheat,
  Tractor,
  Phone,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const API_URL = "http://localhost:3000/api/aadhaar/check";
const UIDAI_URL = "https://uidai.gov.in/";

export default function FarmerAadhaarCheck() {
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
        navigate("/farmer-login");
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
    <div className="relative min-h-screen overflow-hidden bg-[#eef7e8] px-4 py-8 flex items-center justify-center">

      {/* =====================================================
          FARM BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#dff4ff] via-[#f1f9e9] to-[#c5e59d]" />

        {/* Sun */}
        <motion.div
          className="absolute right-[12%] top-[8%] h-32 w-32 rounded-full bg-yellow-300/40 blur-md"
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.35, 0.6, 0.35],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Clouds */}
        <motion.div
          className="absolute left-[8%] top-[12%] h-10 w-32 rounded-full bg-white/60 blur-md"
          animate={{
            x: [0, 30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute right-[25%] top-[20%] h-8 w-24 rounded-full bg-white/50 blur-md"
          animate={{
            x: [0, -25, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating Leaf - Left */}
        <motion.div
          className="absolute left-[5%] top-[25%] text-green-600/20"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 15, -10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Leaf size={100} strokeWidth={1} />
        </motion.div>

        {/* Floating Leaf - Right */}
        <motion.div
          className="absolute right-[5%] top-[38%] text-green-700/20"
          animate={{
            y: [0, 35, 0],
            rotate: [0, -20, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Leaf size={120} strokeWidth={1} />
        </motion.div>

        {/* Wheat */}
        <motion.div
          className="absolute bottom-[4%] left-[2%] text-yellow-700/20"
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

        <motion.div
          className="absolute bottom-[2%] right-[3%] text-yellow-700/20"
          animate={{
            rotate: [4, -4, 4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        >
          <Wheat size={140} strokeWidth={1} />
        </motion.div>

        {/* Field */}
        <div className="absolute -bottom-52 -left-[10%] h-[400px] w-[120%] rounded-[50%] bg-green-700/20" />

        <div className="absolute -bottom-64 -left-[15%] h-[400px] w-[130%] rounded-[50%] bg-green-900/10" />

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-green-500/25"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 29) % 100}%`,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.15, 0.7, 0.15],
            }}
            transition={{
              duration: 3 + (i % 4),
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <div className="relative z-10 w-full max-w-md">

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-7 text-center"
        >
          <div className="mb-3 flex items-center justify-center gap-3">

            {/* 3D Logo */}
            <motion.div
              whileHover={{
                rotateY: 180,
                scale: 1.08,
              }}
              transition={{ duration: 0.7 }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 via-emerald-600 to-green-800 shadow-xl shadow-green-900/25"
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

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-green-700">
                Smart Agriculture
              </p>
            </div>
          </div>

          <p className="text-sm text-green-950/60">
            Empowering farmers through digital technology
          </p>
        </motion.div>

        {/* =====================================================
            3D CARD
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
            rotateX: 1.5,
            rotateY: -1.5,
            scale: 1.008,
          }}
          style={{
            perspective: "1200px",
          }}
        >

          <div
            className="relative overflow-hidden rounded-[32px] border border-white/80 bg-white/75 p-8 shadow-[0_35px_90px_rgba(30,90,40,0.22)] backdrop-blur-2xl"
            style={{
              transformStyle: "preserve-3d",
            }}
          >

            {/* Card Glow */}
            <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-green-400/20 blur-3xl" />

            <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-yellow-400/20 blur-3xl" />

            {/* =================================================
                SHIELD
            ================================================== */}

            <motion.div
              initial={{
                scale: 0,
                rotate: -25,
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
              className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[25px] bg-gradient-to-br from-green-600 via-emerald-600 to-green-900 shadow-2xl shadow-green-700/30"
            >

              <ShieldCheck
                size={42}
                className="text-white"
                strokeWidth={1.7}
              />

              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-[25px] border-2 border-green-400/50"
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

              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-800">
                <CheckCircle2 size={13} />
                Farmer Verification
              </div>

              <h2 className="text-3xl font-black tracking-tight text-green-950">
                Verify Aadhaar
              </h2>

              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-600">
                Verify your registered mobile number to
                securely access your Farmer AI account.
              </p>
            </div>

            {/* =================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Mobile */}
              <div>

                <label
                  htmlFor="phone"
                  className="mb-2 flex items-center gap-2 text-sm font-bold text-green-950"
                >
                  <Phone
                    size={15}
                    className="text-green-600"
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
                    className="w-full rounded-2xl border border-green-200 bg-green-50/70 px-5 py-4 text-lg font-semibold tracking-wider text-green-950 outline-none transition-all placeholder:text-green-900/30 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                  />

                  {/* Animated underline */}
                  <motion.div
                    className="absolute bottom-0 left-4 right-4 h-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                    initial={{
                      scaleX: 0,
                    }}
                    whileInView={{
                      scaleX: 1,
                    }}
                    transition={{
                      duration: 1,
                    }}
                  />

                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Your number is used only to check your
                  Farmer AI registration status.
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
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-green-700 via-emerald-600 to-green-700 py-4 font-bold text-white shadow-xl shadow-green-700/25"
              >

                {/* Button Shine */}
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
                    <Sprout
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
                      Register on UIDAI
                      <ArrowRight size={14} />
                    </motion.a>

                  </div>

                </div>

              </motion.div>
            )}

            {/* =================================================
                LOGIN
            ================================================== */}

            <div className="mt-7 border-t border-green-900/10 pt-5 text-center">

              <p className="text-xs text-slate-500">
                Already verified?
              </p>

              <NavLink
                to="/farmer-login"
                className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-green-700 transition hover:text-green-950"
              >
                Go to Farmer Login
                <ArrowRight size={14} />
              </NavLink>

            </div>

          </div>

        </motion.div>

        {/* =====================================================
            FARM FEATURES
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
          className="mt-7 flex flex-wrap items-center justify-center gap-2"
        >

          <div className="flex items-center gap-2 rounded-full border border-green-200 bg-white/60 px-4 py-2 text-xs font-bold text-green-800 shadow-sm backdrop-blur">
            <Sprout size={14} />
            Farmer First
          </div>

          <div className="flex items-center gap-2 rounded-full border border-green-200 bg-white/60 px-4 py-2 text-xs font-bold text-green-800 shadow-sm backdrop-blur">
            <ShieldCheck size={14} />
            Secure
          </div>

          <div className="flex items-center gap-2 rounded-full border border-green-200 bg-white/60 px-4 py-2 text-xs font-bold text-green-800 shadow-sm backdrop-blur">
            <Tractor size={14} />
            Smart Farming
          </div>

        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1,
          }}
          className="mt-5 text-center text-[10px] font-bold tracking-[0.2em] text-green-950/35"
        >
          FARMER AI • DIGITAL AGRICULTURE • NEXUS PRIME
        </motion.p>

      </div>
    </div>
  );
}

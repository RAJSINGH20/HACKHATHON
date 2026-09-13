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
import dotenv from "dotenv";

dotenv.config();

const CLIENT_URL = process.env.REACT_APP_CLIENT_URL;
const API_URL = `${CLIENT_URL}/api/aadhaar/check`;
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
    <div className="relative min-h-screen overflow-hidden bg-brand-bg px-4 py-8 flex items-center justify-center">

      {/* =====================================================
          FARM BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#e3f6fb] via-[#eafaf5] to-[#bfe8d9]" />

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
          className="absolute left-[5%] top-[25%] text-brand-green/25"
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
          className="absolute right-[5%] top-[38%] text-brand-teal/25"
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
        <div className="absolute -bottom-52 -left-[10%] h-[400px] w-[120%] rounded-[50%] bg-brand-green/20" />

        <div className="absolute -bottom-64 -left-[15%] h-[400px] w-[130%] rounded-[50%] bg-brand-deep/10" />

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-brand-teal/25"
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

            {/* Logo */}
            <motion.div
              whileHover={{
                rotateY: 180,
                scale: 1.08,
              }}
              transition={{ duration: 0.7 }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xl shadow-brand-deep/20"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <img
                src="/logo-icon.png"
                alt="Fasal Setu logo"
                className="h-11 w-11 object-contain"
              />
            </motion.div>

            <div className="text-left">
              <h1 className="text-2xl font-black tracking-tight text-brand-deep">
                Fasal Setu
              </h1>

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-teal">
                Smart Agriculture
              </p>
            </div>
          </div>

          <p className="text-sm text-brand-deep/60">
            A Smarter Way To Sell Your Harvest
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
            <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-brand-teal/20 blur-3xl" />

            <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl" />

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
              className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[25px] bg-gradient-to-br from-brand-deep via-brand-teal to-brand-green shadow-2xl shadow-brand-teal/30"
            >

              <ShieldCheck
                size={42}
                className="text-white"
                strokeWidth={1.7}
              />

              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-[25px] border-2 border-brand-teal/50"
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

              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-mint px-3 py-1.5 text-xs font-bold text-brand-green">
                <CheckCircle2 size={13} />
                Farmer Verification
              </div>

              <h2 className="text-3xl font-black tracking-tight text-brand-deep">
                Verify Aadhaar
              </h2>

              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-600">
                Verify your registered mobile number to
                securely access your Fasal Setu account.
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
                  className="mb-2 flex items-center gap-2 text-sm font-bold text-brand-deep"
                >
                  <Phone
                    size={15}
                    className="text-brand-teal"
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
                    className="w-full rounded-2xl border border-brand-teal/30 bg-brand-mint/40 px-5 py-4 text-lg font-semibold tracking-wider text-brand-deep outline-none transition-all placeholder:text-brand-deep/30 focus:border-brand-teal focus:bg-white focus:ring-4 focus:ring-brand-teal/10"
                  />

                  {/* Animated underline */}
                  <motion.div
                    className="absolute bottom-0 left-4 right-4 h-1 rounded-full bg-gradient-to-r from-brand-teal to-brand-green"
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
                  Fasal Setu registration status.
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
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-deep via-brand-teal to-brand-green py-4 font-bold text-white shadow-xl shadow-brand-teal/25"
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

            <div className="mt-7 border-t border-brand-deep/10 pt-5 text-center">

              <p className="text-xs text-slate-500">
                Already verified?
              </p>

              <NavLink
                to="/farmer-login"
                className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-brand-teal transition hover:text-brand-deep"
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

          <div className="flex items-center gap-2 rounded-full border border-brand-teal/20 bg-white/60 px-4 py-2 text-xs font-bold text-brand-green shadow-sm backdrop-blur">
            <Sprout size={14} />
            Farmer First
          </div>

          <div className="flex items-center gap-2 rounded-full border border-brand-teal/20 bg-white/60 px-4 py-2 text-xs font-bold text-brand-green shadow-sm backdrop-blur">
            <ShieldCheck size={14} />
            Secure
          </div>

          <div className="flex items-center gap-2 rounded-full border border-brand-teal/20 bg-white/60 px-4 py-2 text-xs font-bold text-brand-green shadow-sm backdrop-blur">
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
          className="mt-5 text-center text-[10px] font-bold tracking-[0.2em] text-brand-deep/35"
        >
          FASAL SETU • A SMARTER WAY TO SELL YOUR HARVEST
        </motion.p>

      </div>
    </div>
  );
}
// ======================================================
// index.js
// ======================================================

import dotenv from "dotenv";
// Resolve .env relative to this backend entrypoint. This keeps configuration
// working whether the server is launched from Backend/ or the repository root.
dotenv.config({ path: new URL(".env", import.meta.url) });

import express from "express";
import cors from "cors";

import connectDB from "./Database/db.js";

import authRoutes from "./Routes/user.routes.js";
import bookingRoutes from "./Routes/booking.routes.js";
import aadhaarRoutes from "./Routes/Addhar.routes.js";
import procurementRoutes from "./Routes/procument.routes.js";
import chatRoutes from "./Routes/chat.route.js";
import dns from "dns";

// Use Google DNS (8.8.8.8, 8.8.4.4) instead of system default
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

connectDB();

// ✅ Fixed: corrected typo'd Vercel URL (was missing the trailing "8")
// ✅ Also using a regex fallback so any future Vercel preview URL
//    for this project still works without editing this file every deploy.
const allowedOrigins = [
  "http://localhost:5173",
  "https://hackhathon-omega.vercel.app",
  "https://hackhathon-git-main-raj-singhs-projects-fd8d0c78.vercel.app"
];

// Matches any preview deployment like:
// https://hackhathon-git-<branch>-raj-singhs-projects-<hash>.vercel.app
const vercelPreviewRegex = /^https:\/\/hackhathon-[a-z0-9-]+\.vercel\.app$/;

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin || // allow non-browser requests (curl, mobile apps, etc.)
        allowedOrigins.includes(origin) ||
        vercelPreviewRegex.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);
// ❌ Removed the second duplicate app.use(cors(...)) call —
//    having two cors() middlewares can cause conflicting headers.

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/aadhaar", aadhaarRoutes);
app.use("/api/procurement", procurementRoutes);
app.use("/api/chats", chatRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Farmer AI Backend Running",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

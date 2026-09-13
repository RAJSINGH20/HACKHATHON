// ======================================================
// index.js
// ======================================================

import dotenv from "dotenv";

dotenv.config();

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



app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hackhathon-omega.vercel.app"
    ],
    credentials: true
  })
);
``

app.use(express.json());

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/bookings",
  bookingRoutes
);

app.use(
  "/api/aadhaar",
  aadhaarRoutes
);

app.use(
  "/api/procurement",
  procurementRoutes
);
app.use(
  "/api/chats",
  chatRoutes
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Farmer AI Backend Running",
  });
});

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});
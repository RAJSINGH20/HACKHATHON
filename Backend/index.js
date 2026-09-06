import dotenv from "dotenv";
dotenv.config();

import dns from "dns";
import express from "express";
import cors from "cors";

import connectDB from "./Database/db.js";
import authRoutes from "./Routes/user.routes.js";
import bookingRoutes from "./Routes/booking.routes.js";
import {connectRabbitMQ} from "./Database/rabbit.js";

const app = express();

// ==============================
// DNS CONFIGURATION
// ==============================

// Use Google DNS (8.8.8.8, 8.8.4.4) instead of system default
dns.setServers(["8.8.8.8", "8.8.4.4"]);

console.log("DNS servers set to:", dns.getServers());

// ==============================
// DATABASE
// ==============================

connectDB();
connectRabbitMQ().then(() => {
  console.log("RabbitMQ connection established successfully.");
});

// ==============================
// MIDDLEWARE
// ==============================

app.use(cors({
  origin: "http://localhost:5173", // or whatever your frontend's actual origin/port is
  credentials: true,
}));
app.use(express.json());

// ==============================
// ROUTES
// ==============================

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

// ==============================
// TEST ROUTE
// ==============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Farmer AI Backend Running",
  });
});

// ==============================
// SERVER
// ==============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
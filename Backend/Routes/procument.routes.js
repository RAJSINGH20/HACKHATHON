// ======================================================
// Routes/procument.routes.js
// ======================================================

import express from "express";

import {
  assignProcurementSlot,
  getProcurementBookings,
  getProcurementBooking,
  checkProcurement,
  acceptProcurement,
  rejectProcurement,
  getProcurementDashboard,
  getProcurementStats,
} from "../Controller/procument.controller.js";

const router = express.Router();

// ==========================================
// Assign newly created farmer booking
// POST /api/procurement/assign-booking/:bookingId
// ==========================================

router.post(
  "/assign-booking/:bookingId",
  assignProcurementSlot
);

// ==========================================
// Get all procurement bookings
// GET /api/procurement/bookings
// ==========================================

router.get(
  "/bookings",
  getProcurementBookings
);

// ==========================================
// Get one procurement booking
// GET /api/procurement/bookings/:bookingId
// ==========================================

router.get(
  "/bookings/:bookingId",
  getProcurementBooking
);

// ==========================================
// Check quantity + quality
// POST /api/procurement/bookings/:bookingId/check
// ==========================================

router.post(
  "/bookings/:bookingId/check",
  checkProcurement
);

// ==========================================
// Accept procurement
// PATCH /api/procurement/bookings/:bookingId/accept
// ==========================================

router.patch(
  "/bookings/:bookingId/accept",
  acceptProcurement
);

// ==========================================
// Reject procurement
// PATCH /api/procurement/bookings/:bookingId/reject
// ==========================================

router.patch(
  "/bookings/:bookingId/reject",
  rejectProcurement
);

// ==========================================
// Government dashboard
// GET /api/procurement/dashboard
// ==========================================

router.get(
  "/dashboard",
  getProcurementDashboard
);

// ==========================================
// Procurement centre stats (centre type counts + KMS)
// GET /api/procurement/stats
// ==========================================

router.get(
  "/stats",
  getProcurementStats
);

export default router;
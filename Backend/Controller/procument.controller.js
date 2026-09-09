// Controller/procument.controller.js

import Booking from "../models/Booking.js";
import Procurement from "../models/procument.model.js";

// ======================================================
// SLOT CONFIGURATION
// ======================================================

const SLOT_MINUTES = 30;

const SHIFTS = [
  {
    startHour: 10,
    startMinute: 0,
    endHour: 14,
    endMinute: 0,
  },
  {
    startHour: 16,
    startMinute: 0,
    endHour: 20,
    endMinute: 0,
  },
];

// ======================================================
// BUILD DAILY SLOTS
// ======================================================

const buildDaySlots = (date) => {
  const slots = [];

  for (const shift of SHIFTS) {
    const current = new Date(date);

    current.setHours(
      shift.startHour,
      shift.startMinute,
      0,
      0
    );

    const end = new Date(date);

    end.setHours(
      shift.endHour,
      shift.endMinute,
      0,
      0
    );

    while (current < end) {
      const start = new Date(current);

      const finish = new Date(
        current.getTime() +
          SLOT_MINUTES * 60 * 1000
      );

      slots.push({
        start,
        end: finish,
      });

      current.setTime(finish.getTime());
    }
  }

  return slots;
};

// ======================================================
// FIND NEXT AVAILABLE SLOT
// ======================================================

const findAvailableSlot = (
  procurementCenter,
  fromDate = new Date()
) => {
  for (let day = 0; day < 30; day++) {
    const date = new Date(fromDate);

    date.setDate(
      date.getDate() + day
    );

    const slots = buildDaySlots(date);

    for (const slot of slots) {
      const count =
        procurementCenter.bookings.filter(
          (booking) => {
            if (!booking.slotStart) {
              return false;
            }

            return (
              new Date(
                booking.slotStart
              ).getTime() ===
              slot.start.getTime()
            );
          }
        ).length;

      if (
        count <
        procurementCenter.capacityPerSlot
      ) {
        return slot;
      }
    }
  }

  return null;
};

// ======================================================
// 1. CREATE PROCUREMENT RECORD
// Called AFTER farmer creates booking
// POST /api/procurement/assign/:bookingId
// ======================================================

export const assignProcurementSlot =
  async (req, res) => {
    try {
      const { bookingId } = req.params;

      // ------------------------------------------
      // Find booking
      // ------------------------------------------

      const booking =
        await Booking.findById(
          bookingId
        );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      // ------------------------------------------
      // Check if already assigned
      // ------------------------------------------

      const existing =
        await Procurement.findOne({
          "bookings.bookingId":
            booking._id,
        });

      if (existing) {
        const existingBooking =
          existing.bookings.find(
            (item) =>
              item.bookingId.toString() ===
              booking._id.toString()
          );

        return res.status(200).json({
          success: true,
          message:
            "Booking already assigned",
          procurementCenter: {
            id: existing._id,
            officeName:
              existing.officeName,
            address:
              existing.address,
            contactPhone:
              existing.contactPhone,
          },
          slot: {
            start:
              existingBooking?.slotStart,
            end:
              existingBooking?.slotEnd,
          },
        });
      }

      // ------------------------------------------
      // Find active centres accepting this crop
      // ------------------------------------------

      const centres =
        await Procurement.find({
          isActive: true,
          productsAccepted:
            booking.product,
        }).sort({
          createdAt: 1,
        });

      if (!centres.length) {
        return res.status(404).json({
          success: false,
          message:
            "No procurement centre available for this product",
        });
      }

      // ------------------------------------------
      // Find centre + slot
      // ------------------------------------------

      let selectedCentre = null;
      let selectedSlot = null;

      for (const centre of centres) {
        const slot =
          findAvailableSlot(
            centre
          );

        if (slot) {
          selectedCentre = centre;
          selectedSlot = slot;
          break;
        }
      }

      if (
        !selectedCentre ||
        !selectedSlot
      ) {
        return res.status(409).json({
          success: false,
          message:
            "No procurement slot available",
        });
      }

      // ------------------------------------------
      // Add booking to Procurement document
      // ------------------------------------------

      selectedCentre.bookings.push({
        bookingId:
          booking._id,

        farmerId:
          booking.farmerId || null,

        farmerName:
          `${booking.firstName} ${booking.lastName}`,

        farmerPhone:
          booking.phone,

        product:
          booking.product,

        offeredQuantity:
          Number(booking.weight),

        verifiedQuantity:
          0,

        qualityGrade:
          null,

        ratePerKg:
          0,

        procurementAmount:
          0,

        decision:
          "Pending",

        rejectionReason:
          "",

        paymentStatus:
          "Pending",

        slotStart:
          selectedSlot.start,

        slotEnd:
          selectedSlot.end,
      });

      await selectedCentre.save();

      // ------------------------------------------
      // Update original booking
      // ------------------------------------------

      booking.assignedSlotStart =
        selectedSlot.start;

      booking.assignedSlotEnd =
        selectedSlot.end;

      booking.status =
        "Confirmed";

      await booking.save();

      return res.status(201).json({
        success: true,
        message:
          "Procurement centre and slot assigned successfully",

        booking: {
          id: booking._id,
          farmer:
            `${booking.firstName} ${booking.lastName}`,
          product:
            booking.product,
          weight:
            booking.weight,
          status:
            booking.status,
        },

        procurementCenter: {
          id:
            selectedCentre._id,
          officeName:
            selectedCentre.officeName,
          address:
            selectedCentre.address,
          contactPhone:
            selectedCentre.contactPhone,
        },

        slot: {
          start:
            selectedSlot.start,
          end:
            selectedSlot.end,
        },
      });
    } catch (error) {
      console.error(
        "ASSIGN PROCUREMENT SLOT ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to assign procurement slot",
        error:
          error.message,
      });
    }
  };

// ======================================================
// 2. GET ALL PROCUREMENT BOOKINGS
// GET /api/procurement/bookings
// ======================================================

export const getProcurementBookings =
  async (req, res) => {
    try {
      const centres =
        await Procurement.find({
          "bookings.0": {
            $exists: true,
          },
        }).lean();

      const bookings = [];

      for (const centre of centres) {
        for (const booking of centre.bookings) {
          bookings.push({
            procurementId:
              centre._id,

            procurementCenter:
              centre.officeName,

            address:
              centre.address,

            contactPhone:
              centre.contactPhone,

            bookingId:
              booking.bookingId,

            farmerId:
              booking.farmerId,

            farmerName:
              booking.farmerName,

            farmerPhone:
              booking.farmerPhone,

            product:
              booking.product,

            offeredQuantity:
              booking.offeredQuantity,

            verifiedQuantity:
              booking.verifiedQuantity,

            qualityGrade:
              booking.qualityGrade,

            ratePerKg:
              booking.ratePerKg,

            procurementAmount:
              booking.procurementAmount,

            decision:
              booking.decision,

            rejectionReason:
              booking.rejectionReason,

            paymentStatus:
              booking.paymentStatus,

            slotStart:
              booking.slotStart,

            slotEnd:
              booking.slotEnd,

            checkedAt:
              booking.checkedAt,

            createdAt:
              booking.createdAt,
          });
        }
      }

      bookings.sort(
        (a, b) =>
          new Date(a.slotStart) -
          new Date(b.slotStart)
      );

      return res.status(200).json({
        success: true,
        count:
          bookings.length,
        bookings,
      });
    } catch (error) {
      console.error(
        "GET PROCUREMENT BOOKINGS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch procurement bookings",
      });
    }
  };

// ======================================================
// GET SINGLE PROCUREMENT BOOKING
// GET /api/procurement/bookings/:bookingId
// ======================================================

export const getProcurementBooking =
  async (req, res) => {
    try {
      const { bookingId } = req.params;

      const centre =
        await Procurement.findOne({
          "bookings.bookingId": bookingId,
        }).lean();

      if (!centre) {
        return res.status(404).json({
          success: false,
          message:
            "Procurement booking not found",
        });
      }

      const booking =
        centre.bookings.find(
          (item) =>
            item.bookingId.toString() ===
            bookingId.toString()
        );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message:
            "Booking not found in procurement centre",
        });
      }

      return res.status(200).json({
        success: true,
        booking: {
          procurementId:
            centre._id,
          procurementCenter:
            centre.officeName,
          address:
            centre.address,
          contactPhone:
            centre.contactPhone,
          bookingId:
            booking.bookingId,
          farmerId:
            booking.farmerId,
          farmerName:
            booking.farmerName,
          farmerPhone:
            booking.farmerPhone,
          product:
            booking.product,
          offeredQuantity:
            booking.offeredQuantity,
          verifiedQuantity:
            booking.verifiedQuantity,
          qualityGrade:
            booking.qualityGrade,
          ratePerKg:
            booking.ratePerKg,
          procurementAmount:
            booking.procurementAmount,
          decision:
            booking.decision,
          rejectionReason:
            booking.rejectionReason,
          paymentStatus:
            booking.paymentStatus,
          slotStart:
            booking.slotStart,
          slotEnd:
            booking.slotEnd,
          checkedAt:
            booking.checkedAt,
          createdAt:
            booking.createdAt,
        },
      });
    } catch (error) {
      console.error(
        "GET PROCUREMENT BOOKING ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch procurement booking",
        error:
          error.message,
      });
    }
  };

// ======================================================
// 3. CHECK QUALITY + QUANTITY
// POST /api/procurement/bookings/:bookingId/check
// ======================================================

export const checkProcurement =
  async (req, res) => {
    try {
      const {
        verifiedQuantity,
        qualityGrade,
        ratePerKg,
      } = req.body;

      const quantity =
        Number(verifiedQuantity);

      const rate =
        Number(ratePerKg);

      // ------------------------------------------
      // Find Procurement document
      // ------------------------------------------

      const centre =
        await Procurement.findOne({
          "bookings.bookingId":
            req.params.bookingId,
        });

      if (!centre) {
        return res.status(404).json({
          success: false,
          message:
            "Procurement booking not found",
        });
      }

      // ------------------------------------------
      // Find embedded booking
      // ------------------------------------------

      const procurementBooking =
        centre.bookings.find(
          (item) =>
            item.bookingId.toString() ===
            req.params.bookingId
        );

      if (!procurementBooking) {
        return res.status(404).json({
          success: false,
          message:
            "Booking record not found",
        });
      }

      // ------------------------------------------
      // Validate quantity
      // ------------------------------------------

      if (
        !Number.isFinite(quantity) ||
        quantity < 0 ||
        quantity >
          procurementBooking.offeredQuantity
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Verified quantity must be between 0 and ${procurementBooking.offeredQuantity} kg`,
        });
      }

      // ------------------------------------------
      // Validate quality
      // ------------------------------------------

      if (
        !["A", "B", "C"].includes(
          qualityGrade
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Quality grade must be A, B or C",
        });
      }

      // ------------------------------------------
      // Validate rate
      // ------------------------------------------

      if (
        !Number.isFinite(rate) ||
        rate < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid rate per kg",
        });
      }

      // ------------------------------------------
      // Calculate amount
      // ------------------------------------------

      const amount =
        quantity * rate;

      // ------------------------------------------
      // Update Procurement DB
      // ------------------------------------------

      procurementBooking.verifiedQuantity =
        quantity;

      procurementBooking.qualityGrade =
        qualityGrade;

      procurementBooking.ratePerKg =
        rate;

      procurementBooking.procurementAmount =
        amount;

      procurementBooking.checkedAt =
        new Date();

      await centre.save();

      // ------------------------------------------
      // Update original Booking
      // ------------------------------------------

      await Booking.findByIdAndUpdate(
        req.params.bookingId,
        {
          verifiedQuantity:
            quantity,

          qualityGrade:
            qualityGrade,

          ratePerKg:
            rate,

          procurementAmount:
            amount,

          checkedAt:
            new Date(),
        }
      );

      return res.status(200).json({
        success: true,

        message:
          "Quality and quantity check saved",

        procurement: {
          bookingId:
            procurementBooking.bookingId,

          farmerName:
            procurementBooking.farmerName,

          product:
            procurementBooking.product,

          offeredQuantity:
            procurementBooking.offeredQuantity,

          verifiedQuantity:
            procurementBooking.verifiedQuantity,

          qualityGrade:
            procurementBooking.qualityGrade,

          ratePerKg:
            procurementBooking.ratePerKg,

          procurementAmount:
            procurementBooking.procurementAmount,
        },
      });
    } catch (error) {
      console.error(
        "CHECK PROCUREMENT ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to save procurement check",
        error:
          error.message,
      });
    }
  };

// ======================================================
// 4. ACCEPT PROCUREMENT
// PATCH /api/procurement/bookings/:bookingId/accept
// ======================================================

export const acceptProcurement =
  async (req, res) => {
    try {
      const {
        verifiedQuantity,
        qualityGrade,
        ratePerKg,
      } = req.body || {};

      const centre =
        await Procurement.findOne({
          "bookings.bookingId":
            req.params.bookingId,
        });

      if (!centre) {
        return res.status(404).json({
          success: false,
          message:
            "Procurement booking not found",
        });
      }

      const procurementBooking =
        centre.bookings.find(
          (item) =>
            item.bookingId.toString() ===
            req.params.bookingId
        );

      if (!procurementBooking) {
        return res.status(404).json({
          success: false,
          message:
            "Booking record not found",
        });
      }

      // Update from req.body if supplied
      if (verifiedQuantity !== undefined && Number(verifiedQuantity) > 0) {
        procurementBooking.verifiedQuantity = Number(verifiedQuantity);
      }

      if (qualityGrade) {
        procurementBooking.qualityGrade = qualityGrade;
      }

      if (ratePerKg !== undefined && Number(ratePerKg) > 0) {
        procurementBooking.ratePerKg = Number(ratePerKg);
      }

      // ------------------------------------------
      // Must check quantity first
      // ------------------------------------------

      if (
        !procurementBooking.verifiedQuantity ||
        procurementBooking.verifiedQuantity <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Verify quantity before accepting",
        });
      }

      // ------------------------------------------
      // Grade C cannot be accepted
      // ------------------------------------------

      if (
        !["A", "B"].includes(
          procurementBooking.qualityGrade
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Only Grade A or Grade B can be accepted",
        });
      }

      // ------------------------------------------
      // Rate required
      // ------------------------------------------

      if (
        !procurementBooking.ratePerKg ||
        procurementBooking.ratePerKg <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Rate per kg is required",
        });
      }

      // ------------------------------------------
      // Calculate final amount
      // ------------------------------------------

      procurementBooking.procurementAmount =
        procurementBooking.verifiedQuantity *
        procurementBooking.ratePerKg;

      procurementBooking.decision =
        "Accepted";

      procurementBooking.paymentStatus =
        "Paid";

      procurementBooking.checkedAt =
        new Date();

      procurementBooking.rejectionReason =
        "";

      await centre.save();

      // ------------------------------------------
      // Update Booking model
      // ------------------------------------------

      await Booking.findByIdAndUpdate(
        req.params.bookingId,
        {
          verifiedQuantity:
            procurementBooking.verifiedQuantity,

          qualityGrade:
            procurementBooking.qualityGrade,

          ratePerKg:
            procurementBooking.ratePerKg,

          procurementAmount:
            procurementBooking.procurementAmount,

          procurementDecision:
            "Accepted",

          paymentStatus:
            "Paid",

          rejectionReason:
            "",

          checkedAt:
            new Date(),
        },
        {
          new: true,
        }
      );

      return res.status(200).json({
        success: true,

        message:
          "Procurement accepted successfully",

        procurement: {
          bookingId:
            procurementBooking.bookingId,

          farmerName:
            procurementBooking.farmerName,

          product:
            procurementBooking.product,

          verifiedQuantity:
            procurementBooking.verifiedQuantity,

          qualityGrade:
            procurementBooking.qualityGrade,

          ratePerKg:
            procurementBooking.ratePerKg,

          procurementAmount:
            procurementBooking.procurementAmount,

          decision:
            procurementBooking.decision,

          paymentStatus:
            procurementBooking.paymentStatus,
        },
      });
    } catch (error) {
      console.error(
        "ACCEPT PROCUREMENT ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to accept procurement",
        error:
          error.message,
      });
    }
  };

// ======================================================
// 5. REJECT PROCUREMENT
// PATCH /api/procurement/bookings/:bookingId/reject
// ======================================================

export const rejectProcurement =
  async (req, res) => {
    try {
      const {
        qualityGrade,
        rejectionReason,
      } = req.body;

      const centre =
        await Procurement.findOne({
          "bookings.bookingId":
            req.params.bookingId,
        });

      if (!centre) {
        return res.status(404).json({
          success: false,
          message:
            "Procurement booking not found",
        });
      }

      const procurementBooking =
        centre.bookings.find(
          (item) =>
            item.bookingId.toString() ===
            req.params.bookingId
        );

      if (!procurementBooking) {
        return res.status(404).json({
          success: false,
          message:
            "Booking record not found",
        });
      }

      procurementBooking.decision =
        "Rejected";

      procurementBooking.verifiedQuantity =
        0;

      procurementBooking.procurementAmount =
        0;

      procurementBooking.qualityGrade =
        qualityGrade || "C";

      procurementBooking.ratePerKg =
        0;

      procurementBooking.rejectionReason =
        rejectionReason ||
        "Lot rejected after quality/quantity verification";

      procurementBooking.paymentStatus =
        "Pending";

      procurementBooking.checkedAt =
        new Date();

      await centre.save();

      // ------------------------------------------
      // Update Booking model
      // ------------------------------------------

      await Booking.findByIdAndUpdate(
        req.params.bookingId,
        {
          verifiedQuantity:
            0,

          qualityGrade:
            procurementBooking.qualityGrade,

          ratePerKg:
            0,

          procurementAmount:
            0,

          procurementDecision:
            "Rejected",

          paymentStatus:
            "Pending",

          rejectionReason:
            procurementBooking.rejectionReason,

          checkedAt:
            new Date(),
        }
      );

      return res.status(200).json({
        success: true,

        message:
          "Procurement rejected successfully",

        procurement: {
          bookingId:
            procurementBooking.bookingId,

          farmerName:
            procurementBooking.farmerName,

          product:
            procurementBooking.product,

          decision:
            procurementBooking.decision,

          qualityGrade:
            procurementBooking.qualityGrade,

          verifiedQuantity:
            procurementBooking.verifiedQuantity,

          procurementAmount:
            procurementBooking.procurementAmount,

          rejectionReason:
            procurementBooking.rejectionReason,
        },
      });
    } catch (error) {
      console.error(
        "REJECT PROCUREMENT ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to reject procurement",
        error:
          error.message,
      });
    }
  };

// ======================================================
// 6. GET PROCUREMENT DASHBOARD
// GET /api/procurement/dashboard
// ======================================================

export const getProcurementDashboard =
  async (req, res) => {
    try {
      const result =
        await Procurement.aggregate([
          {
            $unwind:
              "$bookings",
          },

          {
            $group: {
              _id: null,

              totalSlots: {
                $sum: 1,
              },

              pendingChecks: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$bookings.decision",
                        "Pending",
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },

              acceptedSlots: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$bookings.decision",
                        "Accepted",
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },

              rejectedSlots: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$bookings.decision",
                        "Rejected",
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },

              acceptedQuantity: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$bookings.decision",
                        "Accepted",
                      ],
                    },
                    "$bookings.verifiedQuantity",
                    0,
                  ],
                },
              },

              procurementAmount: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$bookings.decision",
                        "Accepted",
                      ],
                    },
                    "$bookings.procurementAmount",
                    0,
                  ],
                },
              },

              paidAmount: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        {
                          $eq: [
                            "$bookings.decision",
                            "Accepted",
                          ],
                        },
                        {
                          $eq: [
                            "$bookings.paymentStatus",
                            "Paid",
                          ],
                        },
                      ],
                    },
                    "$bookings.procurementAmount",
                    0,
                  ],
                },
              },
            },
          },
        ]);

      const dashboard =
        result[0] || {
          totalSlots: 0,
          pendingChecks: 0,
          acceptedSlots: 0,
          rejectedSlots: 0,
          acceptedQuantity: 0,
          procurementAmount: 0,
          paidAmount: 0,
        };

      return res.status(200).json({
        success: true,
        dashboard,
      });
    } catch (error) {
      console.error(
        "GET PROCUREMENT DASHBOARD ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch dashboard data",
      });
    }
  };
// ======================================================
// Controller/booking.controller.js
// Farmer booking + automatic procurement assignment
// ======================================================

import Booking from "../models/Booking.js";
import Procurement from "../models/procument.model.js";
import aadhaarRecords from "../AddharDummy/AddharDummy.json" with { type: "json" };

// ======================================================
// CREATE FARMER BOOKING
// POST /api/bookings/createBooking
// ======================================================

export const createBooking = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            phone,
            product,
            weight,
            farmerId,
        } = req.body;

        console.log(firstName, lastName, phone, product, weight, farmerId)

        if (
            !firstName ||
            !lastName ||
            !phone ||
            !product ||
            !weight
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "All fields are required",
            });
        }

        // ------------------------------------------
        // Create booking
        // ------------------------------------------

        const newBooking =
            await Booking.create({
                firstName,
                lastName,
                phone,
                product,
                weight: Number(weight),
                farmerId: farmerId || null,
                status: "Pending",
            });

        // ------------------------------------------
        // Find available procurement centres
        // ------------------------------------------

        const centres =
            await Procurement.find({
                isActive: true,
                productsAccepted: product,
            }).sort({
                createdAt: 1,
            });

        if (!centres.length) {
            return res.status(201).json({
                success: true,
                message:
                    "Booking created, but no procurement centre is currently available",
                booking: newBooking,
                assigned: false,
            });
        }

        // ------------------------------------------
        // Build slots
        // ------------------------------------------

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

        const buildSlots = (date) => {
            const slots = [];

            for (const shift of SHIFTS) {
                const current =
                    new Date(date);

                current.setHours(
                    shift.startHour,
                    shift.startMinute,
                    0,
                    0
                );

                const end =
                    new Date(date);

                end.setHours(
                    shift.endHour,
                    shift.endMinute,
                    0,
                    0
                );

                while (current < end) {
                    const start =
                        new Date(current);

                    const slotEnd =
                        new Date(
                            current.getTime() +
                            SLOT_MINUTES *
                            60 *
                            1000
                        );

                    slots.push({
                        start,
                        end: slotEnd,
                    });

                    current.setTime(
                        slotEnd.getTime()
                    );
                }
            }

            return slots;
        };

        // ------------------------------------------
        // Search next available slot
        // ------------------------------------------

        let selectedCentre = null;
        let selectedSlot = null;

        for (
            let dayOffset = 0;
            dayOffset < 30 &&
            !selectedCentre;
            dayOffset++
        ) {
            const date =
                new Date();

            date.setDate(
                date.getDate() +
                dayOffset
            );

            const slots =
                buildSlots(date);

            for (const centre of centres) {
                for (const slot of slots) {
                    const alreadyBooked =
                        centre.bookings.filter(
                            (item) => {
                                return (
                                    new Date(
                                        item.slotStart
                                    ).getTime() ===
                                    slot.start.getTime()
                                );
                            }
                        ).length;

                    if (
                        alreadyBooked < 1
                    ) {
                        selectedCentre =
                            centre;

                        selectedSlot =
                            slot;

                        break;
                    }
                }

                if (selectedCentre) {
                    break;
                }
            }
        }

        // ------------------------------------------
        // No slot available
        // ------------------------------------------

        if (
            !selectedCentre ||
            !selectedSlot
        ) {
            return res.status(201).json({
                success: true,
                message:
                    "Booking created, but no slot is currently available",
                booking: newBooking,
                assigned: false,
            });
        }

        // ------------------------------------------
        // Save assignment inside Procurement
        // ------------------------------------------

        selectedCentre.bookings.push({
            bookingId:
                newBooking._id,

            farmerId:
                farmerId || null,

            farmerName:
                `${firstName} ${lastName}`,

            farmerPhone:
                phone,

            product,

            offeredQuantity:
                Number(weight),

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
        // Save assigned slot in Booking
        // ------------------------------------------

        newBooking.assignedSlotStart =
            selectedSlot.start;

        newBooking.assignedSlotEnd =
            selectedSlot.end;

        newBooking.status =
            "Confirmed";

        await newBooking.save();

        return res.status(201).json({
            success: true,

            message:
                "Booking created and procurement centre assigned successfully",

            booking: {
                id:
                    newBooking._id,

                farmer:
                    `${firstName} ${lastName}`,

                phone,

                product,

                weight,

                status:
                    newBooking.status,
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
            "CREATE BOOKING ERROR:",
            error
        );

        if (
            error.name ===
            "ValidationError"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong",
            error:
                error.message,
        });
    }
};

// ======================================================
// GET ALL BOOKINGS
// ======================================================

export const getBookings = async (
    req,
    res
) => {
    try {
        const { farmerId } = req.query;
        const filter = farmerId ? { farmerId } : {};
        const bookings =
            await Booking.find(filter)
                .sort({
                    createdAt: -1,
                })
                .lean();

        // Get procurement centre assignments
        const centres = await Procurement.find({
            "bookings.0": { $exists: true },
        }).lean();

        const centreMap = {};
        for (const centre of centres) {
            for (const b of centre.bookings) {
                centreMap[b.bookingId.toString()] = {
                    procurementCenter: centre.officeName,
                    procurementAddress: centre.address,
                    procurementPhone: centre.contactPhone,
                    slotStart: b.slotStart,
                    slotEnd: b.slotEnd,
                    decision: b.decision,
                    paymentStatus: b.paymentStatus,
                    verifiedQuantity: b.verifiedQuantity,
                    qualityGrade: b.qualityGrade,
                    ratePerKg: b.ratePerKg,
                    procurementAmount: b.procurementAmount,
                    rejectionReason: b.rejectionReason,
                    checkedAt: b.checkedAt,
                };
            }
        }

        const enriched = bookings.map((booking) => {
            const c = centreMap[booking._id.toString()] || {};
            const aadhaarRecord = aadhaarRecords.find(
                (r) => r.mobile_number === booking.phone
            );

            const isAccepted =
                c.decision === "Accepted" ||
                booking.procurementDecision === "Accepted";

            const paymentStatus =
                isAccepted || c.paymentStatus === "Paid" || booking.paymentStatus === "Paid"
                    ? "Paid"
                    : (c.paymentStatus || booking.paymentStatus || "Pending");

            return {
                ...booking,
                procurementCenter:
                    c.procurementCenter ||
                    booking.procurementCenter ||
                    "Central Grain Procurement Centre — Karnal Mandi",
                procurementAddress:
                    c.procurementAddress ||
                    booking.procurementAddress ||
                    null,
                procurementPhone:
                    c.procurementPhone ||
                    booking.procurementPhone ||
                    null,
                slotStart:
                    c.slotStart ||
                    booking.assignedSlotStart ||
                    null,
                slotEnd:
                    c.slotEnd ||
                    booking.assignedSlotEnd ||
                    null,
                decision:
                    c.decision ||
                    booking.procurementDecision ||
                    "Pending",
                paymentStatus,
                verifiedQuantity:
                    c.verifiedQuantity ??
                    booking.verifiedQuantity ??
                    0,
                qualityGrade:
                    c.qualityGrade ||
                    booking.qualityGrade ||
                    null,
                ratePerKg:
                    c.ratePerKg ??
                    booking.ratePerKg ??
                    0,
                procurementAmount:
                    c.procurementAmount ??
                    booking.procurementAmount ??
                    0,
                rejectionReason:
                    c.rejectionReason ||
                    booking.rejectionReason ||
                    "",
                checkedAt:
                    c.checkedAt ||
                    booking.checkedAt ||
                    null,
                aadhaar:
                    aadhaarRecord?.aadhaar_number ||
                    booking.aadhaar ||
                    null,
            };
        });

        return res.status(200).json({
            success: true,
            bookings: enriched,
        });
    } catch (error) {
        console.error(
            "GET BOOKINGS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong",
        });
    }
};

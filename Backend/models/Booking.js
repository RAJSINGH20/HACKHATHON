// ======================================================
// models/Booking.js
// IMPORTANT: add these fields to your existing model
// ======================================================

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        farmerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Farmer",
            default: null,
        },

        firstName: {
            type: String,
            required: true,
            trim: true,
        },

        lastName: {
            type: String,
            required: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            match: [
                /^[0-9]{10}$/,
                "Phone number must be exactly 10 digits",
            ],
        },

        product: {
            type: String,
            required: true,
            enum: [
                "Wheat",
                "Paddy",
                "Mustard",
                "Maize",
                "Sugarcane",
                "Cotton",
            ],
        },

        weight: {
            type: Number,
            required: true,
            min: 1,
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Confirmed",
                "Cancelled",
            ],
            default: "Pending",
        },

        assignedSlotStart: {
            type: Date,
            default: null,
        },

        assignedSlotEnd: {
            type: Date,
            default: null,
        },

        verifiedQuantity: {
            type: Number,
            default: 0,
        },

        qualityGrade: {
            type: String,
            enum: ["A", "B", "C", null],
            default: null,
        },

        ratePerKg: {
            type: Number,
            default: 0,
        },

        procurementAmount: {
            type: Number,
            default: 0,
        },

        procurementDecision: {
            type: String,
            enum: [
                "Pending",
                "Accepted",
                "Rejected",
            ],
            default: "Pending",
        },

        rejectionReason: {
            type: String,
            default: "",
        },

        paymentStatus: {
            type: String,
            enum: [
                "Pending",
                "Processing",
                "Paid",
            ],
            default: "Pending",
        },

        checkedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model(
    "Booking",
    bookingSchema
);

export default Booking;
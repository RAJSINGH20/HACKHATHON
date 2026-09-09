// ======================================================
// models/Procurement.js
// ======================================================

import mongoose from "mongoose";

const procurementBookingSchema = new mongoose.Schema(
    {
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
            unique: true,
            sparse: true,
        },

        farmerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Farmer",
            default: null,
        },

        farmerName: {
            type: String,
            required: true,
            trim: true,
        },

        farmerPhone: {
            type: String,
            required: true,
            trim: true,
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

        offeredQuantity: {
            type: Number,
            required: true,
            min: 1,
        },

        verifiedQuantity: {
            type: Number,
            default: 0,
            min: 0,
        },

        qualityGrade: {
            type: String,
            enum: ["A", "B", "C", null],
            default: null,
        },

        ratePerKg: {
            type: Number,
            default: 0,
            min: 0,
        },

        procurementAmount: {
            type: Number,
            default: 0,
            min: 0,
        },

        decision: {
            type: String,
            enum: ["Pending", "Accepted", "Rejected"],
            default: "Pending",
        },

        rejectionReason: {
            type: String,
            default: "",
            trim: true,
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Processing", "Paid"],
            default: "Pending",
        },

        slotStart: {
            type: Date,
            required: true,
        },

        slotEnd: {
            type: Date,
            required: true,
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

const procurementSchema = new mongoose.Schema(
    {
        officeName: {
            type: String,
            required: [true, "Office name is required"],
            trim: true,
        },

        address: {
            type: String,
            required: [true, "Address is required"],
            trim: true,
        },

        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },

            coordinates: {
                type: [Number],
                required: [true, "Location coordinates are required"],
            },
        },

        contactPhone: {
            type: String,
            match: [/^[0-9]{10}$/, "Phone number must be exactly 10 digits"],
        },

        productsAccepted: {
            type: [String],
            enum: [
                "Wheat",
                "Paddy",
                "Mustard",
                "Maize",
                "Sugarcane",
                "Cotton",
            ],
            default: [
                "Wheat",
                "Paddy",
                "Mustard",
                "Maize",
                "Sugarcane",
                "Cotton",
            ],
        },

        capacityPerSlot: {
            type: Number,
            required: [true, "Capacity per slot is required"],
            min: 1,
            default: 5,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        // Every farmer assigned to this centre
        bookings: {
            type: [procurementBookingSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

procurementSchema.index({
    location: "2dsphere",
});

const Procurement = mongoose.model(
    "Procurement",
    procurementSchema
);

export default Procurement;
import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        mobile: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        aadhaar: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        village: {
            type: String,
            required: true,
            trim: true,
        },
        district: {
            type: String,
            required: true,
            trim: true,
        },
        state: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "farmer",
            enum: ["farmer"],
        },
    },
    { timestamps: true }
);

export const Farmer = mongoose.model("Farmer", farmerSchema);
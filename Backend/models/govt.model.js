import mongoose from "mongoose";

const govtSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        mobile: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        department: {
            type: String,
            required: true,
            trim: true,
        },
        governmentId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        office: {
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
            default: "government",
            enum: ["government"],
        },
    },
    { timestamps: true }
);

export const Govt = mongoose.model("Govt", govtSchema);
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            match: [/^[0-9]{10}$/, "Phone number must be exactly 10 digits"],
        },
        product: {
            type: String,
            required: [true, "Product is required"],
            enum: ["Wheat", "Paddy", "Mustard", "Maize", "Sugarcane", "Cotton"],
        },
        weight: {
            type: Number,
            required: [true, "Weight is required"],
            min: [1, "Weight must be greater than 0"],
        },
        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Cancelled"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
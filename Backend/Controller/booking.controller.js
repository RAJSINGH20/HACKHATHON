import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
    try {
        const { firstName, lastName, phone, product, weight } = req.body;
        console.log("CREATE BOOKING REQUEST BODY:", firstName, lastName, phone, product, weight);

        if (!firstName || !lastName || !phone || !product || !weight) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create and save the new booking
        const newBooking = new Booking({
            firstName,
            lastName,
            phone,
            product,
            weight,
        });

        await newBooking.save();

        return res.status(201).json({ message: "Booking created successfully", booking: newBooking });
    } catch (error) {
        console.error("CREATE BOOKING ERROR:", error);

        // Mongoose validation errors (bad phone format, invalid product enum, etc.)
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }

        return res.status(500).json({ message: "Something went wrong, please try again later" });
    }
};

export const getBookings = async (req, res) => {
    try{
        const bookings = await Booking.find();
        return res.status(200).json({ bookings });
    } catch (error) {
        console.error("GET BOOKINGS ERROR:", error);
        return res.status(500).json({ message: "Something went wrong, please try again later" });
    }
}
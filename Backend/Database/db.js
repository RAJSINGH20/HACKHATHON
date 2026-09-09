import mongoose from "mongoose";
import Procurement from "../models/procument.model.js";

const DEFAULT_CENTRES = [
  {
    officeName: "Central Grain Procurement Centre — Karnal Mandi",
    address: "APMC Market Yard, GT Road, Karnal, Haryana - 132001",
    location: { type: "Point", coordinates: [76.9897, 29.6857] },
    contactPhone: "9876543211",
    productsAccepted: ["Wheat", "Paddy", "Mustard", "Maize", "Sugarcane", "Cotton"],
    capacityPerSlot: 10,
    isActive: true,
  },
  {
    officeName: "Regional Agro Procurement Hub — Ludhiana Mandi",
    address: "New Grain Market, Gill Road, Ludhiana, Punjab - 141003",
    location: { type: "Point", coordinates: [75.8573, 30.901] },
    contactPhone: "9876543212",
    productsAccepted: ["Wheat", "Paddy", "Mustard", "Maize", "Sugarcane", "Cotton"],
    capacityPerSlot: 10,
    isActive: true,
  },
  {
    officeName: "State Crop Purchase Depot — Meerut Mandi",
    address: "Krishi Utpadan Mandi Samiti, Delhi Road, Meerut, UP - 250002",
    location: { type: "Point", coordinates: [77.7064, 28.9845] },
    contactPhone: "9876543213",
    productsAccepted: ["Wheat", "Paddy", "Mustard", "Maize", "Sugarcane", "Cotton"],
    capacityPerSlot: 10,
    isActive: true,
  },
  {
    officeName: "District Agricultural Marketing Board — Indore Mandi",
    address: "Laxmibai Nagar Mandi Yard, Indore, MP - 452006",
    location: { type: "Point", coordinates: [75.8648, 22.7196] },
    contactPhone: "9876543214",
    productsAccepted: ["Wheat", "Paddy", "Mustard", "Maize", "Sugarcane", "Cotton"],
    capacityPerSlot: 10,
    isActive: true,
  },
];

const seedDefaultCentres = async () => {
  try {
    const count = await Procurement.countDocuments();
    if (count === 0) {
      await Procurement.insertMany(DEFAULT_CENTRES);
      console.log("Seeded default procurement centres successfully.");
    }
  } catch (error) {
    console.error("Error auto-seeding procurement centres:", error.message);
  }
};

const connectDB = async () => {
  try {
    const URI = process.env.MONGODB_URI;
    console.log("URI loaded:", process.env.MONGODB_URI ? "yes" : "NO - undefined");
    const conn = await mongoose.connect(URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedDefaultCentres();
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;

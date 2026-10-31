// import mongoose from "mongoose";
// import Procurement from "../models/procument.model.js";

// const DEFAULT_CENTRES = [
//   {
//     officeName: "Central Grain Procurement Centre — Karnal Mandi",
//     address: "APMC Market Yard, GT Road, Karnal, Haryana - 132001",
//     location: { type: "Point", coordinates: [76.9897, 29.6857] },
//     contactPhone: "9876543211",
//     productsAccepted: ["Wheat", "Paddy", "Mustard", "Maize", "Sugarcane", "Cotton"],
//     capacityPerSlot: 10,
//     isActive: true,
//   },
//   {
//     officeName: "Regional Agro Procurement Hub — Ludhiana Mandi",
//     address: "New Grain Market, Gill Road, Ludhiana, Punjab - 141003",
//     location: { type: "Point", coordinates: [75.8573, 30.901] },
//     contactPhone: "9876543212",
//     productsAccepted: ["Wheat", "Paddy", "Mustard", "Maize", "Sugarcane", "Cotton"],
//     capacityPerSlot: 10,
//     isActive: true,
//   },
//   {
//     officeName: "State Crop Purchase Depot — Meerut Mandi",
//     address: "Krishi Utpadan Mandi Samiti, Delhi Road, Meerut, UP - 250002",
//     location: { type: "Point", coordinates: [77.7064, 28.9845] },
//     contactPhone: "9876543213",
//     productsAccepted: ["Wheat", "Paddy", "Mustard", "Maize", "Sugarcane", "Cotton"],
//     capacityPerSlot: 10,
//     isActive: true,
//   },
//   {
//     officeName: "District Agricultural Marketing Board — Indore Mandi",
//     address: "Laxmibai Nagar Mandi Yard, Indore, MP - 452006",
//     location: { type: "Point", coordinates: [75.8648, 22.7196] },
//     contactPhone: "9876543214",
//     productsAccepted: ["Wheat", "Paddy", "Mustard", "Maize", "Sugarcane", "Cotton"],
//     capacityPerSlot: 10,
//     isActive: true,
//   },
// ];

// const seedDefaultCentres = async () => {
//   try {
//     const count = await Procurement.countDocuments();
//     if (count === 0) {
//       await Procurement.insertMany(DEFAULT_CENTRES);
//       console.log("Seeded default procurement centres successfully.");
//     }
//   } catch (error) {
//     console.error("Error auto-seeding procurement centres:", error.message);
//   }
// };

// const sanitizeErrorMessage = (error) =>
//   String(error?.message || error).replace(
//     /mongodb(?:\+srv)?:\/\/[^\s"'<>]+/gi,
//     "[redacted MongoDB URI]"
//   );

// const connectDB = async () => {
//   const uri = process.env.MONGODB_URI;
//   if (!uri) {
//     throw new Error("MONGODB_URI is missing. Set it in Backend/.env.");
//   }

//   try {
//     await mongoose.connect(uri, {
//       dbName: process.env.MONGODB_DATABASE || "fasal_setu",
//       serverSelectionTimeoutMS: 10000,
//     });
//     console.log("MongoDB connected.");
//     await seedDefaultCentres();
//     return mongoose.connection;
//   } catch (error) {
//     throw new Error(`MongoDB connection failed: ${sanitizeErrorMessage(error)}`);
//   }
// };

// export default connectDB;


import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongodb =()=> {
  mongoose.connect(process.env.MONGODB_URI)
      .then(() => {
          console.log("MongoDB Connected Successfully!");
      })
      .catch((error) => {
          console.error("MongoDB Connection Failed:", error.message);
      });
}
export default mongodb;
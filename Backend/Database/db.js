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

let connectionPromise;

const ATLAS_SETUP_GUIDANCE =
  "Open MongoDB Atlas > Database > Connect > Drivers, copy the actual Node.js connection string, and update MONGODB_URI in Backend/.env.";

const isValidAtlasHostname = (hostname) => {
  const labels = hostname.split(".");
  return (
    hostname.endsWith(".mongodb.net") &&
    labels.length >= 4 &&
    labels.every(
      (label) =>
        label.length <= 63 &&
        /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label)
    )
  );
};

export const validateMongoUri = (value) => {
  const uri = value?.trim();
  if (!uri) {
    throw new Error(
      "MongoDB configuration error:\nMONGODB_URI is missing or empty. Set it in Backend/.env."
    );
  }

  const placeholderPattern =
    /YOUR_REAL_CLUSTER|YOUR_USERNAME|YOUR_PASSWORD|xxxxx|abc123|(?:^|[^a-z0-9])(?:USERNAME|PASSWORD|CLUSTER)(?=$|[^a-z0-9])/i;
  if (placeholderPattern.test(uri)) {
    throw new Error(
      `MongoDB configuration error:\nYour MONGODB_URI still contains a placeholder.\n${ATLAS_SETUP_GUIDANCE}`
    );
  }

  if (/PORT\s*=\s*\d+/i.test(uri)) {
    throw new Error(
      "MongoDB configuration error:\nMONGODB_URI contains a PORT assignment. Put PORT=3000 on its own line in Backend/.env."
    );
  }

  if (!/^mongodb(?:\+srv)?:\/\//i.test(uri)) {
    throw new Error(
      "MongoDB configuration error:\nMONGODB_URI must start with mongodb:// or mongodb+srv://."
    );
  }

  let parsedUri;
  try {
    parsedUri = new URL(uri);
  } catch {
    throw new Error(
      `MongoDB configuration error:\nMONGODB_URI is malformed. ${ATLAS_SETUP_GUIDANCE}`
    );
  }

  if (!parsedUri.hostname || parsedUri.pathname.length < 2) {
    throw new Error(
      `MongoDB configuration error:\nMONGODB_URI must include a hostname and database name. ${ATLAS_SETUP_GUIDANCE}`
    );
  }

  if (parsedUri.protocol === "mongodb+srv:") {
    if (!isValidAtlasHostname(parsedUri.hostname) || parsedUri.port) {
      throw new Error(
        `MongoDB configuration error:\nMONGODB_URI has a malformed Atlas hostname. ${ATLAS_SETUP_GUIDANCE}`
      );
    }

    if (!parsedUri.username || !parsedUri.password) {
      throw new Error(
        `MongoDB configuration error:\nThe Atlas URI must include the database user's username and password. ${ATLAS_SETUP_GUIDANCE}`
      );
    }
  }

  try {
    decodeURIComponent(parsedUri.username);
    decodeURIComponent(parsedUri.password);
  } catch {
    throw new Error(
      "MongoDB configuration error:\nMONGODB_URI credentials contain invalid percent-encoding. URL-encode special characters in the username and password."
    );
  }

  return uri;
};

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected.");
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected.");
});

const sanitizeErrorMessage = (error) =>
  String(error?.message || error).replace(
    /mongodb(?:\+srv)?:\/\/[^\s"'<>]+/gi,
    "[redacted MongoDB URI]"
  );

const connectDB = async () => {
  const uri = validateMongoUri(process.env.MONGODB_URI);

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      })
      .then(async () => {
        console.log(`MongoDB connected to ${mongoose.connection.host}.`);
        await seedDefaultCentres();
        return mongoose.connection;
      })
      .catch((error) => {
        connectionPromise = undefined;
        throw new Error(`MongoDB connection failed: ${sanitizeErrorMessage(error)}`);
      });
  }

  return connectionPromise;
};

export default connectDB;

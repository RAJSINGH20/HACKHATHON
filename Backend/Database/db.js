import mongoose from "mongoose";


const connectDB = async () => {
    try {
        const URI = process.env.MONGODB_URI
        console.log("URI loaded:", process.env.MONGODB_URI ? "yes" : "NO - undefined");
        const conn = await mongoose.connect(URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

export default connectDB;
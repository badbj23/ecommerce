import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
    try {
        // Reuse existing connection
        if (mongoose.connection.readyState === 1) {
            return;
        }

        const conn = await mongoose.connect(ENV.DB_URL);

        console.log(
            `Connected to MongoDB: ${conn.connection.host}`
        );

    } catch (error) {
        console.error("MongoDB Connection Error:", error);

        // Important: Stop the calling function if connection fails
        throw error;
    }
};
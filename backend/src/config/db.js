import mongoose from"mongoose";
import {ENV} from "./env.js"
import {MongoClient} from "mongodb";

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(ENV.DB_URL);
        console.log("Connected to MongoDB..{conn.connection.host}");
    } catch (error) {
        console.error("Connection Error");
    }
}
import express from 'express';
import path from 'path';
import { ENV } from './config/env.js';
import {connectDB} from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express"
import { functions, inngest } from "./config/inngest.js"


const app = express();

const __dirname = path.resolve()



console.log(
    "Clerk secret configured:",
    Boolean(process.env.CLERK_SECRET_KEY)
);

console.log(
    "Clerk secret prefix:",
    process.env.CLERK_SECRET_KEY
        ? process.env.CLERK_SECRET_KEY.substring(0, 7)
        : "MISSING"
);

app.use(
    clerkMiddleware({
        secret: process.env.CLERK_SECRET_KEY,
    }));

app.use(express.json())

app.use("/api/inngest", serve({client:inngest, functions:functions}));

app.get("/api/health", (req, res) => {
    res.status(200).json({message: "Success" })
});

if(ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../admin/dist")))
    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"));
    })
}

const startServer = async () => {
    await connectDB();
    app.listen(ENV.PORT, () => {
        console.log("Server started");
    })
};
startServer();
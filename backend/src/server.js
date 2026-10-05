import express from 'express';
import path from 'path';
import { ENV } from './config/env.js';
import {connectDB} from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express"
import { functions, inngest } from "./config/inngest.js"
import cors from "cors";
import { Webhook } from "svix";


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

app.use(cors());

app.use(
    clerkMiddleware({
        secret: process.env.CLERK_SECRET_KEY,
    }));

app.post(
    "/api/webhooks/clerk",
    express.raw({ type: "application/json" }),
    async (req, res) => {
        try {
            const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

            const event = wh.verify(req.body, {
                "svix-id": req.headers["svix-id"],
                "svix-timestamp": req.headers["svix-timestamp"],
                "svix-signature": req.headers["svix-signature"],
            });

            console.log("Clerk webhook received:", event.type);

            if (event.type === "user.created") {
                await inngest.send({
                    name: "clerk/user.created",
                    data: event.data,
                });
            }

            if (event.type === "user.deleted") {
                await inngest.send({
                    name: "clerk/user.deleted",
                    data: event.data,
                });
            }

            res.status(200).json({ success: true });
        } catch (error) {
            console.error("Clerk webhook error:", error);
            res.status(400).json({ error: "Invalid webhook" });
        }
    }
);



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
import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

export const inngest = new Inngest({
    id: "ecommerce",
});

const syncUser = inngest.createFunction(
    {
        id: "sync-user",
        triggers: {
            event: "webhook-integration/user.created",
        },
    },

    async ({ event }) => {
        console.log("=== SYNC USER START ===");

        await connectDB();

        console.log("MongoDB readyState:", mongoose.connection.readyState);
        console.log("MongoDB database:", mongoose.connection.name);

        const user = event.data;

        console.log("Clerk ID:", user?.id);
        console.log(
            "Email:",
            user?.email_addresses?.[0]?.email_address
        );

        const email = user.email_addresses?.[0]?.email_address;

        const existingUser = await User.findOne({
            clerkId: user.id,
        });

        console.log("Existing user:", existingUser);

        if (existingUser) {
            console.log("USER ALREADY EXISTS:", existingUser._id);
            return;
        }

        const newUser = {
            clerkId: user.id,
            email,
            name:
                `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                "User",
            image: user.image_url || "",
            addys: [],
            wishlist: [],
        };

        console.log("Creating MongoDB user:", newUser);

        const createdUser = await User.create(newUser);

        console.log("========== USER CREATED ==========");
        console.log("MongoDB ID:", createdUser._id);
        console.log("Clerk ID:", createdUser.clerkId);
        console.log("Email:", createdUser.email);
    });

/*
    async ({ event }) => {
        await connectDB();

        console.log(
            "Clerk user.created event:",
            JSON.stringify(event.data, null, 2)
        );

        const user  = event.data;

        if (!user?.id) {
            throw new Error("Missing Clerk user ID from event");
        }

        const email = user.email_addresses?.[0]?.email_address;

        if (!email) {
            throw new Error("Missing email from Clerk user");
        }

        const existingUser = await User.findOne({
            clerkId: user.id,
        });

        if (existingUser) {
            console.log("User already exists:", user.id);
            return;
        }

        const newUser = {
            clerkId: user.id,
            email,
            name:
                `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                "User",
            image: user.image_url || "",
            addys: [],
            wishlist: [],
        };

        await User.create(newUser);

        console.log("User created successfully:", user.id);
    }
);*/

const deleteUser = inngest.createFunction(
    {
        id: "delete-user",
        triggers: {
            event: "webhook-integration/user.deleted",
        },
    },

    async ({ event }) => {
        await connectDB();

        const { id } = event.data;

        await User.deleteOne({
            clerkId: id,
        });

        console.log("User deleted successfully:", id);
    }
);

export const functions = [syncUser, deleteUser];
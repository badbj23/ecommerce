import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/user.model.js";

export const inngest = new Inngest({
    id: "ecommerce",
});

const syncUser = inngest.createFunction(
    {
        id: "sync-user",
        triggers: {
            event: "user.created",
        },
    },

    async ({ event }) => {
        await connectDB();

        const {
            id,
            email_addresses,
            first_name,
            last_name,
            image_url,
        } = event.data;

        const clerkId = id;
        const email = email_addresses?.[0]?.email_address;

        if (!clerkId) {
            throw new Error("Missing Clerk ID from Inngest event");
        }

        if (!email) {
            throw new Error("Missing email from Inngest event");
        }

        const existingUser = await User.findOne({
            clerkId,
        });

        if (existingUser) {
            console.log("User already exists:", clerkId);
            return;
        }

        const newUser = {
            clerkId,
            email,
            name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
            image: image_url || "",
            addys: [],
            wishlist: [],
        };

        console.log("Creating user:", {
            clerkId,
            email,
            name: newUser.name,
        });

        await User.create(newUser);

        console.log("User created successfully:", clerkId);
    }
);

const deleteUser = inngest.createFunction(
    {
        id: "delete-user",
        triggers: {
            event: "clerk/user.deleted",
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
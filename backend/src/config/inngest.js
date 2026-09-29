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
        console.log("========== INNGEST EVENT ==========");
        console.log(JSON.stringify(event, null, 2));
        console.log("===================================");

        await connectDB();

        const data = event?.data;

        console.log("EVENT DATA:");
        console.log(JSON.stringify(data, null, 2));

        const clerkId = data?.id;

        console.log("CLERK ID:", clerkId);

        if (!clerkId) {
            throw new Error(
                `Missing Clerk ID. Received event data: ${JSON.stringify(data)}`
            );
        }

        const email = data?.email_addresses?.[0]?.email_address;

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
            name:
                `${data?.first_name || ""} ${data?.last_name || ""}`.trim() ||
                "User",
            image: data?.image_url || "",
            addys: [],
            wishlist: [],
        };

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
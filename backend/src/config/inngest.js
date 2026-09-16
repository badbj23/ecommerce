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

        const data = event?.data;
        const clerkId = data.id;
        const email = data.email_addresses?.[0]?.email_address;

        const existingUser = await User.findOne({ clerkId });

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

        await User.create(newUser);
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
    }
);

export const functions = [
    syncUser,
    deleteUser,
];
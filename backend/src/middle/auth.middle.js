import { requireAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
import { ENV } from "../config/env.js";

export const protectedRoute = [
    requireAuth(),
    async (req, res, next) => {
    try{
        const clerkId = req.auth().userId
        if(!clerkId) return res.status(403).send("Not authorized, invalid token");

        const user = await  User.findOne({clerkId})
        if(!user) return res.status(404).send("User not found");

        req.user = user;
        next()
    } catch (error){
        console.error("error in protectedRoute", error);
        req.status(500).json({message: "Internal Server error"});

    }
    }
];

export const adminOnly = async (req, res, next) => {
    if(!req.user) {
        return res.status(401).send("Not authorized, admin only");
    }

    if(req.user.email !== ENV.ADMIN_EMAIL){
        return res.status(403).send("Not authorized, admin only");
    }

    next();
}
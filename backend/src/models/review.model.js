import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    Rating: {
        type: Number,
        min: 1,
        required: true,
        max: 5,
    },
},{ timestamps: true });

export const Review = mongoose.model("Review", reviewSchema);
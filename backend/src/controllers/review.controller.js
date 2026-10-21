import { Review } from "../models/review.model.js";
import {Order} from "../models/order.model.js";
import {Product} from "../models/product.model.js";

export async function createReview(req, res) {
    try{
        const {productId, orderId, rating} = req.body;

        if(!rating || rating < 1 || rating > 5){
            return res.status(400).json({message: "Please enter a valid rating"});
        }

        const user = req.user;

        const order = await Order.findById(orderId);
        if(!order) {
            return res.status(400).json({message: "Please enter a valid order"});
        }

        if(!order.clerkId !== user.clerkId) {
            return res.status(400).json({message: "Not authorized for this"});
        }

        if(order.status !== "delivered") {
            return res.status(400).json({message: "Not delivered yet"});
        }

        const productInOrder = order.orderItems.find((item) => item.product.toString() === productId.toString());

        if(!productInOrder) {
            return res.status(400).json({message: "product no in this order"});
        }

        const existingReview = await Review.findOne({productId, usedId: user._id})
        if(existingReview) {
            return res.status(400).json({message: "Review already exists"});
        }

        const review = await Review.create({
            productId,
            userId: user._id,
            orderId,
            rating,
        });

        const product = await Product.findById(productId)
        const reviews = await Review.find({ productId })
        const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
        product.averageRating = totalRating / reviews.length;
        product.totalReviews = reviews.length;
        await product.save();

        res.status(200).json({message: "Successfully created review"});

    } catch (error) {
        console.error("error creating review", error);
        res.status(500).json({message: "Something went wrong"});

    }
}

export async function deleteReview(req, res) {
    try {
        const { reviewId } = req.params;
        const user = req.user;

        const review = await Review.findById(reviewId);
        if(!review) {
            return res.status(400).json({message: "Review not found"});
        }

        if(review.userId.toString() !== user._id.toString()) {
            return res.status(400).json({message: "Not authorized"});
        }

        const productId = review.productId;
        await Review.findByIdAndDelete(reviewId);

        const reviews = await Review.find({ productId });
        const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
        await Product.findByIdAndUpdate(productId, {
            averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
            totalReviews: reviews.length
        })

        res.status(200).json({message: "Successfully deleted review"});

    } catch (error) {
        console.error("error creating review", error);
        res.status(500).json({message: "Something went wrong"});
    }
}

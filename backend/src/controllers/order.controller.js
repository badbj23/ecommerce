import {Product} from "../models/product.model.js";
import {Order} from "../models/order.model.js";
import {Review} from "../models/review.model.js";

export async function getUserOrder(req, res) {
    try{
        const orders = await Order.find({clerkId: req.user.clerkId})
            .populate("orderItems.product")
            .sort({ createdAt: -1 })

        const ordersWithReview = await Promise.all(
            orders.map(async (order) => {
                const review = await Review.findOne({ orderId: order._id})
                return {
                    ...order.toObject(),
                    hasReview: !!review,
                };
            })
        )

        res.status(200).json({orders: ordersWithReview});

    } catch (error) {
        console.error("error creating order", error)
        return res.status(400).json({error: "not enough in stock"})
    }
}

export async function createOrders(req, res) {
    try{
        const { orderItems, shippingAddy, payment, totalPrice } = req.body

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({error: 'Order Not Found'})
        }

        for (const item of orderItems) {
            const product = await Product.findById(item.product._id);
            if (!product) {
                return res.status(400).json({error: 'Product not found'})
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({error: 'Stock not found'})
            }

        }

        const order = await Order.create({
            user: user._id,
            clerkId: user.clerkId,
            orderItems,
            shippingAddy,
            payment,
            totalPrice,

        });

        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity },
            });
        }
        res.status(200).json({message: 'Order successfully created', order})

    } catch (error) {
        console.error("error creating order", error)
        return res.status(400).json({error: "not enough in stock"})
    }
}

export async function updateOrders(req, res) {}

export async function deleteOrders(req, res) {}
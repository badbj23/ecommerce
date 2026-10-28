import {Product} from "../models/product.model.js";
import {Order} from "../models/order.model.js";
import {Cart} from "../models/cart.model.js";

export async function getCart(req, res) {
    try{
        let cart = await Cart.findOne({clerkId: req.user.clerkId}).
            populate("items.product");
        if (!cart) {
            const user = req.user;

            cart = await Cart.create({
                user: user._id,
                clerkId: user.clerkId,
                items: [],

            });
        }
        res.status(200).json({cart});

    } catch (error) {
        console.error("error getting cart", error);
        res.status(500).json({error: "Something went wrong"});

    }
}

export async function addToCart(req, res) {
    try {
        const {productId, quantity = 1} = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            res.status(400).json({error: "Product not found"});
        }

        if (product.stock < quantity) {
            res.status(400).json({error: "Stock does not exist"});
        }

        let cart = await Cart.findOne({clerkId: req.user.clerkId});
        if (!cart) {
            const user = req.user;
            cart = await Cart.create({
                user: user._id,
                clerkId: user.clerkId,
                items: [],
            })
        }

        const existingItem = cart.items.find((item) => item.product.toString() === productId);
        if (!existingItem) {
            const newQuantity = existingItem.quantity + 1;
            if (product.stock < newQuantity) {
                return res.status(400).json({error: "Stock does not exist"});
            }
            existingItem.quantity = newQuantity;
        } else {
            cart.items.push({ product: productId, quantity});
        }

        await cart.save()
        res.status(200).json({message: "added to cart", cart});
    } catch (error) {
        console.error("error adding to cart", error);
        res.status(500).json({error: "Something went wrong"});

    }

}

export async function updateCart(req, res) {
    try{
        const {productId} = req.params;
        const {quantity} = req.body;

        if (quantity < 1) {
            return res.status(400).json({error: "Quantity cannot be empty"});
        }

        const cart = await Cart.findOne({clerkId: req.user.clerkId}
    );
        if (!cart){
            return res.status(400).json({error: "Item not found"});
        }

        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(400).json({error: "Item not found"});
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({error: "Product not found"});
        }

        if (product.stock < quantity) {
            return res.status(400).json({error: "Stock does not exist"});
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

    } catch (error) {
        console.error("error updating to cart", error);
        res.status(500).json({error: "Something went wrong"});

    }
}

export async function deleteFromCart(req, res) {
    try{
        const {productId} = req.params;
        const cart = await Cart.findOne({clerkId: req.user.clerkId});
        if (!cart) {
            return res.status(400).json({error: "Cart not found"});
        }

        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        await cart.save();
        res.status(200).json({message: "deleted from cart", cart});

    } catch (error) {
        console.error("error deleting to cart", error);
        res.status(500).json({error: "Something went wrong"});
    }
}

export async function clearCart(req, res) {
    try{
        const cart = await Cart.findOne({clerkId: req.user.clerkId});
        if (!cart) {
            return res.status(400).json({error: "Cart not found"});
        }
        cart.items = [];
        await cart.save()

        res.status(200).json({message: "deleted from cart", cart});

    }  catch (error) {
        console.error("error clearing to cart", error);
        res.status(500).json({error: "Something went wrong"});
    }
}
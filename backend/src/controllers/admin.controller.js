import cloudinary from "../config/cloud.js";
import {Product} from "../models/product.model.js";
import {Order} from "../models/order.model.js";
import {User} from "../models/user.model.js";

export async function createProduct(req, res) {
    try{
        const {name, description, price, stock, category} = req.body;
        if (!name || !description || !price || !stock || !category) {
            return res.status(400).json({message:"all fields are required"})
        }

        if (!req.files || !req.files.length === 0) {
            return res.status(400).json({message:"at least one image is required"})
        }
        if (req.files.length > 3) {
            return res.status(400).json({message:"max is 3"})
        }

        const uploadPromises = req.files.map((file) => {
            return cloudinary.uploader.upload(file.path, {
                folder: "products",
            })
        })

        const upresult = await Promise.all(uploadPromises);

        const imageURL = upresult.map((result) => result.secure_url);

        const product = await Product.create({
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(),
            category,
            images: imageURL,
        })

        req.status(201).json(product);


    } catch (error) {
        console.error("error creating product", error);
        req.status(500).json({message:"something went wrong"})

    }

}

export async function getAllProducts(req, res) {
try{
const products = await Product.find().sort({createdAt: -1})
    req.status(200).json(products);
} catch (error) {
console.error("error getting products", error);
req.status(500).json({message:"something went wrong"})
}
}

export async function updateProduct(req, res) {
try{
const {id} = req.params;
const {name, description, price, stock, category} = req.body;

const product = await Product.findById(id);

if(!product) {
    return res.status(400).json({message:"no product with id is found"})
}

if(name) product.name = name;
if(description) product.description = description;
if(price !== undefined) product.price = parseFloat(price);
if(stock !== undefined) product.stock = parseFloat(stock);
if(category) product.category = category;

if(req.files && req.files.length > 0) {
    if (req.files.length > 3) {
    return res.status(400).json({message:"no file uploaded"})
}}

const uploadPromises = req.files.map((file) => {
    return cloudinary.uploader.upload(file.path, {
        folder: "products",
    })
})

    const upresult = await Promise.all(uploadPromises);

    product.images = upresult.map((result) => result.secure_url);


    await product.save();
    res.status(200).json(product);


} catch (error) {
    console.error("error getting products", error);
    req.status(500).json({message:"something went wrong"})
}
}

export async function getAllOrders(req, res) {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("orderItems.product")
            .sort({createdAt: -1})

            res.status(200).json(orders);

    } catch (error) {
        console.error("error getting orders", error);
        req.status(500).json({message:"something went wrong"})

    }
}


export async function updateOrder(req, res) {
    try{
        const { orderId } = req.params;
        const { status } = req.body;

        if (!["pending", "shipped", "delivered"].includes(status)) {
            return res.status(400).json({message:"something went wrong"})
        }

        const order = await Order.findById(orderId);
        if(!order) {
            return res.status(400).json({message:"no order with id is found"})
        }

        order.status = status;

        if (status === "shipped" && !order.shippedAt) {
            order.shippedAt = new Date();
        }

        if (status === "delivered" && !order.deliveredAt) {
            order.deliveredAt = new Date();
        }

        await order.save();
        res.status(200).json({message: "success", order});

    } catch (error) {
        console.error("error updating order", error);
        res.status(500).json({message:"something went wrong"})
    }
}

export async function getAllCustos(_, res) {
    try{
        const custos = await User.find().sort({createdAt: -1});
        req.status(200).json({custos});

    } catch (error) {
        console.error("error getting custos", error);
        res.status(500).json({message:"something went wrong"})
    }
}

export async function getStats(req, res) {
    try{
        const totalOrders = await Order.countDocuments();

        const revenueResult = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: {$sum: "$totalPrice"},
                },
            },
        ]);

        const totalRevenue = revenueResult[0]?.total || 0;
        const totalCustos = await User.countDocuments();

        const totalProducts = await Product.countDocuments();

        res.status(200).json({
            totalRevenue,
            totalCustos,
            totalProducts,
            totalOrders
        });

    } catch (error) {
        console.error("error getting stats", error);
        res.status(500).json({message:"something went wrong"})
    }
}
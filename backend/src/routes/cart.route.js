import { Router } from "express"
import {protectedRoute} from "../middle/auth.middle.js";
import {updateOrder} from "../controllers/admin.controller.js";
import {createOrders, getUserOrder} from "../controllers/order.controller.js";
import {addToCart, clearCart, deleteFromCart, getCart, updateCart} from "../controllers/cart.controller.js";

const router = Router()

router.use(protectedRoute)

router.post("/", addToCart)
router.get("/", getCart)
router.put("/:productId", updateCart)
router.delete("/:productId", deleteFromCart)
router.delete("/", clearCart)

export default router
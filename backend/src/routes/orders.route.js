import { Router } from "express"
import {protectedRoute} from "../middle/auth.middle.js";
import {updateOrder} from "../controllers/admin.controller.js";
import {createOrders, getUserOrder, deleteOrders} from "../controllers/order.controller.js";

const router = Router()

router.use(protectedRoute)

router.post("/", createOrders)
router.get("/", getUserOrder)
router.put("/:orderId", updateOrder)
router.delete("/:orderId", deleteOrders)

export default router
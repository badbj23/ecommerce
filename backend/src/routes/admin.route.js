import { Router } from "express";
import {
    createProduct, getAllCustos,
    getAllOrders,
    getAllProducts, getStats,
    updateOrder,
    updateProduct
} from "../controllers/admin.controller.js";
import {adminOnly, protectedRoute} from "../middle/auth.middle.js";
import {upload} from "../middle/multer.middle.js";

const router = Router();

router.use(protectedRoute, adminOnly);

router.post("/products", upload.array("images", 3),createProduct);
router.get("/products", getAllProducts);
router.put("/products/:id",upload.array("images", 3),updateProduct);

router.get("/orders", getAllOrders)
router.patch("/orders/:orderId/status", updateOrder)

router.get("/customers", getAllCustos)
router.get("/stats", getStats)



export default router;
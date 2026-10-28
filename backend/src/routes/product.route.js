import { Router } from "express";
import {getAllProducts} from "../controllers/admin.controller.js";
import {protectedRoute} from "../middle/auth.middle.js";
import {getProductById} from "../controllers/product.controller.js";

const router = Router();

router.use(protectedRoute)

router.get("/", getAllProducts)
router.get("/", getProductById)

export default router;
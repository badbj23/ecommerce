import { Router } from "express";
import {
    addAddys,
    addWishes,
    deleteAddys,
    deleteWishes,
    getAddys,
    getWishes,
    updateAddys
} from "../controllers/user.controller.js";
import {protectedRoute} from "../middle/auth.middle.js";

const router = Router();

router.use(protectedRoute);

router.post("/addresses", addAddys)
router.get("/addresses", getAddys)
router.put("/addresses/:addressesId", updateAddys)
router.get("/addresses/:addressesId", deleteAddys)


router.post("/addresses", addWishes)
router.post("/addresses", deleteWishes)
router.post("/addresses", getWishes)

export default router;
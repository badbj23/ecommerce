import { Router } from "express";
import {protectedRoute} from "../middle/auth.middle.js";

const router = Router();

router.use(protectedRoute)

router.post("/", createReview)
router.delete("/:reviewId", deleteReview)


export default router;
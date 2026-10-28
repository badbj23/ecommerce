import { Router } from "express";
import {protectedRoute} from "../middle/auth.middle.js";
import {createReview, deleteReview} from "../controllers/review.controller.js";

const router = Router();

router.use(protectedRoute)

router.post("/", createReview)
router.delete("/:reviewId", deleteReview)


export default router;
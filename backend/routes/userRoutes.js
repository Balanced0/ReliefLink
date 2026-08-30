import express from "express";
import { getUserProfile, rateUser } from "../controllers/userController.js";
import requireAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id", getUserProfile);
router.post("/:id/rate", requireAuth, rateUser);

export default router;


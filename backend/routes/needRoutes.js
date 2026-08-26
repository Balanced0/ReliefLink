import express from "express";
import requireAuth from "../middleware/authMiddleware.js";
import { createNeed } from "../controllers/needController.js";

const router = express.Router();

router.post("/", requireAuth, createNeed);

export default router;
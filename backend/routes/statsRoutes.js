import express from "express";
import { getImpactSummary } from "../controllers/statsController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/impact", requireAuth, getImpactSummary);

export default router;


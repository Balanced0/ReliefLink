import express from "express";
import { getImpactSummary } from "../controllers/statsController.js";

const router = express.Router();

router.get("/impact", getImpactSummary);

export default router;

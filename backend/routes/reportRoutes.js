import express from "express";
import requireAuth from "../middleware/authMiddleware.js";
import { createReport, getReportsForNeed } from "../controllers/reportController.js";

const router = express.Router();

router.post("/:need_id", requireAuth, createReport);

router.get("/:need_id", requireAuth, getReportsForNeed);

export default router;

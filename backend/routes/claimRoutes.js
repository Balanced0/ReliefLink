import express from "express";
import requireAuth from "../middleware/authMiddleware.js";
import { fulfillClaim } from "../controllers/claimController.js";

const router = express.Router();

router.patch("/:id/fulfill", requireAuth, fulfillClaim);

export default router;
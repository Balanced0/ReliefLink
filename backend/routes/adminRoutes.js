import express from "express";
import requireAuth from "../middleware/authMiddleware.js";
import requireAdmin from "../middleware/adminMiddleware.js";
import {
  getFlaggedNeeds,
  moderateNeed,
  getAllUsers,
  updateUserStatus,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/reports", requireAuth, requireAdmin, getFlaggedNeeds);
router.patch("/needs/:need_id/moderate", requireAuth, requireAdmin, moderateNeed);
router.get("/users", requireAuth, requireAdmin, getAllUsers);
router.patch("/users/:id/status", requireAuth, requireAdmin, updateUserStatus);

export default router;
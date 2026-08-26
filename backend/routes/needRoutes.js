import express from "express";
import requireAuth from "../middleware/authMiddleware.js";
import { createNeed } from "../controllers/needController.js";
import { addComment, getComments } from "../controllers/commentController.js";

const router = express.Router();

router.post("/", requireAuth, createNeed);
router.post("/:needId/comments", requireAuth, addComment);
router.get("/:needId/comments", requireAuth, getComments);

export default router;
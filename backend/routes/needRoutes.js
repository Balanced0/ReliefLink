import express from "express";
import requireAuth from "../middleware/authMiddleware.js";
import { createNeed, getNeeds, getNeedById } from "../controllers/needController.js";
import { claimNeed } from "../controllers/claimController.js";
import { addComment, getComments } from "../controllers/commentController.js";

const router = express.Router();

router.get("/", getNeeds);
router.get("/:id", getNeedById);
router.post("/", requireAuth, createNeed);
router.post("/:id/claim", requireAuth, claimNeed);
router.post("/:needId/comments", requireAuth, addComment);
router.get("/:needId/comments", requireAuth, getComments);

export default router;
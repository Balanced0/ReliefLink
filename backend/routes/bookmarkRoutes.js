import express from "express";
import requireAuth from "../middleware/authMiddleware.js";
import { addBookmark, removeBookmark, getBookmarks } from "../controllers/bookmarkController.js";

const router = express.Router();

router.post("/", requireAuth, addBookmark);
router.delete("/:area_id", requireAuth, removeBookmark);
router.get("/", requireAuth, getBookmarks);

export default router;

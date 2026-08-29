import express from "express";
import requireAuth from "../middleware/authMiddleware.js";
import { register, login, logout, getMe } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, getMe);

export default router;

import express from "express";
import { getAreas } from "../controllers/areaController.js";

const router = express.Router();

router.get("/", getAreas);

export default router;
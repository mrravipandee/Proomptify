import { Router } from "express";
import { analyzePrompt } from "../controllers/ai.controller";
import { protect } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/admin.middleware";

const router = Router();

// POST /api/ai/analyze - Analyze prompt text and generate metadata
// Protected: Only authenticated admins can use this
router.post("/analyze", protect, isAdmin, analyzePrompt);

export default router;

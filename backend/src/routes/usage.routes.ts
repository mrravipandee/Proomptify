import { Router } from "express";
import { trackPromptUsage } from "../controllers/usage.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/track", protect, trackPromptUsage);

export default router;

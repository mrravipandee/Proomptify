import { Router } from "express";
import { getPrompts, getSinglePrompt } from "../controllers/prompt.controller";

const router = Router();

router.get("/", getPrompts);
router.get("/:id", getSinglePrompt);

export default router;

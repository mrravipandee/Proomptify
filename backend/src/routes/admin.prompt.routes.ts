import { Router } from "express";
import {
  createPrompt,
  getAllPromptsAdmin,
  updatePrompt,
  deletePrompt,
  getAdminStats
} from "../controllers/admin.prompt.controller";

import { protect } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/admin.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.use(protect, isAdmin);

// Stats route must come before /:id routes
router.get("/stats", getAdminStats);

router.post("/", protect, isAdmin, upload.single("image"), createPrompt);
router.get("/", getAllPromptsAdmin);
router.put("/:id", updatePrompt);
router.delete("/:id", deletePrompt);

export default router;



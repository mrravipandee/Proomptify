import { Router } from "express";
import {
  createCategory,
  getCategories,
  deleteCategory,
} from "../controllers/category.controller";
import { protect } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/admin.middleware";

const router = Router();

/* PUBLIC */
router.get("/", getCategories);

/* ADMIN */
router.post("/", protect, isAdmin, createCategory);
router.delete("/:id", protect, isAdmin, deleteCategory);

export default router;

import express from "express";
import {
  handlePaymentWebhook,
  createPaymentSession,
  getCurrentPlan
} from "../controllers/payment.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * DODO WEBHOOK (CRITICAL)
 * must use raw body parser
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handlePaymentWebhook
);

/**
 * PROTECTED ROUTES
 */

router.post("/create-session", protect, createPaymentSession);
router.get("/plan/me", protect, getCurrentPlan);
router.get("/plan/:userId", protect, getCurrentPlan);

export default router;

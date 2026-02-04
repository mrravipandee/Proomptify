import express from "express";
import {
  createPaymentSession,
  handlePaymentWebhook,
  getCurrentPlan
} from "../controllers/payment.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

// Create payment session (protected route)
router.post("/create-session", protect, createPaymentSession);

// Webhook endpoint (public - no auth required)
router.post("/webhook", handlePaymentWebhook);

// Get current plan (protected route)
router.get("/plan/:userId", protect, getCurrentPlan);

export default router;

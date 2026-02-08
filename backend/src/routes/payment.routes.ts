import express from "express";
import {
  handlePaymentWebhook,
  createPaymentSession,
  getCurrentPlan
} from "../controllers/payment.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * PUBLIC WEBHOOK ROUTE
 * Must receive raw body (not JSON-parsed) from DodoPayments
 * Signature verification happens inside controller
 * Always returns 200 to prevent provider retries
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handlePaymentWebhook
);

/**
 * PROTECTED ROUTES - Require valid JWT
 */

// Create payment session (protected)
// POST /api/payments/create-session
// Body: { plan: "yearly" | "lifetime" }
// Response: { success, checkoutUrl, paymentUrl, plan, metadata }
router.post("/create-session", protect, createPaymentSession);

// Get current user's plan (protected)
// GET /api/payments/plan/me
// Response: { success, plan, planExpiresAt, isActive }
router.get("/plan/me", protect, getCurrentPlan);

// Get specific user's plan (protected, for backward compatibility)
// GET /api/payments/plan/:userId
// Response: { success, plan, planExpiresAt, isActive }
router.get("/plan/:userId", protect, getCurrentPlan);

export default router;

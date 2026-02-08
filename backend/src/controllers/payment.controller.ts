// Payment Controller for Dodopayments Integration
import { Request, Response } from "express";
import crypto from "crypto";
import { AuthRequest } from "../middlewares/auth.middleware";
import User from "../models/User";

// Type-safe plan type
type Plan = "free" | "yearly" | "lifetime";

// Product IDs from environment variables
const PRODUCTS = {
  YEARLY: process.env.DODOPAYMENTS_YEARLY_PRODUCT_ID || "pdt_0NXihbAhmbDcsX9nTvqZR",
  LIFETIME: process.env.DODOPAYMENTS_LIFETIME_PRODUCT_ID || "pdt_0NXihZ5BuHgFCMxg7P54Z"
} as const;

// Type-safe product_id to plan mapping
const PRODUCT_TO_PLAN: Record<string, Plan> = {
  [PRODUCTS.YEARLY]: "yearly",
  [PRODUCTS.LIFETIME]: "lifetime",
} as const;

// Webhook signature verification key
const WEBHOOK_SECRET = process.env.DODO_PAYMENTS_WEBHOOK_KEY;

if (!WEBHOOK_SECRET) {
  console.warn("⚠️ WARNING: DODO_PAYMENTS_WEBHOOK_KEY not set in environment variables");
  console.warn("Webhook signature verification will be skipped");
}

// Frontend URL from environment - REQUIRED (no localhost fallback)
const FRONTEND_URL = process.env.FRONTEND_URL;

if (!FRONTEND_URL) {
  console.error("❌ ERROR: FRONTEND_URL is not set in environment variables");
  console.error("Set FRONTEND_URL to your production frontend URL (e.g., https://proomptify.shop)");
}

/**
 * Create Payment Session (Protected Route)
 * 
 * Creates a DodoPayments checkout session
 * - Verifies user via JWT (protect middleware)
 * - Validates plan type (yearly or lifetime)
 * - Builds DodoPayments checkout URL with:
 *   * product_id (from env)
 *   * customer_email (from authenticated user)
 *   * success_url (FRONTEND_URL/payment/success)
 *   * cancel_url (FRONTEND_URL/pricing)
 *   * metadata (userId, plan)
 * 
 * Returns checkout_url for frontend redirect
 */
export const createPaymentSession = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { plan } = req.body;
    const userId = req.user?.id || req.user?.userId;
    const userEmail = req.user?.email;

    console.log("\n========================================");
    console.log("💳 CREATE PAYMENT SESSION");
    console.log("========================================");
    console.log("Authenticated user ID:", userId);
    console.log("Requested plan:", plan);

    // Validate plan
    if (!plan) {
      console.error("❌ Missing plan parameter");
      res.status(400).json({
        success: false,
        message: "Plan is required (yearly or lifetime)",
      });
      return;
    }

    // Validate plan type
    if (plan !== "yearly" && plan !== "lifetime") {
      console.error(`❌ Invalid plan type: ${plan}`);
      res.status(400).json({
        success: false,
        message: "Plan must be 'yearly' or 'lifetime'",
      });
      return;
    }

    // User is guaranteed by protect middleware, but double-check
    if (!userId || !userEmail) {
      console.error("❌ No authenticated user found");
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    // Find user in database
    const user = await User.findById(userId);
    if (!user) {
      console.error(`❌ User not found: ${userId}`);
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    console.log(`✅ User found: ${user.email}`);

    // Validate FRONTEND_URL is set
    if (!FRONTEND_URL) {
      console.error("❌ FRONTEND_URL not configured");
      res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
      return;
    }

    // Determine product ID based on plan
    const productId = plan === "yearly" ? PRODUCTS.YEARLY : PRODUCTS.LIFETIME;
    console.log(`📦 Product ID for ${plan}: ${productId}`);

    // Build URLs (MUST use FRONTEND_URL, not localhost)
    const successUrl = `${FRONTEND_URL}/payment/success?plan=${plan}`;
    const cancelUrl = `${FRONTEND_URL}/pricing`;

    console.log("📌 Success URL:", successUrl);
    console.log("📌 Cancel URL:", cancelUrl);

    // Build DodoPayments checkout URL with all required parameters
    // This creates a hosted checkout page on DodoPayments
    const checkoutUrl =
      `https://checkout.dodopayments.com/buy/${productId}?` +
      `quantity=1` +
      `&success_url=${encodeURIComponent(successUrl)}` +
      `&cancel_url=${encodeURIComponent(cancelUrl)}` +
      `&customer_email=${encodeURIComponent(user.email)}` +
      `&customer_name=${encodeURIComponent(user.name)}` +
      `&metadata[userId]=${encodeURIComponent(userId)}` +
      `&metadata[plan]=${encodeURIComponent(plan)}`;

    console.log("✅ Checkout URL generated successfully");
    console.log("========================================\n");

    // Return checkout URL to frontend
    res.json({
      success: true,
      message: "Payment session created successfully",
      checkoutUrl, // Frontend expects this field name
      paymentUrl: checkoutUrl, // Also include for backward compatibility
      plan,
      metadata: {
        userId,
        plan,
      },
    });
  } catch (error) {
    console.error("========================================");
    console.error("❌ Create payment session error:", error);
    console.error("========================================\n");
    res.status(500).json({
      success: false,
      message: "Failed to create payment session",
    });
  }
};

/**
 * Verify DodoPayments Webhook Signature
 * 
 * Signature verification prevents unauthorized webhook calls
 * Uses HMAC-SHA256 with DODO_PAYMENTS_WEBHOOK_KEY
 */
function verifyWebhookSignature(
  payload: Buffer | string,
  signature: string | undefined
): boolean {
  if (!WEBHOOK_SECRET || !signature) {
    console.warn("⚠️ Skipping signature verification (no key or signature)");
    return true; // Skip verification if no key configured
  }

  try {
    // Convert payload to string if Buffer
    const payloadString = typeof payload === "string" ? payload : payload.toString();
    
    // Create HMAC-SHA256 signature
    const expectedSignature = crypto
      .createHmac("sha256", WEBHOOK_SECRET)
      .update(payloadString)
      .digest("hex");

    // Compare signatures (constant-time comparison)
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (isValid) {
      console.log("✅ Webhook signature verified");
      return true;
    } else {
      console.error("❌ Webhook signature verification failed");
      return false;
    }
  } catch (error) {
    console.error("❌ Signature verification error:", error);
    return false;
  }
}

/**
 * Webhook Handler for DodoPayments
 * 
 * IMPORTANT: Returns 200 immediately to prevent gateway retries
 * 
 * Process:
 * 1. Verify webhook signature from headers
 * 2. Parse raw buffer to JSON
 * 3. Handle payment.succeeded events
 * 4. Extract customer_email and product_id
 * 5. Type-safely map product_id to plan
 * 6. Update user plan in MongoDB
 * 7. Return 200 OK immediately
 */
export const handlePaymentWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const signature = req.headers["dodo-signature"] as string;
    const rawBody = req.body;
    
    console.log("\n========================================");
    console.log("🔔 DodoPayments WEBHOOK RECEIVED");
    console.log("========================================");

    // Verify webhook signature
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.error("❌ Invalid webhook signature - rejecting request");
      res.sendStatus(200); // Still return 200, don't process
      return;
    }

    // Parse raw buffer to JSON
    let parsedEvent = rawBody;
    if (Buffer.isBuffer(rawBody)) {
      try {
        const payloadString = rawBody.toString();
        parsedEvent = JSON.parse(payloadString);
        console.log("✅ Parsed raw buffer to JSON");
      } catch (parseError) {
        console.error("❌ Failed to parse JSON from buffer");
        res.sendStatus(200); // Return 200 anyway
        return;
      }
    }

    const eventType = parsedEvent.event_type || parsedEvent.type;
    console.log("📌 Event Type:", eventType);

    // Handle payment.succeeded event
    if (eventType === "payment.succeeded" || eventType === "payment_succeeded") {
      console.log("\n💳 PROCESSING: Payment Succeeded");
      await handlePaymentSucceeded(parsedEvent);
    } else {
      console.log(`⚠️ Unhandled event type (only payment.succeeded is processed): ${eventType}`);
    }

    console.log("========================================\n");
    
    // RETURN 200 IMMEDIATELY (no JSON response)
    res.sendStatus(200);
  } catch (error) {
    console.error("========================================");
    console.error("❌ WEBHOOK PROCESSING ERROR:", error);
    console.error("========================================\n");
    
    // ALWAYS return 200 even on error to prevent retries
    res.sendStatus(200);
  }
};

/**
 * Handle Payment.Succeeded Event
 * 
 * Type-safe plan assignment:
 * - Maps product_id to Plan type using PRODUCT_TO_PLAN record
 * - Only assigns valid plan types: "yearly" | "lifetime"
 * - If product_id doesn't match, does nothing but doesn't crash
 * - Updates user in MongoDB and saves
 */
async function handlePaymentSucceeded(event: any): Promise<void> {
  try {
    console.log("\n--- PAYMENT SUCCEEDED EVENT HANDLER ---");
    
    // Extract customer_email and product_id from event
    const eventData = event.data || event;
    const customerEmail = eventData.customer_email || event.customer_email;
    const productId = eventData.product_id || event.product_id;

    console.log("\n📦 WEBHOOK EVENT DATA:");
    console.log(`   Customer Email: ${customerEmail}`);
    console.log(`   Product ID: ${productId}`);

    // Validate required fields
    if (!customerEmail) {
      console.error("❌ VALIDATION FAILED: Missing customer_email in webhook - cannot update plan");
      return;
    }

    if (!productId) {
      console.error(`❌ VALIDATION FAILED: Missing product_id in webhook for ${customerEmail} - cannot update plan`);
      return;
    }

    console.log("\n✅ Validation passed");

    // Find user by email
    console.log(`\n🔍 Looking up user in database...`);
    const user = await User.findOne({ email: customerEmail });
    if (!user) {
      console.error(`❌ DATABASE ERROR: User not found with email: ${customerEmail}`);
      return;
    }

    console.log(`✅ User found in database`);
    console.log(`   User ID: ${user._id}`);
    console.log(`   User Email: ${user.email}`);
    console.log(`   Current Plan: ${user.plan}`);

    // Type-safe plan mapping: only assign if product_id matches
    console.log(`\n🔗 Mapping product_id to plan type...`);
    console.log(`   Product ID Config:`);
    console.log(`   - YEARLY: ${PRODUCTS.YEARLY}`);
    console.log(`   - LIFETIME: ${PRODUCTS.LIFETIME}`);
    
    const newPlan: Plan | undefined = PRODUCT_TO_PLAN[productId];

    if (!newPlan) {
      // Unknown product_id - log but don't crash or assign random strings
      console.error(`❌ MAPPING ERROR: Unknown product_id: ${productId}`);
      console.error(`   Valid product IDs: YEARLY=${PRODUCTS.YEARLY}, LIFETIME=${PRODUCTS.LIFETIME}`);
      return;
    }

    console.log(`✅ Product mapped successfully: ${productId} → ${newPlan}`);

    // Calculate expiry date based on plan type
    let expiryDate: Date | null = null;
    if (newPlan === "yearly") {
      expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now
      console.log(`\n📅 Expiry Date Calculated:`);
      console.log(`   Plan Type: Yearly`);
      console.log(`   Expires At: ${expiryDate.toISOString()}`);
    } else if (newPlan === "lifetime") {
      expiryDate = null;
      console.log(`\n♾️ Lifetime Plan`);
      console.log(`   No expiration date`);
    }

    // Type-safe assignment: newPlan is guaranteed to be "yearly" | "lifetime"
    console.log(`\n💾 UPDATING USER IN DATABASE...`);
    user.plan = newPlan;
    user.planExpiresAt = expiryDate;

    // Save to MongoDB
    await user.save();
    console.log(`✅ User successfully saved`);
    
    console.log(`\n${'='.repeat(50)}`);
    console.log(`✅ SUCCESS: PAYMENT WEBHOOK PROCESSED`);
    console.log(`${'='.repeat(50)}`);
    console.log(`   User: ${user.email}`);
    console.log(`   Plan Updated: ${user.plan}`);
    console.log(`   Expires: ${expiryDate ? expiryDate.toLocaleDateString() : 'Never'}`);
    console.log(`${'='.repeat(50)}\n`);
  } catch (error) {
    console.error("========================================");
    console.error("❌ ERROR in handlePaymentSucceeded:", error);
    console.error("========================================\n");
    // Don't throw - webhook must not crash
  }
}

/**
 * Get Current User's Plan (Protected Route)
 * 
 * Returns authenticated user's subscription plan
 * - plan: "free" | "yearly" | "lifetime"
 * - planExpiresAt: expiration date (null for lifetime/free)
 * - isActive: whether plan is currently active
 */
export const getCurrentPlan = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Use userId from protected middleware (req.user is guaranteed to exist)
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID required",
      });
      return;
    }

    const user = await User.findById(userId).select("plan planExpiresAt");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Determine if plan is currently active
    const isActive =
      user.plan === "lifetime" ||
      (user.planExpiresAt && user.planExpiresAt > new Date());

    res.json({
      success: true,
      plan: user.plan,
      planExpiresAt: user.planExpiresAt,
      isActive,
    });
  } catch (error) {
    console.error("❌ Get current plan error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

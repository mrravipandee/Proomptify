"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentPlan = exports.handlePaymentWebhook = exports.createPaymentSession = void 0;
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const PRODUCTS = {
    YEARLY: process.env.DODOPAYMENTS_YEARLY_PRODUCT_ID || "pdt_0NXihbAhmbDcsX9nTvqZR",
    LIFETIME: process.env.DODOPAYMENTS_LIFETIME_PRODUCT_ID || "pdt_0NXihZ5BuHgFCMxg7P54Z"
};
const PRODUCT_TO_PLAN = {
    [PRODUCTS.YEARLY]: "yearly",
    [PRODUCTS.LIFETIME]: "lifetime",
};
const WEBHOOK_SECRET = process.env.DODO_PAYMENTS_WEBHOOK_KEY;
if (!WEBHOOK_SECRET) {
    console.warn("⚠️ WARNING: DODO_PAYMENTS_WEBHOOK_KEY not set in environment variables");
    console.warn("Webhook signature verification will be skipped");
}
const FRONTEND_URL = process.env.FRONTEND_URL;
if (!FRONTEND_URL) {
    console.error("❌ ERROR: FRONTEND_URL is not set in environment variables");
    console.error("Set FRONTEND_URL to your production frontend URL (e.g., https://proomptify.shop)");
}
const createPaymentSession = async (req, res) => {
    try {
        const { plan } = req.body;
        const userId = req.user?.id || req.user?.userId;
        const userEmail = req.user?.email;
        console.log("\n========================================");
        console.log("💳 CREATE PAYMENT SESSION");
        console.log("========================================");
        console.log("Authenticated user ID:", userId);
        console.log("Requested plan:", plan);
        if (!plan) {
            console.error("❌ Missing plan parameter");
            res.status(400).json({
                success: false,
                message: "Plan is required (yearly or lifetime)",
            });
            return;
        }
        if (plan !== "yearly" && plan !== "lifetime") {
            console.error(`❌ Invalid plan type: ${plan}`);
            res.status(400).json({
                success: false,
                message: "Plan must be 'yearly' or 'lifetime'",
            });
            return;
        }
        if (!userId || !userEmail) {
            console.error("❌ No authenticated user found");
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }
        const user = await User_1.default.findById(userId);
        if (!user) {
            console.error(`❌ User not found: ${userId}`);
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        console.log(`✅ User found: ${user.email}`);
        if (!FRONTEND_URL) {
            console.error("❌ FRONTEND_URL not configured");
            res.status(500).json({
                success: false,
                message: "Server configuration error",
            });
            return;
        }
        const productId = plan === "yearly" ? PRODUCTS.YEARLY : PRODUCTS.LIFETIME;
        console.log(`📦 Product ID for ${plan}: ${productId}`);
        const successUrl = `${FRONTEND_URL}/payment/success?plan=${plan}`;
        const cancelUrl = `${FRONTEND_URL}/pricing`;
        console.log("📌 Success URL:", successUrl);
        console.log("📌 Cancel URL:", cancelUrl);
        const checkoutUrl = `https://checkout.dodopayments.com/buy/${productId}?` +
            `quantity=1` +
            `&success_url=${encodeURIComponent(successUrl)}` +
            `&cancel_url=${encodeURIComponent(cancelUrl)}` +
            `&customer_email=${encodeURIComponent(user.email)}` +
            `&customer_name=${encodeURIComponent(user.name)}` +
            `&metadata[userId]=${encodeURIComponent(userId)}` +
            `&metadata[plan]=${encodeURIComponent(plan)}`;
        console.log("✅ Checkout URL generated successfully");
        console.log("========================================\n");
        res.json({
            success: true,
            message: "Payment session created successfully",
            checkoutUrl,
            paymentUrl: checkoutUrl,
            plan,
            metadata: {
                userId,
                plan,
            },
        });
    }
    catch (error) {
        console.error("========================================");
        console.error("❌ Create payment session error:", error);
        console.error("========================================\n");
        res.status(500).json({
            success: false,
            message: "Failed to create payment session",
        });
    }
};
exports.createPaymentSession = createPaymentSession;
function verifyWebhookSignature(payload, signature) {
    if (!WEBHOOK_SECRET || !signature) {
        console.warn("⚠️ Skipping signature verification (no key or signature)");
        return true;
    }
    try {
        const payloadString = typeof payload === "string" ? payload : payload.toString();
        const expectedSignature = crypto_1.default
            .createHmac("sha256", WEBHOOK_SECRET)
            .update(payloadString)
            .digest("hex");
        const isValid = crypto_1.default.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
        if (isValid) {
            console.log("✅ Webhook signature verified");
            return true;
        }
        else {
            console.error("❌ Webhook signature verification failed");
            return false;
        }
    }
    catch (error) {
        console.error("❌ Signature verification error:", error);
        return false;
    }
}
const handlePaymentWebhook = async (req, res) => {
    try {
        const signature = req.headers["dodo-signature"];
        const rawBody = req.body;
        console.log("\n========================================");
        console.log("🔔 DodoPayments WEBHOOK RECEIVED");
        console.log("========================================");
        if (!verifyWebhookSignature(rawBody, signature)) {
            console.error("❌ Invalid webhook signature - rejecting request");
            res.sendStatus(200);
            return;
        }
        let parsedEvent = rawBody;
        if (Buffer.isBuffer(rawBody)) {
            try {
                const payloadString = rawBody.toString();
                parsedEvent = JSON.parse(payloadString);
                console.log("✅ Parsed raw buffer to JSON");
            }
            catch (parseError) {
                console.error("❌ Failed to parse JSON from buffer");
                res.sendStatus(200);
                return;
            }
        }
        const eventType = parsedEvent.event_type || parsedEvent.type;
        console.log("📌 Event Type:", eventType);
        if (eventType === "payment.succeeded" || eventType === "payment_succeeded") {
            console.log("\n💳 PROCESSING: Payment Succeeded");
            await handlePaymentSucceeded(parsedEvent);
        }
        else {
            console.log(`⚠️ Unhandled event type (only payment.succeeded is processed): ${eventType}`);
        }
        console.log("========================================\n");
        res.sendStatus(200);
    }
    catch (error) {
        console.error("========================================");
        console.error("❌ WEBHOOK PROCESSING ERROR:", error);
        console.error("========================================\n");
        res.sendStatus(200);
    }
};
exports.handlePaymentWebhook = handlePaymentWebhook;
async function handlePaymentSucceeded(event) {
    try {
        console.log("\n--- PAYMENT SUCCEEDED EVENT HANDLER ---");
        const eventData = event.data || event;
        const customerEmail = eventData.customer_email || event.customer_email;
        const productId = eventData.product_id || event.product_id;
        console.log("\n📦 WEBHOOK EVENT DATA:");
        console.log(`   Customer Email: ${customerEmail}`);
        console.log(`   Product ID: ${productId}`);
        if (!customerEmail) {
            console.error("❌ VALIDATION FAILED: Missing customer_email in webhook - cannot update plan");
            return;
        }
        if (!productId) {
            console.error(`❌ VALIDATION FAILED: Missing product_id in webhook for ${customerEmail} - cannot update plan`);
            return;
        }
        console.log("\n✅ Validation passed");
        console.log(`\n🔍 Looking up user in database...`);
        const user = await User_1.default.findOne({ email: customerEmail });
        if (!user) {
            console.error(`❌ DATABASE ERROR: User not found with email: ${customerEmail}`);
            return;
        }
        console.log(`✅ User found in database`);
        console.log(`   User ID: ${user._id}`);
        console.log(`   User Email: ${user.email}`);
        console.log(`   Current Plan: ${user.plan}`);
        console.log(`\n🔗 Mapping product_id to plan type...`);
        console.log(`   Product ID Config:`);
        console.log(`   - YEARLY: ${PRODUCTS.YEARLY}`);
        console.log(`   - LIFETIME: ${PRODUCTS.LIFETIME}`);
        const newPlan = PRODUCT_TO_PLAN[productId];
        if (!newPlan) {
            console.error(`❌ MAPPING ERROR: Unknown product_id: ${productId}`);
            console.error(`   Valid product IDs: YEARLY=${PRODUCTS.YEARLY}, LIFETIME=${PRODUCTS.LIFETIME}`);
            return;
        }
        console.log(`✅ Product mapped successfully: ${productId} → ${newPlan}`);
        let expiryDate = null;
        if (newPlan === "yearly") {
            expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
            console.log(`\n📅 Expiry Date Calculated:`);
            console.log(`   Plan Type: Yearly`);
            console.log(`   Expires At: ${expiryDate.toISOString()}`);
        }
        else if (newPlan === "lifetime") {
            expiryDate = null;
            console.log(`\n♾️ Lifetime Plan`);
            console.log(`   No expiration date`);
        }
        console.log(`\n💾 UPDATING USER IN DATABASE...`);
        user.plan = newPlan;
        user.planExpiresAt = expiryDate;
        await user.save();
        console.log(`✅ User successfully saved`);
        console.log(`\n${'='.repeat(50)}`);
        console.log(`✅ SUCCESS: PAYMENT WEBHOOK PROCESSED`);
        console.log(`${'='.repeat(50)}`);
        console.log(`   User: ${user.email}`);
        console.log(`   Plan Updated: ${user.plan}`);
        console.log(`   Expires: ${expiryDate ? expiryDate.toLocaleDateString() : 'Never'}`);
        console.log(`${'='.repeat(50)}\n`);
    }
    catch (error) {
        console.error("========================================");
        console.error("❌ ERROR in handlePaymentSucceeded:", error);
        console.error("========================================\n");
    }
}
const getCurrentPlan = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.userId;
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID required",
            });
            return;
        }
        const user = await User_1.default.findById(userId).select("plan planExpiresAt");
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        const isActive = user.plan === "lifetime" ||
            (user.planExpiresAt && user.planExpiresAt > new Date());
        res.json({
            success: true,
            plan: user.plan,
            planExpiresAt: user.planExpiresAt,
            isActive,
        });
    }
    catch (error) {
        console.error("❌ Get current plan error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
exports.getCurrentPlan = getCurrentPlan;

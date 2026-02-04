"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentPlan = exports.handlePaymentWebhook = exports.createPaymentSession = void 0;
const User_1 = __importDefault(require("../models/User"));
// Product IDs from environment variables
const PRODUCTS = {
    YEARLY: process.env.DODOPAYMENTS_YEARLY_PRODUCT_ID || "pdt_0NXihbAhmbDcsX9nTvqZR",
    LIFETIME: process.env.DODOPAYMENTS_LIFETIME_PRODUCT_ID || "pdt_0NXihZ5BuHgFCMxg7P54Z"
};
// Get base URL from environment
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5500";
/**
 * Create Payment Session
 */
const createPaymentSession = async (req, res) => {
    try {
        const { plan, userId } = req.body; // plan: 'yearly' | 'lifetime'
        if (!plan || !userId) {
            return res.status(400).json({ message: "Plan and userId required" });
        }
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Determine product ID based on plan
        const productId = plan === 'yearly' ? PRODUCTS.YEARLY : PRODUCTS.LIFETIME;
        // Create direct checkout URL with Dodopayments
        const successUrl = `${FRONTEND_URL}/payment/success?plan=${plan}`;
        const cancelUrl = `${FRONTEND_URL}/payment/cancel`;
        const checkoutUrl = `https://checkout.dodopayments.com/buy/${productId}?` +
            `quantity=1` +
            `&success_url=${encodeURIComponent(successUrl)}` +
            `&cancel_url=${encodeURIComponent(cancelUrl)}` +
            `&customer_email=${encodeURIComponent(user.email)}` +
            `&customer_name=${encodeURIComponent(user.name)}` +
            `&metadata[userId]=${userId}` +
            `&metadata[plan]=${plan}`;
        return res.json({
            success: true,
            paymentUrl: checkoutUrl,
            productId,
            plan
        });
    }
    catch (error) {
        console.error("Create payment session error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.createPaymentSession = createPaymentSession;
/**
 * Webhook Handler for Dodopayments
 */
const handlePaymentWebhook = async (req, res) => {
    try {
        const event = req.body;
        console.log("📦 Webhook received:", JSON.stringify(event, null, 2));
        // Dodopayments webhook events
        const eventType = event.event_type || event.type;
        switch (eventType) {
            case "payment.successful":
            case "payment_successful":
                await handleSuccessfulPayment(event);
                break;
            case "payment.failed":
            case "payment_failed":
                await handleFailedPayment(event);
                break;
            case "subscription.created":
                await handleSubscriptionCreated(event);
                break;
            case "subscription.cancelled":
                await handleSubscriptionCancelled(event);
                break;
            default:
                console.log(`⚠️ Unhandled webhook event type: ${eventType}`);
        }
        return res.status(200).json({ received: true });
    }
    catch (error) {
        console.error("❌ Webhook error:", error);
        return res.status(500).json({ message: "Webhook processing error" });
    }
};
exports.handlePaymentWebhook = handlePaymentWebhook;
/**
 * Handle Successful Payment
 * Automatically update user's plan in database when payment is completed
 * NO EMAIL SENDING - Just database update
 */
async function handleSuccessfulPayment(event) {
    try {
        // Extract data from webhook event
        const eventData = event.data || event;
        const metadata = eventData.metadata || {};
        const userId = metadata.userId;
        const plan = metadata.plan;
        console.log("📦 Processing payment success:", { userId, plan });
        if (!userId) {
            console.error("❌ No userId in webhook metadata");
            return;
        }
        const user = await User_1.default.findById(userId);
        if (!user) {
            console.error(`❌ User not found: ${userId}`);
            return;
        }
        // Update user's plan in database
        if (plan === 'yearly') {
            user.plan = 'yearly';
            user.planExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now
            console.log(`📅 Yearly plan expires: ${user.planExpiresAt}`);
        }
        else if (plan === 'lifetime') {
            user.plan = 'lifetime';
            user.planExpiresAt = null; // No expiration for lifetime
            console.log(`♾️ Lifetime plan - no expiration`);
        }
        await user.save();
        console.log(`✅ Database updated successfully for user: ${user.email} - Plan: ${plan}`);
        // NOTE: No email sending as per user request
    }
    catch (error) {
        console.error("❌ Handle successful payment error:", error);
    }
}
/**
 * Handle Failed Payment
 */
async function handleFailedPayment(event) {
    try {
        const { metadata } = event.data || event;
        const userId = metadata?.userId;
        console.log(`⚠️ Payment failed for user: ${userId}`);
        // You can send email notification here
    }
    catch (error) {
        console.error("❌ Handle failed payment error:", error);
    }
}
/**
 * Handle Subscription Created
 */
async function handleSubscriptionCreated(event) {
    try {
        const { metadata } = event.data || event;
        const userId = metadata?.userId;
        console.log(`✅ Subscription created for user: ${userId}`);
    }
    catch (error) {
        console.error("❌ Handle subscription created error:", error);
    }
}
/**
 * Handle Subscription Cancelled
 */
async function handleSubscriptionCancelled(event) {
    try {
        const { metadata } = event.data || event;
        const userId = metadata?.userId;
        if (!userId)
            return;
        const user = await User_1.default.findById(userId);
        if (!user)
            return;
        // Revert to free plan
        user.plan = 'free';
        user.planExpiresAt = null;
        await user.save();
        console.log(`⚠️ Subscription cancelled for user: ${user.email}`);
    }
    catch (error) {
        console.error("❌ Handle subscription cancelled error:", error);
    }
}
/**
 * Get User's Current Plan
 */
const getCurrentPlan = async (req, res) => {
    try {
        const userId = req.body.userId || req.params.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID required" });
        }
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({
            plan: user.plan,
            planExpiresAt: user.planExpiresAt,
            isActive: user.plan === 'lifetime' || (user.planExpiresAt && user.planExpiresAt > new Date())
        });
    }
    catch (error) {
        console.error("Get current plan error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getCurrentPlan = getCurrentPlan;

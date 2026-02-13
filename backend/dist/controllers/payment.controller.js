"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentPlan = exports.handlePaymentWebhook = exports.createPaymentSession = void 0;
const User_1 = __importDefault(require("../models/User"));
const env_1 = require("../config/env");
const FRONTEND_URL = env_1.config.urls.frontend;
const YEARLY_PRODUCT = (process.env.DODOPAYMENTS_YEARLY_PRODUCT_ID || "").trim();
const LIFETIME_PRODUCT = (process.env.DODOPAYMENTS_LIFETIME_PRODUCT_ID || "").trim();
const createPaymentSession = async (req, res) => {
    try {
        const { plan } = req.body;
        const userId = req.user?.id;
        if (!plan || (plan !== "yearly" && plan !== "lifetime")) {
            res.status(400).json({ message: "Invalid plan" });
            return;
        }
        const user = await User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const productId = plan === "yearly" ? YEARLY_PRODUCT : LIFETIME_PRODUCT;
        const successUrl = `${FRONTEND_URL}/payment/success`;
        const cancelUrl = `${FRONTEND_URL}/payment/cancel`;
        const params = new URLSearchParams({
            productId: (productId || "").trim(),
            quantity: "1",
            customer_email: user.email,
            customer_name: user.name,
            metadata_user_id: user.id,
            metadata_plan: plan,
        });
        params.set("success_url", successUrl);
        params.set("cancel_url", cancelUrl);
        const checkoutUrl = `https://checkout.dodopayments.com/buy?${params.toString()}`;
        console.log("Checkout URL:", checkoutUrl);
        res.json({ paymentUrl: checkoutUrl });
    }
    catch (err) {
        console.error("Create session error:", err);
        res.status(500).json({ message: "Failed to create session" });
    }
};
exports.createPaymentSession = createPaymentSession;
const handlePaymentWebhook = async (req, res) => {
    try {
        console.log("\n========= DODO WEBHOOK RECEIVED =========");
        const rawBody = req.body;
        if (!Buffer.isBuffer(rawBody)) {
            console.log("Webhook not raw buffer");
            res.sendStatus(200);
            return;
        }
        const event = JSON.parse(rawBody.toString());
        console.log("EVENT TYPE:", event.type);
        if (event.type !== "payment.succeeded") {
            res.sendStatus(200);
            return;
        }
        const payment = event?.data?.payment;
        if (!payment) {
            console.log("No payment object in webhook");
            res.sendStatus(200);
            return;
        }
        const email = payment?.customer?.email;
        const productId = payment?.product_id;
        console.log("Customer:", email);
        console.log("Product:", productId);
        if (!email || !productId) {
            console.log("Missing email/product");
            res.sendStatus(200);
            return;
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            console.log("User not found in DB");
            res.sendStatus(200);
            return;
        }
        let newPlan = null;
        if (productId === YEARLY_PRODUCT)
            newPlan = "yearly";
        if (productId === LIFETIME_PRODUCT)
            newPlan = "lifetime";
        if (!newPlan) {
            console.log("Unknown product id");
            res.sendStatus(200);
            return;
        }
        let expiryDate = null;
        if (newPlan === "yearly") {
            expiryDate = new Date();
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        }
        user.plan = newPlan;
        user.planExpiresAt = expiryDate;
        await user.save();
        console.log("✅ PLAN UPDATED:", newPlan);
        console.log("================================\n");
        res.sendStatus(200);
    }
    catch (error) {
        console.error("Webhook error:", error);
        res.sendStatus(200);
    }
};
exports.handlePaymentWebhook = handlePaymentWebhook;
const getCurrentPlan = async (req, res) => {
    try {
        const userId = req.user?.id;
        const user = await User_1.default.findById(userId).select("plan planExpiresAt");
        if (!user) {
            res.status(404).json({ message: "User not found" });
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
        console.error("Get plan error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getCurrentPlan = getCurrentPlan;

import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import User from "../models/User";

/* ---------------- TYPES ---------------- */

type Plan = "free" | "yearly" | "lifetime";

/* ---------------- CONFIG ---------------- */

const FRONTEND_URL = process.env.FRONTEND_URL!;

const YEARLY_PRODUCT = process.env.DODOPAYMENTS_YEARLY_PRODUCT_ID!;
const LIFETIME_PRODUCT = process.env.DODOPAYMENTS_LIFETIME_PRODUCT_ID!;

/* =========================================================
   CREATE CHECKOUT SESSION
   ========================================================= */

export const createPaymentSession = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { plan } = req.body;
    const userId = req.user?.id;
    // const email = req.user?.email;

    if (!plan || (plan !== "yearly" && plan !== "lifetime")) {
      res.status(400).json({ message: "Invalid plan" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const productId = plan === "yearly" ? YEARLY_PRODUCT : LIFETIME_PRODUCT;

    const successUrl = `${FRONTEND_URL}/payment/success`;
    const cancelUrl = `${FRONTEND_URL}/pricing`;

    const checkoutUrl =
      `https://checkout.dodopayments.com/buy/${productId}?` +
      `quantity=1` +
      `&success_url=${encodeURIComponent(successUrl)}` +
      `&cancel_url=${encodeURIComponent(cancelUrl)}` +
      `&customer_email=${encodeURIComponent(user.email)}` +
      `&customer_name=${encodeURIComponent(user.name)}`;

    console.log("Checkout URL:", checkoutUrl);

    res.json({ checkoutUrl });
  } catch (err) {
    console.error("Create session error:", err);
    res.status(500).json({ message: "Failed to create session" });
  }
};

/* =========================================================
   WEBHOOK  ⭐ MOST IMPORTANT PART
   ========================================================= */

export const handlePaymentWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("\n========= DODO WEBHOOK RECEIVED =========");

    // RAW BUFFER → JSON
    const rawBody = req.body as Buffer;

    if (!Buffer.isBuffer(rawBody)) {
      console.log("Webhook not raw buffer");
      res.sendStatus(200);
      return;
    }

    const event = JSON.parse(rawBody.toString());

    console.log("EVENT TYPE:", event.type);

    // Only process successful payment
    if (event.type !== "payment.succeeded") {
      res.sendStatus(200);
      return;
    }

    /* ---------- REAL PAYMENT DATA ---------- */
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

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found in DB");
      res.sendStatus(200);
      return;
    }

    /* ---------- PLAN MAPPING ---------- */
    let newPlan: Plan | null = null;

    if (productId === YEARLY_PRODUCT) newPlan = "yearly";
    if (productId === LIFETIME_PRODUCT) newPlan = "lifetime";

    if (!newPlan) {
      console.log("Unknown product id");
      res.sendStatus(200);
      return;
    }

    /* ---------- EXPIRY ---------- */
    let expiryDate: Date | null = null;

    if (newPlan === "yearly") {
      expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }

    /* ---------- UPDATE USER ---------- */
    user.plan = newPlan;
    user.planExpiresAt = expiryDate;
    await user.save();

    console.log("✅ PLAN UPDATED:", newPlan);
    console.log("================================\n");

    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook error:", error);
    res.sendStatus(200);
  }
};

/* =========================================================
   GET CURRENT PLAN
   ========================================================= */

export const getCurrentPlan = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const user = await User.findById(userId).select("plan planExpiresAt");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

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
    console.error("Get plan error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

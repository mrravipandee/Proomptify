"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("../controllers/payment.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post("/webhook", express_1.default.raw({ type: "application/json" }), payment_controller_1.handlePaymentWebhook);
router.use(express_1.default.json());
router.post("/create-session", auth_middleware_1.protect, payment_controller_1.createPaymentSession);
router.get("/plan/me", auth_middleware_1.protect, payment_controller_1.getCurrentPlan);
router.get("/plan/:userId", auth_middleware_1.protect, payment_controller_1.getCurrentPlan);
exports.default = router;

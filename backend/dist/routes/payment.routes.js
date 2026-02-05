"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("../controllers/payment.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post("/create-session", auth_middleware_1.protect, payment_controller_1.createPaymentSession);
router.post("/webhook", payment_controller_1.handlePaymentWebhook);
router.get("/plan/:userId", auth_middleware_1.protect, payment_controller_1.getCurrentPlan);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSubscriptionChecker = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const User_1 = __importDefault(require("../models/User"));
const startSubscriptionChecker = () => {
    node_cron_1.default.schedule("0 2 * * *", async () => {
        console.log("Running subscription expiry check...");
        const now = new Date();
        const expiredUsers = await User_1.default.find({
            plan: "yearly",
            planExpiresAt: { $lt: now },
        });
        for (const user of expiredUsers) {
            user.plan = "free";
            user.planExpiresAt = null;
            await user.save();
            console.log(`User downgraded: ${user.email}`);
        }
    });
};
exports.startSubscriptionChecker = startSubscriptionChecker;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackPromptUsage = void 0;
const Usage_1 = __importDefault(require("../models/Usage"));
const User_1 = __importDefault(require("../models/User"));
const FREE_LIFETIME_LIMIT = 1000;
const trackPromptUsage = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.plan !== "free") {
            return res.json({
                allowed: true,
                remaining: "unlimited"
            });
        }
        let usage = await Usage_1.default.findOne({ userId });
        if (!usage) {
            usage = await Usage_1.default.create({
                userId,
                count: 1
            });
            return res.json({
                allowed: true,
                remaining: FREE_LIFETIME_LIMIT - 1
            });
        }
        if (usage.count >= FREE_LIFETIME_LIMIT) {
            return res.status(403).json({
                allowed: false,
                message: "FREE_LIMIT_REACHED"
            });
        }
        usage.count += 1;
        await usage.save();
        return res.json({
            allowed: true,
            remaining: FREE_LIFETIME_LIMIT - usage.count
        });
    }
    catch (error) {
        console.error("Usage tracking error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.trackPromptUsage = trackPromptUsage;

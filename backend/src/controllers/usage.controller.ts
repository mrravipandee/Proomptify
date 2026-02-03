import { Response } from "express";
import Usage from "../models/Usage";
import User from "../models/User";
import { AuthRequest } from "../middlewares/auth.middleware";

const FREE_LIFETIME_LIMIT = 10;

/**
 * Track prompt click
 */
export const trackPromptUsage = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔓 Paid users → unlimited
    if (user.plan !== "free") {
      return res.json({
        allowed: true,
        remaining: "unlimited"
      });
    }

    let usage = await Usage.findOne({ userId });

    // First ever usage
    if (!usage) {
      usage = await Usage.create({
        userId,
        count: 1
      });

      return res.json({
        allowed: true,
        remaining: FREE_LIFETIME_LIMIT - 1
      });
    }

    // Limit reached
    if (usage.count >= FREE_LIFETIME_LIMIT) {
      return res.status(403).json({
        allowed: false,
        message: "FREE_LIMIT_REACHED"
      });
    }

    // Increment usage
    usage.count += 1;
    await usage.save();

    return res.json({
      allowed: true,
      remaining: FREE_LIFETIME_LIMIT - usage.count
    });

  } catch (error) {
    console.error("Usage tracking error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

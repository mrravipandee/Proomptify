import cron from "node-cron";
import User from "../models/User";

/**
 * Runs every day at 2:00 AM
 */
export const startSubscriptionChecker = () => {
  cron.schedule("0 2 * * *", async () => {
    console.log("Running subscription expiry check...");

    const now = new Date();

    const expiredUsers = await User.find({
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

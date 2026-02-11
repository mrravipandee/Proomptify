import { Request, Response } from "express";
import Prompt from "../models/Prompt";
import User from "../models/User";
import { AuthRequest } from "../middlewares/auth.middleware";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

/**
 * Helper function to parse tags properly
 * Handles cases where tags come as:
 * - Stringified array: '["tag1", "tag2"]'
 * - Array with stringified item: ['["tag1", "tag2"]']
 * - Proper array: ["tag1", "tag2"]
 */
const parseTags = (tags: any): string[] => {
    try {
        // If tags is already a proper array of strings, return it
        if (Array.isArray(tags) && tags.every(tag => typeof tag === 'string' && !tag.startsWith('['))) {
            return tags;
        }

        // If tags is a string, parse it
        if (typeof tags === 'string') {
            return JSON.parse(tags);
        }

        // If tags is an array with a single stringified item
        if (Array.isArray(tags) && tags.length === 1 && typeof tags[0] === 'string' && tags[0].startsWith('[')) {
            return JSON.parse(tags[0]);
        }

        // If tags is an array but needs parsing
        if (Array.isArray(tags)) {
            return tags.map(tag => {
                if (typeof tag === 'string' && tag.startsWith('[')) {
                    try {
                        return JSON.parse(tag);
                    } catch {
                        return tag;
                    }
                }
                return tag;
            }).flat();
        }

        // Default: return empty array
        return [];
    } catch (error) {
        console.error('Error parsing tags:', error);
        return [];
    }
};

export const createPrompt = async (req: AuthRequest, res: Response) => {
    try {
        let imageUrl = "";

        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.buffer);
        }

        // Parse tags properly before saving
        const parsedTags = parseTags(req.body.tags);

        const prompt = await Prompt.create({
            ...req.body,
            tags: parsedTags,
            imgUrl: imageUrl,
            createdBy: req.user?.userId,
        });

        res.status(201).json(prompt);

    } catch (error: any) {
        console.error("CREATE PROMPT ERROR 👉", error);

        res.status(500).json({
            message: "Failed to create prompt",
            details: error?.message || error,
        });
    }
};

export const getAllPromptsAdmin = async (_req: Request, res: Response) => {
    const prompts = await Prompt.find().sort({ createdAt: -1 });
    res.json(prompts);
};


export const updatePrompt = async (req: Request, res: Response) => {
    const { id } = req.params;

    // Parse tags properly before updating
    if (req.body.tags) {
        req.body.tags = parseTags(req.body.tags);
    }

    const updated = await Prompt.findByIdAndUpdate(id, req.body, {
        new: true
    });

    res.json(updated);
};


export const deletePrompt = async (req: Request, res: Response) => {
    const { id } = req.params;

    await Prompt.findByIdAndDelete(id);

    res.json({ message: "Prompt deleted" });
};

/**
 * Get admin dashboard statistics
 * Returns aggregated data about prompts, users, and usage
 */
export const getAdminStats = async (_req: Request, res: Response) => {
    try {
        // Total prompts
        const totalPrompts = await Prompt.countDocuments();

        // Total users
        const totalUsers = await User.countDocuments({ role: "user" });

        // Total usage (sum of all usageCount)
        const usageStats = await Prompt.aggregate([
            {
                $group: {
                    _id: null,
                    totalUsage: { $sum: "$usageCount" }
                }
            }
        ]);
        const totalUsage = usageStats[0]?.totalUsage || 0;

        // Average usage per prompt
        const averageUsagePerPrompt = totalPrompts > 0 ? totalUsage / totalPrompts : 0;

        // Top 5 prompts by usage
        const topPrompts = await Prompt.find()
            .select("title usageCount")
            .sort({ usageCount: -1 })
            .limit(5)
            .lean()
            .then(prompts => prompts.map(p => ({
                id: (p._id as any).toString(),
                title: p.title,
                usage: p.usageCount
            })));

        // Active users (with plan !== 'free')
        const activeUsers = await User.countDocuments({ plan: { $ne: "free" } });

        // New users this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const newUsersThisMonth = await User.countDocuments({
            createdAt: { $gte: startOfMonth }
        });

        // Placeholder for revenue (would need Payment model integration)
        const revenueThisMonth = 0;

        res.json({
            totalPrompts,
            totalUsers,
            totalUsage,
            averageUsagePerPrompt: Math.round(averageUsagePerPrompt * 100) / 100,
            topPrompts,
            activeUsers,
            newUsersThisMonth,
            revenueThisMonth
        });

    } catch (error) {
        console.error("GET ADMIN STATS ERROR 👉", error);
        res.status(500).json({
            message: "Failed to fetch admin stats",
            details: error instanceof Error ? error.message : error
        });
    }
};

import { Request, Response } from "express";
import Prompt from "../models/Prompt";
import Category from "../models/Category";
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

const parseStringArray = (value: any): string[] => {
    if (Array.isArray(value)) {
        return value.filter((item) => typeof item === "string");
    }

    if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) return [];
        try {
            const parsed = JSON.parse(trimmed);
            return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [trimmed];
        } catch {
            return [trimmed];
        }
    }

    return [];
};

const parseNumber = (value: any, fallback = 0): number => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    }
    return fallback;
};

const slugifyCategory = (value: string): string =>
    value
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

const resolveCategorySlug = async (category: unknown): Promise<string | undefined> => {
    if (typeof category !== "string") return undefined;

    const trimmed = category.trim();
    if (!trimmed) return undefined;

    const existing = await Category.findOne({
        $or: [
            { _id: trimmed },
            { slug: trimmed.toLowerCase() },
            { name: { $regex: `^${trimmed}$`, $options: "i" } }
        ]
    }).select("slug");

    return existing?.slug ?? slugifyCategory(trimmed);
};

export const createPrompt = async (req: AuthRequest, res: Response) => {
    try {
        let imageUrl = "";

        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.buffer);
        }

        const { title, description, category, promptText } = req.body;

        if (!title || !description || !category || !promptText) {
            return res.status(400).json({
                message: "Missing required fields",
                required: ["title", "description", "category", "promptText"],
            });
        }

        if (!req.file && !req.body.imgUrl) {
            return res.status(400).json({
                message: "Cover image is required",
            });
        }

        // Parse tags/arrays and normalize category before saving
        const parsedTags = parseTags(req.body.tags);
        const parsedSteps = parseStringArray(req.body.steps);
        const parsedCompleteSteps = parseStringArray(req.body.completeSteps);
        const categorySlug = await resolveCategorySlug(req.body.category);
        const usageCount = parseNumber(req.body.usageCount, 0);

        const prompt = await Prompt.create({
            ...req.body,
            tags: parsedTags,
            steps: parsedSteps,
            completeSteps: parsedCompleteSteps,
            usageCount,
            ...(categorySlug ? { category: categorySlug } : {}),
            imgUrl: imageUrl || req.body.imgUrl,
            createdBy: req.user?.userId,
        });

        return res.status(201).json(prompt);

    } catch (error: any) {
        console.error("CREATE PROMPT ERROR 👉", error);

        return res.status(500).json({
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

    // Parse tags/arrays and normalize category before updating
    if (req.body.tags) {
        req.body.tags = parseTags(req.body.tags);
    }

    if (req.body.steps) {
        req.body.steps = parseStringArray(req.body.steps);
    }

    if (req.body.completeSteps) {
        req.body.completeSteps = parseStringArray(req.body.completeSteps);
    }

    if (req.body.category) {
        const categorySlug = await resolveCategorySlug(req.body.category);
        if (categorySlug) {
            req.body.category = categorySlug;
        }
    }

    if (req.body.usageCount !== undefined) {
        req.body.usageCount = parseNumber(req.body.usageCount, 0);
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

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminStats = exports.deletePrompt = exports.updatePrompt = exports.getAllPromptsAdmin = exports.createPrompt = void 0;
const Prompt_1 = __importDefault(require("../models/Prompt"));
const Category_1 = __importDefault(require("../models/Category"));
const User_1 = __importDefault(require("../models/User"));
const uploadToCloudinary_1 = require("../utils/uploadToCloudinary");
const parseTags = (tags) => {
    try {
        if (Array.isArray(tags) && tags.every(tag => typeof tag === 'string' && !tag.startsWith('['))) {
            return tags;
        }
        if (typeof tags === 'string') {
            return JSON.parse(tags);
        }
        if (Array.isArray(tags) && tags.length === 1 && typeof tags[0] === 'string' && tags[0].startsWith('[')) {
            return JSON.parse(tags[0]);
        }
        if (Array.isArray(tags)) {
            return tags.map(tag => {
                if (typeof tag === 'string' && tag.startsWith('[')) {
                    try {
                        return JSON.parse(tag);
                    }
                    catch {
                        return tag;
                    }
                }
                return tag;
            }).flat();
        }
        return [];
    }
    catch (error) {
        console.error('Error parsing tags:', error);
        return [];
    }
};
const parseStringArray = (value) => {
    if (Array.isArray(value)) {
        return value.filter((item) => typeof item === "string");
    }
    if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed)
            return [];
        try {
            const parsed = JSON.parse(trimmed);
            return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [trimmed];
        }
        catch {
            return [trimmed];
        }
    }
    return [];
};
const parseNumber = (value, fallback = 0) => {
    if (typeof value === "number" && Number.isFinite(value))
        return value;
    if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    }
    return fallback;
};
const slugifyCategory = (value) => value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
const resolveCategorySlug = async (category) => {
    if (typeof category !== "string")
        return undefined;
    const trimmed = category.trim();
    if (!trimmed)
        return undefined;
    const existing = await Category_1.default.findOne({
        $or: [
            { _id: trimmed },
            { slug: trimmed.toLowerCase() },
            { name: { $regex: `^${trimmed}$`, $options: "i" } }
        ]
    }).select("slug");
    return existing?.slug ?? slugifyCategory(trimmed);
};
const createPrompt = async (req, res) => {
    try {
        let imageUrl = "";
        if (req.file) {
            imageUrl = await (0, uploadToCloudinary_1.uploadToCloudinary)(req.file.buffer);
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
        const parsedTags = parseTags(req.body.tags);
        const parsedSteps = parseStringArray(req.body.steps);
        const parsedCompleteSteps = parseStringArray(req.body.completeSteps);
        const categorySlug = await resolveCategorySlug(req.body.category);
        const usageCount = parseNumber(req.body.usageCount, 0);
        const prompt = await Prompt_1.default.create({
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
    }
    catch (error) {
        console.error("CREATE PROMPT ERROR 👉", error);
        return res.status(500).json({
            message: "Failed to create prompt",
            details: error?.message || error,
        });
    }
};
exports.createPrompt = createPrompt;
const getAllPromptsAdmin = async (_req, res) => {
    const prompts = await Prompt_1.default.find().sort({ createdAt: -1 });
    res.json(prompts);
};
exports.getAllPromptsAdmin = getAllPromptsAdmin;
const updatePrompt = async (req, res) => {
    const { id } = req.params;
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
    const updated = await Prompt_1.default.findByIdAndUpdate(id, req.body, {
        new: true
    });
    res.json(updated);
};
exports.updatePrompt = updatePrompt;
const deletePrompt = async (req, res) => {
    const { id } = req.params;
    await Prompt_1.default.findByIdAndDelete(id);
    res.json({ message: "Prompt deleted" });
};
exports.deletePrompt = deletePrompt;
const getAdminStats = async (_req, res) => {
    try {
        const totalPrompts = await Prompt_1.default.countDocuments();
        const totalUsers = await User_1.default.countDocuments({ role: "user" });
        const usageStats = await Prompt_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    totalUsage: { $sum: "$usageCount" }
                }
            }
        ]);
        const totalUsage = usageStats[0]?.totalUsage || 0;
        const averageUsagePerPrompt = totalPrompts > 0 ? totalUsage / totalPrompts : 0;
        const topPrompts = await Prompt_1.default.find()
            .select("title usageCount")
            .sort({ usageCount: -1 })
            .limit(5)
            .lean()
            .then(prompts => prompts.map(p => ({
            id: p._id.toString(),
            title: p.title,
            usage: p.usageCount
        })));
        const activeUsers = await User_1.default.countDocuments({ plan: { $ne: "free" } });
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const newUsersThisMonth = await User_1.default.countDocuments({
            createdAt: { $gte: startOfMonth }
        });
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
    }
    catch (error) {
        console.error("GET ADMIN STATS ERROR 👉", error);
        res.status(500).json({
            message: "Failed to fetch admin stats",
            details: error instanceof Error ? error.message : error
        });
    }
};
exports.getAdminStats = getAdminStats;

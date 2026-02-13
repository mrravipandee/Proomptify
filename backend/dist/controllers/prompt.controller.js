"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrompts = exports.getSinglePrompt = void 0;
const Prompt_1 = __importDefault(require("../models/Prompt"));
const getSinglePrompt = async (req, res) => {
    try {
        const { id } = req.params;
        const prompt = await Prompt_1.default.findById(id);
        if (!prompt) {
            return res.status(404).json({ message: "Prompt not found" });
        }
        await Prompt_1.default.findByIdAndUpdate(id, {
            $inc: { usageCount: 1 },
        });
        return res.json(prompt);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getSinglePrompt = getSinglePrompt;
const getPrompts = async (req, res) => {
    try {
        const { category, search } = req.query;
        const filter = {};
        if (category)
            filter.category = category;
        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }
        const prompts = await Prompt_1.default.find(filter)
            .sort({ createdAt: -1 })
            .lean();
        return res.json(prompts);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch prompts" });
    }
};
exports.getPrompts = getPrompts;

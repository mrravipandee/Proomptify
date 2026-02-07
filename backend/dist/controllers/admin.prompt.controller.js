"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePrompt = exports.updatePrompt = exports.getAllPromptsAdmin = exports.createPrompt = void 0;
const Prompt_1 = __importDefault(require("../models/Prompt"));
const uploadToCloudinary_1 = require("../utils/uploadToCloudinary");
const createPrompt = async (req, res) => {
    try {
        let imageUrl = "";
        if (req.file) {
            imageUrl = await (0, uploadToCloudinary_1.uploadToCloudinary)(req.file.buffer);
        }
        const prompt = await Prompt_1.default.create({
            ...req.body,
            imgUrl: imageUrl,
            createdBy: req.user?.userId,
        });
        res.status(201).json(prompt);
    }
    catch (error) {
        console.error("CREATE PROMPT ERROR 👉", error);
        res.status(500).json({
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

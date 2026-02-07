import { Request, Response } from "express";
import Prompt from "../models/Prompt";
import { AuthRequest } from "../middlewares/auth.middleware";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

export const createPrompt = async (req: AuthRequest, res: Response) => {
    try {
        let imageUrl = "";

        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.buffer);
        }

        const prompt = await Prompt.create({
            ...req.body,
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

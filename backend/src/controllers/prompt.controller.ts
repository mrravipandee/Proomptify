import { Request, Response } from "express";
import Prompt from "../models/Prompt";

export const getSinglePrompt = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { id } = req.params;

        const prompt = await Prompt.findById(id);

        if (!prompt) {
            return res.status(404).json({ message: "Prompt not found" });
        }

        // increase usage count
        await Prompt.findByIdAndUpdate(id, {
            $inc: { usageCount: 1 },
        });

        return res.json(prompt);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getPrompts = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { category, search } = req.query;

        const filter: any = {};

        if (category) filter.category = category;

        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }

        const prompts = await Prompt.find(filter)
            .select("title description imgUrl category usageCount tags")
            .sort({ createdAt: -1 });

        return res.json(prompts);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch prompts" });
    }
};

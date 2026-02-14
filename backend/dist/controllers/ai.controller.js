"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzePrompt = void 0;
const generative_ai_1 = require("@google/generative-ai");
const Category_1 = __importDefault(require("../models/Category"));
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const analyzePrompt = async (req, res) => {
    try {
        const { promptText } = req.body;
        if (!promptText || promptText.trim() === "") {
            res.status(400).json({
                success: false,
                message: "Prompt text is required",
            });
            return;
        }
        const existingCategories = await Category_1.default.find().select("name slug").lean();
        const categoryList = existingCategories.map((c) => c.name).join(", ");
        const systemPrompt = `You are an AI classification and content generation engine for a marketplace called Promptify, a platform where users browse and use AI prompts (social media content, image generation, portraits, cinematic posters, avatars, editing prompts, etc).

Your task is to analyze a raw AI prompt written by a user and generate clean marketplace metadata.

You MUST carefully understand what the prompt produces as an OUTPUT (not what the prompt says literally).
You are NOT summarizing the prompt — you are describing the RESULT a user will get after running the prompt.

You must return STRICT JSON only.
No markdown, no explanation, no extra text.

---

OUTPUT FORMAT (MANDATORY)

Return ONLY:

{
  "title": "",
  "shortDescription": "",
  "category": "",
  "tags": [],
  "steps": [],
  "estimatedTime": ""
}

---

TITLE RULES

* 4 to 8 words
* Maximum 60 characters
* Human readable and natural
* No emojis
* No quotation marks
* Must describe the final generated result

---

SHORT DESCRIPTION RULES

* 8 to 18 words
* Simple marketing English
* Describe what the user will get
* Do not mention AI, prompt, generator, or tools

---

CATEGORY RULES
Existing categories: ${categoryList || "instagram, youtube, linkedin, aiart, chatgpt, resume, bio, tiktok, twitter"}

Choose the closest matching category from the existing ones.
If none fit well, use the most relevant existing category anyway.
Return only the category name in lowercase.

---

TAGS RULES

* 5 tags exactly
* lowercase only
* no hashtags
* no duplicates
* SEO friendly keywords
* describe style, subject, and use-case

---

STEPS RULES

* Generate 4-6 simple action steps
* Each step should be 2-5 words
* Steps describe HOW to use the prompt
* Example: ["Copy prompt", "Open ChatGPT", "Paste and customize", "Review output", "Use in your content"]

---

ESTIMATED TIME RULES

* Simple time estimate like "3 min", "5 min", "10 min"
* Based on complexity of the prompt usage

---

IMPORTANT BEHAVIOR
Focus on the FINAL RESULT the user receives.
Do NOT include tool names (midjourney, stable diffusion, chatgpt, sdxl, etc) in tags.
Do NOT explain anything.
Return valid JSON only.`;
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent([
            systemPrompt,
            `\n\nAnalyze this prompt:\n\n${promptText}`,
        ]);
        const responseText = result.response.text();
        let parsedResponse;
        try {
            let cleanedResponse = responseText.trim();
            if (cleanedResponse.startsWith("```json")) {
                cleanedResponse = cleanedResponse.slice(7);
            }
            if (cleanedResponse.startsWith("```")) {
                cleanedResponse = cleanedResponse.slice(3);
            }
            if (cleanedResponse.endsWith("```")) {
                cleanedResponse = cleanedResponse.slice(0, -3);
            }
            cleanedResponse = cleanedResponse.trim();
            parsedResponse = JSON.parse(cleanedResponse);
        }
        catch (parseError) {
            console.error("Failed to parse AI response:", responseText);
            res.status(500).json({
                success: false,
                message: "Failed to parse AI response",
                raw: responseText,
            });
            return;
        }
        const { title, shortDescription, category, tags, steps, estimatedTime, } = parsedResponse;
        if (!title || !shortDescription || !category || !tags) {
            res.status(500).json({
                success: false,
                message: "Incomplete AI response",
                data: parsedResponse,
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: {
                title: title.slice(0, 60),
                description: shortDescription,
                category: category.toLowerCase(),
                tags: Array.isArray(tags) ? tags.slice(0, 5) : [],
                steps: Array.isArray(steps) ? steps.slice(0, 6) : ["Copy prompt", "Open AI tool", "Paste and run", "Review output"],
                estimatedTime: estimatedTime || "5 min",
            },
        });
    }
    catch (error) {
        console.error("AI Analysis Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to analyze prompt",
        });
    }
};
exports.analyzePrompt = analyzePrompt;

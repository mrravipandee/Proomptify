"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prompt_controller_1 = require("../controllers/prompt.controller");
const router = (0, express_1.Router)();
router.get("/", prompt_controller_1.getPrompts);
router.get("/:id", prompt_controller_1.getSinglePrompt);
exports.default = router;

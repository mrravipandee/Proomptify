"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usage_controller_1 = require("../controllers/usage.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/track", auth_middleware_1.protect, usage_controller_1.trackPromptUsage);
exports.default = router;

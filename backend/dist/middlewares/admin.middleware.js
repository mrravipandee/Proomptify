"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const User_1 = __importDefault(require("../models/User"));
const isAdmin = async (req, res, next) => {
    const user = await User_1.default.findById(req.user?.userId);
    if (!user || user.email !== process.env.ADMIN_EMAIL) {
        res.status(403).json({ message: "Admin access only" });
        return;
    }
    next();
};
exports.isAdmin = isAdmin;

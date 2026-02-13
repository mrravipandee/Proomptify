"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const User_1 = __importDefault(require("../models/User"));
const isAdmin = async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.user?.userId);
        if (!user) {
            res.status(403).json({ message: "Admin access only - User not found" });
            return;
        }
        const isAdminRole = user.role === "admin" || user.role === "super_admin";
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
        const emailMatches = user.email === adminEmail;
        if (!isAdminRole) {
            res.status(403).json({ message: "Admin access only - Insufficient permissions" });
            return;
        }
        if (!emailMatches) {
            console.warn(`⚠️  Admin role attempt with mismatched email: ${user.email}`);
            res.status(403).json({ message: "Admin access only - Email mismatch" });
            return;
        }
        next();
    }
    catch (error) {
        console.error("Admin middleware error:", error);
        res.status(500).json({ message: "Server error during authorization check" });
    }
};
exports.isAdmin = isAdmin;

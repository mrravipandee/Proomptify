"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jwt_1 = require("../utils/jwt");
const User_1 = __importDefault(require("../models/User"));
const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.warn("⚠️  Missing Authorization header");
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }
        if (!authHeader.startsWith("Bearer ")) {
            console.warn("⚠️  Invalid Authorization header format");
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            console.warn("⚠️  No token provided in Authorization header");
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }
        let decoded;
        try {
            decoded = (0, jwt_1.verifyToken)(token);
        }
        catch (jwtError) {
            console.warn("⚠️  JWT verification failed:", jwtError instanceof Error ? jwtError.message : "Unknown error");
            res.status(401).json({
                success: false,
                message: "Invalid token",
            });
            return;
        }
        if (!decoded.userId || !decoded.email) {
            console.warn("⚠️  JWT payload missing required fields");
            res.status(401).json({
                success: false,
                message: "Invalid token",
            });
            return;
        }
        const user = await User_1.default.findById(decoded.userId).select("-password");
        if (!user) {
            console.warn(`⚠️  User not found in database: ${decoded.userId}`);
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }
        req.user = {
            id: user._id?.toString() || decoded.userId,
            userId: decoded.userId,
            email: decoded.email,
            plan: user.plan,
        };
        console.log(`✅ User authenticated: ${user.email} (${user._id})`);
        next();
    }
    catch (error) {
        console.error("❌ Authentication middleware error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.protect = protect;

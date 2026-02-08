import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import User from "../models/User";

/**
 * Extended Express Request with authenticated user
 * This interface ensures type safety when accessing req.user on protected routes
 */
export interface AuthRequest extends Request {
  user?: {
    id: string;
    userId: string;
    email: string;
    plan?: string;
  };
  file?: Express.Multer.File;
}

/**
 * JWT Authentication Middleware
 * 
 * Protects routes by verifying JWT token from Authorization header
 * Requirements:
 * - Authorization header with "Bearer <token>" format
 * - Valid JWT signed with JWT_SECRET
 * - User must exist in MongoDB
 * 
 * On success: attaches req.user with database user info
 * On failure: returns 401 with descriptive error message
 * 
 * Usage: router.get("/protected", protect, handler)
 */
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader) {
      console.warn("⚠️  Missing Authorization header");
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    // Check if header starts with "Bearer "
    if (!authHeader.startsWith("Bearer ")) {
      console.warn("⚠️  Invalid Authorization header format");
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    if (!token) {
      console.warn("⚠️  No token provided in Authorization header");
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    // Verify JWT token signature and expiry
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (jwtError) {
      console.warn("⚠️  JWT verification failed:", jwtError instanceof Error ? jwtError.message : "Unknown error");
      res.status(401).json({
        success: false,
        message: "Invalid token",
      });
      return;
    }

    // Validate decoded token has required fields
    if (!decoded.userId || !decoded.email) {
      console.warn("⚠️  JWT payload missing required fields");
      res.status(401).json({
        success: false,
        message: "Invalid token",
      });
      return;
    }

    // Fetch user from database to verify they still exist
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      console.warn(`⚠️  User not found in database: ${decoded.userId}`);
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    // Attach user to request object
    // Include all relevant user info for use in route handlers
    req.user = {
      id: user._id?.toString() || decoded.userId,
      userId: decoded.userId,
      email: decoded.email,
      plan: user.plan,
    };

    console.log(`✅ User authenticated: ${user.email} (${user._id})`);

    // Continue to next middleware/handler
    next();
  } catch (error) {
    console.error("❌ Authentication middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import User from "../models/User";

/**
 * Admin Authorization Middleware
 * 
 * Checks if user is admin or super_admin AND their email matches ADMIN_EMAIL env variable
 * This provides defense in depth - two layers of protection
 * 
 * Requirements:
 * - Must be after protect middleware
 * - User must have admin or super_admin role
 * - User's email must match NEXT_PUBLIC_ADMIN_EMAIL environment variable
 * 
 * Returns 403 if not authorized, otherwise calls next()
 */
export const isAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId);

    // Check if user exists
    if (!user) {
      res.status(403).json({ message: "Admin access only - User not found" });
      return;
    }

    // Check if user has admin role
    const isAdminRole = user.role === "admin" || user.role === "super_admin";
    
    // Check if email matches ADMIN_EMAIL (defense in depth)
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
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({ message: "Server error during authorization check" });
  }
};


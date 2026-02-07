import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import User from "../models/User";

export const isAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = await User.findById(req.user?.userId);

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    res.status(403).json({ message: "Admin access only" });
    return;
  }

  next();
};

import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  email: string;
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return secret;
};

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
};

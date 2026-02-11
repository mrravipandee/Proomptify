import mongoose, { Schema, Document } from "mongoose";

/**
 * User Interface (TypeScript safety)
 */
export interface IUser extends Document {
    name: string;
    email: string;
    phone: string;
    instaHandle?: string;
    passwordHash: string;
    gender?: "male" | "female" | "other";

    isVerified: boolean;
    otp?: string;
    otpExpiresAt?: Date;

    plan: "free" | "yearly" | "lifetime";
    planExpiresAt?: Date | null;

    role: "user" | "admin" | "super_admin";
    isBlocked?: boolean;

    createdAt: Date;
    updatedAt: Date;
}

/**
 * User Schema
 */
const UserSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true
        },

        phone: {
            type: String,
            required: true
        },

        instaHandle: {
            type: String,
            default: null
        },

        gender: {
            type: String,
            enum: ["male", "female", "other"],
            default: null
        },

        passwordHash: {
            type: String,
            required: true
        },

        isVerified: {
            type: Boolean,
            default: false
        },

        plan: {
            type: String,
            enum: ["free", "yearly", "lifetime"],
            default: "free",
            index: true
        },

        planExpiresAt: {
            type: Date,
            default: null
        },

        role: {
            type: String,
            enum: ["user", "admin", "super_admin"],
            default: "user",
            index: true
        },

        isBlocked: {
            type: Boolean,
            default: false
        },

        otp: {
            type: String,
            default: null
        },

        otpExpiresAt: {
            type: Date,
            default: null
        }

    },
    {
        timestamps: true
    }
);

/**
 * Model Export
 */
const User = mongoose.model<IUser>("User", UserSchema);
export default User;

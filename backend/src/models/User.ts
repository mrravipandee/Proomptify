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

    isVerified: boolean;
    otp?: string;
    otpExpiresAt?: Date;


    plan: "free" | "yearly" | "lifetime";
    planExpiresAt?: Date | null;

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

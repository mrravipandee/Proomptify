import { Request, Response } from "express";
import User from "../models/User";
import { hashPassword, comparePassword } from "../utils/hash";
import { signToken } from "../utils/jwt";
import { generateOTP } from "../utils/otp";
import { sendOTPEmail } from "../services/mail.service";

/**
 * REGISTER + SEND OTP
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, instaHandle, password, gender } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    
    // If user exists and is already verified
    if (existingUser && existingUser.isVerified) {
      return res.status(409).json({ 
        message: "Email already registered. Please login." 
      });
    }

    // If user exists but NOT verified - resend OTP
    if (existingUser && !existingUser.isVerified) {
      const otp = generateOTP();
      existingUser.otp = otp;
      existingUser.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
      
      // Update password if they're trying again with different password
      if (password) {
        existingUser.passwordHash = await hashPassword(password);
      }
      
      await existingUser.save();

      // Send OTP email
      try {
        await sendOTPEmail(email, otp);
        return res.status(200).json({
          message: "Account exists but not verified. New verification code sent to your email.",
          email
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        return res.status(200).json({
          message: "Account exists but email sending failed. Please try resend OTP.",
          email
        });
      }
    }

    // New user - create account
    const passwordHash = await hashPassword(password);
    const otp = generateOTP();

    await User.create({
      name,
      email,
      phone,
      instaHandle,
      gender,
      passwordHash,
      otp,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
      isVerified: false
    });

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
      return res.status(201).json({
        message: "Registration successful! Please check your email for verification code.",
        email
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return res.status(201).json({
        message: "Registration successful but email sending failed. Please try resend OTP.",
        email
      });
    }
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * RESEND OTP
 */
export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Generate new OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
      return res.json({
        message: "Verification code sent successfully. Please check your email."
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return res.status(500).json({
        message: "Failed to send verification email. Please try again."
      });
    }
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * VERIFY EMAIL OTP
 */
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    console.log("📨 Verify email request received:", { email: req.body.email, otpProvided: !!req.body.otp });
    
    const { email, otp } = req.body;

    if (!email || !otp) {
      console.log("❌ Missing fields - email:", !!email, "otp:", !!otp);
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ message: "User not found" });
    }

    console.log("✅ User found:", { email, isVerified: user.isVerified, hasOTP: !!user.otp });

    if (!user.otp) {
      console.log("❌ No OTP stored for user");
      return res.status(400).json({ message: "No OTP found. Please register or resend OTP." });
    }

    // Trim whitespace and compare as strings
    const userOTP = user.otp.toString().trim();
    const inputOTP = otp.toString().trim();

    console.log(`🔍 Verifying OTP for ${email}`);
    console.log(`Stored OTP: "${userOTP}" | Entered OTP: "${inputOTP}" | Match: ${userOTP === inputOTP}`);

    if (userOTP !== inputOTP) {
      console.log("❌ OTP mismatch");
      return res.status(400).json({ 
        message: "Invalid OTP. Please check the code and try again." 
      });
    }

    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
      console.log("❌ OTP expired at:", user.otpExpiresAt);
      return res.status(400).json({ 
        message: "OTP expired. Please request a new code." 
      });
    }

    user.isVerified = true;
    user.set({ otp: undefined, otpExpiresAt: undefined });
    await user.save();

    // Generate JWT token for auto-login
    const token = signToken({ userId: user._id.toString(), email: user.email });

    console.log("✅ Email verified successfully for:", email);

    return res.json({ 
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        instaHandle: user.instaHandle,
        gender: user.gender,
        plan: user.plan,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * LOGIN
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email" });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email
    });

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        instaHandle: user.instaHandle,
        gender: user.gender,
        plan: user.plan,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

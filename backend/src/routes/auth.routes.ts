import { Router } from "express";
import { register, login, verifyEmail, resendOTP } from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOTP);

export default router;

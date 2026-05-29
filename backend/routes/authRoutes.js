import express from "express";
import { getProfile, login, register, verifyOtp, resendOtp, forgotPassword, resetPassword } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/protectedRoutes.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/verify-otp", verifyOtp);
authRoutes.post("/resend-otp", resendOtp);
authRoutes.post("/login", login);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password/:token", resetPassword);
authRoutes.get("/profile", verifyToken, getProfile);

export default authRoutes;
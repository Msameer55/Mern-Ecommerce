import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const createToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.SECRET,
        { expiresIn: "1h" }
    );
};
export const forgotPassToken = (user,) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.SECRET,
        { expiresIn: "15m" }
    );
};
const generateOTP = () => String(Math.floor(100000 + Math.random() * 900000));
const sendOTPEmail = async (email, otp) => {
    await transporter.sendMail({
        from: `"ShopNow" <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: "Verify your ShopNow account",
        html: `
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
                <h2 style="color:#111827;margin-bottom:8px;">Verify your email</h2>
                <p style="color:#6b7280;">Use the OTP below to complete your registration. It expires in <strong>10 minutes</strong>.</p>
                <div style="font-size:36px;font-weight:700;letter-spacing:8px;color:#111827;text-align:center;padding:24px 0;">${otp}</div>
                <p style="color:#9ca3af;font-size:13px;">If you did not create an account, you can safely ignore this email.</p>
            </div>
        `,
    });
};
const sendForgotPassEmail = async (email, token) => {
    await transporter.sendMail({
        from: `"ShopNow" <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: "Reset Password",
        html: `
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
                <h2 style="color:#111827;margin-bottom:8px;">Reset your password</h2>
                <p style="color:#6b7280;">Use the reset link below. It expires in <strong>15 minutes</strong>.</p>
                <a href="http://localhost:5173/reset-password/${token}" style="color:#111827;text-align:center;padding:24px 0;">Reset Password</a>
                <p style="color:#9ca3af;font-size:13px;">If you did not create an account, you can safely ignore this email.</p>
            </div>
        `,
    });
};

// ─── Register ────────────────────────────────────────────────────────────────

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser && existingUser.isAccountVerified) {
            return res.status(400).json({ success: false, message: "An account with this email already exists" });
        }

        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        const hashedPass = await bcryptjs.hash(password, 10);

        if (existingUser && !existingUser.isAccountVerified) {
            // Refresh OTP for existing unverified account
            existingUser.name = name;
            existingUser.password = hashedPass;
            existingUser.otp = otp;
            existingUser.otpExpiresAt = otpExpiresAt;
            await existingUser.save();
        } else {
            await User.create({ name, email, password: hashedPass, otp, otpExpiresAt });
        }

        // Try sending email — non-blocking so bad SMTP never breaks registration
        try {
            await sendOTPEmail(email, otp);
            console.log(`✅ OTP email sent to ${email}`);
        } catch (emailError) {
            // Email failed — log OTP to console so devs can still test
            console.error("⚠️  Email sending failed:", emailError.message);
            console.log(`🔑 DEV MODE — OTP for ${email}: ${otp}`);
        }

        return res.status(201).json({
            success: true,
            message: "OTP sent to your email. Please verify to complete registration.",
            email,
        });

    } catch (error) {
        console.error("register error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ─── Verify OTP ──────────────────────────────────────────────────────────────

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "No account found for this email" });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Account is already verified. Please login." });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
            return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
        }

        user.isAccountVerified = true;
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        const token = createToken(user);

        return res.status(200).json({
            success: true,
            message: "Email verified successfully! Welcome aboard.",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("verifyOtp error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ─── Resend OTP ──────────────────────────────────────────────────────────────
export const resendOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "No account found for this email" });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Account is already verified. Please login." });
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        await sendOTPEmail(email, otp);

        return res.status(200).json({ success: true, message: "A new OTP has been sent to your email." });

    } catch (error) {
        console.error("resendOtp error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ─── Login ───────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "No account found with this email" });
        }
        if (!user.isAccountVerified) {
            return res.status(403).json({
                success: false,
                message: "Account not verified. Please check your email for the OTP.",
                needsVerification: true,
                email: user.email,
            });
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }
        const token = createToken(user);
        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("login error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with this email",
            });
        }
        if (!user.isAccountVerified) {
            return res.status(403).json({
                success: false,
                message: "Account is not verified",
            });
        }
        const token = forgotPassToken(user);
        try {
            await sendForgotPassEmail(email, token);
        } catch (error) {
            console.error("Forgot Password Email Error:", error);
        }
        return res.status(200).json({
            success: true,
            message: "Reset password token generated successfully",
        });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPass } = req.body;
        if (!newPass) {
            return res.status(400).json({
                success: false,
                message: "Please enter a new password",
            });
        }
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token is required",
            });
        }
        // Verify token
        const decodedToken = jwt.verify(token, process.env.SECRET);
        const userId = decodedToken.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (!user.isAccountVerified) {
            return res.status(403).json({
                success: false,
                message: "Account is not verified",
            });
        }
        // Hash new password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPass, salt);
        // Save updated password
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        // Token expired
        if (error.name === "TokenExpiredError") {
            return res.status(400).json({
                success: false,
                message: "Reset token has expired",
            });
        }
        // Invalid token
        if (error.name === "JsonWebTokenError") {
            return res.status(400).json({
                success: false,
                message: "Invalid reset token",
            });
        }
        console.error("Reset Password Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// ─── Get Profile ─────────────────────────────────────────────────────────────

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password -otp -otpExpiresAt");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User found", user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
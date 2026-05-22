import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
    otp: { type: String },
    otpExpiresAt: { type: Date },
    isAccountVerified: { type: Boolean, default: false },
}, { timestamps: true })

const User = mongoose.model("User", userSchema);
export default User;
import express from "express"
import User from "../models/User.js";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken";

export const createToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.SECRET, { expiresIn: "1h" })
}

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" })
    }

    try {
        const isUser = await User.findOne({ email });
        if (isUser) {
            return res.status(400).json({ success: false, message: "User with this email is already taken" })
        }

        const hashedPass = await bcryptjs.hash(password, 10);
        const newUser = await User.create({
            name, email, password: hashedPass
        })

        const token = createToken(newUser);

        return res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        })

    } catch (error) {
        console.log("inside catch")
        return res.status(400).json({ success: false, message: error.message })
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" })
    }
    try {
        const checkUser = await User.findOne({ email });

        if (!checkUser) {
            return res.status(400).json({ success: false, message: "No User found with this email" })
        }
        const comparePass = await bcryptjs.compare(password, checkUser.password);
        if (!comparePass) {
            return res.status(404).json({ success: false, message: "Password must be valid" })
        }

        const token = createToken(checkUser);
        return res.status(201).json({
            success: true, message: "User Login successfully", token, user: {
                id: checkUser._id,
                name: checkUser.name,
                email: checkUser.email,
                password: checkUser.password,
                role: checkUser.role
            }
        })

    } catch (error) {
        console.log("inside catch")
        return res.status(400).json({ success: false, message: error.message })
    }
}

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
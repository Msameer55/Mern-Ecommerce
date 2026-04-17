import express from "express";
import User from "../models/User.js";
import bcryptjs from "bcryptjs"

// @route GET /api/admin/users
// @desc get all admin users (Admin Only)
// @access Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const user = await User.find({});
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }
        return res.status(200).json({ success: true, message: "All Users found", user })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" })
    }
}

// @route POST /api/admin/users
// @desc post admin users (Admin Only)
// @access Private/Admin
export const addUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all the required fields" })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ success: false, message: "User with this Email already registered " })
        }

        const hashedPass = await bcryptjs.hash(password, 10);

        const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPass,
            role: role || "customer"
        })

        await newUser.save();
        return res.status(201).json({ success: true, message: "User added successfully", newUser })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" })
    }
}

// @route PUT /api/admin/users/:id
// @desc update admin users (Admin Only)
// @access Private/Admin
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all the required fields" })
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }
        user.name = name;
        user.email = email;
        user.password = password;
        user.role = role;
        await user.save();
        return res.status(200).json({ success: true, message: "User updated successfully", user })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" })
    }
}

// @route DELETE /api/admin/users/:id
// @desc delete admin users (Admin Only)
// @access Private/Admin

export const deleteUser = async (req, res) => {

    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }
        await user.deleteOne();
        return res.status(200).json({ success: true, message: "User deleted successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" })
    }
}
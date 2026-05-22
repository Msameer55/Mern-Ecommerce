import express from "express";
import Product from "../models/Product.js";

// @route GET /api/admin/products
// @desc get all products (Admin Only)
// @access Private/Admin
export const getAllAdminProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        if (!products) {
            return res.status(400).json({ success: false, message: "Products not found" })
        }
        return res.status(200).json({ success: true, message: "Products fetched successfully", products })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" })
    }
}


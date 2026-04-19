import express from "express"
import { Order } from "../models/Order.js"

// @route GET /api/orders
// @desc Get all orders for the logged in user
// @access Private

export const getOrders = async (req, res) => {
    try {
        // Fetch all orders for user but hide heavy arrays/objects
        const orders = await Order.find({ user: req.user._id })
            .select("-orderItems -shippingAddress") // exclude heavy fields
            .sort({ createdAt: -1 });

        if (orders) {
            return res.status(201).json({ success: true, message: "Orders fetched successfully", orders })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Server Error '
        });
    }
}


// @route GET /api/orders/:id
// @desc Get Details order by ID
// @access Private

export const getOrdersById = async (req, res) => {
    try {
        const orders = await Order.findById(req.params.id);
        if (!orders) {
            return res.status(404).json({ success: false, message: "Order not found" })
        }
        return res.status(201).json({ success: true, message: "Order fetched successfully", orders })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Server Error '
        });
    }
}
import express from "express";
import { Order } from "../models/Order.js";

// @route GET /api/admin/orders
// @desc  get all orders with user details
// @access Private
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", "name email");
        if (orders) {
            return res.status(200).json({ success: true, message: "Orders fetched successfully", orders })
        }
        else {
            return res.status(400).json({ success: false, message: "Orders not found" })
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" })
    }
}

// @route PUT /api/admin/orders/:id
// @desc  update the order details
// @access Private
export const updateOrders = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(400).json({ success: false, message: "Order with this id not found" })
        }
        if (req.body.status) {
            order.status = req.body.status;
        }

        if (order.status === "Delivered") {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        } else {
            order.isDelivered = false;
            order.deliveredAt = null;
        }

        await order.save();
        return res.status(200).json({ success: true, message: "Order updated successfully", order })


    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" })
    }
}

// @route DELETE /api/admin/orders/:id
// @desc  delete the order details
// @access Private

export const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id);
        console.log(order, "order id delete")
        if (!order) {
            return res.status(400).json({ success: false, message: "Order Not Found" })
        }
        await order.deleteOne();
        return res.status(200).json({ success: true, message: "Order has been deleted" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" })
    }
}
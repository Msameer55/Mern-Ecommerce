import express from "express"
import Subscriber from "../models/Subscriber.js"

// @route POST /api/subscribe
// @desc Post email subscribers 
// @access Publice

export const subscribe = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" })
    }
    try {
        // Check if email already subscribe
        let subscriber = await Subscriber.findOne({ email })
        if (subscriber) {
            return res.status(400).json({ success: false, message: "Email already subscribed" })
        }
        else {
            const subscribeEmail = new Subscriber({ email });
            await subscribeEmail.save();
            return res.status(201).json({ success: true, message: "Email subscribed successfully", subscribeEmail })
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" })
    }
}

// @route GET /api/subscribe
// @desc Get all subscribers 
// @access Private

export const getAllSubscribers = async (req, res) => {
    try {
        const subscribers = await Subscriber.find({}).sort({ createdAt: -1 }).select("_id email createdAt");
        if (!subscribers) {
            return res.status(404).json({ success: false, message: "No subscribers found" })
        }
        return res.status(200).json({ success: true, subscribers })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" })
    }
}

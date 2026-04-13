import jwt from "jsonwebtoken"
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token)
    if (!token) return res.status(401).json({ success: false, message: "Authorization Failed! Token Not Found" })

    try {
        console.log("Verifying token...");
        const decoded = jwt.verify(token, process.env.SECRET);
        console.log(decoded, "decoded user from middleware");

        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ success: false, message: "User not found" });

        req.user = user;
        next(); 
    } catch (error) {
        console.error("JWT verification failed:", error.message);
        return res.status(401).json({ success: false, error: 'Invalid token' });
    }
}

// Check if user is admin only to allow to crud perform with product

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    }
    else {
        return res.status(403).json({ success: false, message: "Not Authorized as an Admin" })
    }
} 
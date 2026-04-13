import express from "express"
import { getProfile, login, register } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/protectedRoutes.js";

const authRoutes = express.Router();

authRoutes.post("/register", register)
authRoutes.post("/login", login)
authRoutes.get("/profile", verifyToken , getProfile)

export default authRoutes;
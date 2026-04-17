import express from "express"
import { isAdmin, verifyToken } from "../middlewares/protectedRoutes.js";
import { addUser, deleteUser, getAllUsers, updateUser } from "../controllers/adminController.js";

const adminRoutes = express.Router();

adminRoutes.get("/", verifyToken, isAdmin, getAllUsers);
adminRoutes.post("/", verifyToken, isAdmin, addUser);
adminRoutes.put("/:id", verifyToken, isAdmin, updateUser);
adminRoutes.delete("/:id", verifyToken, isAdmin, deleteUser);

export default adminRoutes;
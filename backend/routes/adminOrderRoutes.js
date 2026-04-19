import express from "express";
import { isAdmin, verifyToken } from "../middlewares/protectedRoutes.js";
import { deleteOrder, getAllOrders, updateOrders } from "../controllers/adminOrderController.js";

const adminOrderRoutes = express.Router();

adminOrderRoutes.get("/", verifyToken, isAdmin, getAllOrders);
adminOrderRoutes.put("/:id", verifyToken, isAdmin, updateOrders);
adminOrderRoutes.delete("/:id", verifyToken, isAdmin, deleteOrder);

export default adminOrderRoutes;
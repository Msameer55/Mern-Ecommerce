import express from "express"
import { verifyToken } from "../middlewares/protectedRoutes.js";
import { getOrders, getOrdersById } from "../controllers/orderController.js";

const orderRoutes = express.Router();

orderRoutes.get("/", verifyToken, getOrders);
orderRoutes.get("/:id", verifyToken, getOrdersById);

export default orderRoutes;
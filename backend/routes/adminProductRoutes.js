import express from "express"
import { isAdmin, verifyToken } from "../middlewares/protectedRoutes.js";
import { getAllAdminProducts } from "../controllers/adminProductController.js";

const productRoutes = express.Router();

productRoutes.get("/", verifyToken, isAdmin, getAllAdminProducts);

export default productRoutes;
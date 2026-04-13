import express from "express"
import { addProductToCart, deleteProductToCart, getProductsOfCart, mergeProductToCart, updateProductToCart } from "../controllers/cartController.js";
import { verifyToken } from "../middlewares/protectedRoutes.js";

const cartRoutes = express.Router();

cartRoutes.post("/", addProductToCart );
cartRoutes.put("/", updateProductToCart);
cartRoutes.delete("/", deleteProductToCart);
cartRoutes.get("/", getProductsOfCart);
cartRoutes.post("/merge", verifyToken, mergeProductToCart)

export default cartRoutes;



import express from "express"
import { addProductToWishlist, deleteProductFromWishlist, getWishlistItems } from "../controllers/wishlistController.js";
const wishlistRoutes = express.Router();

wishlistRoutes.get("/", getWishlistItems);
wishlistRoutes.post("/", addProductToWishlist);
wishlistRoutes.delete("/:id", deleteProductFromWishlist);

export default wishlistRoutes;

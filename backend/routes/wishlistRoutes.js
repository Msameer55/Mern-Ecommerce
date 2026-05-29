import express from "express"
import { addProductToWishlist, deleteProductFromWishlist, getWishlistItems, mergeWishlist } from "../controllers/wishlistController.js";
import { verifyToken } from "../middlewares/protectedRoutes.js";
const wishlistRoutes = express.Router();

wishlistRoutes.get("/", getWishlistItems);
wishlistRoutes.post("/", addProductToWishlist);
wishlistRoutes.delete("/:id", deleteProductFromWishlist);
wishlistRoutes.post("/merge", verifyToken, mergeWishlist);

export default wishlistRoutes;

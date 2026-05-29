import express from "express"
import { addProduct, bestSeller, deleteProduct, getAllProducts, getProduct, newArrival, similarProduct, updateProduct, getProductFilters } from "../controllers/productController.js";
import { isAdmin, verifyToken } from "../middlewares/protectedRoutes.js";

const productRoutes = express.Router();


productRoutes.get("/bestseller", bestSeller);
productRoutes.get("/new-arrivals", newArrival);

// Admin routes 
productRoutes.post("/", verifyToken, isAdmin, addProduct);
productRoutes.put("/:id", verifyToken, isAdmin, updateProduct);
productRoutes.delete("/:id", verifyToken, isAdmin, deleteProduct);

productRoutes.get("/meta/filters", getProductFilters);
productRoutes.get("/similar/:id", similarProduct);
productRoutes.get("/:id", getProduct);
productRoutes.get("/", getAllProducts);


export default productRoutes;
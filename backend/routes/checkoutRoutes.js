import express from "express"
import { verifyToken } from "../middlewares/protectedRoutes.js";
import { createCheckout, finalizeCheckout, updateCheckout } from "../controllers/checkoutController.js";

const checkoutRoutes = express.Router();

checkoutRoutes.post("/", verifyToken, createCheckout );
checkoutRoutes.post("/:id/pay", verifyToken, updateCheckout );
checkoutRoutes.post("/:id/finalize", verifyToken, finalizeCheckout );


export default checkoutRoutes;

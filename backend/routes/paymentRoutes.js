import express from "express";
import { createPaymentIntent } from "../controllers/paymentController.js";
import { verifyToken } from "../middlewares/protectedRoutes.js";

const router = express.Router();

router.post("/create-payment-intent", verifyToken, createPaymentIntent);

export default router;

import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @route POST /api/payment/create-payment-intent
// @desc Create a stripe payment intent 
// @access Private
export const createPaymentIntent = async (req, res) => {
    const { amount, currency = "pkr" } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects the amount in cents
            currency,
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server Error",
        });
    }
};

import transporter from "../config/nodemailer.js";
import Cart from "../models/Cart.js";
import { Checkout } from "../models/Checkout.js";
import { Order } from "../models/Order.js";
import User from "../models/User.js";

// Helpers 
const sendPaymentSuccessEmail = async (email, paymentDetails, paymentMethod) => {
    await transporter.sendMail({
        from: `"ShopNow" <${process.env.SENDER_EMAIL}>`,
        to: email, subject: "Payment Successful - ShopNow",
        html: ` 
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;background:#ffffff;"> 
        <h2 style="color:#111827;margin-bottom:12px;"> Payment Successful 🎉 </h2> 
        <p style="color:#4b5563;font-size:15px;line-height:24px;"> 
        Your payment has been received successfully. </p>
         <div style="background:#f9fafb;padding:18px;border-radius:10px;margin:24px 0;">
        <p style="margin:0 0 10px 0;color:#111827;">
        <strong>Payment Status:</strong> Paid </p>
        <p style="margin:0 0 10px 0;color:#111827;"> <strong>Transaction ID:</strong>
        ${paymentDetails?.id || "N/A"} </p> <p style="margin:0;color:#111827;">
        <strong>Method Type:</strong>
        ${paymentMethod !== "cod"
                ? `<p style="margin:0;color:#111827;">
        <strong>Method Type:</strong>
        ${paymentDetails?.payment_method_types?.[0] || "Online Payment"}
        </p>`
                : ""
            }
        <strong>Method:</strong>
        ${paymentMethod || "Test"} </p> 
        </div> <p style="color:#6b7280;font-size:14px;line-height:22px;">
         We are now processing your order and you will receive another email once your order is confirmed. </p> <p style="margin-top:32px;color:#111827;"> Thank you for shopping with <strong>ShopNow</strong>. </p>
          </div> `,
    });
};

// @route POST /api/checkout
// @desc create a new checkout session
// @access Private
export const createCheckout = async (req, res) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;
    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({ success: false, message: "No Items in the checkout" })
    }
    try {
        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems: checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "pending",
            isPaid: false
        });
        console.log(`Checkout created for the user, ${req.user._id}`);
        res.status(200).json({ success: true, message: "Checkout created for the user", newCheckout })
    } catch (error) {
        console.error("Error creating the checkout session", error)
        return res.status(500).json({
            success: false,
            message: error.message || 'Server Error '
        });
    }
}

// @route PUT /api/checkout/:id/pay
// @desc Update checkout to mark as paid after successful payment
// @access Private

export const updateCheckout = async (req, res) => {
    const { paymentStatus, paymentDetails, paymentMethod } = req.body;
    console.log(paymentDetails, paymentMethod, "payment details")
    try {
        const checkout = await Checkout.findById(req.params.id).populate("user");
        // const user = await User.findById(checkout.user);
        if (!checkout) {
            return res.status(404).json({ success: false, message: "Checkout not found" })
        }
        if (paymentStatus === "paid") {
            checkout.isPaid = true;
            checkout.paymentStatus = paymentStatus;
            checkout.paymentDetails = paymentDetails;
            if (paymentMethod) checkout.paymentMethod = paymentMethod;
            checkout.paidAt = Date.now();
            await checkout.save();
            await sendPaymentSuccessEmail(checkout.user.email, paymentDetails, paymentMethod);
        }
        else {
            return res.status(400).json({ success: false, message: "Invalid Payment Status" })
        }
        return res.status(201).json({ success: true, message: `Checkout payment ${paymentStatus}`, checkout })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Server Error '
        });
    }
}

// @route POST /api/checkout/:id/finalize 
// @desc Finalize checkout and convert to an order after payment confirmation
// @access Private

export const finalizeCheckout = async (req, res) => {

    try {
        const checkout = await Checkout.findById(req.params.id)
        if (!checkout) {
            return res.status(404).json({ success: false, message: "Checkout not found" })
        }
        if (checkout.isPaid && !checkout.isFinalized) {
            // create the final order based on the checkout details
            const finalOrder = await Order.create({
                user: req.user._id,
                orderItems: checkout.checkoutItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: true,
                paidAt: checkout.paidAt,
                isDelivered: false,
                paymentStatus: "paid",
                paymentDetails: checkout.paymentDetails
            })

            // Mark the checkout as finalized
            checkout.isFinalized = true;
            checkout.finalizedAt = Date.now();
            await checkout.save();

            // Delete all carts associated with the user to prevent ghost carts from race conditions
            await Cart.deleteMany({ user: req.user._id });
            res.status(201).json({ success: true, message: "Checkout Finalized", finalOrder })

        } else if (checkout.isFinalized) {
            res.status(400).json({ success: false, message: "Checkout already finalized" })
        } else {
            return res.status(400).json({ success: false, message: "Checkout is not paid" })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Server Error '
        });
    }
}


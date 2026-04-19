import Cart from "../models/Cart.js";
import { Checkout } from "../models/Checkout.js";
import { Order } from "../models/Order.js";


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
    const { paymentStatus, paymentDetails } = req.body;

    try {
        const checkout = await Checkout.findById(req.params.id)
        if (!checkout) {
            return res.status(404).json({ success: false, message: "Checkout not found" })
        }
        if (paymentStatus === "paid") {
            checkout.isPaid = true;
            checkout.paymentStatus = paymentStatus;
            checkout.paymentDetails = paymentDetails;
            checkout.paidAt = Date.now();
            await checkout.save();
        }

        else {
            res.status(400).json({ success: false, message: "Invalid Payment Status" })
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
                user: checkout.user,
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
            checkout.isFinalized = true,
                checkout.finalizedAt = Date.now()
            await checkout.save();

            // Delete the cart associated with the user 
            await Cart.findOneAndDelete({ user: checkout.user });
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


import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });
    } else if (guestId) {
        return await Cart.findOne({ guestId });
    }
    return null;
};

// @route POST /api/cart
// @desc Add product to cart
// @access PUBLIC
export const addProductToCart = async (req, res) => {
    const { productId, quantity = 1, size, color, guestId, userId } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        let cart = await getCart(userId, guestId);
        // ✅ If cart exists
        if (cart) {
            const productIndex = cart.products.findIndex((p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
            );
            if (productIndex > -1) {
                // update quantity
                cart.products[productIndex].quantity += quantity;
            } else {
                // add new item
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images?.[0]?.url || "",
                    price: product.discountedPrice || product.price,
                    size,
                    color,
                    quantity
                });
            }
            // ✅ FIXED total price
            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + (item.discountedPrice || item.price) * (item.quantity),
                0
            );
            await cart.save();
            return res.status(200).json({
                success: true,
                message: "Cart updated successfully",
                cart
            });
        }
        // ✅ Create new cart
        const newCart = await Cart.create({
            user: userId || undefined,
            guestId: guestId || "guest_" + Date.now(),
            products: [
                {
                    productId,
                    name: product.name,
                    image: product.images?.[0]?.url || "",
                    price: product.discountedPrice || product.price,
                    size,
                    color,
                    quantity
                }
            ],
            totalPrice: (product.discountedPrice || product.price) * quantity
        });
        return res.status(201).json({
            success: true,
            message: "Cart created successfully",
            cart: newCart   // ✅ FIXED
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Server Error '
        });
    }
};

// @route PUT /api/cart
// @desc Update Product quantity in the cart for guest or logged in user  
// @access PUBLIC

export const updateProductToCart = async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    try {
        let cart = await getCart(userId, guestId);
        if (!cart) {
            return res.status(500).json({
                success: false,
                message: "Cart Not Found"
            });
        }
        const productIndex = cart.products.findIndex((p) =>
            p.productId.toString() === productId && p.size === size && p.color === color
        )
        if (productIndex > -1) {
            // update quantity
            if (quantity > 0) {
                cart.products[productIndex].quantity = quantity;
            } else {
                cart.products.splice(productIndex, 1) // Remove products if quantity is 0
            }
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save();
            return res.status(200).json({
                success: true,
                message: "Cart updated successfully",
                cart
            });
        }
        else {
            return res.status(404).json({ success: false, message: "Product not found in cart " })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Server Error '
        });
    }
}

// @route DELETE /api/cart/productId
// @desc Remove Product form cart
// @access PUBLIC

export const deleteProductToCart = async (req, res) => {
    const { productId, size, color, userId, guestId } = req.body;
    try {
        let cart = await getCart(userId, guestId);
        if (!cart) {
            return res.status(500).json({
                success: false,
                message: "Cart Not Found"
            });
        }
        const productIndex = cart.products.findIndex((p) =>
            p.productId.toString() === productId && p.size === size && p.color === color
        )
        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save();
            return res.status(200).json({
                success: true,
                message: "Cart deleted successfully",
                cart
            });
        }
        else {
            return res.status(404).json({ success: false, message: "Product not found in cart " })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Server Error '
        });
    }
}

// @route GET /api/cart
// @desc Get logged in users or guest's users cart
// @access PUBLIC

export const getProductsOfCart = async (req, res) => {
    const { guestId, userId } = req.query;
    try {
        const cart = await getCart(userId, guestId);
        if (cart) {
            return res.status(200).json({ success: true, message: "Products in the cart", cart })
        }
        else {
            return res.status(200).json({ success: true, message: "Cart not found", cart: { products: [] } })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Server Error '
        });
    }
}

// @route POST /api/cart/merge
// @desc Merge guest cart into user cart on login
// @access Private

export const mergeProductToCart = async (req, res) => {
    const { guestId } = req.body;
    try {
        // Find the guest cart and user cart
        const guestCart = await Cart.findOne({ guestId });
        const userCart = await Cart.findOne({ user: req.user._id });
        if (guestCart) {
            // If guest cart is empty, no merging needed
            if (guestCart.products.length === 0) {
                return res.status(400).json({ message: "Guest cart is empty" });
            }
            if (userCart) {
                // Merge guest cart into user cart
                guestCart.products.forEach((guestItem) => {
                    const productIndex = userCart.products.findIndex(
                        (item) =>
                            item.productId.toString() === guestItem.productId.toString() &&
                            item.size === guestItem.size &&
                            item.color === guestItem.color
                    );

                    if (productIndex > -1) {
                        // Item exists in user cart — update quantity
                        userCart.products[productIndex].quantity += guestItem.quantity;
                    } else {
                        // Item not in user cart — add it
                        userCart.products.push(guestItem);
                    }
                });
                await userCart.save();
                // Delete the guest cart after merging
                await Cart.findOneAndDelete({ guestId });
                return res.status(200).json({ success: true, message: "Cart merged successfully", cart: userCart });
            } else {
                // No existing user cart — assign guest cart to user
                guestCart.user = req.user._id;
                guestCart.guestId = undefined;
                await guestCart.save();
                return res.status(200).json({ success: true, message: "Cart assigned to user", cart: guestCart });
            }
        } else {
            if (userCart) {
                // Guest cart already merged, return user cart
                return res.status(200).json({ success: true, message: "User cart retrieved", cart: userCart });
            }
            res.status(404).json({ message: "Guest cart not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

const getWishlist = async (userId, guestId) => {
    if (userId) {
        return await Wishlist.findOne({ user: userId });
    } else if (guestId) {
        return await Wishlist.findOne({ guestId });
    }
    return null;
};

const populateWishlistItems = async (wishlist) => {
    if (!wishlist || !wishlist.products) return wishlist;
    const populatedProducts = await Promise.all(
        wishlist.products.map(async (item) => {
            const product = await Product.findById(item.productId).select("sizes colors");
            const itemObj = item.toObject ? item.toObject() : item;
            return {
                ...itemObj,
                sizes: product ? product.sizes : (item.sizes || []),
                colors: product ? product.colors : (item.colors || [])
            };
        })
    );
    const wishlistObj = wishlist.toObject ? wishlist.toObject() : wishlist;
    wishlistObj.products = populatedProducts;
    return wishlistObj;
};

// @route GET /api/wishlist
// @desc Get Products from wishlist
// @access PUBLIC
export const getWishlistItems = async (req, res) => {
    const { guestId, userId } = req.query;
    try {
        const wishlist = await getWishlist(userId, guestId);
        if (wishlist) {
            const populatedWishlist = await populateWishlistItems(wishlist);
            return res.status(200).json({ success: true, message: "Products in the wishlist", wishlist: populatedWishlist })
        }
        else {
            return res.status(200).json({ success: true, message: "Wishlist not found", wishlist: { products: [] } })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Server Error '
        });
    }
}

// @route POST /api/wishlist
// @desc Add product to wishlist
// @access PUBLIC
export const addProductToWishlist = async (req, res) => {
    const { productId, guestId, userId } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        let wishlist = await getWishlist(userId, guestId);

        if (wishlist) {
            const productExists = wishlist.products.some(
                (p) => p.productId.toString() === productId
            );

            if (productExists) {
                return res.status(400).json({ success: false, message: "Product already in wishlist" });
            }

            wishlist.products.push({
                productId,
                name: product.name,
                image: product.images?.[0]?.url || "",
                price: product.discountedPrice || product.price,
                sizes: product.sizes || [],
                colors: product.colors || []
            });

            await wishlist.save();
            const populatedWishlist = await populateWishlistItems(wishlist);
            return res.status(200).json({
                success: true,
                message: "Product added to wishlist",
                wishlist: populatedWishlist
            });
        }

        // Create new wishlist
        const newWishlist = await Wishlist.create({
            user: userId || undefined,
            guestId: guestId || "guest_" + Date.now(),
            products: [
                {
                    productId,
                    name: product.name,
                    image: product.images?.[0]?.url || "",
                    price: product.discountedPrice || product.price,
                    sizes: product.sizes || [],
                    colors: product.colors || []
                }
            ]
        });

        const populatedWishlist = await populateWishlistItems(newWishlist);
        return res.status(201).json({
            success: true,
            message: "Wishlist created successfully",
            wishlist: populatedWishlist
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Server Error '
        });
    }
};

// @route DELETE /api/wishlist
// @desc Remove Product from wishlist
// @access PUBLIC
export const deleteProductFromWishlist = async (req, res) => {
    const productId = req.params.id || req.body.productId;
    const { userId, guestId } = req.body;
    try {
        let wishlist = await getWishlist(userId, guestId);
        if (!wishlist) {
            return res.status(404).json({ success: false, message: "Wishlist Not Found" });
        }

        const productIndex = wishlist.products.findIndex(
            (p) => p.productId.toString() === productId
        );

        if (productIndex > -1) {
            wishlist.products.splice(productIndex, 1);
            await wishlist.save();
            const populatedWishlist = await populateWishlistItems(wishlist);
            return res.status(200).json({
                success: true,
                message: "Product removed from wishlist",
                wishlist: populatedWishlist
            });
        } else {
            return res.status(404).json({ success: false, message: "Product not found in wishlist" });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Server Error '
        });
    }
};

// @route POST /api/wishlist/merge
// @desc Merge guest wishlist into user wishlist on login
// @access Private
export const mergeWishlist = async (req, res) => {
    const { guestId } = req.body;
    try {
        const guestWishlist = await Wishlist.findOne({ guestId });
        const userWishlist = await Wishlist.findOne({ user: req.user._id });

        if (guestWishlist) {
            if (guestWishlist.products.length === 0) {
                return res.status(400).json({ message: "Guest wishlist is empty" });
            }
            if (userWishlist) {
                guestWishlist.products.forEach((guestItem) => {
                    const exists = userWishlist.products.some(
                        (item) => item.productId.toString() === guestItem.productId.toString()
                    );
                    if (!exists) {
                        userWishlist.products.push(guestItem);
                    }
                });
                await userWishlist.save();
                await Wishlist.findOneAndDelete({ guestId });
                const populatedWishlist = await populateWishlistItems(userWishlist);
                return res.status(200).json({ success: true, message: "Wishlist merged successfully", wishlist: populatedWishlist });
            } else {
                guestWishlist.user = req.user._id;
                guestWishlist.guestId = undefined;
                await guestWishlist.save();
                const populatedWishlist = await populateWishlistItems(guestWishlist);
                return res.status(200).json({ success: true, message: "Wishlist assigned to user", wishlist: populatedWishlist });
            }
        } else {
            if (userWishlist) {
                const populatedWishlist = await populateWishlistItems(userWishlist);
                return res.status(200).json({ success: true, message: "User wishlist retrieved", wishlist: populatedWishlist });
            }
            res.status(404).json({ message: "Guest wishlist not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
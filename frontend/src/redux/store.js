import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import productSlice from "./slice/productSlice";
import cartSlice from "./slice/cartSlice";
import checkoutSlice from "./slice/checkoutSlice";
import orderSlice from "./slice/orderSlice";
import adminSlice from "./slice/adminSlice";
import adminProductSlice from "./slice/adminProductSlice";
import adminOrderSlice from "./slice/adminOrderSlice";
import subscriberSlice from "./slice/subscriberSlice";
import wishListSlice from "./slice/wishlistSlice";
import aiSlice from "./slice/aiSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        product: productSlice,
        cart: cartSlice,
        checkout: checkoutSlice,
        order: orderSlice,
        admin: adminSlice,
        adminProduct: adminProductSlice,
        adminOrder: adminOrderSlice,
        subscriber: subscriberSlice,
        wishlist: wishListSlice,
        ai: aiSlice,
    }
});

export default store;
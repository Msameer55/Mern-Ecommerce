import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartApi from "../../api/cartApi";

const loadCartFromStorage = () => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : { products: [] }
}

const saveCartToStorage = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

//Fetch Cart for a user or guest user
export const fetchCart = createAsyncThunk("cart/fetchCart", async ({ guestId, userId }, { rejectWithValue }) => {
    try {
        const response = await cartApi.fetchCartByParams({ guestId, userId });
        console.log(response.data, "from fetch cart");
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.message || "Something went wrong");
    }
})

// Add an Item to the cart for the guest or user
export const addToCart = createAsyncThunk("cart/addToCart", async ({ productId, color, size, quantity, guestId, userId }, { rejectWithValue }) => {
    try {
        const response = await cartApi.addToCart({ productId, color, size, quantity, guestId, userId });
        // console.log(response.data, "from add to cart");
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.message || "Something went wrong");
    }
})

// Update the Cart Item Quantity
export const updateCartItemQuantity = createAsyncThunk("cart/updateCart", async ({ productId, size, color, quantity, guestId, userId }, { rejectWithValue }) => {
    try {
        const response = await cartApi.updateCartQunatity({ productId, size, color, quantity, guestId, userId });
        console.log(response.data, "from update cart");
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.message || "Something went wrong");
    }
})


// Delete the Item From Cart 
export const deleteItemFromCart = createAsyncThunk("cart/deleteCart", async (data, { rejectWithValue }) => {
    try {
        const response = await cartApi.removeItemFromCart(data);
        console.log(response.data, "from delete slice");
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.message || "Something went wrong");
    }
})

// Merge the Cart Items 
export const mergeCart = createAsyncThunk("cart/mergeCart", async ({ guestId, userId }, { rejectWithValue }) => {
    try {
        const response = await cartApi.mergeCart({ guestId, userId });
        console.log(response.data, "from merge slice");
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.message || "Something went wrong");
    }
})


const initialState = {
    cart: loadCartFromStorage(),
    loading: false,
    error: null,
    cartItems: [],
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearCart: (state) => {
            state.cart = { products: [] },
                localStorage.removeItem("cart");
            state.cartItems = [];
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.cart;
                state.cartItems = action.payload.cart.products || [];
                saveCartToStorage(action.payload.cart);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.cart;
                state.cartItems = action.payload.cart.products || [];
                saveCartToStorage(action.payload.cart);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateCartItemQuantity.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.cart;
                state.cartItems = action.payload.cart.products || [];
                saveCartToStorage(action.payload.cart);
            })
            .addCase(updateCartItemQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteItemFromCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteItemFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.cart;
                state.cartItems = action.payload.cart.products || [];
                saveCartToStorage(action.payload.cart);
            })
            .addCase(deleteItemFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(mergeCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(mergeCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.cart;
                state.cartItems = action.payload.cart.products || [];
                saveCartToStorage(action.payload.cart);
            })
            .addCase(mergeCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
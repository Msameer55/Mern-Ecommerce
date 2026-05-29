import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import wishlistApi from "../../api/wishListApi";

const loadWishlistFromStorage = () => {
    const storedWishlist = localStorage.getItem("wishlist");
    return storedWishlist ? JSON.parse(storedWishlist) : { products: [] }
}

const saveWishlistToStorage = (wishlist) => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
};

export const getWishListItemsSlice = createAsyncThunk("/api/getWishlist", async({guestId, userId} = {}, {rejectWithValue}) => {
    try {
        const response = await wishlistApi.getWishlist({guestId, userId});
        console.log("response from wishlist", response.data)
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data ||error?.response || error?.response?.data?.message || error?.message || "Something went wrong");    
    }
})

export const addWishListItemsSlice = createAsyncThunk("/api/addWishlist", async({productId, guestId, userId} = {}, {rejectWithValue}) => {
    try {
        const response = await wishlistApi.addProductToWishlist({productId, guestId, userId});
        console.log("response from add wishlist", response.data)
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data ||error?.response || error?.response?.data?.message || error?.message || "Something went wrong");    
    }
})

export const deleteWishListItemsSlice = createAsyncThunk("/api/deleteWishlist", async({productId, guestId, userId} = {}, {rejectWithValue}) => {
    try {
        const response = await wishlistApi.deleteProductFromWishlist({productId, guestId, userId});
        console.log("response from delete wishlist", response.data)
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data ||error?.response || error?.response?.data?.message || error?.message || "Something went wrong");    
    }
})

const initialState = {
    wishlist: [],
    loading : false,
    error: null
}

const wishListSlice = createSlice({
    name : "wishlist",
    initialState,
    reducers: { 
        clearWishlist : (state) => {
            state.wishlist = [];
            localStorage.removeItem("wishlist");
            saveWishlistToStorage({ products: [] });
        }
    },
    extraReducers : (builder) => {
        builder
        .addCase(getWishListItemsSlice.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getWishListItemsSlice.fulfilled, (state,action) => {
            const products = action.payload?.wishlist?.products || action.payload?.products || (Array.isArray(action.payload) ? action.payload : null);
            state.wishlist = Array.isArray(products) ? products : [];
            saveWishlistToStorage({ products: action.payload?.wishlist?.products || action.payload?.products || [] });
            state.loading = false;
        })
         .addCase(getWishListItemsSlice.rejected, (state,action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(addWishListItemsSlice.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addWishListItemsSlice.fulfilled, (state,action) => {
            const products = action.payload?.wishlist?.products || action.payload?.products;
            if (Array.isArray(products)) {
                state.wishlist = products;
            } else if (action.payload && action.payload.productId) {
                state.wishlist = [...state.wishlist, action.payload];
            }
            saveWishlistToStorage(action.payload.wishlist || action.payload);
            state.loading = false;
        })
         .addCase(addWishListItemsSlice.rejected, (state,action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(deleteWishListItemsSlice.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteWishListItemsSlice.fulfilled, (state,action) => {
            const products = action.payload?.wishlist?.products || action.payload?.products;
            if (Array.isArray(products)) {
                state.wishlist = products;
            } else if (action.payload && action.payload.productId) {
                state.wishlist = state.wishlist.filter(item => item.productId !== action.payload.productId);
            }
            localStorage.removeItem("wishlist");
            saveWishlistToStorage(action.payload.wishlist || action.payload);
            state.loading = false;
        })
         .addCase(deleteWishListItemsSlice.rejected, (state,action) => {
            state.loading = false;
            state.error = action.payload;
        })

    }

})

export default wishListSlice.reducer;
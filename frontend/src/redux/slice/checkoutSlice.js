import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import checkoutApi from "../../api/checkoutApi";

export const createCheckoutSlice = createAsyncThunk("checkout/createCheckout", async (checkoutData, { rejectWithValue }) => {
    try {
        const response = await checkoutApi.createCheckoutItems(checkoutData);
        console.log(response.data, "from checkout slice");
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.response?.data || error.message || "Something went wrong");
    }
})

export const updateCheckoutSlice = createAsyncThunk("checkout/updateCheckout", async ({ id, details }, { rejectWithValue }) => {
    try {
        const response = await checkoutApi.updateCheckoutItems({ id, details });
        console.log(response.data, "from update checkout slice");
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.response?.data || error.message || "Something went wrong");
    }
})


export const finalizeCheckoutSlice = createAsyncThunk("checkout/finalizeCheckout", async (id, { rejectWithValue }) => {
    try {
        const response = await checkoutApi.finalizeCheckoutItems(id);
        console.log(response.data, "from finalize checkout slice");
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.response?.data || error.message || "Something went wrong");
    }
})

const initialState = {
    loading: false,
    error: null,
    checkoutItems: [],
    updatedCheckoutItems: [],
    finalizedCheckoutItems: [],
}

const checkoutSlice = createSlice({
    name: "checkout",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(createCheckoutSlice.pending, (state) => {
                state.loading = true;
            })
            .addCase(createCheckoutSlice.fulfilled, (state, action) => {
                state.loading = false;
                state.checkoutItems = action.payload.newCheckout;
            })
            .addCase(createCheckoutSlice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateCheckoutSlice.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCheckoutSlice.fulfilled, (state, action) => {
                state.loading = false;
                state.updatedCheckoutItems = action.payload.checkout;
            })
            .addCase(updateCheckoutSlice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(finalizeCheckoutSlice.pending, (state) => {
                state.loading = true;
            })
            .addCase(finalizeCheckoutSlice.fulfilled, (state, action) => {
                state.loading = false;
                state.finalizedCheckoutItems = action.payload.finalOrder;
            })
            .addCase(finalizeCheckoutSlice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export default checkoutSlice.reducer;
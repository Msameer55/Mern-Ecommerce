import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import orderApi from "../../api/orderApi";

// fetch Order details 
export const fetchOrders = createAsyncThunk("order/fetchOrderDetails", async (_, { rejectWithValue }) => {
    try {
        const response = await orderApi.fetchOrders();
        console.log(response.data, "from order slice");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message || "Something went wrong");
    }
})

//fetch Order Details By ID
export const fetchOrderDetailsByID = createAsyncThunk("order/fetchById", async (id, { rejectWithValue }) => {
    try {
        const response = await orderApi.fetchOrderById(id);
        console.log(response.data, "from order detail by id slice")
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message || "Something went wrong");
    }
})

const initialState = {
    loading: false,
    error: null,
    orders: [],
    orderDetails: null
}

const orderSlice = createSlice({
    name: "order",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchOrderDetailsByID.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOrderDetailsByID.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload.orders;
            })
            .addCase(fetchOrderDetailsByID.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export default orderSlice.reducer;
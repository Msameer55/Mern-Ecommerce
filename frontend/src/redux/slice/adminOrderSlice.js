import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import adminOrderApi from "../../api/adminOrderApi";

export const getAllAdminOrders = createAsyncThunk("admin/getAllAdminOrders", async (_, { rejectWithValue }) => {
    try {
        const response = await adminOrderApi.getAllOrdersApi();
        console.log(response.data, "get all data from admin order slice ")
        return response.data;

    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.response?.data || error.message || "Something went wrong");
    }
})

export const updateAdminOrders = createAsyncThunk("admin/updateAdminOrders", async ({ id, updateOrder }, { rejectWithValue }) => {
    try {
        const response = await adminOrderApi.updateOrderApi(id, updateOrder);
        console.log(response.data, "update data from admin order slice ")
        return response.data;

    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.response?.data || error.message || "Something went wrong");
    }
})

export const deleteAdminOrders = createAsyncThunk("admin/deleteAdminOrders", async (id, { rejectWithValue }) => {
    try {
        const response = await adminOrderApi.deleteOrdersApi(id);
        console.log(response.data, "delete data from admin order slice ")
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.response?.data || error.message || "Something went wrong");
    }
})

const initialState = {
    loading: false,
    error: null,
    totalOrders: 0,
    totalSales: 0,
    orders: []
}

const adminOrderSlice = createSlice({
    name: "adminOrder",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllAdminOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllAdminOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
                state.totalOrders = action.payload.orders.length;

                // calculate total Sales 
                const totalSales = state.orders.reduce((acc, order) => {
                    return acc + order.totalPrice;
                }, 0)
                state.totalSales = totalSales.toFixed(2);
            })
            .addCase(getAllAdminOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateAdminOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAdminOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = state.orders.map((order) => order._id === action.payload.order._id ? action.payload.order : order)
            })
            .addCase(updateAdminOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteAdminOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAdminOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = state.orders.filter((order) => order._id !== action.payload.order._id);
            })
            .addCase(deleteAdminOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})



export default adminOrderSlice.reducer;
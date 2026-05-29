import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import subscriberApi from "../../api/subscriberApi";

export const subscriberUser = createAsyncThunk("susbcriber/user", async (data, { rejectWithValue }) => {
    try {
        const response = await subscriberApi.subscribe(data);
        console.log(response, "response")
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
})

export const getAllSubscribers = createAsyncThunk("susbcriber/getAll", async (_, { rejectWithValue }) => {
    try {
        const response = await subscriberApi.getAllSubscribers();
        console.log(response, "response")
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
})

const initialState = {
    subscriber: [],
    loading: false,
    error: null,
    success: false,
}

const subscriberSlice = createSlice({
    name: "subscriber",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(subscriberUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(subscriberUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.subscriber = action.payload;
            })
            .addCase(subscriberUser.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            })
            .addCase(getAllSubscribers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllSubscribers.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.subscriber = action.payload.subscribers;
            })
            .addCase(getAllSubscribers.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            })
    }
})

export default subscriberSlice.reducer;
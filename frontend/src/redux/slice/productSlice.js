import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const filterProductsByQuery = createAsyncThunk("/product/fetchByQuery", async ({
    collections,
    size,
    color,
    gender,
    minPrice,
    maxPrice,
    sortBy,
    search,
    category,
    material,
    brand,
    limit
}, { rejectWithValue }) => {
    const query = new URLSearchParams();
    if (collections) { query.append("collections", collections) }
    if (size) { query.append("size", size) }
    if (color) { query.append("color", color) }
    if (gender) { query.append("gender", gender) }
    if (minPrice) { query.append("minPrice", minPrice) }
    if (maxPrice) { query.append("maxPrice", maxPrice) }
    if (sortBy) { query.append("sortBy", sortBy) }
    if (search) { query.append("search", search) }
    if (category) { query.append("category", category) }
    if (material) { query.append("material", material) }
    if (brand) { query.append("brand", brand) }
    if (limit) { query.append("limit", limit) }
    try {
        const response = await ProductApi.fetchProductsByQuery(query);
        console.log(response.data, "response from  product slice fetch by product query ")
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.response?.data || error.message || "Something went wrong");
    }
})


const initialState = {
    products: [],
    error: false,
    loading: false
}

const productSlice = createSlice({
    name: "product",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(filterProductsByQuery.pending, (state) => {
                state.loading = true;
            })
            .addCase(filterProductsByQuery.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
                state.error = null;
            })
            .addCase(filterProductsByQuery.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload;
            })
    }
})

export default productSlice.reducer;
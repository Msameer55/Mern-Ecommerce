import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ProductApi from "../../api/productApi";

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
        // console.log(response.data, "response from  product slice fetch by product query ")
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.response?.data || error.message || "Something went wrong");
    }
})

export const fetchSingleProduct = createAsyncThunk("product/fetchSingleProduct", async (productId, { rejectWithValue }) => {
    try {
        const response = await ProductApi.fetchProductById(productId);
        // console.log(response.data, "single product");
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.response?.data || error.message || "Something went wrong");
    }
})

export const fetchSimilarProductById = createAsyncThunk("product/fetchSimilar", async (productId, { rejectWithValue }) => {
    try {
        const response = await ProductApi.fetchSimilarProduct(productId);
        // console.log(response.data, "similar product");
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.response?.data || error.message || "Something went wrong");
    }
})

export const bestSellersProduct = createAsyncThunk("/products/bestseller", async (_, { rejectWithValue }) => {
    try {
        const response = await ProductApi.fetchBestSellersProduct();
        // console.log(response.data, "bestseller");
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.response?.data || error.message || "Something went wrong");
    }
})

// Fetch Single Product with its Id
export const getSingleProduct = createAsyncThunk("/product/fetchSingleProduct", async (productId, { rejectWithValue }) => {
    try {
        const response = await ProductApi.getSingleProduct(productId);
        console.log(response.data, "response from single product slice");
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.response?.data || error.message || "Something went wrong");
    }
})

// Fetch Similar Product By Id 
export const getSimilarProduct = createAsyncThunk("/product/similarProduct", async (productId, { rejectWithValue }) => {
    try {
        const response = await ProductApi.getSimilarProduct(productId);
        console.log(response.data, " response from similar product slice")
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.response?.data || error.message || "Something went wrong");
    }
})

export const newArrivalProduct = createAsyncThunk("/prodcuts/newArrival", async (_, { rejectWithValue }) => {
    try {
        const response = await ProductApi.fectchNewArrivalProduct();
        // console.log(response.data, "new arrival")
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.response?.data || error.message || "Something went wrong");
    }
})

const initialState = {
    allProducts: [],
    singleProduct: {},
    similarProduct: [],
    bestSeller: [],
    newArrival: [],
    error: false,
    loading: false,
    filters: {
        collections: "",
        size: "",
        color: "",
        gender: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "",
        search: "",
        category: "",
        material: "",
        brand: "",
        limit: ""
    }
}

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload }
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(filterProductsByQuery.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(filterProductsByQuery.fulfilled, (state, action) => {
                state.loading = false;
                state.allProducts = action.payload.products;
                state.error = null;
            })
            .addCase(filterProductsByQuery.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getSingleProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSingleProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.singleProduct = action.payload.product;
                state.error = null;
            })
            .addCase(getSingleProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getSimilarProduct.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getSimilarProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.similarProduct = action.payload;
                state.error = null;
            })
            .addCase(getSimilarProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchSingleProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSingleProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.singleProduct = action.payload.product;
            })
            .addCase(fetchSingleProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchSimilarProductById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSimilarProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.similarProduct = action.payload.similarProducts;
            })
            .addCase(fetchSimilarProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(bestSellersProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(bestSellersProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.bestSeller = action.payload.bestSellers;
            })
            .addCase(bestSellersProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(newArrivalProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(newArrivalProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.newArrival = action.payload.newArrivals;
            })
            .addCase(newArrivalProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export const { setFilters, clearFilters } = productSlice.actions;
export default productSlice.reducer;
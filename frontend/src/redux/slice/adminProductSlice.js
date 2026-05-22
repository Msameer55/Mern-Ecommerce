import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import adminProductApi from "../../api/adminProductApi"

export const fetchAllAdminProducts = createAsyncThunk("admin/getAllProducts", async (_, { rejectWithValue }) => {
    try {
        const response = await adminProductApi.getAllAdminProducts();
        // console.log(response.data, "from get all admin products")
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.response?.data || error.message || "Something went wrong");
    }
})

// Creating the product :- From Product Controller
export const adminCreateProduct = createAsyncThunk("admin/createProducts", async (productData, { rejectWithValue }) => {
    try {
        const response = await adminProductApi.createAdminProduct(productData);
        console.log(response.data, "from create product")
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.response?.data || error.message || "Something went wrong");
    }
})

// Update the product :- From Product Controller
export const adminUpdateProduct = createAsyncThunk("admin/updateProducts", async ({ id, productData }, { rejectWithValue }) => {
    try {
        const response = await adminProductApi.updateAdminProduct({ id, productData });
        console.log(response.data, "from update product")
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.response?.data || error.message || "Something went wrong");
    }
})

// Delete the product :- From Product Controller
export const adminDeleteProduct = createAsyncThunk("admin/deleteProduct", async (id, { rejectWithValue }) => {
    try {
        const response = await adminProductApi.deleteAdminProduct(id);
        console.log(response.data, "from delete product")
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.response?.data || error.message || "Something went wrong");
    }
})

const initialState = {
    loading: false,
    error: null,
    allAdminProduct: []
}

const adminProductSlice = createSlice({
    name: "adminProduct",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get All Admin Products  
            .addCase(fetchAllAdminProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.allAdminProduct = action.payload.products;
                // console.log(action.payload.products, "allAdminProduct from slice")
            })
            .addCase(fetchAllAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create Product  
            .addCase(adminCreateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminCreateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.allAdminProduct.push(action.payload.product);
            })
            .addCase(adminCreateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //Update the admin Product
            .addCase(adminUpdateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminUpdateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.allAdminProduct = state.allAdminProduct.map((item) => item._id === action.payload.product._id ? action.payload.product : item)
            })
            .addCase(adminUpdateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Admin Product
            .addCase(adminDeleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminDeleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.allAdminProduct = state.allAdminProduct.filter((item) => item._id !== action.payload.product._id)
            })
            .addCase(adminDeleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
})

export default adminProductSlice.reducer;

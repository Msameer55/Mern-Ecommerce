import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminApi from "../../api/adminApi";

// fetch All Users (Admin Only )
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async (_, { rejectWithValue }) => {
    try {
        const response = await adminApi.getUsers();
        console.log(response.data, "from fetch users slice")
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message || "Something went wrong")
    }
})

// Add User 
export const addUserActions = createAsyncThunk("admin/addUser", async (userData, { rejectWithValue }) => {
    try {
        const response = await adminApi.addUserData(userData);
        console.log(response.data, "from add user slice");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message || "Something went wrong")
    }
})

// Update User 
export const updateUserActions = createAsyncThunk("admin/updateUser", async ({ id, userData }, { rejectWithValue }) => {
    try {
        const response = await adminApi.updateUserData({ id, userData });
        console.log(response.data, "from update user slice");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message || "Something went wrong")
    }
})

// Delete User 
export const deleteUserAction = createAsyncThunk("admin/deleteUser", async (id, { rejectWithValue }) => {
    try {
        const response = await adminApi.deleteUserData(id);
        console.log(response.data, "from delete user slice");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message || "Something went wrong")
    }
})

const initialState = {
    loading: false,
    error: null,
    allUsers: []
}

const adminSlice = createSlice({
    name: "admin",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.allUsers = action.payload.user;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addUserActions.pending, (state) => {
                state.loading = true;
            })
            .addCase(addUserActions.fulfilled, (state, action) => {
                state.loading = false;
                state.allUsers = [...state.allUsers, action.payload.user];
            })
            .addCase(addUserActions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUserActions.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUserActions.fulfilled, (state, action) => {
                state.loading = false;
                state.allUsers = state.allUsers.map((user) => user._id === action.payload.user._id ? action.payload.user : user);
            })
            .addCase(updateUserActions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteUserAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteUserAction.fulfilled, (state, action) => {
                state.loading = false;
                state.allUsers = state.allUsers.filter((user) => user._id !== action.payload.userId);
            })
            .addCase(deleteUserAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export default adminSlice.reducer;
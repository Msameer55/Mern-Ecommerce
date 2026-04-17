import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isTokenValid, getOrCreateGuestId } from "../../utils/tokenValidity";
import { getActiveAuthToken, setActiveAuthToken } from "../../utils/activeAuthToken";
import AuthApi from "../../api/authApi";

// Async Thunk for Registration
export const registerUser = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
    try {
        const response = await AuthApi.register(userData);
        console.log(response.data, "from register");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.response.data || error.message || "Something went wrong");
    }
})

// Async Thunk for Login
export const loginUser = createAsyncThunk("auth/login", async (userData, { rejectWithValue }) => {
    try {
        const response = await AuthApi.login(userData);
        const { token, user } = response.data;
        if (token) {
            setActiveAuthToken(token);
        }
        return { user, message: response.data.message };
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.response.data || error.message || "Something went wrong");
    }
})

const token = getActiveAuthToken();
const tokenData = isTokenValid(token);
console.log(tokenData, "token dataa")

const user = localStorage.getItem("user");
const initialState = {
    user: user ? JSON.parse(user) : tokenData.user,
    email: tokenData.email,
    guestId: getOrCreateGuestId(),
    token: token || "",
    isLoggedIn: tokenData.valid || false,
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.email = null;
            localStorage.removeItem("user");
            const newGuestId = `guest_${new Date().getTime()}`;
            localStorage.setItem("guestId", newGuestId);
            state.guestId = newGuestId;

            state.error = null;
            state.loading = false;
            state.token = "";
            state.isLoggedIn = false;
        },
        generateNewGuestId: (state) => {
            const newGuestId = `guest_${new Date().getTime()}`;
            localStorage.setItem("guestId", newGuestId);
            state.guestId = newGuestId;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false,
                    state.user = action.payload.user,
                    localStorage.setItem("user", JSON.stringify(action.payload.user)),
                    state.error = null
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false,
                    state.user = action.payload.user,
                    localStorage.setItem("user", JSON.stringify(action.payload.user)),
                    state.error = null
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

    }
})

export const { logout, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;
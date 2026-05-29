import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isTokenValid, getOrCreateGuestId } from "../../utils/tokenValidity";
import { getActiveAuthToken, setActiveAuthToken } from "../../utils/activeAuthToken";
import AuthApi from "../../api/authApi";

// Async Thunk for Registration (does NOT log in — just sends OTP)
export const registerUser = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
    try {
        const response = await AuthApi.register(userData);
        console.log("register response", response)
        return response.data; // { success, message, email }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || "Something went wrong");
    }
});

// Async Thunk for OTP Verification (logs the user in)
export const verifyOtpUser = createAsyncThunk("auth/verifyOtp", async (data, { rejectWithValue }) => {
    try {
        const response = await AuthApi.verifyOtp(data);
        const { token, user } = response.data;
        if (token) setActiveAuthToken(token);
        return { user, token, message: response.data.message };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || "Something went wrong");
    }
});

// Async Thunk for Resend OTP
export const resendOtpUser = createAsyncThunk("auth/resendOtp", async (data, { rejectWithValue }) => {
    try {
        const response = await AuthApi.resendOtp(data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || "Something went wrong");
    }
});

// Async Thunk for Login
export const loginUser = createAsyncThunk("auth/login", async (userData, { rejectWithValue }) => {
    try {
        const response = await AuthApi.login(userData);
        const { token, user } = response.data;
        if (token) {
            setActiveAuthToken(token);
        }
        return { user, token, message: response.data.message };
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.response.data || error.message || "Something went wrong");
    }
})

// Async Thunk for ForgotPass
export const forgotPassAsync = createAsyncThunk("auth/forgotPass", async ({ email }, { rejectWithValue }) => {
    try {
        const response = await AuthApi.forgotPass({ email });
        console.log(response.data, "response from forgotPass")
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.response.data || error.message || "Something went wrong");
    }
})

// Async Thunk for ResetPass
export const resetPassAsync = createAsyncThunk("auth/resetPass", async ({ token, password }, { rejectWithValue }) => {
    try {
        const response = await AuthApi.resetPass({ token, password });
        console.log(response.data, "response from resetPass")
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.response.data || error.message || "Something went wrong");
    }
})

const token = getActiveAuthToken();
const tokenData = isTokenValid(token);
console.log(tokenData, "token dataa")

// If token is invalid, ensure localStorage is clean so user isn't falsely loaded
if (!tokenData.valid) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
}

const user = localStorage.getItem("user");
const initialState = {
    user: tokenData.valid && user ? JSON.parse(user) : tokenData.user,
    email: tokenData.email,
    pendingEmail: null,       // email waiting for OTP verification
    guestId: getOrCreateGuestId(),
    token: tokenData.valid ? (token || "") : "",
    isLoggedIn: tokenData.valid || false,
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.email = null;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
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
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                // Don't log in yet — just store the email so OTP page knows who to verify
                state.pendingEmail = action.payload.email;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            // OTP Verification
            .addCase(verifyOtpUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtpUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isLoggedIn = true;
                state.pendingEmail = null;
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("user", JSON.stringify(action.payload.user));
                state.error = null;
            })
            .addCase(verifyOtpUser.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            // Resend OTP
            .addCase(resendOtpUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(resendOtpUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resendOtpUser.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token; // Ensure token is updated
                state.isLoggedIn = true; // IMPORTANT: Set this to true
                localStorage.setItem("user", JSON.stringify(action.payload.user));
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(forgotPassAsync.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(forgotPassAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
            })
            .addCase(forgotPassAsync.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(resetPassAsync.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(resetPassAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
            })
            .addCase(resetPassAsync.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

    }
})

export const { logout, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;
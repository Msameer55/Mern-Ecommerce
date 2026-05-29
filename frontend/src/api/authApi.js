import axiosInstance from "../config/axios";

const AuthApi = {
    register: (userData) => {
        return axiosInstance.post("/api/users/register", userData);
    },
    login: (userData) => {
        return axiosInstance.post("/api/users/login", userData);
    },
    verifyOtp: (data) => {
        return axiosInstance.post("/api/users/verify-otp", data);
    },
    resendOtp: (data) => {
        return axiosInstance.post("/api/users/resend-otp", data);
    },
    forgotPass: ({ email }) => {
        return axiosInstance.post("/api/users/forgot-password", { email });
    },
    resetPass: ({ token, password }) => {
        return axiosInstance.post(`/api/users/reset-password/${token}`, { newPass: password });
    }

};

export default AuthApi;

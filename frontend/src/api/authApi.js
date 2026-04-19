import axiosInstance from "../config/axios";

const AuthApi = {
    register: (userData) => {
        return axiosInstance.post("/api/users/register", userData);
    },
    login: (userData) => {
        return axiosInstance.post("/api/users/login", userData);
    }
}

export default AuthApi;
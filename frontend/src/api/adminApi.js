import axiosInstance from "../config/axios";

const adminApi = {
    getUsers: () => axiosInstance.get("/api/admin/users"),
    addUserData: (userData) => axiosInstance.post("/api/admin/users", userData),
    updateUserData: ({ id, userData }) => axiosInstance.put(`/api/admin/users/${id}`, userData),
    deleteUserData: (id) => axiosInstance.delete(`/api/admin/users/${id}`),

}

export default adminApi;
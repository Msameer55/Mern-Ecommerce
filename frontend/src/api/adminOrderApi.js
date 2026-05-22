import axiosInstance from "../config/axios";

const adminOrderApi = {
    getAllOrdersApi: () => axiosInstance.get("/api/admin/orders"),
    updateOrderApi: (id, status) => axiosInstance.put(`/api/admin/orders/${id}`, { status }),
    deleteOrdersApi: (id) => axiosInstance.delete(`/api/admin/orders/${id}`),
}

export default adminOrderApi;

import axiosInstance from "../config/axios";

const orderApi = {
    fetchOrders: () => axiosInstance.get("/api/orders"),
    fetchOrderById: (id) => axiosInstance.get(`/api/orders/${id}`),
};

export default orderApi;
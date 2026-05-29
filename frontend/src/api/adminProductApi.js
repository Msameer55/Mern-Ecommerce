import axiosInstance from "../config/axios";

const adminProductApi = {
    getAllAdminProducts: () => axiosInstance.get("/api/admin/products"),
    createAdminProduct: (productData) => axiosInstance.post("/api/products", productData),
    updateAdminProduct: ({ id, productData }) => axiosInstance.put(`/api/products/${id}`, productData),
    deleteAdminProduct: (id) => axiosInstance.delete(`/api/products/${id}`),
}
export default adminProductApi;
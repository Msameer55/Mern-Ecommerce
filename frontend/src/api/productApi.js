import axiosInstance from "../config/axios";

const ProductApi = {
    fetchProductsByQuery: (query) => axiosInstance.get(`/api/products?${query}`),
    getSingleProduct: (id) => axiosInstance.get(`/api/products/${id}`),
    getSimilarProduct: (id) => axiosInstance.get(`/api/products/similar/${id}`),
}

export default ProductApi;
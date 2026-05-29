import axiosInstance from "../config/axios";

const ProductApi = {
    fetchProductsByQuery: (query) => axiosInstance.get(`/api/products/?${query}`),
    fetchProductById: (id) => axiosInstance.get(`/api/products/${id}`),
    fetchSimilarProduct: (id) => axiosInstance.get(`/api/products/similar/${id}`),
    fetchBestSellersProduct: () => axiosInstance.get("/api/products/bestseller"),
    fectchNewArrivalProduct: () => axiosInstance.get("/api/products/new-arrivals"),

    fetchProductsByQuery: (query) => axiosInstance.get(`/api/products?${query}`),
    getSingleProduct: (id) => axiosInstance.get(`/api/products/${id}`),
    getSimilarProduct: (id) => axiosInstance.get(`/api/products/similar/${id}`),
}

export default ProductApi;
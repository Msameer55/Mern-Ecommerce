import axiosInstance from "../config/axios";

const ProductApi = {
    fetchProductsByQuery: (query) => axiosInstance.get(`/api/products/${query}`);
}

export default ProductApi;
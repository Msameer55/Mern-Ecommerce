import axiosInstance from "../config/axios";

const wishlistApi = {
    // accept optional guestId / userId
    getWishlist : ({guestId, userId} = {}) => axiosInstance.get("/api/wishlist", { params: { guestId, userId } }),
    addProductToWishlist : ({productId, guestId, userId} = {}) => axiosInstance.post("/api/wishlist", {productId, guestId, userId}), 
   deleteProductFromWishlist : ({productId, guestId, userId} = {}) => axiosInstance.delete(`/api/wishlist/${productId}`, {data: { guestId, userId}}),
}

export default wishlistApi;
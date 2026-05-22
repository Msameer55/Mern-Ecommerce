import axiosInstance from "../config/axios";

const cartApi = {
    fetchCartByParams: ({ guestId, userId }) => {
        return axiosInstance.get("/api/cart", {
            params: { guestId, userId }
        })
    },
    addToCart: ({ productId, color, size, quantity, guestId, userId }) => {
        return axiosInstance.post("/api/cart", {
            productId, quantity, color, size, guestId, userId
        })
    },
    updateCartQunatity: ({ productId, quantity, color, size, guestId, userId }) => {
        return axiosInstance.put("/api/cart", {
            productId, quantity, color, size, guestId, userId
        })
    },
    removeItemFromCart: (data) => {
        return axiosInstance.delete(`/api/cart`, { data })
    },
    mergeCart: ({ guestId, userId }) => {
        return axiosInstance.post("/api/cart/merge", { guestId, userId })
    }
}

export default cartApi;
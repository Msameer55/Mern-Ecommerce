import axiosInstance from "../config/axios";

const checkoutApi = {
    createCheckoutItems: (checkoutData) => axiosInstance.post('/api/checkout', checkoutData),
    updateCheckoutItems: ({ id, details }) => axiosInstance.put(`/api/checkout/${id}/pay`, details),
    finalizeCheckoutItems: (id) => axiosInstance.put(`/api/checkout/${id}/finalize`),
}
export default checkoutApi; 
import axiosInstance from "../config/axios";

const subscriberApi = {
    subscribe: (data) => axiosInstance.post("/api/subscriber", data),
    getAllSubscribers: () => axiosInstance.get("/api/subscriber")
}

export default subscriberApi;
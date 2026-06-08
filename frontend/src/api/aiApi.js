import axiosInstance from "../config/axios";

const aiApi = {
    getAiData : ({message, history = []}) => {
        return axiosInstance.post("/api/chat/get", {message, history});
    }
}

export default aiApi;
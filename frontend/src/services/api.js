import axios from "axios";

export const API_BASE_URL =
    import.meta.env.VITE_API_URL || "https://palmistry-tarot-backend-43y2.onrender.com";

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (!config.headers) {
        config.headers = {};
    }

    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        };
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
        }
        return Promise.reject(error);
    }
);

export default api;

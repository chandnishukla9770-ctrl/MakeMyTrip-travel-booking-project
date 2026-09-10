import axios from "axios";

export const API_BASE_URL = "https://makemytrip-travel-booking-project-production.up.railway.app";

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const csrfToken = localStorage.getItem("csrfToken") || document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("csrftoken="))
        ?.split("=")[1];
    if (csrfToken) {
        config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
});

export const getErrorMessage = (error, fallback) => {
    const data = error.response?.data;

    if (typeof data === "string" && data.trim()) {
        return data;
    }

    if (data && typeof data === "object") {
        return Object.entries(data)
            .map(([field, message]) => `${field}: ${Array.isArray(message) ? message.join(", ") : message}`)
            .join("\n");
    }

    return error.message || fallback;
};
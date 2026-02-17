import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(` API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error(" Response Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API Functions
export const fetchDashboard = () => {
  return api.get("/analyze");
};

export const fetchHome = () => {
  return api.get("/");
};

export const testConnection = async () => {
  try {
    const response = await api.get("/");
    return { success: true, message: response.data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export default api;
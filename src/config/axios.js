import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
    timeout: 10000,
});

// Request interceptor - token qo'shish
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  
  // Agar FormData bo'lsa, Content-Type-ni axios o'zini belgilashiga qoldirish
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  console.log("API Request:", config.method?.toUpperCase(), config.baseURL + config.url);
  return config;
}, error => {
  console.error("Request error:", error);
  return Promise.reject(error);
});

// Response interceptor - xatoliklarni ushlash
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("Response error:", error.response.status, error.response.statusText);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error("No response from server. Backend ishlamayabdi?");
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
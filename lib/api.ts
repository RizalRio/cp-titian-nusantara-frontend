import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

// Buat instance Axios
const api = axios.create({
  // Fallback ke localhost jika .env belum di-set
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// INTERCEPTOR REQUEST: Berjalan sebelum request dikirim ke Golang
api.interceptors.request.use(
  (config) => {
    // Ambil token dari Zustand
    const token = useAuthStore.getState().token;

    // Jika token ada, selipkan ke header Authorization
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// INTERCEPTOR RESPONSE: Berjalan saat menerima balasan dari Golang
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Jika Golang membalas 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // 🌟 PERBAIKAN: Jangan paksa refresh jika error berasal dari proses login itu sendiri!
      if (error.config.url !== "/api/v1/auth/login") {
        useAuthStore.getState().logout();

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;

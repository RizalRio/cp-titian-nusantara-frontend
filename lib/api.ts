import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

// Buat instance Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  // 🌟 PERBAIKAN 1: Mencegah Request Hanging (Batas waktu 15 detik)
  timeout: 15000,
});

// INTERCEPTOR REQUEST: Berjalan sebelum request dikirim ke Golang
api.interceptors.request.use(
  (config) => {
    // 🌟 PERBAIKAN 2: SSR Safety (Cek window untuk menghindari crash di Server Components)
    if (typeof window !== "undefined") {
      const token = useAuthStore.getState().token;

      // Jika token ada, selipkan ke header Authorization
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
    // 🌟 PERBAIKAN 3: Handler jika server backend sama sekali tidak merespons (Mati/Down)
    if (!error.response) {
      if (typeof window !== "undefined") {
        toast.error(
          "Koneksi ke server terputus. Pastikan internet Anda stabil.",
        );
      }
      return Promise.reject(error);
    }

    const { status, config } = error.response;

    // Jika Golang membalas 401 Unauthorized (Token Kedaluwarsa/Tidak Valid)
    if (status === 401) {
      // Abaikan jika error berasal dari upaya login itu sendiri
      if (config.url !== "/api/v1/auth/login") {
        if (typeof window !== "undefined") {
          // Bersihkan state Zustand
          useAuthStore.getState().logout();

          // 🌟 PERBAIKAN 4: Mencegah Infinite Loop Redirect
          // Cek apakah user TIDAK sedang berada di halaman login
          if (!window.location.pathname.includes("/login")) {
            // Beri notifikasi ke user agar tidak bingung
            toast.error("Sesi Anda telah berakhir. Silakan login kembali.", {
              duration: 3000,
            });

            // Beri jeda 1.5 detik agar notifikasi sempat terbaca sebelum dilempar
            setTimeout(() => {
              // Asumsi halaman login admin Anda ada di /admin/login
              window.location.href = "/admin/login";
            }, 1500);
          }
        }
      }
    }

    // 🌟 PERBAIKAN 5: Penanganan 403 Forbidden (Opsional tapi sangat disarankan)
    // Berlaku jika user punya token valid, tapi mencoba mengakses resource yang bukan haknya
    if (status === 403) {
      if (typeof window !== "undefined") {
        toast.warning("Akses Ditolak", {
          description: "Anda tidak memiliki izin otoritas untuk tindakan ini.",
        });
      }
    }

    return Promise.reject(error);
  },
);

export default api;

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  role_id: string | null;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      // Fungsi untuk menyimpan data saat login sukses
      setAuth: (token, user) => set({ token, user }),
      // Fungsi untuk menghapus data saat logout
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "titian-auth-storage", // Nama key di localStorage browser
    },
  ),
);

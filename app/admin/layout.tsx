"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";

import { Sidebar } from "@/components/admin/Sidebar";
import { Navbar } from "@/components/admin/Navbar";
import { Footer } from "@/components/admin/Footer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Catatan: Jika halaman login ada di (auth)/login, layout ini tidak akan terpanggil di sana.
  // Tapi pengecekan ini tetap aman sebagai lapis keamanan tambahan.
  useEffect(() => {
    if (isMounted && !token && pathname !== "/login") {
      router.push("/login");
    }
  }, [token, isMounted, router, pathname]);

  if (!isMounted)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );

  if (pathname === "/login") {
    return <>{children}</>;
  }

  if (token) {
    return (
      <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
        {/* Sidebar Kiri */}
        <Sidebar />

        {/* Area Utama Kanan */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
          {/* Top Navbar */}
          <Navbar />

          {/* 🌟 PERBAIKAN: Area Gulir (Scroll Area) */}
          <div className="flex-1 overflow-y-auto bg-background/50 flex flex-col">
            {/* Konten Dinamis (Pages) diberi flex-1 agar mendorong Footer ke bawah jika konten sedikit */}
            <main className="flex-1 w-full p-6 md:p-8 mx-auto max-w-7xl">
              {children}
            </main>

            {/* Footer kini berada sejajar dengan main, di dalam area scroll, TANPA terpotong padding */}
            <Footer />
          </div>
        </div>
      </div>
    );
  }

  return null;
}

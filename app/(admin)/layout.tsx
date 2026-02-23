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

  useEffect(() => {
    if (isMounted && !token && pathname !== "/login") {
      router.push("/login");
    }
  }, [token, isMounted, router, pathname]);

  if (!isMounted)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  if (pathname === "/login") {
    return <>{children}</>;
  }

  if (token) {
    return (
      <div className="flex min-h-screen bg-background text-foreground font-sans">
        {/* Sidebar Kiri */}
        <Sidebar />

        {/* Area Utama Kanan */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Top Navbar */}
          <Navbar />

          {/* Konten Dinamis (Pages) */}
          <main className="flex-1 overflow-y-auto bg-background/50 p-6 md:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>

            <Footer />
          </main>
        </div>
      </div>
    );
  }

  return null;
}

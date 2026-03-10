"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";

import { PublicNavbar } from "@/components/public/PublicNavbar";
import { PublicFooter } from "@/components/public/PublicFooter";
import { HomeTemplate } from "@/components/templates/HomeTemplate";

export default function HomePage() {
  const [pageData, setPageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        // Mengambil data halaman berdasarkan slug "beranda" atau "beranda-utama"
        // Sesuaikan endpoint dengan URL slug yang Anda buat di CMS
        const res = await api.get("/api/v1/pages/beranda");

        if (res.data.status === "success") {
          setPageData(res.data.data);
        }
      } catch (error) {
        console.error("Gagal memuat data halaman beranda:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, []);

  // 🌟 STATE LOADING
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <PublicNavbar />
        <main className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground font-medium animate-pulse">
            Memuat Titian Nusantara...
          </p>
        </main>
        <PublicFooter />
      </div>
    );
  }

  // 🌟 FALLBACK DATA
  // Jika Admin belum membuat halaman dengan slug "beranda", gunakan data statis ini
  // agar website tidak blank/error saat pertama kali diluncurkan.
  const content = pageData?.content_json || {
    hero_title: "Menyemai Harapan, Menuai Perubahan.",
    hero_subtitle:
      "Ruang kolaborasi akar rumput yang menempatkan manusia sebagai pusat perjalanan. Bersama wujudkan ekosistem inklusif.",
    manifesto_quote:
      "Manusia sebagai pusat, keberagaman sebagai kekuatan. Melangkah bersama untuk dampak yang lebih luas.",
    values: [
      {
        title: "Bermakna",
        icon: "Heart",
        description:
          "Setiap program dan langkah yang kami ambil harus memiliki akar dan tujuan yang jelas bagi masyarakat.",
      },
      {
        title: "Adil",
        icon: "Scale",
        description:
          "Menjunjung tinggi kesetaraan dan pemerataan akses bagi seluruh elemen tanpa terkecuali.",
      },
      {
        title: "Berkelanjutan",
        icon: "Leaf",
        description:
          "Membangun solusi jangka panjang yang tidak merusak tatanan sosial maupun lingkungan alam.",
      },
      {
        title: "Arah yang Jelas",
        icon: "Compass",
        description:
          "Menjadi navigator bagi inisiatif lokal untuk mencapai skala dampak yang jauh lebih besar.",
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Cangkang Atas */}
      <PublicNavbar />

      {/* Konten Utama */}
      <main className="flex-1 flex flex-col">
        <HomeTemplate content={content} />
      </main>

      {/* Cangkang Bawah */}
      <PublicFooter />
    </div>
  );
}

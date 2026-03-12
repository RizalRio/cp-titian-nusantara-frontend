"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sprout } from "lucide-react";
import api from "@/lib/api";

// 🌟 Import Kedua Template yang Telah Kita Buat
import { CollaborationTemplate } from "@/components/templates/CollaborationTemplate";
import { ModelKolaborasiTemplate } from "@/components/templates/ModelKolaborasiTemplate";

export default function KolaborasiDynamicPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [pageData, setPageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPageDetail = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/api/v1/pages/slug/${slug}`);
        setPageData(res.data.data);
      } catch (error) {
        console.error("Gagal memuat data halaman kolaborasi:", error);
        // Jika slug tidak ditemukan di database, kembalikan ke beranda / halaman 404
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchPageDetail();
    }
  }, [slug, router]);

  // 🌟 LOADING STATE (Animasi konsisten dengan halaman publik lainnya)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] dark:bg-background flex flex-col items-center justify-center">
        <Sprout className="w-12 h-12 text-primary animate-bounce mb-4 opacity-50" />
        <p className="text-primary font-medium animate-pulse tracking-widest uppercase text-sm">
          Menyiapkan Ruang Kolaborasi...
        </p>
      </div>
    );
  }

  // Jika data tidak ada (karena error / redirecting), return null
  if (!pageData) return null;

  // =========================================================================
  // 🌟 RENDER BERSYARAT (CONDITIONAL RENDERING) BERDASARKAN TEMPLATE_NAME
  // =========================================================================

  // 2. Render Template Kolaborasi Sektoral (Institusi Publik / Mitra Industri)
  if (pageData.template_name === "collaboration") {
    return <CollaborationTemplate data={pageData.content_json} slug={slug} />;
  }

  // 3. Fallback jika ada template nyasar yang tidak sengaja dipanggil di rute ini
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
      <h1 className="text-2xl font-bold mb-2 text-destructive">
        Template Tidak Valid
      </h1>
      <p className="text-muted-foreground">
        Halaman dengan slug <strong>"{slug}"</strong> menggunakan template{" "}
        <strong>"{pageData.template_name}"</strong> yang tidak didukung pada
        rute kolaborasi ini.
      </p>
    </div>
  );
}

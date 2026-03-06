"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Compass, Layers, Sprout } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

interface PortfolioSector {
  id: string;
  title: string;
  slug: string;
  sector: string;
  short_story: string;
  media?: { file_url: string; media_type: string }[];
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export default function JejakKaryaIndexPage() {
  const [sectors, setSectors] = useState<PortfolioSector[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const res = await api.get(
          "/api/v1/portfolios?status=published&limit=50",
        );

        const fetchedData = res.data.data || [];

        // 🌟 LOGIKA PENYARINGAN SEKTOR UNIK (Maksimal 4)
        const uniqueSectors: PortfolioSector[] = [];
        const seenSectors = new Set();

        for (const item of fetchedData) {
          const sectorName = item.sector
            ? String(item.sector).trim().toLowerCase()
            : "tanpa kategori";

          if (!seenSectors.has(sectorName)) {
            seenSectors.add(sectorName);
            uniqueSectors.push(item);
          }

          if (uniqueSectors.length === 4) break;
        }

        setSectors(uniqueSectors);
      } catch (error) {
        console.error("Gagal memuat daftar sektor:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSectors();
  }, []);

  return (
    <div className="min-h-screen bg-secondary/10 text-foreground font-sans pb-24">
      {/* 🌟 HERO SECTION (Tanpa Overlap) */}
      <section className="relative pt-32 pb-32 px-6 lg:px-12 bg-primary text-center overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-black/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto mt-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 mb-6 backdrop-blur-sm"
          >
            <Compass className="w-4 h-4 mr-2" />
            Rekam Jejak Titian Nusantara
          </motion.div>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground tracking-tight leading-tight mb-6"
          >
            Menyelami Lintas Sektor
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed"
          >
            Pilih ruang gerak yang ingin Anda jelajahi. Temukan cerita,
            tantangan, dan dampak nyata yang telah kami rajut bersama akar
            rumput.
          </motion.p>
        </div>
      </section>

      {/* 🌟 KARTU NAVIGASI SEKTOR */}
      <section className="max-w-[90rem] mx-auto px-6 lg:px-8 pt-24 pb-12 relative z-20">
        {/* LOADING & EMPTY STATE */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-card rounded-[40px] shadow-sm border border-border">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-primary font-medium">
              Memetakan sektor karya...
            </p>
          </div>
        ) : sectors.length === 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center py-24 bg-card rounded-[40px] border border-border shadow-sm"
          >
            <Layers className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Peta Sektor Belum Tersedia
            </h3>
            <p className="text-muted-foreground">
              Kami sedang menyusun dokumentasi portofolio untuk berbagai sektor.
            </p>
          </motion.div>
        ) : (
          /* GRID 4 KOLOM SEJAJAR */
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {sectors.map((item) => {
              const thumbnail = item.media?.find(
                (m) => m.media_type === "thumbnail",
              )?.file_url;

              const displaySectorName = item.sector
                ? String(item.sector).trim()
                : "Tanpa Kategori";

              return (
                <motion.div
                  key={item.id}
                  variants={fadeInUp}
                  className="group relative w-full h-[400px] md:h-[450px] rounded-[32px] overflow-hidden shadow-lg border-2 border-background/10 bg-muted flex flex-col justify-end transform hover:-translate-y-2 transition-all duration-500"
                >
                  {/* Latar Belakang Gambar Penuh */}
                  <div className="absolute inset-0 w-full h-full">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={displaySectorName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary/30">
                        <Sprout className="w-20 h-20 text-primary/20" />
                      </div>
                    )}
                  </div>

                  {/* Overlay Gradient Tebal agar Teks Terbaca */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

                  {/* Konten Teks di Atas Gambar */}
                  <div className="relative z-10 p-6 flex flex-col h-full justify-end">
                    <h3 className="text-2xl font-extrabold text-white tracking-tight mb-2 drop-shadow-md">
                      {displaySectorName}
                    </h3>

                    <p className="text-white/80 text-sm leading-relaxed mb-6 line-clamp-3">
                      {item.short_story}
                    </p>

                    <Link
                      href={`/jejak-karya/${item.slug}`}
                      className="inline-flex items-center justify-between w-full px-5 py-3 bg-primary/90 backdrop-blur-sm text-primary-foreground font-semibold rounded-2xl border border-white/10 hover:bg-primary transition-all duration-300 shadow-xl group-hover:px-6"
                    >
                      <span>Jelajahi</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>
    </div>
  );
}

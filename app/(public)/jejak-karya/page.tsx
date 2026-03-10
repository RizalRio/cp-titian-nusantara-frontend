"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  Compass,
  Layers,
  Sprout,
  Sparkles,
} from "lucide-react";
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
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
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
    <div className="min-h-screen bg-[#F9F9F7] dark:bg-background text-foreground font-sans pb-32">
      {/* 🌟 1. HERO SECTION (Organic & Texturized) */}
      <section className="relative pt-40 pb-36 px-6 lg:px-12 bg-primary text-center overflow-hidden rounded-b-[3rem] md:rounded-b-[5rem] shadow-sm">
        {/* Ornamen Tekstur dan Gelembung Cahaya */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-black/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-2 text-[11px] font-bold tracking-[0.2em] uppercase text-white mb-8 backdrop-blur-md shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 mr-2.5 text-amber-300" />
            Rekam Jejak Titian Nusantara
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold text-primary-foreground tracking-tight leading-[1.1] mb-8 text-balance mx-auto"
          >
            Menyelami Lintas Sektor.
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed font-medium text-balance"
          >
            Pilih ruang gerak yang ingin Anda jelajahi. Temukan cerita,
            tantangan, dan dampak nyata yang telah kami rajut bersama masyarakat
            akar rumput.
          </motion.p>
        </div>
      </section>

      {/* 🌟 2. KARTU NAVIGASI SEKTOR */}
      <section className="max-w-[85rem] mx-auto px-4 lg:px-8 -mt-16 relative z-20">
        <AnimatePresence mode="wait">
          {isLoading ? (
            /* LOADING STATE (Skeleton Card) */
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-full aspect-[3/4] md:aspect-[4/5] bg-card rounded-[2.5rem] border border-border shadow-sm animate-pulse p-6 flex flex-col justify-end gap-4"
                >
                  <div className="h-8 w-2/3 bg-muted rounded-lg" />
                  <div className="h-4 w-full bg-muted rounded-full" />
                  <div className="h-4 w-5/6 bg-muted rounded-full" />
                  <div className="h-12 w-full bg-muted rounded-xl mt-4" />
                </div>
              ))}
            </motion.div>
          ) : sectors.length === 0 ? (
            /* EMPTY STATE */
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32 bg-card rounded-[3rem] border border-border shadow-xl shadow-primary/5 mx-2"
            >
              <div className="w-20 h-20 bg-primary/5 text-primary flex items-center justify-center rounded-full mx-auto mb-6">
                <Layers className="w-10 h-10 opacity-50" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-3">
                Peta Sektor Belum Tersedia
              </h3>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Kami sedang menyusun dokumentasi portofolio yang komprehensif
                untuk berbagai sektor.
              </p>
            </motion.div>
          ) : (
            /* GRID 4 KOLOM SEJAJAR (Dynamic Cards) */
            <motion.div
              key="content"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
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
                    className="group relative w-full aspect-[3/4] md:aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-xl shadow-primary/5 border border-border/50 bg-card flex flex-col justify-end transform hover:-translate-y-3 transition-all duration-500"
                  >
                    {/* Latar Belakang Gambar Penuh */}
                    <div className="absolute inset-0 w-full h-full bg-muted">
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

                    {/* Overlay Gradient Halus */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                    {/* Konten Teks di Atas Gambar */}
                    <div className="relative z-10 p-6 md:p-8 flex flex-col h-full justify-end">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-[1.7rem] leading-tight font-extrabold text-white tracking-tight mb-3 drop-shadow-md">
                          {displaySectorName}
                        </h3>

                        <p className="text-white/80 text-sm leading-relaxed mb-8 line-clamp-3 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          {item.short_story ||
                            "Jelajahi berbagai program, tantangan, dan capaian luar biasa yang terjadi di sektor ini."}
                        </p>
                      </div>

                      <Link
                        href={`/jejak-karya/${item.slug}`}
                        className="inline-flex items-center justify-between w-full px-6 py-4 bg-white/10 backdrop-blur-md text-white font-bold tracking-wide rounded-2xl border border-white/20 hover:bg-white hover:text-primary transition-all duration-300 shadow-lg group/btn"
                      >
                        <span>Jelajahi Sektor</span>
                        <div className="w-8 h-8 rounded-full bg-white/20 group-hover/btn:bg-primary/10 flex items-center justify-center transition-colors">
                          <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

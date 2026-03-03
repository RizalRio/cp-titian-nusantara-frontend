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
        // Tarik semua jejak karya (profil sektor) yang dipublikasi
        const res = await api.get(
          "/api/v1/portfolios?status=published&limit=50",
        );
        setSectors(res.data.data || []);
      } catch (error) {
        console.error("Gagal memuat daftar sektor:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSectors();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 font-sans pb-32">
      {/* 🌟 HERO SECTION */}
      <section className="relative pt-32 pb-24 px-6 lg:px-12 bg-[#2D4A22] text-center overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-black/10 rounded-full blur-3xl" />

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
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6"
          >
            Menyelami Lintas Sektor
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
          >
            Pilih ruang gerak yang ingin Anda jelajahi. Temukan cerita,
            tantangan, dan dampak nyata yang telah kami rajut bersama akar
            rumput.
          </motion.p>
        </div>
      </section>

      {/* 🌟 KARTU NAVIGASI SEKTOR */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 animate-spin text-[#2D4A22] mb-4" />
            <p className="text-[#2D4A22] font-medium">
              Memetakan sektor karya...
            </p>
          </div>
        ) : sectors.length === 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center py-24 bg-white rounded-[40px] border border-slate-100 shadow-sm"
          >
            <Layers className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              Peta Sektor Belum Tersedia
            </h3>
            <p className="text-slate-500">
              Kami sedang menyusun dokumentasi portofolio untuk berbagai sektor.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {sectors.map((item) => {
              const thumbnail = item.media?.find(
                (m) => m.media_type === "thumbnail",
              )?.file_url;
              return (
                <motion.div
                  key={item.id}
                  variants={fadeInUp}
                  className="bg-white rounded-[32px] overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-[#2D4A22]/15 transition-all duration-500 group flex flex-col relative transform hover:-translate-y-2"
                >
                  {/* Thumbnail Gambar */}
                  <div className="w-full h-64 bg-slate-100 relative overflow-hidden">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={item.sector}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#E3E8E1]">
                        <Sprout className="w-16 h-16 text-[#2D4A22]/20" />
                      </div>
                    )}
                    {/* Overlay Gradient Soft */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />

                    {/* Label Sektor di Atas Gambar */}
                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                      <h3 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                        {item.sector}
                      </h3>
                    </div>
                  </div>

                  {/* Konten Kartu */}
                  <div className="p-8 flex flex-col flex-grow bg-white">
                    <p className="text-slate-600 leading-relaxed mb-8 flex-grow line-clamp-3">
                      {item.short_story}
                    </p>

                    <Link
                      href={`/jejak-karya/${item.slug}`}
                      className="inline-flex items-center justify-center w-full px-6 py-4 bg-[#FAF9F6] text-[#2D4A22] font-bold rounded-full border border-[#2D4A22]/10 group-hover:bg-[#2D4A22] group-hover:text-white transition-all duration-300"
                    >
                      Jelajahi Sektor{" "}
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
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

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Target,
  LayoutTemplate,
  Quote,
  Images,
  Sprout,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

// 🌟 INTERFACE
interface Testimonial {
  author_name: string;
  author_role: string;
  content: string;
  avatar_url?: string;
}

interface Portfolio {
  title: string;
  sector: string;
  short_story: string;
  impact: string;
  location: string;
  testimonials?: Testimonial[];
  media?: { file_url: string; media_type: string }[];
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function JejakKaryaSektorPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await api.get(`/api/v1/portfolios/slug/${slug}`);
        setPortfolio(res.data.data);
      } catch (error) {
        console.error("Gagal memuat jejak karya:", error);
        router.push("/jejak-karya");
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) fetchPortfolio();
  }, [slug, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center">
        <Sprout className="w-12 h-12 text-[#2D4A22] animate-bounce mb-4" />
        <p className="text-[#2D4A22] font-medium animate-pulse">
          Memuat wawasan sektor...
        </p>
      </div>
    );
  }

  if (!portfolio) return null;

  const thumbnail = portfolio.media?.find(
    (m) => m.media_type === "thumbnail",
  )?.file_url;
  const gallery =
    portfolio.media?.filter((m) => m.media_type === "gallery") || [];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 font-sans pb-32">
      {/* 🌟 1. HERO SECTION */}
      <section className="relative w-full pt-32 pb-24 px-6 lg:px-12 bg-[#2D4A22] overflow-hidden text-center">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto relative z-10">
          <Link
            href="/jejak-karya"
            className="inline-flex items-center text-white/70 hover:text-white font-medium transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Ikhtisar Jejak Karya
          </Link>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-sm font-bold tracking-widest uppercase mb-6 backdrop-blur-sm"
          >
            Sektor {portfolio.sector}
          </motion.div>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-8"
          >
            {portfolio.title}
          </motion.h1>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="inline-flex items-center text-white/90 bg-white/10 px-5 py-2.5 rounded-full font-medium"
          >
            <MapPin className="w-5 h-5 mr-2" /> Wilayah Konteks:{" "}
            {portfolio.location}
          </motion.div>
        </div>
      </section>

      {/* 🌟 2. THUMBNAIL UTAMA */}
      {thumbnail && (
        <section className="max-w-6xl mx-auto px-6 lg:px-12 relative z-20 -mt-12 mb-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="w-full aspect-video md:aspect-[21/9] rounded-[40px] overflow-hidden shadow-2xl shadow-[#2D4A22]/10 border-4 border-white"
          >
            <img
              src={thumbnail}
              alt={portfolio.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </section>
      )}

      {/* 🌟 3. CERITA SINGKAT & DAMPAK (2 Kolom) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <LayoutTemplate className="w-8 h-8 text-[#2D4A22]" /> Latar
              Belakang & Konteks
            </h2>
            <div className="p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm">
              <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-line">
                {portfolio.short_story}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Target className="w-8 h-8 text-[#2D4A22]" /> Dampak yang Terwujud
            </h2>
            <div className="p-8 bg-[#2D4A22]/5 rounded-[32px] border border-[#2D4A22]/10 h-full">
              <p className="text-lg text-[#2D4A22] font-medium leading-relaxed whitespace-pre-line">
                {portfolio.impact}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🌟 4. TESTIMONI (Suara Mereka) */}
      {portfolio.testimonials && portfolio.testimonials.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 lg:px-12 py-24 mt-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3 mb-4">
              <Quote className="w-8 h-8 text-[#2D4A22]" /> Suara Akar Rumput
            </h2>
            <p className="text-lg text-slate-600">
              Kesaksian nyata dari mereka yang merasakan langsung dampak
              inisiatif ini.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolio.testimonials.map((testi, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-lg shadow-[#2D4A22]/5 relative"
              >
                <Quote className="absolute top-8 right-8 w-12 h-12 text-[#2D4A22]/10" />
                <p className="text-lg text-slate-700 italic leading-relaxed mb-8 relative z-10">
                  "{testi.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 border-2 border-[#FAF9F6] shadow-sm">
                    {testi.avatar_url ? (
                      <img
                        src={testi.avatar_url}
                        alt={testi.author_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#2D4A22]/10 flex items-center justify-center text-[#2D4A22] font-bold">
                        {testi.author_name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">
                      {testi.author_name}
                    </h4>
                    {testi.author_role && (
                      <p className="text-sm text-slate-500">
                        {testi.author_role}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 🌟 5. GALERI FOTO */}
      {gallery.length > 0 && (
        <section className="bg-white py-24 border-t border-slate-100 mt-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
                <Images className="w-8 h-8 text-[#2D4A22]" /> Dokumentasi
                Lapangan
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((img, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  className="w-full aspect-square rounded-[32px] overflow-hidden shadow-sm"
                >
                  <img
                    src={img.file_url}
                    alt={`Dokumentasi ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

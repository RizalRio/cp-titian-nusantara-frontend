"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Target,
  LayoutTemplate,
  Quote,
  Images,
  Sprout,
  X,
  ChevronLeft,
  ChevronRight,
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
  sector: string; // Bisa string atau object
  category?: { name: string };
  short_story: string;
  impact: string;
  location: string;
  testimonials?: Testimonial[];
  media?: { file_url: string; media_type: string }[];
}

// 🌟 ANIMASI
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export default function JejakKaryaSektorPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // State & Ref untuk Fitur Lightbox & Carousel
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const carouselRef = useRef<HTMLDivElement>(null);

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

  // Pemilahan Media
  const thumbnail = portfolio?.media?.find(
    (m) => m.media_type === "thumbnail",
  )?.file_url;
  const gallery =
    portfolio?.media?.filter((m) => m.media_type === "gallery") || [];

  // Keyboard Navigation untuk Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;

      if (e.key === "Escape") {
        setSelectedImageIndex(null);
      } else if (e.key === "ArrowRight") {
        setSelectedImageIndex((prev) =>
          prev === gallery.length - 1 ? 0 : prev! + 1,
        );
      } else if (e.key === "ArrowLeft") {
        setSelectedImageIndex((prev) =>
          prev === 0 ? gallery.length - 1 : prev! - 1,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    if (selectedImageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [selectedImageIndex, gallery.length]);

  // Handler Scroll Carousel Testimoni
  const scrollTestimonials = (direction: "left" | "right") => {
    if (carouselRef.current) {
      // Menggeser kurang lebih sebesar 1 kartu
      const scrollAmount = direction === "left" ? -400 : 400;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Sprout className="w-12 h-12 text-primary animate-bounce mb-4" />
        <p className="text-primary font-medium animate-pulse">
          Memuat detail jejak karya...
        </p>
      </div>
    );
  }

  if (!portfolio) return null;

  // Deteksi nama sektor dengan aman
  const displaySectorName =
    portfolio.category?.name ||
    (typeof portfolio.sector === "object"
      ? (portfolio.sector as any)?.name
      : portfolio.sector) ||
    "Sektor Umum";

  const isCarousel =
    portfolio.testimonials && portfolio.testimonials.length > 2;

  return (
    <div className="min-h-screen bg-secondary/10 text-foreground font-sans pb-32">
      {/* GLOBAL CSS UNTUK HIDE SCROLLBAR CAROUSEL */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* 🌟 1. HERO SECTION */}
      <section className="relative w-full pt-32 pb-28 px-4 lg:px-8 bg-primary overflow-hidden text-center">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-black/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
          <Link
            href="/jejak-karya"
            className="inline-flex items-center text-primary-foreground/80 hover:text-primary-foreground font-medium transition-colors mb-10 group bg-primary-foreground/10 px-5 py-2 rounded-full backdrop-blur-sm border border-primary-foreground/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Ikhtisar Jejak Karya
          </Link>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary bg-background shadow-sm mb-6"
          >
            Sektor {displaySectorName}
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground tracking-tight leading-tight mb-8"
          >
            {portfolio.title}
          </motion.h1>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="inline-flex items-center bg-black/20 px-6 py-3 rounded-full backdrop-blur-md text-sm font-medium border border-white/10 text-primary-foreground/90"
          >
            <MapPin className="w-5 h-5 mr-3" /> Wilayah Konteks:{" "}
            {portfolio.location}
          </motion.div>
        </div>
      </section>

      {/* 🌟 2. THUMBNAIL UTAMA (Overlapping Hero) */}
      {thumbnail && (
        <section className="max-w-5xl mx-auto px-4 lg:px-8 relative z-20 -mt-16 mb-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="w-full aspect-video md:aspect-[21/9] rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl shadow-primary/10 border-4 border-background bg-muted"
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
      <section className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Kolom Kiri: Latar Belakang */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="bg-card border border-border rounded-[32px] p-8 lg:p-10 shadow-sm flex flex-col"
          >
            <div className="flex items-center gap-4 mb-6 border-b border-border pb-6">
              <div className="p-3 bg-secondary/50 rounded-xl">
                <LayoutTemplate className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Latar Belakang & Konteks
              </h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line flex-grow">
              {portfolio.short_story}
            </p>
          </motion.div>

          {/* Kolom Kanan: Dampak */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="bg-primary/5 border border-primary/10 rounded-[32px] p-8 lg:p-10 shadow-sm flex flex-col"
          >
            <div className="flex items-center gap-4 mb-6 border-b border-primary/10 pb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Dampak yang Terwujud
              </h2>
            </div>
            <p className="text-lg text-primary/80 font-medium leading-relaxed whitespace-pre-line flex-grow">
              {portfolio.impact}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 🌟 4. TESTIMONI (DINAMIS & KARTU DIPERKECIL) */}
      {portfolio.testimonials && portfolio.testimonials.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 lg:px-8 py-20 mt-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              className="text-left max-w-2xl"
            >
              <h2 className="text-3xl font-bold text-foreground flex items-center gap-3 mb-4">
                <Quote className="w-8 h-8 text-primary" /> Suara Mitra &
                Penerima Manfaat
              </h2>
              <p className="text-lg text-muted-foreground">
                Kesan dan kesaksian langsung dari mereka yang terlibat serta
                merasakan dampak inisiatif ini.
              </p>
            </motion.div>

            {/* Tombol Navigasi Muncul Hanya Jika Mode Carousel */}
            {isCarousel && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="flex items-center gap-3"
              >
                <button
                  onClick={() => scrollTestimonials("left")}
                  className="w-12 h-12 rounded-full border border-border bg-card hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors shadow-sm"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => scrollTestimonials("right")}
                  className="w-12 h-12 rounded-full border border-border bg-card hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors shadow-sm"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </motion.div>
            )}
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            ref={isCarousel ? carouselRef : null}
            className={
              isCarousel
                ? "flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar scroll-smooth"
                : // Mengubah grid menjadi flex agar bisa diatur lebar fix-nya
                  "flex flex-col md:flex-row flex-wrap gap-6 md:gap-8"
            }
          >
            {portfolio.testimonials.map((testi, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                // 👇 PENGATURAN LEBAR KARTU YANG LEBIH RINGKAS 👇
                className={`bg-card p-8 lg:p-10 rounded-[32px] border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col ${
                  isCarousel
                    ? "w-[85vw] sm:w-[380px] max-w-[400px] snap-start shrink-0"
                    : "w-full md:w-[400px] max-w-full"
                }`}
              >
                {/* Watermark Quote */}
                <Quote className="absolute top-6 right-6 w-24 h-24 text-primary/5 group-hover:text-primary/10 transition-colors -rotate-12 pointer-events-none" />

                <p className="text-lg text-foreground italic leading-relaxed mb-10 relative z-10 flex-grow">
                  "{testi.content}"
                </p>

                <div className="flex items-center gap-5 mt-auto relative z-10 pt-6 border-t border-border">
                  <div className="w-14 h-14 rounded-full bg-secondary overflow-hidden flex-shrink-0 border-2 border-background shadow-sm">
                    {testi.avatar_url ? (
                      <img
                        src={testi.avatar_url}
                        alt={testi.author_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                        {testi.author_name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-lg">
                      {testi.author_name}
                    </h4>
                    {testi.author_role && (
                      <p className="text-sm text-muted-foreground">
                        {testi.author_role}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* 🌟 5. GALERI FOTO */}
      {gallery.length > 0 && (
        <section className="bg-background py-24 border-t border-border mt-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-foreground flex items-center justify-center gap-3">
                <Images className="w-8 h-8 text-primary" /> Dokumentasi Lapangan
              </h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {gallery.map((img, index) => (
                <motion.div
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  variants={fadeInUp}
                  className="w-full aspect-square rounded-[32px] overflow-hidden group cursor-zoom-in shadow-sm border border-border bg-muted relative"
                >
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-multiply flex items-center justify-center">
                    <span className="text-white font-semibold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                      Lihat Penuh
                    </span>
                  </div>
                  <img
                    src={img.file_url}
                    alt={`Dokumentasi ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* 🌟 6. LIGHTBOX / OVERLAY MODAL */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl p-4 md:p-8"
            onClick={() => setSelectedImageIndex(null)}
          >
            {/* Tombol Close */}
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-6 right-6 md:top-8 md:right-8 p-3 bg-secondary/50 hover:bg-primary hover:text-primary-foreground rounded-full transition-colors z-50 group"
            >
              <X className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-90 transition-transform" />
            </button>

            {/* Tombol Panah Kiri */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex((prev) =>
                  prev === 0 ? gallery.length - 1 : prev! - 1,
                );
              }}
              className="absolute left-4 md:left-12 p-3 md:p-4 bg-secondary/50 hover:bg-primary hover:text-primary-foreground rounded-full transition-colors z-50"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Kontainer Gambar Besar */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl max-h-full w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={gallery[selectedImageIndex].file_url}
                alt={`Tampilan Besar ${selectedImageIndex + 1}`}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              />
              <p className="text-muted-foreground font-medium mt-6">
                {selectedImageIndex + 1} / {gallery.length}
              </p>
            </motion.div>

            {/* Tombol Panah Kanan */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex((prev) =>
                  prev === gallery.length - 1 ? 0 : prev! + 1,
                );
              }}
              className="absolute right-4 md:right-12 p-3 md:p-4 bg-secondary/50 hover:bg-primary hover:text-primary-foreground rounded-full transition-colors z-50"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

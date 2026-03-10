"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Quote,
  Images,
  Sprout,
  X,
  ChevronLeft,
  ChevronRight,
  MapPinned,
  Sparkles,
  Layers,
  Target,
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
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
      const scrollAmount = direction === "left" ? -400 : 400;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] dark:bg-background flex flex-col items-center justify-center">
        <Sprout className="w-12 h-12 text-primary animate-bounce mb-4 opacity-50" />
        <p className="text-primary font-medium animate-pulse tracking-widest uppercase text-sm">
          Membuka Arsip Karya...
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
    <div className="min-h-screen bg-[#F9F9F7] dark:bg-background text-foreground font-sans pb-32">
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
      <section className="relative w-full pt-40 pb-36 px-4 lg:px-8 bg-primary overflow-hidden text-center rounded-b-[3rem] md:rounded-b-[5rem] shadow-sm">
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-black/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
          <Link
            href="/jejak-karya"
            className="inline-flex items-center text-primary-foreground/80 hover:text-primary-foreground font-medium tracking-wide transition-colors mb-10 group bg-primary-foreground/10 px-5 py-2 rounded-full backdrop-blur-sm border border-primary-foreground/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Ikhtisar Jejak Karya
          </Link>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="inline-flex items-center rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary bg-background shadow-xl mb-8"
          >
            <Layers className="w-3.5 h-3.5 mr-2" /> Sektor {displaySectorName}
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-primary-foreground tracking-tight leading-[1.1] mb-8 text-balance"
          >
            {portfolio.title}
          </motion.h1>
        </div>
      </section>

      {/* 🌟 2. THUMBNAIL UTAMA (Overlapping Hero) */}
      {thumbnail && (
        <section className="max-w-6xl mx-auto px-4 lg:px-8 relative z-20 -mt-20 mb-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="w-full aspect-[4/3] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/10 border border-border/50 bg-muted relative"
          >
            <div className="absolute inset-0 bg-primary/5 mix-blend-overlay z-10" />
            <img
              src={thumbnail}
              alt={portfolio.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </section>
      )}

      <div className="max-w-[54rem] mx-auto px-6 lg:px-8">
        {/* 🌟 3. LATAR BELAKANG & KONTEKS (Editorial Reading Width) */}
        <section className="py-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 flex items-center gap-4">
              <div className="w-10 h-1 bg-primary rounded-full" />
              Latar Belakang
            </h2>
            <p className="text-[1.15rem] text-muted-foreground leading-[1.9] whitespace-pre-line font-medium">
              {portfolio.short_story}
            </p>
          </motion.div>
        </section>

        {/* 🌟 4. DAMPAK YANG TERWUJUD */}
        <section className="py-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
          >
            <div className="bg-card p-10 md:p-12 rounded-[3rem] border border-border shadow-xl shadow-primary/5 relative overflow-hidden">
              <Target className="absolute -right-6 -bottom-6 w-40 h-40 text-primary/5 rotate-12" />
              <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3 relative z-10">
                <Sparkles className="w-8 h-8 text-primary" /> Dampak yang
                Terwujud
              </h2>
              <p className="text-[1.15rem] text-muted-foreground leading-[1.9] whitespace-pre-line font-medium relative z-10">
                {portfolio.impact}
              </p>
            </div>
          </motion.div>
        </section>

        {/* 🌟 5. WILAYAH KONTEKS (Peta Lokasi) */}
        {portfolio.location && (
          <section className="py-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-4">
                <MapPinned className="text-primary w-8 h-8" />
                Titik Eksekusi
              </h2>
              <p className="text-lg text-foreground font-semibold mb-8 bg-secondary/50 px-5 py-2.5 rounded-full inline-flex border border-border/50">
                {portfolio.location}
              </p>
              <div className="w-full aspect-video rounded-[2.5rem] overflow-hidden border border-border shadow-sm bg-secondary/30 relative">
                <iframe
                  title="Peta Lokasi"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(portfolio.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                ></iframe>
              </div>
            </motion.div>
          </section>
        )}
      </div>

      {/* 🌟 6. TESTIMONI (CAROUSEL DINAMIS) */}
      {portfolio.testimonials && portfolio.testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 lg:px-8 py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              className="max-w-2xl"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-4 mb-4">
                Suara Akar Rumput
              </h2>
              <p className="text-xl text-muted-foreground">
                Kesan dan kesaksian langsung dari mereka yang merasakan dampak
                inisiatif ini.
              </p>
            </motion.div>

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
                  className="w-14 h-14 rounded-full border border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary flex items-center justify-center transition-all shadow-sm"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => scrollTestimonials("right")}
                  className="w-14 h-14 rounded-full border border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary flex items-center justify-center transition-all shadow-sm"
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
                ? "flex overflow-x-auto gap-6 pb-10 snap-x snap-mandatory hide-scrollbar scroll-smooth"
                : "grid grid-cols-1 md:grid-cols-2 gap-6"
            }
          >
            {portfolio.testimonials.map((testi, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className={`bg-card p-10 lg:p-12 rounded-[3rem] border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-500 relative overflow-hidden group flex flex-col ${
                  isCarousel
                    ? "w-[85vw] sm:w-[420px] snap-start shrink-0"
                    : "w-full"
                }`}
              >
                <Quote className="absolute top-8 right-8 w-24 h-24 text-primary/5 group-hover:text-primary/10 transition-colors -rotate-12 pointer-events-none" />

                <p className="text-[1.15rem] text-foreground italic leading-relaxed mb-10 relative z-10 flex-grow font-medium">
                  "{testi.content}"
                </p>

                <div className="flex items-center gap-5 mt-auto relative z-10 pt-6 border-t border-border/60">
                  <div className="w-14 h-14 rounded-full bg-secondary overflow-hidden flex-shrink-0 border-2 border-background shadow-sm">
                    {testi.avatar_url ? (
                      <img
                        src={testi.avatar_url}
                        alt={testi.author_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl font-serif">
                        {testi.author_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-lg">
                      {testi.author_name}
                    </h4>
                    {testi.author_role && (
                      <p className="text-sm font-medium tracking-wide text-primary uppercase mt-0.5">
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

      {/* 🌟 7. GALERI FOTO */}
      {gallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 lg:px-8 py-20 border-t border-border/50">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-4">
              <Images className="w-8 h-8 text-primary" /> Dokumentasi Sektor
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Potret kolaborasi, senyum, dan kerja keras di lapangan.
            </p>
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
                className="w-full aspect-square rounded-[2.5rem] overflow-hidden group cursor-zoom-in shadow-sm border border-border bg-muted relative"
              >
                <div className="absolute inset-0 bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-multiply flex items-center justify-center backdrop-blur-[2px]">
                  <span className="bg-background/90 text-foreground px-5 py-2.5 rounded-full text-sm font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-all delay-100 transform translate-y-4 group-hover:translate-y-0">
                    Lihat Penuh
                  </span>
                </div>
                <img
                  src={img.file_url}
                  alt={`Dokumentasi ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* 🌟 8. LIGHTBOX / OVERLAY MODAL */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-2xl p-4 md:p-8"
            onClick={() => setSelectedImageIndex(null)}
          >
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-6 right-6 md:top-8 md:right-8 p-3 bg-secondary/50 hover:bg-destructive hover:text-destructive-foreground rounded-full transition-colors z-50 group shadow-lg"
            >
              <X className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-90 transition-transform" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex((prev) =>
                  prev === 0 ? gallery.length - 1 : prev! - 1,
                );
              }}
              className="absolute left-4 md:left-10 p-3 md:p-4 bg-background/50 hover:bg-primary hover:text-primary-foreground border border-border rounded-full transition-colors z-50 shadow-lg"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-6xl max-h-full w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={gallery[selectedImageIndex].file_url}
                alt={`Tampilan Besar ${selectedImageIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl ring-1 ring-border/50"
              />
              <div className="bg-card/80 backdrop-blur-md px-6 py-2 rounded-full border border-border mt-6">
                <p className="text-foreground font-bold tracking-widest text-sm">
                  {selectedImageIndex + 1} / {gallery.length}
                </p>
              </div>
            </motion.div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex((prev) =>
                  prev === gallery.length - 1 ? 0 : prev! + 1,
                );
              }}
              className="absolute right-4 md:right-10 p-3 md:p-4 bg-background/50 hover:bg-primary hover:text-primary-foreground border border-border rounded-full transition-colors z-50 shadow-lg"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

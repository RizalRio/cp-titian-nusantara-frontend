"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Loader2,
  Images,
  LayoutTemplate,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Sprout,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

// 🌟 INTERFACE
interface ProjectMetric {
  metric_label: string;
  metric_value: number;
  metric_unit: string;
  order: number;
}

interface MediaAsset {
  file_url: string;
  media_type: string;
}

interface Service {
  name: string;
  slug: string;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  status: string;
  service: Service;
  media?: MediaAsset[];
  metrics?: ProjectMetric[];
}

// 🌟 ANIMASI
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export default function ProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Fitur Lightbox Galeri
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/api/v1/projects/slug/${slug}`);
        setProject(res.data.data);
      } catch (error) {
        console.error("Gagal memuat detail program:", error);
        router.push("/layanan"); // Redirect jika tidak ditemukan
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) fetchProject();
  }, [slug, router]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  };

  // Pemilahan Media
  const thumbnail = project?.media?.find(
    (m) => m.media_type === "thumbnail",
  )?.file_url;
  const gallery =
    project?.media?.filter((m) => m.media_type === "gallery") || [];

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] dark:bg-background flex flex-col items-center justify-center">
        <Sprout className="w-12 h-12 text-primary animate-bounce mb-4 opacity-50" />
        <p className="text-primary font-medium animate-pulse tracking-widest uppercase text-sm">
          Menyiapkan Cerita Program...
        </p>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-[#F9F9F7] dark:bg-background text-foreground font-sans pb-32">
      {/* 🌟 1. HERO / BANNER (Editorial Full Width) */}
      <section className="relative w-full h-[75vh] min-h-[600px] flex items-end justify-center overflow-hidden bg-primary/90">
        <div className="absolute inset-0 bg-black/50 z-10" />{" "}
        {/* Overlay Gelap Halus */}
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary to-secondary/50 flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
            <LayoutTemplate className="w-40 h-40 text-white/10" />
          </div>
        )}
        <div className="absolute top-32 left-0 right-0 z-20 container mx-auto px-6">
          <Link
            href={
              project.service ? `/layanan/${project.service.slug}` : "/layanan"
            }
            className="inline-flex items-center rounded-full border border-white/20 bg-black/20 px-5 py-2 text-sm font-medium text-white backdrop-blur-md hover:bg-black/40 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Kembali ke {project.service?.name || "Layanan"}
          </Link>
        </div>
        <div className="relative z-20 container mx-auto px-6 lg:px-8 pb-24 md:pb-32 w-full text-center flex flex-col items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl"
          >
            <motion.div
              variants={fadeInUp}
              className="mb-6 inline-flex items-center rounded-full px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase text-white bg-white/20 backdrop-blur-md border border-white/30"
            >
              <Sparkles className="w-3.5 h-3.5 mr-2 text-amber-300" /> Aksi
              Nyata
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-white tracking-tight leading-[1.1] mb-8 text-balance"
            >
              {project.title}
            </motion.h1>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-4 text-white/90 mb-8"
            >
              {project.location && (
                <div className="flex items-center bg-black/30 px-5 py-2.5 rounded-full backdrop-blur-md text-sm font-medium border border-white/10 shadow-sm">
                  <MapPin className="w-4 h-4 mr-2 text-primary-foreground" />{" "}
                  {project.location}
                </div>
              )}
              {(project.start_date || project.end_date) && (
                <div className="flex items-center bg-black/30 px-5 py-2.5 rounded-full backdrop-blur-md text-sm font-medium border border-white/10 shadow-sm">
                  <Calendar className="w-4 h-4 mr-2 text-primary-foreground" />
                  {formatDate(project.start_date)}{" "}
                  {project.end_date && `- ${formatDate(project.end_date)}`}
                </div>
              )}
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-medium text-balance"
            >
              {project.summary}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 🌟 2. METRIK DAMPAK (Melayang di atas batas Hero) */}
      {project.metrics && project.metrics.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 lg:px-8 relative z-30 -mt-20 md:-mt-24 mb-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {project.metrics
              .sort((a, b) => a.order - b.order)
              .map((metric, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-card/90 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-primary/5 border border-border/60 text-center flex flex-col justify-center transform hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="text-4xl md:text-[3.5rem] font-black text-primary mb-3 flex items-baseline justify-center gap-1 tracking-tight">
                    {metric.metric_value}
                    {metric.metric_unit && (
                      <span className="text-lg md:text-xl font-bold text-muted-foreground/80">
                        {metric.metric_unit}
                      </span>
                    )}
                  </div>
                  <p className="text-sm md:text-base font-bold text-foreground/80 line-clamp-2 leading-snug">
                    {metric.metric_label}
                  </p>
                </motion.div>
              ))}
          </motion.div>
        </section>
      )}

      {/* 🌟 3. CERITA LENGKAP (Rich Text) */}
      <section
        className={`max-w-6xl mx-auto px-4 lg:px-8 ${!project.metrics || project.metrics.length === 0 ? "pt-24" : "pt-10"} pb-16`}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="bg-card border border-border rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-xl shadow-primary/5"
        >
          <div className="border-b border-border/60 pb-8 mb-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Catatan Perjalanan Program
            </h2>
          </div>

          <div
            className="quill-content text-lg md:text-[1.2rem] text-muted-foreground leading-relaxed md:leading-[1.9] font-medium"
            dangerouslySetInnerHTML={{ __html: project.description }}
          />
        </motion.div>

        {/* === CSS PENYESUAIAN KHUSUS UNTUK QUILL HTML === */}
        <style jsx global>{`
          .quill-content p {
            margin-bottom: 1.5em;
            color: hsl(var(--foreground) / 0.85);
          }
          .quill-content h2,
          .quill-content h3,
          .quill-content h4 {
            color: hsl(var(--foreground));
            font-weight: 800;
            line-height: 1.2;
            letter-spacing: -0.02em;
          }
          .quill-content h2 {
            font-size: 2rem;
            margin-top: 2em;
            margin-bottom: 1em;
          }
          .quill-content h3 {
            font-size: 1.5rem;
            margin-top: 1.8em;
            margin-bottom: 0.8em;
          }
          .quill-content a {
            color: hsl(var(--primary));
            text-decoration: underline;
            text-decoration-thickness: 2px;
            text-underline-offset: 4px;
            font-weight: 600;
          }
          .quill-content a:hover {
            background-color: hsl(var(--primary) / 0.1);
            text-decoration-color: transparent;
          }
          /* --- LIST --- */
          .quill-content ul,
          .quill-content ol {
            padding-left: 1.5rem;
            margin-bottom: 1.75em;
            color: hsl(var(--foreground) / 0.85);
          }
          .quill-content ul {
            list-style-type: disc;
          }
          .quill-content ol {
            list-style-type: decimal;
          }
          .quill-content li[data-list="bullet"] {
            list-style-type: disc;
          }
          .quill-content li[data-list="ordered"] {
            list-style-type: decimal;
          }
          .quill-content .ql-ui {
            display: none;
          }
          .quill-content li {
            margin-bottom: 0.5em;
            padding-left: 0.5rem;
          }
          /* --- BLOCKQUOTE --- */
          .quill-content blockquote {
            border-left: none;
            font-style: italic;
            color: hsl(var(--foreground));
            margin: 3em 0;
            background: hsl(var(--secondary) / 0.3);
            padding: 2.5rem 2rem;
            border-radius: 1.5rem;
            position: relative;
            text-align: center;
            font-size: 1.25em;
            line-height: 1.6;
          }
          .quill-content blockquote::before {
            content: '"';
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            font-family: Georgia, serif;
            font-weight: 900;
            color: hsl(var(--primary));
            font-size: 4rem;
            line-height: 1;
            background: hsl(var(--card));
            padding: 0 10px;
            border-radius: 50%;
          }
          /* --- MEDIA --- */
          .quill-content img {
            border-radius: 1.5rem;
            margin: 2.5em auto;
            max-width: 100%;
            border: 1px solid hsl(var(--border) / 0.5);
            box-shadow: 0 10px 30px -10px hsl(var(--primary) / 0.05);
          }
          .quill-content iframe {
            width: 100%;
            aspect-ratio: 16/9;
            border-radius: 1.5rem;
            margin: 2.5em 0;
            border: none;
          }
        `}</style>
      </section>

      {/* 🌟 4. GALERI FOTO (Dokumentasi) */}
      {gallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16 border-t border-border/50">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-4">
              <Images className="w-8 h-8 text-primary" /> Lensa Dokumentasi
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Potret nyata perjalanan, aktivitas, dan senyum masyarakat di
              lapangan.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {gallery.map((img, index) => (
              <motion.div
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                variants={fadeInUp}
                className="w-full aspect-square rounded-[2.5rem] overflow-hidden group cursor-zoom-in shadow-sm border border-border bg-muted relative"
              >
                <div className="absolute inset-0 bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-multiply flex items-center justify-center backdrop-blur-[2px]">
                  <span className="bg-background/90 text-foreground px-4 py-2 rounded-full text-sm font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-all delay-100 transform translate-y-4 group-hover:translate-y-0">
                    Lihat Penuh
                  </span>
                </div>
                <img
                  src={img.file_url}
                  alt={`Dokumentasi Program ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* 🌟 5. LIGHTBOX / OVERLAY MODAL */}
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
            {/* Tombol Close di Pojok Kanan Atas */}
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-6 right-6 md:top-8 md:right-8 p-3 bg-secondary/50 hover:bg-destructive hover:text-destructive-foreground rounded-full transition-colors z-50 group shadow-lg"
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
              className="absolute left-4 md:left-10 p-3 md:p-4 bg-background/50 hover:bg-primary hover:text-primary-foreground border border-border rounded-full transition-colors z-50 shadow-lg"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Kontainer Gambar Besar */}
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

            {/* Tombol Panah Kanan */}
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

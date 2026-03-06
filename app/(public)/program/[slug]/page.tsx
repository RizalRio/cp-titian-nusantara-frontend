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
  hidden: { opacity: 0, y: 30 },
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
    // Kunci scroll body saat lightbox terbuka
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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-primary font-medium animate-pulse">
          Menyiapkan cerita program...
        </p>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-secondary/10 text-foreground font-sans pb-32">
      {/* 🌟 1. HERO SECTION */}
      <section className="relative w-full pt-32 pb-28 px-4 lg:px-8 bg-primary overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-black/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center flex flex-col items-center">
          <Link
            href={
              project.service ? `/layanan/${project.service.slug}` : "/layanan"
            }
            className="inline-flex items-center text-primary-foreground/80 hover:text-primary-foreground font-medium transition-colors mb-10 group bg-primary-foreground/10 px-5 py-2 rounded-full backdrop-blur-sm border border-primary-foreground/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Kembali ke {project.service?.name || "Layanan"}
          </Link>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground tracking-tight leading-tight mb-8"
          >
            {project.title}
          </motion.h1>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-4 text-primary-foreground/90 mb-8"
          >
            {project.location && (
              <div className="flex items-center bg-black/20 px-5 py-2.5 rounded-full backdrop-blur-md text-sm font-medium border border-white/10">
                <MapPin className="w-4 h-4 mr-2" /> {project.location}
              </div>
            )}
            {(project.start_date || project.end_date) && (
              <div className="flex items-center bg-black/20 px-5 py-2.5 rounded-full backdrop-blur-md text-sm font-medium border border-white/10">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(project.start_date)}{" "}
                {project.end_date && `- ${formatDate(project.end_date)}`}
              </div>
            )}
          </motion.div>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed"
          >
            {project.summary}
          </motion.p>
        </div>
      </section>

      {/* 🌟 2. METRIK (Angka Dampak) */}
      {project.metrics && project.metrics.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 lg:px-8 relative z-20 -mt-14 mb-16">
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
                  className="bg-card p-6 md:p-8 rounded-[24px] shadow-xl shadow-primary/5 border border-border text-center flex flex-col justify-center transform hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="text-4xl md:text-5xl font-black text-primary mb-2 flex items-baseline justify-center gap-1">
                    {metric.metric_value}
                    {metric.metric_unit && (
                      <span className="text-lg font-bold text-muted-foreground">
                        {metric.metric_unit}
                      </span>
                    )}
                  </div>
                  <p className="text-sm md:text-base font-semibold text-muted-foreground line-clamp-2">
                    {metric.metric_label}
                  </p>
                </motion.div>
              ))}
          </motion.div>
        </section>
      )}

      {/* 🌟 3. GAMBAR UTAMA (Thumbnail) */}
      {thumbnail && (
        <section className="max-w-5xl mx-auto px-4 lg:px-8 mb-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="w-full aspect-video md:aspect-[21/9] rounded-[32px] md:rounded-[40px] overflow-hidden shadow-lg border border-border bg-muted"
          >
            <img
              src={thumbnail}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </section>
      )}

      {/* 🌟 4. CERITA LENGKAP (Rich Text) */}
      <section className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="bg-card border border-border rounded-[40px] p-8 md:p-12 lg:p-16 shadow-sm"
        >
          <div className="border-b border-border pb-8 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-4">
              <span className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <LayoutTemplate className="w-6 h-6 text-primary" />
              </span>
              Cerita Program
            </h2>
          </div>

          <div
            className="quill-content text-lg text-muted-foreground leading-[1.9]"
            dangerouslySetInnerHTML={{ __html: project.description }}
          />
        </motion.div>

        {/* Styling Khusus Konten Quill */}
        <style jsx global>{`
          .quill-content p {
            margin-bottom: 1.5em;
          }
          .quill-content h2 {
            font-size: 2rem;
            color: hsl(var(--foreground));
            font-weight: 800;
            margin-top: 2em;
            margin-bottom: 1em;
          }
          .quill-content h3 {
            font-size: 1.5rem;
            color: hsl(var(--foreground));
            font-weight: 700;
            margin-top: 1.5em;
            margin-bottom: 0.75em;
          }
          .quill-content ul {
            list-style-type: disc;
            padding-left: 1.5rem;
            margin-bottom: 1.5em;
          }
          .quill-content blockquote {
            border-left: 4px solid hsl(var(--primary));
            padding-left: 1.5rem;
            color: hsl(var(--muted-foreground));
            font-style: italic;
            margin: 2em 0;
            background: hsl(var(--secondary) / 0.5);
            padding: 1.5rem;
            border-radius: 0 16px 16px 0;
          }
          .quill-content img {
            border-radius: 24px;
            margin: 2em 0;
            max-width: 100%;
            border: 1px solid hsl(var(--border));
          }
          .quill-content iframe {
            width: 100%;
            aspect-ratio: 16/9;
            border-radius: 24px;
            margin: 2em 0;
          }
        `}</style>
      </section>

      {/* 🌟 5. GALERI FOTO */}
      {gallery.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 lg:px-8 py-20 mt-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
              <Images className="w-8 h-8 text-primary" /> Galeri Dokumentasi
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Potret nyata perjalanan dan aktivitas program di lapangan.
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
                onClick={() => setSelectedImageIndex(index)} // <-- Trigger Lightbox
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
                  alt={`Galeri ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </motion.div>
            ))}
          </motion.div>
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
            onClick={() => setSelectedImageIndex(null)} // Klik diluar foto untuk tutup
          >
            {/* Tombol Close di Pojok Kanan Atas */}
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-6 right-6 md:top-8 md:right-8 p-3 bg-secondary/50 hover:bg-primary hover:text-primary-foreground rounded-full transition-colors z-50 group"
            >
              <X className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-90 transition-transform" />
            </button>

            {/* Tombol Panah Kiri */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Mencegah klik tembus ke background
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
              onClick={(e) => e.stopPropagation()} // Mencegah klik di area gambar agar tidak tertutup
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
                e.stopPropagation(); // Mencegah klik tembus ke background
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

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Sprout,
  BarChart3,
  Images,
  LayoutTemplate,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

// 🌟 INTERFACE
interface ProjectMetric {
  metric_label: string;
  metric_value: number;
  metric_unit: string;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center">
        <Sprout className="w-12 h-12 text-[#2D4A22] animate-bounce mb-4" />
        <p className="text-[#2D4A22] font-medium animate-pulse">
          Menyiapkan cerita program...
        </p>
      </div>
    );
  }

  if (!project) return null;

  // Pemilahan Media
  const thumbnail = project.media?.find(
    (m) => m.media_type === "thumbnail",
  )?.file_url;
  const gallery =
    project.media?.filter((m) => m.media_type === "gallery") || [];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 font-sans pb-32">
      {/* 🌟 1. HERO SECTION */}
      <section className="relative w-full pt-32 pb-24 px-6 lg:px-12 bg-[#2D4A22] overflow-hidden">
        {/* Ornamen Background */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-black/10 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <Link
            href={
              project.service ? `/layanan/${project.service.slug}` : "/layanan"
            }
            className="inline-flex items-center text-white/70 hover:text-white font-medium transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Kembali ke {project.service?.name || "Layanan"}
          </Link>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6"
          >
            {project.title}
          </motion.h1>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-4 text-white/80 mb-8"
          >
            {project.location && (
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <MapPin className="w-4 h-4 mr-2" /> {project.location}
              </div>
            )}
            {(project.start_date || project.end_date) && (
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
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
            className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            {project.summary}
          </motion.p>
        </div>
      </section>

      {/* 🌟 2. METRIK (Angka Dampak) - Overlapping the Hero */}
      {project.metrics && project.metrics.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 lg:px-12 relative z-20 -mt-12 mb-16">
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
                  className="bg-white p-6 rounded-[24px] shadow-xl shadow-[#2D4A22]/10 border border-slate-100 text-center flex flex-col justify-center transform hover:-translate-y-1 transition-transform"
                >
                  <div className="text-3xl md:text-4xl font-extrabold text-[#2D4A22] mb-1 flex items-baseline justify-center gap-1">
                    {metric.metric_value}
                    {metric.metric_unit && (
                      <span className="text-base font-semibold text-slate-500">
                        {metric.metric_unit}
                      </span>
                    )}
                  </div>
                  <p className="text-sm md:text-base font-medium text-slate-600 line-clamp-2">
                    {metric.metric_label}
                  </p>
                </motion.div>
              ))}
          </motion.div>
        </section>
      )}

      {/* 🌟 3. GAMBAR UTAMA (Thumbnail) */}
      {thumbnail && (
        <section className="max-w-5xl mx-auto px-6 lg:px-12 mb-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="w-full aspect-video md:aspect-[21/9] rounded-[40px] overflow-hidden shadow-2xl shadow-[#2D4A22]/5"
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
      <section className="max-w-3xl mx-auto px-6 lg:px-12 py-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <LayoutTemplate className="w-8 h-8 text-[#2D4A22]" /> Cerita Program
          </h2>
          <div
            className="quill-content text-lg text-slate-700 leading-[1.9]"
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
            color: #0f172a;
            font-weight: 800;
            margin-top: 2em;
            margin-bottom: 1em;
          }
          .quill-content h3 {
            font-size: 1.5rem;
            color: #1e293b;
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
            border-left: 4px solid #2d4a22;
            padding-left: 1.5rem;
            color: #475569;
            font-style: italic;
            margin: 2em 0;
          }
          .quill-content img {
            border-radius: 24px;
            margin: 2em 0;
            max-width: 100%;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
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
        <section className="max-w-6xl mx-auto px-6 lg:px-12 py-24 border-t border-slate-200/50 mt-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
              <Images className="w-8 h-8 text-[#2D4A22]" /> Galeri Dokumentasi
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Potret nyata perjalanan program di lapangan.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {gallery.map((img, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="w-full aspect-square rounded-[32px] overflow-hidden group cursor-pointer shadow-sm border border-slate-100"
              >
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
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  HeartHandshake,
  Leaf,
  Sprout,
  Target,
  FolderKanban,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

// 🌟 INTERFACE SESUAI DTO BACKEND
interface ServiceDetail {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  impact_points: string[];
  cta_text: string;
  cta_link: string;
  media?: { file_url: string; media_type: string }[];
}

interface ProjectMetric {
  metric_label: string;
  metric_value: number;
  metric_unit: string;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  location: string;
  media?: { file_url: string; media_type: string }[];
  metrics?: ProjectMetric[];
}

// 🌟 ANIMASI FRAMER MOTION
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

export default function LayananDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [service, setService] = useState<ServiceDetail | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🌟 FETCH DATA LAYANAN & CONTOH PROGRAM
  useEffect(() => {
    const fetchServiceAndProjects = async () => {
      try {
        // 1. Fetch Layanan
        const resService = await api.get(`/api/v1/services/slug/${slug}`);
        const serviceData = resService.data.data;
        setService(serviceData);

        // 2. Fetch Contoh Program berdasarkan service_id
        if (serviceData?.id) {
          const resProjects = await api.get(
            `/api/v1/projects?service_id=${serviceData.id}&limit=4&status=published`,
          );
          setProjects(resProjects.data.data || []);
        }
      } catch (error) {
        console.error("Gagal memuat data:", error);
        router.push("/layanan");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchServiceAndProjects();
  }, [slug, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Sprout className="w-12 h-12 text-primary animate-bounce mb-4" />
        <p className="text-primary font-medium animate-pulse">
          Merajut wawasan ekosistem...
        </p>
      </div>
    );
  }

  if (!service) return null;

  const thumbnail = service.media?.find(
    (m) => m.media_type === "thumbnail",
  )?.file_url;

  return (
    <div className="min-h-screen bg-secondary/10 text-foreground font-sans selection:bg-primary selection:text-primary-foreground pb-32">
      {/* 🌟 1. HERO / BANNER */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-primary">
        {/* Ornamen Background */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-black/10 rounded-full blur-3xl pointer-events-none z-0" />

        {thumbnail && (
          <div className="absolute inset-0 z-0">
            <img
              src={thumbnail}
              alt={service.name}
              className="w-full h-full object-cover opacity-20 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
          </div>
        )}

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
          <Link
            href="/layanan"
            className="inline-flex items-center rounded-full border border-white/30 bg-white/20 px-4 py-1.5 text-sm font-medium text-white mb-6 backdrop-blur-sm hover:bg-white/40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Ekosistem Layanan
          </Link>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground tracking-tight leading-tight mb-6"
          >
            {service.name}
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed"
          >
            {service.short_description}
          </motion.p>
        </div>
      </section>

      {/* 🌟 2. NARASI KONTEKS (2 KOLOM: Teks & Gambar) */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="order-2 lg:order-1"
          >
            <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
              <Leaf className="w-8 h-8 text-primary" /> Narasi Konteks
            </h2>
            <div
              className="quill-content text-lg text-muted-foreground leading-[1.8]"
              dangerouslySetInnerHTML={{ __html: service.description }}
            />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="order-1 lg:order-2"
          >
            <div className="w-full aspect-square md:aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl shadow-primary/10 border-4 border-background relative bg-muted">
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt="Ilustrasi Narasi"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
                  <Sprout className="w-24 h-24 text-primary/20" />
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Styling Khusus Konten Quill disesuaikan Tema */}
        <style jsx global>{`
          .quill-content p {
            margin-bottom: 1.5em;
          }
          .quill-content h2,
          .quill-content h3 {
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
        `}</style>
      </section>

      {/* 🌟 4. CONTOH PROGRAM */}
      <section className="py-24 max-w-7xl mx-auto px-4 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="mb-16 max-w-3xl"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center gap-3">
            <FolderKanban className="w-8 h-8 text-primary" /> Contoh Program
            Terkait
          </h2>
          <p className="text-lg text-muted-foreground">
            Implementasi langsung dari layanan {service.name} yang menyentuh
            masyarakat di berbagai wilayah.
          </p>
        </motion.div>

        {projects.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-[32px] border border-border shadow-sm">
            <FolderKanban className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">
              Contoh program sedang dalam tahap penyusunan dokumentasi.
            </p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {projects.map((project) => {
              const projectThumb = project.media?.find(
                (m) => m.media_type === "thumbnail",
              )?.file_url;
              return (
                <motion.div
                  key={project.id}
                  variants={fadeInUp}
                  className="bg-card rounded-[32px] border border-border shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-500 group overflow-hidden flex flex-col"
                >
                  {projectThumb && (
                    <div className="w-full h-56 bg-muted overflow-hidden relative">
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-multiply" />
                      <img
                        src={projectThumb}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  )}
                  <div className="p-8 flex flex-col flex-grow">
                    {project.location && (
                      <span className="text-sm font-semibold text-primary flex items-center gap-1.5 mb-3 bg-primary/5 w-fit px-3 py-1 rounded-full border border-primary/10">
                        <MapPin className="w-4 h-4" /> {project.location}
                      </span>
                    )}
                    <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-8 flex-grow line-clamp-3">
                      {project.summary}
                    </p>

                    <Link
                      href={`/program/${project.slug}`}
                      className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3.5 bg-secondary/50 border border-border text-foreground font-bold rounded-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                    >
                      Pelajari Program
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>

      {/* 🌟 3. DAMPAK YANG DIHASILKAN */}
      {service.impact_points && service.impact_points.length > 0 && (
        <section className="bg-background py-24 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              className="mb-16 max-w-3xl"
            >
              <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center gap-3">
                <Target className="w-8 h-8 text-primary" /> Dampak yang
                Dihasilkan
              </h2>
              <p className="text-lg text-muted-foreground">
                Perubahan nyata dan terukur yang menjadi target serta telah
                terwujud melalui ekosistem ini.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {service.impact_points.map((impact, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-card p-8 rounded-[32px] border border-border hover:shadow-md hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-7 h-7 text-primary" />
                  </div>
                  <p className="text-foreground leading-relaxed font-medium text-lg">
                    {impact}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* 🌟 5. CTA KOLABORASI */}
      <section className="max-w-5xl mx-auto px-4 lg:px-8 pt-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="bg-primary rounded-[40px] p-10 md:p-16 text-center text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/20"
        >
          <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-5%] w-48 h-48 bg-black/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <HeartHandshake className="w-16 h-16 mx-auto mb-6 text-primary-foreground/90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Mulai Perubahan Bersama Kami
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Percaya pada visi yang sama? Bergabunglah sebagai mitra strategis
              untuk memperluas jangkauan layanan {service.name} ke seluruh
              penjuru negeri.
            </p>

            <Link
              href={service.cta_link || "/hubungi-kami"}
              className="inline-flex items-center px-10 py-4 bg-background text-primary text-lg font-bold rounded-full hover:bg-secondary hover:scale-105 transition-all duration-300 shadow-xl"
            >
              {service.cta_text || "Mulai Kolaborasi"}{" "}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

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
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

// 🌟 INTERFACE
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

export default function LayananDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [service, setService] = useState<ServiceDetail | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServiceAndProjects = async () => {
      setIsLoading(true);
      try {
        const resService = await api.get(`/api/v1/services/slug/${slug}`);
        const serviceData = resService.data.data;
        setService(serviceData);

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
      <div className="min-h-screen bg-[#F9F9F7] dark:bg-background flex flex-col items-center justify-center">
        <Sprout className="w-12 h-12 text-primary animate-bounce mb-4 opacity-50" />
        <p className="text-primary font-medium animate-pulse tracking-widest uppercase text-sm">
          Menyusun Ekosistem...
        </p>
      </div>
    );
  }

  if (!service) return null;

  const thumbnail = service.media?.find(
    (m) => m.media_type === "thumbnail",
  )?.file_url;

  return (
    <div className="min-h-screen bg-[#F9F9F7] dark:bg-background text-foreground font-sans pb-32">
      {/* 🌟 1. HERO / BANNER SECTION (Full Width Editorial) */}
      <section className="relative w-full h-[75vh] min-h-[600px] flex items-end justify-center overflow-hidden bg-primary/95">
        <div className="absolute inset-0 bg-black/40 z-10" />{" "}
        {/* Overlay Gelap Halus */}
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={service.name}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary to-secondary/50 flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
            <Leaf className="w-40 h-40 text-white/10" />
          </div>
        )}
        <div className="absolute top-32 left-0 right-0 z-20 container mx-auto px-6">
          <Link
            href="/layanan"
            className="inline-flex items-center rounded-full border border-white/20 bg-black/20 px-5 py-2 text-sm font-medium text-white backdrop-blur-md hover:bg-black/40 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Katalog Layanan
          </Link>
        </div>
        <div className="relative z-20 container mx-auto px-6 lg:px-8 pb-20 w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-5xl"
          >
            <motion.div
              variants={fadeInUp}
              className="mb-6 inline-flex items-center rounded-full px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase text-white bg-white/20 backdrop-blur-md border border-white/30"
            >
              <Sparkles className="w-3.5 h-3.5 mr-2 text-amber-300" /> Ekosistem
              Pilar
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-[5rem] font-extrabold text-white tracking-tight leading-[1.1] mb-6 text-balance"
            >
              {service.name}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-white/90 max-w-3xl leading-relaxed font-medium"
            >
              {service.short_description}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 🌟 2. NARASI KONTEKS (Deskripsi Panjang HTML) */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="lg:col-span-8 lg:pr-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10 flex items-center gap-4">
              <div className="w-10 h-1 bg-primary rounded-full" />
              Narasi Konteks
            </h2>

            {/* RENDERER QUILL HTML */}
            <div
              className="quill-content text-lg md:text-[1.2rem] text-muted-foreground leading-[1.9] font-medium"
              dangerouslySetInnerHTML={{ __html: service.description }}
            />
          </motion.div>

          {/* Kolom Kanan: Card Mini CTA & Abstrak */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:col-span-4 lg:sticky lg:top-32 space-y-8"
          >
            <div className="w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/10 border border-border/50 relative bg-muted hidden lg:block">
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt="Ilustrasi"
                  className="w-full h-full object-cover opacity-80"
                />
              ) : (
                <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
                  <Sprout className="w-24 h-24 text-primary/20" />
                </div>
              )}
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-8 text-center">
              <HeartHandshake className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2 text-foreground">
                Tertarik berkolaborasi?
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Hubungi kami untuk merancang program ini di daerah Anda.
              </p>
              <Link
                href={service.cta_link || "/hubungi-kami"}
                className="block w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors"
              >
                {service.cta_text || "Mulai Diskusi"}
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Styling CSS Khusus Quill */}
        <style jsx global>{`
          .quill-content p {
            margin-bottom: 1.8em;
            color: hsl(var(--foreground) / 0.8);
          }
          .quill-content h2,
          .quill-content h3 {
            color: hsl(var(--foreground));
            font-weight: 800;
            margin-top: 2em;
            margin-bottom: 1em;
            letter-spacing: -0.02em;
          }
          .quill-content h2 {
            font-size: 2rem;
          }
          .quill-content h3 {
            font-size: 1.5rem;
          }
          .quill-content ul {
            list-style-type: disc;
            padding-left: 1.5rem;
            margin-bottom: 2em;
            color: hsl(var(--foreground) / 0.8);
          }
          .quill-content li {
            margin-bottom: 0.5em;
          }
          .quill-content a {
            color: hsl(var(--primary));
            text-decoration: underline;
            font-weight: 600;
          }
        `}</style>
      </section>

      {/* 🌟 3. DAMPAK YANG DIHASILKAN (Bento Grid Style) */}
      {service.impact_points && service.impact_points.length > 0 && (
        <section className="bg-card py-32 border-y border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              className="text-center mb-20"
            >
              <Target className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
                Dampak Terukur
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Perubahan nyata yang telah dan akan terus menjadi target wujud
                dari ekosistem layanan ini.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {service.impact_points.map((impact, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-background p-8 rounded-[2.5rem] border border-border/60 hover:shadow-xl hover:border-primary/30 transition-all duration-500 flex items-start gap-5 group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                    <CheckCircle2 className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <p className="text-foreground leading-relaxed font-medium text-lg pt-2">
                    {impact}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* 🌟 4. CONTOH PROGRAM TERKAIT */}
      <section className="py-32 max-w-7xl mx-auto px-4 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Aksi Nyata di Lapangan
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Lihat bagaimana pilar {service.name} diimplementasikan langsung ke
              dalam masyarakat.
            </p>
          </div>
        </motion.div>

        {projects.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-[3rem] border border-border border-dashed shadow-sm">
            <FolderKanban className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              Dokumentasi program sedang dalam tahap kurasi.
            </p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
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
                  className="bg-card rounded-[3rem] border border-border shadow-sm hover:shadow-2xl hover:border-primary/30 transition-all duration-500 group overflow-hidden flex flex-col p-4"
                >
                  {/* Thumbnail Kartu Program */}
                  <div className="w-full aspect-[16/9] md:aspect-[4/3] bg-muted rounded-[2.5rem] overflow-hidden relative">
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-overlay" />
                    {projectThumb ? (
                      <img
                        src={projectThumb}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary/20 flex items-center justify-center">
                        <FolderKanban className="w-16 h-16 text-primary/20" />
                      </div>
                    )}
                    {project.location && (
                      <div className="absolute top-4 left-4 z-20 bg-background/90 backdrop-blur-sm px-4 py-1.5 rounded-full border border-border/50 flex items-center gap-1.5 text-xs font-bold tracking-wide text-foreground shadow-sm">
                        <MapPin className="w-3.5 h-3.5 text-primary" />{" "}
                        {project.location}
                      </div>
                    )}
                  </div>

                  {/* Konten Kartu Program */}
                  <div className="p-6 md:p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl md:text-3xl font-extrabold text-foreground mb-4 group-hover:text-primary transition-colors leading-[1.2]">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-8 flex-grow line-clamp-3 text-[1.05rem]">
                      {project.summary}
                    </p>

                    <Link
                      href={`/program/${project.slug}`}
                      className="inline-flex items-center justify-between w-full pt-6 border-t border-border/50 text-foreground font-bold group-hover:text-primary transition-colors"
                    >
                      <span>Pelajari Program Secara Utuh</span>
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>

      {/* 🌟 5. CTA BOTTOM */}
      <section className="max-w-6xl mx-auto px-4 lg:px-8 pt-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="bg-primary rounded-[4rem] p-10 md:p-20 text-center text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/20"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-60" />
          <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <HeartHandshake className="w-16 h-16 mx-auto mb-8 text-primary-foreground/90" />
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-balance">
              Mulai Perubahan Bersama Kami
            </h2>
            <p className="text-primary-foreground/80 text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              Percaya pada visi yang sama? Bergabunglah sebagai mitra strategis
              untuk memperluas jangkauan layanan{" "}
              <strong className="text-white">"{service.name}"</strong> ke
              seluruh penjuru negeri.
            </p>

            <Link
              href={service.cta_link || "/hubungi-kami"}
              className="inline-flex items-center px-10 py-5 bg-background text-primary text-lg font-extrabold rounded-full hover:scale-105 transition-transform duration-300 shadow-xl tracking-wide"
            >
              {service.cta_text || "Diskusikan Kolaborasi"}
              <ArrowRight className="w-6 h-6 ml-3" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Heart,
  Leaf,
  Scale,
  Star,
  Shield,
  Quote,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import api from "@/lib/api";

// 🌟 Pemetaan Ikon Dinamis
const IconMap: Record<string, any> = {
  Heart,
  Scale,
  Leaf,
  Compass,
  Star,
  Shield,
};

// 🌟 Interface
interface ValueItem {
  title: string;
  icon: string;
  description: string;
}

interface HomeContent {
  hero_title: string;
  hero_subtitle: string;
  manifesto_quote: string;
  values?: ValueItem[];
}

interface ServiceData {
  id: string;
  name: string;
  slug: string;
  short_description?: string;
}

interface TestimonialData {
  id: string;
  author_name: string;
  author_role: string;
  content: string;
  avatar_url?: string;
}

// --- Variabel Animasi Masuk (Entry Animations) ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export function HomeTemplate({ content }: { content: HomeContent }) {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  // Testimoni disiapkan jika nanti Anda ingin merendernya di Home
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/api/v1/services?is_flagship=true&limit=3");
        setServices(res.data.data || []);
      } catch (error) {
        console.error("Gagal memuat ekosistem layanan:", error);
      } finally {
        setIsLoadingServices(false);
      }
    };

    const fetchTestimonials = async () => {
      try {
        const res = await api.get("/api/v1/testimonials");
        const allTestimonials = res.data.data || [];
        setTestimonials(allTestimonials.slice(0, 5));
      } catch (error) {
        console.error("Gagal memuat testimoni:", error);
      } finally {
        setIsLoadingTestimonials(false);
      }
    };

    fetchServices();
    fetchTestimonials();
  }, []);

  return (
    <div className="flex flex-col w-full bg-background font-sans text-foreground overflow-hidden selection:bg-primary/20 selection:text-primary">
      {/* 🌟 1. HERO SECTION (Ringan & Optimal) */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-4 lg:px-8 bg-[#F9F9F7] dark:bg-background">
        {/* Background Visuals - Menggunakan CSS native blur & gradient agar tidak membebani GPU */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Tekstur Noise */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

          {/* Ornamen Blobs Statis & CSS Pulse (Sangat ringan diload) */}
          <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-secondary/20 rounded-full blur-3xl"></div>
          <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Konten Hero (Pusat) */}
        <div className="container mx-auto max-w-5xl z-10 relative flex flex-col items-center text-center mt-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8 w-full"
          >
            {/* Lencana (Badge) */}
            <motion.div variants={fadeInUp} className="flex justify-center">
              <div className="inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold text-primary bg-background/80 backdrop-blur-sm border border-primary/20 shadow-sm">
                <Sparkles className="w-4 h-4 mr-2.5 text-amber-500" />
                <span className="tracking-widest uppercase text-[11px]">
                  Merajut Dampak Berkelanjutan
                </span>
              </div>
            </motion.div>

            {/* Judul Utama */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-[5.5rem] font-extrabold tracking-tight text-foreground leading-[1.05] text-balance"
            >
              {content.hero_title || "Menyemai Harapan, Menuai Perubahan."}
            </motion.h1>

            {/* Teks Pendukung */}
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-medium text-balance"
            >
              {content.hero_subtitle ||
                "Ruang kolaborasi akar rumput yang menempatkan manusia sebagai pusat perjalanan. Bersama wujudkan ekosistem inklusif."}
            </motion.p>

            {/* Tombol Aksi */}
            <motion.div
              variants={fadeInUp}
              className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                size="lg"
                className="h-14 px-10 text-base font-bold tracking-wide rounded-full shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 group w-full sm:w-auto"
                asChild
              >
                <Link href="/kolaborasi">
                  Mari Berkolaborasi
                  <ArrowRight className="ml-2.5 w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 text-base font-bold tracking-wide rounded-full bg-background/50 backdrop-blur-sm border-border hover:bg-background hover:text-primary transition-all duration-300 w-full sm:w-auto"
                asChild
              >
                <Link href="/layanan">Jelajahi Program</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Transisi Halus (Gradient Mask) di Bawah Hero */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"></div>
      </section>

      {/* 🌟 2. KOMPAS MORAL (NILAI KAMI) */}
      <section className="py-32 relative z-20 bg-background">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              Kompas Moral
            </h2>
            <div className="w-16 h-1 bg-primary rounded-full mx-auto mb-6"></div>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Prinsip dasar yang memastikan setiap langkah pergerakan kita tetap
              membumi dan relevan dengan kebutuhan.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {(content.values || []).map((item, idx) => {
              const IconComponent = IconMap[item.icon] || Leaf;

              return (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="group p-8 rounded-[2rem] bg-card border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                >
                  {/* Latar hover subtle */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary transition-all duration-500">
                      <IconComponent className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 🌟 3. EKOSISTEM LAYANAN */}
      <section className="py-32 bg-secondary/10 px-4 lg:px-8 border-y border-border">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div className="max-w-2xl space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Ekosistem Layanan
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Jelajahi berbagai ruang inisiatif kami. Setiap ekosistem adalah
                jembatan menuju perubahan yang lebih inklusif.
              </p>
            </div>

            {!isLoadingServices && services.length > 0 && (
              <Button
                size="lg"
                className="rounded-full px-8 h-14 text-base font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-300 w-full md:w-auto shrink-0"
                asChild
              >
                <Link href="/layanan">
                  Semua Layanan
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            )}
          </motion.div>

          {isLoadingServices ? (
            <div className="flex flex-col items-center justify-center py-20 w-full">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-primary font-medium animate-pulse">
                Memuat Ekosistem Layanan...
              </p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-[32px] border border-border shadow-sm">
              <Leaf className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">
                Belum ada ekosistem layanan unggulan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((layanan, idx) => (
                <motion.div
                  key={layanan.id || idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  transition={{ delay: idx * 0.1 }}
                  className="h-full"
                >
                  <Link
                    href={`/layanan/${layanan.slug}`}
                    className="block flex flex-col h-full p-8 md:p-10 rounded-[2.5rem] bg-card border border-border shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/40 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 relative z-10">
                      <Leaf className="w-7 h-7" />
                    </div>

                    <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors relative z-10">
                      {layanan.name}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-10 flex-grow line-clamp-3 relative z-10">
                      {layanan.short_description ||
                        "Jelajahi lebih lanjut mengenai ekosistem layanan ini dan dampaknya bagi masyarakat sekitar."}
                    </p>

                    <div className="mt-auto pt-6 border-t border-border/50 relative z-10">
                      <div className="flex items-center justify-between text-primary font-semibold tracking-wide text-base group-hover:px-2 transition-all duration-300">
                        <span>Mulai perjalanan</span>
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 🌟 4. QUOTE MANIFESTO */}
      <section className="py-40 relative flex items-center justify-center overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent animate-pulse-slow"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="container mx-auto max-w-5xl relative z-10 text-center px-4"
        >
          <Quote className="w-16 h-16 text-white/50 mx-auto mb-10" />
          <blockquote className="text-4xl md:text-5xl lg:text-6xl/tight font-bold tracking-tight leading-tight text-balance">
            "
            {content.manifesto_quote ||
              "Manusia sebagai pusat, keberagaman sebagai kekuatan. Melangkah bersama untuk dampak yang lebih luas."}
            "
          </blockquote>
          <div className="mt-16 flex flex-col items-center justify-center gap-6">
            <div className="h-1 w-24 bg-white/30 rounded-full" />
            <span className="font-bold tracking-[0.2em] uppercase text-sm text-white/80">
              Titian Nusantara
            </span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import api from "@/lib/api";

// 🌟 Pemetaan Ikon Dinamis
const IconMap: Record<string, any> = {
  Heart: Heart,
  Scale: Scale,
  Leaf: Leaf,
  Compass: Compass,
  Star: Star,
  Shield: Shield,
};

// 🌟 Update Tipe Data
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

// 🌟 Interface untuk Data Dinamis
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

// --- Variabel Animasi (Framer Motion) ---
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const blobAnimation = {
  animate: {
    scale: [1, 1.1, 1],
    rotate: [0, 90, 0],
    borderRadius: [
      "60% 40% 30% 70% / 60% 30% 70% 40%",
      "30% 60% 70% 40% / 50% 60% 30% 60%",
      "60% 40% 30% 70% / 60% 30% 70% 40%",
    ],
    transition: { duration: 20, repeat: Infinity, ease: "easeInOut" },
  },
};

export function HomeTemplate({ content }: { content: HomeContent }) {
  // 🌟 State untuk Ekosistem Layanan
  const [services, setServices] = useState<ServiceData[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  // 🌟 State untuk Testimoni
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true);

  // 🌟 Fetch Data dari API
  useEffect(() => {
    // Fetch Services
    const fetchServices = async () => {
      try {
        const res = await api.get("/api/v1/services");
        setServices(res.data.data || []);
      } catch (error) {
        console.error("Gagal memuat ekosistem layanan:", error);
      } finally {
        setIsLoadingServices(false);
      }
    };

    // Fetch Testimonials
    const fetchTestimonials = async () => {
      try {
        const res = await api.get("/api/v1/testimonials");
        const allTestimonials = res.data.data || [];

        // Membatasi 5 data di state
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
    <div className="flex flex-col w-full bg-background font-sans text-foreground overflow-hidden">
      {/* 🌟 1. HERO SECTION MODERN (Organic & Animated) */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden px-4 lg:px-8 bg-[#FAF9F6] dark:bg-background">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            variants={blobAnimation}
            animate="animate"
            className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-primary/10 mix-blend-multiply filter blur-3xl opacity-70 dark:mix-blend-soft-light"
          />
          <motion.div
            variants={blobAnimation}
            animate="animate"
            transition={{ delay: 5 }}
            className="absolute top-[40%] -left-[20%] w-[500px] h-[500px] bg-secondary/20 mix-blend-multiply filter blur-3xl opacity-60 dark:mix-blend-soft-light"
          />
        </div>

        <div className="container mx-auto max-w-7xl z-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-7 space-y-8"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium text-primary bg-primary/5 border border-primary/10 backdrop-blur-md"
              >
                <Leaf className="w-4 h-4 mr-2" />
                <span className="tracking-wide uppercase text-xs">
                  Ekosistem Dampak Berkelanjutan
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]"
              >
                {content.hero_title ||
                  "Merajut Keberagaman, Menciptakan Dampak."}
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-xl text-muted-foreground leading-relaxed max-w-2xl"
              >
                {content.hero_subtitle ||
                  "Ruang kolaborasi yang menempatkan manusia sebagai pusat perjalanan. Bersama wujudkan masa depan yang inklusif."}
              </motion.p>

              <motion.div variants={fadeInUp} className="pt-6">
                <Button
                  size="lg"
                  className="h-14 px-10 text-base rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                  asChild
                >
                  <Link href="/kolaborasi">
                    Mulai Perjalanan
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
              className="lg:col-span-5 relative h-[500px] hidden lg:flex items-center justify-center"
            >
              <div className="relative z-10 w-[400px] h-[500px] rounded-[100px] bg-gradient-to-br from-primary/80 to-secondary overflow-hidden shadow-2xl transform rotate-3">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>{" "}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Compass className="w-32 h-32 text-white opacity-80" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 100,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -bottom-24 -right-24 w-64 h-64 border-[20px] border-white/10 rounded-full dashed"
                />
              </div>
              <div className="absolute top-10 right-10 w-[380px] h-[480px] rounded-[100px] border-2 border-primary/30 z-0 transform -rotate-3" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🌟 2. NILAI KAMI */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-24"
          >
            <h2 className="text-4xl font-bold tracking-tight text-foreground mb-6">
              Kompas Moral Kami
            </h2>
            <p className="text-xl text-muted-foreground">
              Empat prinsip dasar yang memastikan setiap langkah tetap membumi
              dan relevan.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {(content.values || []).map((item, idx) => {
              const IconComponent = IconMap[item.icon] || Leaf;

              return (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  whileHover={{ y: -10 }}
                  className="group p-8 rounded-3xl bg-background/60 backdrop-blur-lg border border-white/20 shadow-lg dark:border-white/5 dark:bg-white/5 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-8 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 🌟 3. EKOSISTEM LAYANAN (Dinamis dari Database - Dibatasi Maksimal 3) */}
      <section className="py-32 bg-secondary/10 px-4 lg:px-8 border-t border-border">
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
                className="rounded-full px-8 h-12 md:h-14 text-sm md:text-base font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-300 w-full md:w-auto shrink-0"
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
                Belum ada ekosistem layanan yang dipublikasikan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.slice(0, 3).map((layanan, idx) => (
                <Link
                  href={`/layanan/${layanan.slug}`}
                  key={layanan.id || idx}
                  className="block group h-full"
                >
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    transition={{ delay: idx * 0.15 }}
                    className="flex flex-col h-full p-8 md:p-10 rounded-[32px] bg-background border border-border shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-2 transition-all duration-500"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                      <Leaf className="w-7 h-7" />
                    </div>

                    <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                      {layanan.name}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-10 flex-grow line-clamp-3">
                      {layanan.short_description ||
                        "Jelajahi lebih lanjut mengenai ekosistem layanan ini dan dampaknya bagi masyarakat sekitar."}
                    </p>

                    <div className="mt-auto pt-6 border-t border-border/50">
                      <Button
                        variant="outline"
                        className="w-full h-12 rounded-full border-primary/20 text-primary bg-transparent group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 flex items-center justify-between px-6 pointer-events-none"
                      >
                        <span className="font-semibold tracking-wide text-base">
                          Mulai perjalanan
                        </span>
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 🌟 4. TESTIMONI (Dinamis dari Database - Dibatasi Maksimal 5) */}
      {!isLoadingTestimonials && testimonials.length > 0 && (
        <section className="py-32 relative overflow-hidden">
          <Quote className="absolute top-10 left-10 w-64 h-64 text-primary/5 rotate-12 pointer-events-none" />

          <div className="container mx-auto max-w-6xl px-4 text-center relative z-10">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-4xl font-bold tracking-tight text-foreground mb-20"
            >
              Resonansi Perjalanan
            </motion.h2>

            <Carousel className="w-full">
              <CarouselContent>
                {/* 👇 Pembatasan slice(0,5) diletakkan di JSX agar lebih tegas 👇 */}
                {testimonials.slice(0, 5).map((testimoni) => (
                  <CarouselItem key={testimoni.id}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8 }}
                      className="p-6 md:p-12"
                    >
                      <p className="text-3xl md:text-4xl/snug font-medium text-foreground leading-relaxed mb-12 font-serif italic opacity-90 line-clamp-4">
                        "{testimoni.content}"
                      </p>
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-1 bg-primary/30 mb-6 rounded-full"></div>

                        {/* Menampilkan Foto Profil jika ada */}
                        {testimoni.avatar_url && (
                          <img
                            src={testimoni.avatar_url}
                            alt={testimoni.author_name}
                            className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-primary/20 shadow-sm"
                          />
                        )}

                        <h4 className="font-bold text-xl text-foreground">
                          {testimoni.author_name}
                        </h4>
                        <p className="text-primary font-medium tracking-wide text-sm uppercase mt-2">
                          {testimoni.author_role}
                        </p>
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {testimonials.length > 1 && (
                <div className="hidden md:flex justify-center gap-4 mt-8">
                  <CarouselPrevious className="static translate-y-0 bg-background hover:bg-primary hover:text-primary-foreground border-2 border-border h-12 w-12" />
                  <CarouselNext className="static translate-y-0 bg-background hover:bg-primary hover:text-primary-foreground border-2 border-border h-12 w-12" />
                </div>
              )}
            </Carousel>
          </div>
        </section>
      )}

      {/* 🌟 5. QUOTE MANIFESTO */}
      <section className="py-40 relative flex items-center justify-center overflow-hidden bg-foreground text-background">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/40 via-background to-background animate-pulse-slow"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="container mx-auto max-w-5xl relative z-10 text-center px-4"
        >
          <Quote className="w-16 h-16 text-primary mx-auto mb-10 opacity-80" />
          <blockquote className="text-4xl md:text-5xl lg:text-6xl/tight font-bold tracking-tight leading-tight">
            "
            {content.manifesto_quote ||
              "Manusia sebagai pusat, keberagaman sebagai kekuatan. Melangkah bersama untuk dampak yang lebih luas."}
            "
          </blockquote>
          <div className="mt-16 flex flex-col items-center justify-center gap-6">
            <div className="h-1 w-24 bg-primary rounded-full" />
            <span className="font-bold tracking-[0.2em] uppercase text-lg text-primary">
              Titian Nusantara
            </span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ArrowRight, Compass, Heart, Leaf, Scale, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";

interface HomeContent {
  hero_title: string;
  hero_subtitle: string;
  manifesto_quote: string;
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
  // Data Statis (Sama seperti sebelumnya)
  const ekosistemLayanan = [
    {
      title: "Pemberdayaan Komunitas",
      desc: "Membangun kemandirian ekonomi dan sosial masyarakat lokal.",
      href: "/ekosistem/pemberdayaan",
    },
    {
      title: "Konservasi Budaya",
      desc: "Merawat warisan leluhur agar tetap relevan dengan zaman.",
      href: "/ekosistem/konservasi",
    },
    {
      title: "Pendidikan Inklusif",
      desc: "Akses pembelajaran merata bagi seluruh lapisan masyarakat.",
      href: "/ekosistem/pendidikan",
    },
  ];

  const testimoniData = [
    {
      name: "Bapak Sudirman",
      role: "Ketua Adat Desa Karang",
      text: "Titian Nusantara datang bukan untuk merubah, tapi menemani kami merawat apa yang sudah ada menjadi lebih berharga.",
    },
    {
      name: "Siti Aisyah",
      role: "Penggerak UMKM",
      text: "Pendekatan yang sangat membumi. Kami diajak berkolaborasi, bukan sekadar dijadikan objek program.",
    },
    {
      name: "Dr. Hendrawan",
      role: "Akademisi Universitas",
      text: "Visi berkelanjutan yang nyata. Titian Nusantara mengukur keberhasilan dari senyum masyarakat.",
    },
  ];

  return (
    <div className="flex flex-col w-full bg-background font-sans text-foreground overflow-hidden">
      {/* 🌟 1. HERO SECTION MODERN (Organic & Animated) */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden px-4 lg:px-8 bg-[#FAF9F6] dark:bg-background">
        {/* Latar Belakang Organik Bergerak */}
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
            {/* Kiri: Teks dengan Stagger Animation */}
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

            {/* Kanan: Ilustrasi Kompas Abstrak Modern */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
              className="lg:col-span-5 relative h-[500px] hidden lg:flex items-center justify-center"
            >
              <div className="relative z-10 w-[400px] h-[500px] rounded-[100px] bg-gradient-to-br from-primary/80 to-secondary overflow-hidden shadow-2xl transform rotate-3">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>{" "}
                {/* Opsional: Tambahkan tekstur noise halus */}
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

      {/* 🌟 2. NILAI KAMI (Glassmorphism & Floating Cards) */}
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
            {[
              {
                icon: Heart,
                title: "Bermakna",
                desc: "Solusi dari akar rumput yang menjawab kegelisahan nyata.",
              },
              {
                icon: Scale,
                title: "Adil",
                desc: "Akses setara, meruntuhkan dinding pembatas sosial.",
              },
              {
                icon: Leaf,
                title: "Membumi",
                desc: "Rendah hati, menghargai kearifan dan budaya lokal.",
              },
              {
                icon: Compass,
                title: "Berkelanjutan",
                desc: "Membangun ekosistem mandiri yang terus berputar.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="group p-8 rounded-3xl bg-background/60 backdrop-blur-lg border border-white/20 shadow-lg dark:border-white/5 dark:bg-white/5 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-8 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                  <item.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 🌟 3. EKOSISTEM LAYANAN (Refined UI & CTA) */}
      <section className="py-32 bg-secondary/10 px-4 lg:px-8 border-t border-border">
        <div className="container mx-auto max-w-7xl">
          {/* Judul & Pengantar Rata Kiri */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-2xl mb-16 space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Ekosistem Layanan
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Jelajahi berbagai ruang inisiatif kami. Setiap ekosistem adalah
              jembatan menuju perubahan yang lebih inklusif.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ekosistemLayanan.map((layanan, idx) => (
              <Link
                href={layanan.href}
                key={idx}
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
                  {/* Ikon Dekoratif Ekosistem */}
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                    <Leaf className="w-7 h-7" />
                  </div>

                  {/* Teks Konten */}
                  <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                    {layanan.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-10 flex-grow">
                    {layanan.desc}
                  </p>

                  {/* 🌟 CTA YANG DIPERBARUI: Lebar penuh, outline menjadi solid saat hover */}
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
        </div>
      </section>

      {/* 🌟 4. TESTIMONI (Immersive & Clean) */}
      <section className="py-32 relative overflow-hidden">
        {/* Background Decor */}
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
              {testimoniData.map((testimoni, index) => (
                <CarouselItem key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="p-6 md:p-12"
                  >
                    <p className="text-3xl md:text-4xl/snug font-medium text-foreground leading-relaxed mb-12 font-serif italic opacity-90">
                      "{testimoni.text}"
                    </p>
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-1 bg-primary/30 mb-6 rounded-full"></div>
                      <h4 className="font-bold text-xl text-foreground">
                        {testimoni.name}
                      </h4>
                      <p className="text-primary font-medium tracking-wide text-sm uppercase mt-2">
                        {testimoni.role}
                      </p>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:flex justify-center gap-4 mt-8">
              <CarouselPrevious className="static translate-y-0 bg-background hover:bg-primary hover:text-primary-foreground border-2 border-border h-12 w-12" />
              <CarouselNext className="static translate-y-0 bg-background hover:bg-primary hover:text-primary-foreground border-2 border-border h-12 w-12" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* 🌟 5. QUOTE MANIFESTO (Visionary Ending) */}
      <section className="py-40 relative flex items-center justify-center overflow-hidden bg-foreground text-background">
        {/* Animated Wave/Particle Background */}
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

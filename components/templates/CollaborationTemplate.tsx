"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  LayoutGrid,
  ShieldCheck,
  TrendingUp,
  Building,
  Briefcase,
  Globe,
  Handshake,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// --- PEMETAAN IKON ---
const IconMap: Record<string, any> = {
  LayoutGrid,
  ShieldCheck,
  TrendingUp,
  Building,
  Briefcase,
  Globe,
  Handshake,
};

// --- TIPE DATA ---
interface BenefitItem {
  title: string;
  description: string;
  icon: string;
}

export interface KolaborasiData {
  id?: string;
  badge_text: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image?: string;
  penjelasan_title: string;
  penjelasan_teks: string;
  penjelasan_image?: string;
  benefit_title: string;
  benefits: BenefitItem[];
  partner_logos?: string[];
  cta_title: string;
  cta_text: string;
  cta_link: string;
}

// --- VARIABEL ANIMASI ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

export function CollaborationTemplate({
  data,
  slug,
}: {
  data?: KolaborasiData;
  slug?: string;
}) {
  // --- DATA FALLBACK DINAMIS (Berdasarkan Slug dari Navbar) ---
  const fallbackMap: Record<string, KolaborasiData> = {
    "institusi-publik": {
      badge_text: "Sinergi B2G (Pemerintah)",
      hero_title: "Akselerasi Program Publik yang Tepat Sasaran",
      hero_subtitle:
        "Menjadi mitra pelaksana strategis bagi kementerian dan pemerintah daerah untuk memastikan kebijakan pembangunan berdampak langsung pada masyarakat akar rumput.",
      penjelasan_title: "Menjembatani Birokrasi & Realita Lapangan",
      penjelasan_teks:
        "Kami menyadari bahwa visi besar dari pemerintah membutuhkan tangan-tangan terampil di lapangan. Titian Nusantara memfasilitasi implementasi program dengan pendekatan partisipatif, memastikan serapan anggaran efektif, dan birokrasi berjalan seirama dengan kebutuhan dan kearifan masyarakat desa.",
      benefit_title: "Nilai Tambah Sinergi Publik",
      benefits: [
        {
          title: "Implementasi Kebijakan",
          description:
            "Eksekusi program di lapangan yang selaras dengan RPJMD & RPJMN.",
          icon: "Building",
        },
        {
          title: "Pelaporan Akuntabel",
          description:
            "Sistem pelaporan yang transparan dan sesuai dengan standar birokrasi negara.",
          icon: "ShieldCheck",
        },
        {
          title: "Skalabilitas Wilayah",
          description:
            "Jaringan fasilitator kami tersebar luas, memungkinkan program menjangkau wilayah 3T.",
          icon: "Globe",
        },
      ],
      cta_title: "Mari Wujudkan Program Publik yang Berdampak",
      cta_text: "Diskusi dengan Tim Kami",
      cta_link: "/proposal-kerjasama",
    },
    "mitra-industri": {
      badge_text: "Kemitraan B2B (Korporasi)",
      hero_title: "Transformasi CSR Menjadi Nilai Bersama",
      hero_subtitle:
        "Kami merancang dan mengelola dana ESG (Environmental, Social, Governance) perusahaan Anda menjadi program pemberdayaan berkelanjutan yang menguntungkan ekosistem.",
      penjelasan_title: "Lebih dari Sekadar Amal Perusahaan",
      penjelasan_teks:
        "Corporate Social Responsibility (CSR) modern menuntut dampak yang terukur (shared value). Kami mendampingi korporasi dari tahap asesmen wilayah (khususnya area ring 1 operasional), perancangan program, eksekusi langsung, hingga audit dampak sosial yang komprehensif untuk melengkapi laporan keberlanjutan tahunan perusahaan.",
      benefit_title: "Nilai Tambah Kemitraan Industri",
      benefits: [
        {
          title: "Manajemen End-to-End",
          description:
            "Kami mengambil alih beban operasional dengan mengelola program dari hulu ke hilir.",
          icon: "Briefcase",
        },
        {
          title: "Indikator ESG Terukur",
          description:
            "Evaluasi dan pencapaian program diukur berdasarkan standar keberlanjutan global.",
          icon: "TrendingUp",
        },
        {
          title: "Resonansi Brand",
          description:
            "Publikasi kolaboratif untuk memperkuat citra positif dan social license to operate perusahaan.",
          icon: "Handshake",
        },
      ],
      cta_title: "Maksimalkan Dampak Investasi Sosial Anda",
      cta_text: "Ajukan Proposal Kemitraan",
      cta_link: "/proposal-kerjasama",
    },
  };

  // Menentukan konten: Cek apakah slug ada di fallbackMap. Jika tidak, gunakan default "institusi-publik".
  const currentFallback =
    slug && fallbackMap[slug]
      ? fallbackMap[slug]
      : fallbackMap["institusi-publik"];

  // Timpa dengan data dari CMS (jika ada)
  const content = { ...currentFallback, ...data };

  return (
    <div className="flex flex-col w-full bg-background font-sans text-foreground overflow-hidden min-h-screen">
      {/* 🌟 1. HERO SECTION */}
      <section className="relative pt-8 pb-16 lg:pt-8 lg:pb-16 px-4 lg:px-8 bg-card border-b border-border overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Kiri: Teks Hero */}
            <motion.div
              key={`hero-${slug}`}
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8 text-center lg:text-left"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold text-primary bg-primary/10 border border-primary/20"
              >
                {content.badge_text}
              </motion.div>
              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]"
              >
                {content.hero_title}
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0"
              >
                {content.hero_subtitle}
              </motion.p>
              <motion.div
                variants={fadeInUp}
                className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button
                  size="lg"
                  className="h-14 px-8 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-all text-base"
                  asChild
                >
                  <a href={content.cta_link}>
                    Mulai Diskusi <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 rounded-full border-border hover:bg-secondary transition-all text-base"
                  asChild
                >
                  <a href="/model-kolaborasi">Lihat Model Kolaborasi</a>
                </Button>
              </motion.div>
            </motion.div>

            {/* Kanan: Placeholder Gambar Hero */}
            <motion.div
              key={`hero-img-${slug}`}
              initial={{ opacity: 0, scale: 0.95, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-md mx-auto lg:max-w-lg aspect-[4/3] bg-muted border border-border rounded-[32px] md:rounded-[40px] overflow-hidden flex items-center justify-center group shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              {content.hero_image ? (
                <img
                  src={content.hero_image}
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-20 h-20 text-muted-foreground/30 group-hover:scale-110 transition-transform duration-700" />
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🌟 2. PENJELASAN */}
      <section className="py-24 lg:py-32 px-4 lg:px-8 bg-background">
        <div className="container mx-auto max-w-5xl text-center">
          <motion.div
            key={`penjelasan-${slug}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-8"
            >
              {content.penjelasan_title}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground leading-relaxed max-w-4xl text-justify md:text-center mb-16 whitespace-pre-wrap"
            >
              {content.penjelasan_teks}
            </motion.p>

            {/* Placeholder Gambar Lebar */}
            <motion.div
              variants={fadeInUp}
              className="w-full h-56 md:h-72 lg:h-80 bg-muted border border-border rounded-[32px] md:rounded-[40px] overflow-hidden flex items-center justify-center shadow-sm group"
            >
              {content.penjelasan_image ? (
                <img
                  src={content.penjelasan_image}
                  alt="Penjelasan"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-16 h-16 text-muted-foreground/30 group-hover:scale-110 transition-transform duration-700" />
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 🌟 3. BENEFIT (3 Kotak Sejajar) */}
      <section className="py-24 px-4 lg:px-8 bg-secondary/10 border-y border-border">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              {content.benefit_title}
            </h2>
          </motion.div>

          <motion.div
            key={`benefit-${slug}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {content.benefits.map((benefit, idx) => {
              const Icon = IconMap[benefit.icon] || LayoutGrid;
              return (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="group bg-background border border-border p-8 lg:p-10 rounded-[32px] text-center flex flex-col items-center hover:shadow-xl hover:border-primary/40 hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-8 group-hover:bg-primary transition-colors duration-300">
                    <Icon className="w-8 h-8 text-foreground group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 🌟 4. CTA (CALL TO ACTION) */}
      <section className="py-24 lg:py-32 px-4 lg:px-8 bg-card text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-primary/5 via-card to-card pointer-events-none"></div>
        <div className="container mx-auto max-w-3xl relative z-10">
          <motion.div
            key={`cta-${slug}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl font-extrabold tracking-tight text-foreground mb-6"
            >
              {content.cta_title}
            </motion.h2>
            <motion.div variants={fadeInUp} className="mt-10">
              <Button
                size="lg"
                className="h-16 px-12 text-lg rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-300 group"
                asChild
              >
                <a href={content.cta_link}>
                  {content.cta_text}
                  <Handshake className="ml-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

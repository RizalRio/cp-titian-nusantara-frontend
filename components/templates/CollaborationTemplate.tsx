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
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// --- PEMETAAN IKON ---
const IconMap: Record<string, any> = {
  LayoutGrid,
  ShieldCheck,
  TrendingUp,
  Building,
  Briefcase,
  Globe,
  Handshake,
  CheckCircle2,
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
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
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
  data?: Partial<KolaborasiData>;
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
            "Eksekusi program di lapangan yang selaras dengan panduan RPJMD & RPJMN.",
          icon: "Building",
        },
        {
          title: "Pelaporan Akuntabel",
          description:
            "Sistem pelaporan yang transparan dan sesuai dengan standar ketat birokrasi negara.",
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
      cta_link: "/hubungi-kami",
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
      cta_link: "/hubungi-kami",
    },
  };

  // Menentukan fallback bawaan
  const currentFallback =
    slug && fallbackMap[slug]
      ? fallbackMap[slug]
      : fallbackMap["institusi-publik"];

  // Timpa dengan data dari CMS (Mengutamakan data CMS jika tidak undefined)
  const content: KolaborasiData = {
    ...currentFallback,
    ...data,
  };

  // Pastikan benefits tidak pecah jika CMS mengirim array kosong
  const renderBenefits = data?.benefits?.length
    ? data.benefits
    : currentFallback.benefits;

  return (
    <div className="flex flex-col w-full bg-[#F9F9F7] dark:bg-background font-sans text-foreground overflow-hidden min-h-screen">
      {/* 🌟 1. HERO SECTION (Organic Asymmetric Layout) */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 px-4 lg:px-8 overflow-hidden border-b border-border/40 bg-card">
        {/* Ornamen Latar */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-secondary/30 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
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
                className="inline-flex items-center rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/5 border border-primary/10 shadow-sm backdrop-blur-md"
              >
                <Sparkles className="w-3.5 h-3.5 mr-2 text-amber-500" />
                {content.badge_text}
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-[4rem] font-extrabold tracking-tight text-foreground leading-[1.1] text-balance"
              >
                {content.hero_title}
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium"
              >
                {content.hero_subtitle}
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="pt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button
                  size="lg"
                  className="h-14 px-8 rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 text-base font-bold group"
                  asChild
                >
                  <Link href={content.cta_link}>
                    {content.cta_text || "Mulai Diskusi"}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 rounded-full bg-background/50 backdrop-blur-sm border-border hover:bg-background transition-all duration-300 text-base font-bold"
                  asChild
                >
                  <Link href="/layanan">Pelajari Layanan Kami</Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Kanan: Gambar Hero (Bentuk Organik) */}
            <motion.div
              key={`hero-img-${slug}`}
              initial={{ opacity: 0, scale: 0.95, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative w-full max-w-md mx-auto lg:max-w-lg aspect-[4/3] bg-muted border border-border/50 rounded-[3rem] overflow-hidden flex items-center justify-center group shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>
              {content.hero_image ? (
                <img
                  src={content.hero_image}
                  alt="Ilustrasi Kolaborasi"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
              ) : (
                <div className="w-full h-full bg-secondary/30 flex items-center justify-center relative">
                  <div className="absolute w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
                  <ImageIcon className="w-24 h-24 text-primary/20 relative z-10 group-hover:scale-110 transition-transform duration-700" />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🌟 2. PENJELASAN (Editorial Width) */}
      <section className="py-24 lg:py-32 px-4 lg:px-8 bg-background">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            key={`penjelasan-${slug}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            <motion.div
              variants={fadeInUp}
              className="w-16 h-1 bg-primary rounded-full mb-8"
            />
            <motion.h2
              variants={fadeInUp}
              className="text-3xl lg:text-[2.5rem] font-extrabold tracking-tight text-foreground mb-8 leading-[1.2] text-balance"
            >
              {content.penjelasan_title}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg lg:text-xl text-muted-foreground leading-[1.8] mb-16 whitespace-pre-wrap font-medium"
            >
              {content.penjelasan_teks}
            </motion.p>

            {/* Placeholder Gambar Lebar / Panorama */}
            <motion.div
              variants={fadeInUp}
              className="w-full aspect-[21/9] bg-card border border-border/60 rounded-[2.5rem] overflow-hidden flex items-center justify-center shadow-xl shadow-primary/5 group relative"
            >
              {content.penjelasan_image ? (
                <img
                  src={content.penjelasan_image}
                  alt="Detail Penjelasan"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
                  <span className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                    Ilustrasi Proses
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 🌟 3. BENEFIT (Nilai Tambah Kolaborasi) */}
      <section className="py-32 px-4 lg:px-8 bg-secondary/10 border-y border-border/50">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              {content.benefit_title}
            </h2>
          </motion.div>

          <motion.div
            key={`benefit-${slug}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {renderBenefits.map((benefit, idx) => {
              const Icon = IconMap[benefit.icon] || CheckCircle2;
              return (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="group bg-card border border-border/60 p-8 lg:p-10 rounded-[2.5rem] flex flex-col items-center text-center hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary transition-colors duration-500 relative z-10">
                    <Icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors relative z-10">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed font-medium relative z-10">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 🌟 4. CTA (CALL TO ACTION) */}
      <section className="py-24 px-4 lg:px-8 bg-background relative overflow-hidden">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            key={`cta-${slug}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="bg-primary rounded-[3.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/20"
          >
            {/* Latar Belakang CTA Dinamis */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-60" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-black/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <Handshake className="w-16 h-16 text-primary-foreground/90 mb-8" />
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary-foreground mb-8 text-balance">
                {content.cta_title}
              </h2>
              <Button
                size="lg"
                className="h-16 px-10 text-lg font-bold rounded-full bg-background text-primary hover:bg-secondary hover:scale-105 transition-all duration-300 shadow-xl group"
                asChild
              >
                <Link href={content.cta_link}>
                  {content.cta_text}
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

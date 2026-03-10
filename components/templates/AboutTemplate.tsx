"use client";

import { motion } from "framer-motion";
import {
  Leaf,
  Target,
  ArrowRight,
  Linkedin,
  Instagram,
  Facebook,
  Heart,
  Scale,
  Compass,
  Star,
  Shield,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Pemetaan Ikon untuk Nilai & Prinsip
const IconMap: Record<string, any> = {
  Heart: Heart,
  Scale: Scale,
  Leaf: Leaf,
  Compass: Compass,
  Star: Star,
  Shield: Shield,
};

interface ValueItem {
  title: string;
  icon: string;
  description: string;
}
interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface AboutContent {
  hero_title: string;
  who_we_are: string;
  why_us: string;
  manifesto_intro: string;
  vision: string;
  mission: string;
  values?: ValueItem[]; // Diambil dari data CMS
  timeline_summary: string;
  timeline_details?: TimelineItem[];
}

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

export function AboutTemplate({ content }: { content: AboutContent }) {
  // Placeholder Data Tim
  const teamMembers = [
    {
      name: "Dr. Allen Sudrajat",
      role: "Pendiri & Visioner",
      bio: "Berpengalaman 15 tahun merajut benang merah antara kebijakan publik dan pemberdayaan masyarakat adat.",
      image: "https://i.pravatar.cc/300?img=11",
    },
    {
      name: "Siti Narasi",
      role: "Direktur Ekosistem",
      bio: "Seorang pembangun jembatan. Mengubah tradisi lama menjadi solusi modern tanpa kehilangan jiwanya.",
      image: "https://i.pravatar.cc/300?img=5",
    },
    {
      name: "Budi Dampak",
      role: "Kepala Kolaborasi",
      bio: "Sang strategis di balik setiap kemitraan. Ia melihat potensi di setiap desa yang ia pijak.",
      image: "https://i.pravatar.cc/300?img=12",
    },
  ];

  // Placeholder Data Jika CMS Kosong
  const fallbackValues = [
    {
      title: "Bermakna",
      icon: "Heart",
      description: "Setiap langkah harus menyentuh tanah dan hati manusia.",
    },
    {
      title: "Adil",
      icon: "Scale",
      description:
        "Meruntuhkan tembok penghalang, membangun meja yang lebih luas.",
    },
    {
      title: "Membumi",
      icon: "Leaf",
      description: "Tidak ada teori langit yang tak bisa dipraktikkan di bumi.",
    },
    {
      title: "Berkelanjutan",
      icon: "Compass",
      description:
        "Kami menanam benih hari ini untuk pohon pelindung esok hari.",
    },
  ];

  const fallbackTimeline = [
    {
      year: "2020",
      title: "Langkah Pertama yang Berani",
      description:
        "Berawal dari sebuah pendopo kecil di kaki gunung, Titian Nusantara lahir dari keresahan bersama.",
    },
    {
      year: "2022",
      title: "Menumbuhkan Ranting",
      description:
        "Program pertama kami berhasil direplikasi di 5 desa sekitar, membuktikan bahwa model kolaborasi ini bekerja.",
    },
    {
      year: "2024",
      title: "Membuka Jendela Dunia",
      description:
        "Menjadi mitra strategis untuk badan pembangunan internasional, membawa suara desa ke panggung global.",
    },
  ];

  const renderValues = content.values?.length ? content.values : fallbackValues;
  const renderTimeline = content.timeline_details?.length
    ? content.timeline_details
    : fallbackTimeline;

  return (
    <div className="flex flex-col w-full bg-background font-sans text-foreground overflow-hidden selection:bg-primary/20 selection:text-primary">
      {/* 🌟 1. HERO SECTION (Lebih Bersih dan Editorial) */}
      <section className="relative pt-40 pb-24 px-4 lg:px-8 bg-[#F9F9F7] dark:bg-background overflow-hidden border-b border-border/40">
        {/* Dekorasi Latar */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
        <div className="absolute -top-[20%] -right-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center text-center mb-20"
          >
            <motion.div
              variants={fadeInUp}
              className="mb-6 inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-primary bg-primary/5 border border-primary/10"
            >
              <Sparkles className="w-3.5 h-3.5 mr-2" /> Cerita Kami
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] max-w-4xl text-balance"
            >
              {content.hero_title || "Menelusuri Jejak, Merawat Harapan."}
            </motion.h1>
          </motion.div>

          {/* Placeholder Image Hero - Berubah menjadi bentuk pil horizontal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="w-full h-[50vh] md:h-[65vh] bg-card rounded-[3rem] md:rounded-[5rem] flex items-center justify-center border border-border shadow-2xl shadow-primary/5 overflow-hidden relative group"
          >
            {/* Latar placeholder jika belum ada gambar beneran */}
            <div className="absolute inset-0 bg-gradient-to-tr from-muted/50 to-muted/10"></div>
            <Leaf className="w-24 h-24 text-muted-foreground/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000 ease-out" />
            <div className="absolute bottom-6 right-8 px-4 py-2 bg-background/80 backdrop-blur-md rounded-full text-xs font-semibold text-muted-foreground border border-border/50">
              Visual Dokumentasi Titian
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🌟 2. SIAPA KAMI & MENGAPA KAMI (Tata Letak Asimetris) */}
      <section className="py-32 px-4 lg:px-8 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            {/* Kiri: Teks Narasi Besar */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="lg:col-span-7 space-y-20"
            >
              <motion.div variants={fadeInUp} className="relative">
                <div className="absolute -left-6 md:-left-12 top-2 text-6xl text-primary/10 font-serif">
                  "
                </div>
                <h2 className="text-xl font-bold mb-6 text-primary tracking-widest uppercase">
                  Siapa Kami
                </h2>
                <p className="text-2xl md:text-3xl text-foreground font-medium leading-[1.6] text-balance">
                  {content.who_we_are ||
                    "Titian Nusantara adalah simpul pergerakan yang berfokus pada kesejahteraan akar rumput. Kami hadir untuk memastikan laju perkembangan tidak meninggalkan mereka yang berada di tapal batas."}
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="relative">
                <h2 className="text-xl font-bold mb-6 text-primary tracking-widest uppercase">
                  Mengapa Kami Berdiri
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground leading-[1.8] text-balance">
                  {content.why_us ||
                    "Karena perubahan sejati tidak datang dari instruksi atas, melainkan dari tumbuhnya kesadaran dan kemandirian di tingkat paling dasar. Kami memandu kolaborasi yang setara, bukan sekadar memberi bantuan."}
                </p>
              </motion.div>
            </motion.div>

            {/* Kanan: Ruang Napas & Gambar Vertikal */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="lg:col-span-5 h-full lg:min-h-[600px] bg-secondary/10 rounded-[3rem] border border-border/50 flex flex-col justify-between p-10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
              <div>
                <Target className="w-12 h-12 text-primary mb-6 opacity-80" />
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Sebuah Jembatan.
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Kami tidak membangun kota, kami membangun manusianya agar
                  mereka siap membangun kotanya sendiri.
                </p>
              </div>
              {/* Gambar abstrak */}
              <div className="w-full aspect-square rounded-[2rem] border-2 border-dashed border-border flex items-center justify-center bg-background/50 backdrop-blur-sm mt-10">
                <span className="text-sm font-medium text-muted-foreground">
                  Foto Aksi Nyata
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🌟 3. MANIFESTO, VISI, MISI (Kotak Elegan) */}
      <section className="py-32 px-4 lg:px-8 bg-card/40 border-y border-border">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
              Manifesto Titian
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {content.manifesto_intro ||
                "Komitmen kami terukir dalam langkah nyata, diarahkan oleh pandangan jauh ke depan dan dijalankan melalui dedikasi tak henti hari ini."}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-background border border-border p-10 md:p-12 rounded-[2.5rem] shadow-sm hover:shadow-lg transition-shadow"
            >
              <h3 className="text-sm font-bold mb-6 text-primary tracking-[0.3em] uppercase flex items-center gap-3">
                <span className="w-6 h-px bg-primary"></span> Misi
              </h3>
              <p className="text-xl font-medium text-foreground leading-[1.7]">
                {content.mission ||
                  "Menjadi jembatan yang menghubungkan potensi lokal dengan peluang global, memberdayakan komunitas melalui pendidikan dan aksi nyata."}
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
              className="bg-primary border border-primary text-primary-foreground p-10 md:p-12 rounded-[2.5rem] shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[40px]"></div>
              <h3 className="text-sm font-bold mb-6 text-primary-foreground/80 tracking-[0.3em] uppercase flex items-center gap-3 relative z-10">
                <span className="w-6 h-px bg-primary-foreground/50"></span> Visi
              </h3>
              <p className="text-xl font-medium leading-[1.7] relative z-10 text-balance">
                {content.vision ||
                  "Mewujudkan tatanan masyarakat yang mandiri, inklusif, dan hidup selaras dengan alam serta akar budayanya."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🌟 4. NILAI DAN PRINSIP (Mewarisi desain Home) */}
      <section className="py-32 bg-background relative z-10">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              Nilai yang Dihidupi
            </h2>
            <div className="w-16 h-1 bg-primary rounded-full mx-auto"></div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {renderValues.map((item, idx) => {
              const IconComponent = IconMap[item.icon] || Leaf;
              return (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="group p-8 rounded-[2rem] bg-card border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary transition-all duration-500">
                      <IconComponent className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-foreground">
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

      {/* 🌟 5. TIMELINE (Desain Minimalis & Interaktif) */}
      <section className="py-32 px-4 lg:px-8 bg-secondary/10 border-t border-border">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            {/* Kiri: Rangkuman */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="lg:col-span-5 lg:sticky lg:top-32 self-start"
            >
              <div className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 mb-6">
                Jejak Waktu
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 leading-[1.1]">
                Perjalanan Kami
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed text-balance">
                {content.timeline_summary ||
                  "Perjalanan kami bukanlah garis lurus. Ia adalah kanvas proses belajar tanpa henti dari setiap tanah yang kami jejakkan dan setiap tangan yang kami jabat."}
              </p>
            </motion.div>

            {/* Kanan: Vertical Timeline */}
            <div className="lg:col-span-7 relative mt-10 lg:mt-0">
              {/* Garis Vertikal Latar */}
              <div className="absolute left-[23px] top-0 bottom-0 w-[2px] bg-border/60"></div>

              <div className="space-y-16">
                {renderTimeline.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                    className="relative pl-16 md:pl-20 group"
                  >
                    {/* Node / Titik Timeline */}
                    <div className="absolute left-0 top-1 w-12 h-12 bg-background border-4 border-card rounded-full flex items-center justify-center shadow-sm z-10 group-hover:border-primary transition-colors duration-500">
                      <div className="w-3 h-3 bg-muted-foreground group-hover:bg-primary rounded-full transition-colors duration-500"></div>
                    </div>

                    {/* Konten Kotak */}
                    <div className="bg-card border border-border p-8 rounded-[2rem] shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-500 group-hover:-translate-y-1 relative overflow-hidden">
                      <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-black tracking-widest text-sm rounded-full mb-5">
                        {item.year}
                      </span>
                      <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-[1.05rem]">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 6. TEAM (Sosok di Balik Layar) */}
      <section className="py-32 px-4 lg:px-8 bg-background">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20"
          >
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
                Penggerak Harapan
              </h2>
              <p className="text-xl text-muted-foreground">
                Orang-orang biasa dengan mimpi yang luar biasa. Inilah mereka
                yang memastikan Titian Nusantara terus melangkah.
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-full h-12 px-6 bg-card border-border shadow-sm hidden md:flex"
            >
              Lihat Seluruh Tim
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: idx * 0.15 }}
                className="group flex flex-col"
              >
                {/* Foto Profil (Aspect Ratio Portrait yang lebih elegan) */}
                <div className="w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-8 bg-muted relative border border-border shadow-sm">
                  {/* Efek Warna Overlay saat di-hover */}
                  <div className="absolute inset-0 bg-primary mix-blend-multiply opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-10" />
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
                  />
                  {/* Link Sosmed Melayang */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-20">
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-background/90 backdrop-blur text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-background/90 backdrop-blur text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="px-2 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <h4 className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-4">
                    {member.role}
                  </h4>
                  <p className="text-muted-foreground text-[1.05rem] leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tombol mobile */}
          <div className="mt-10 flex justify-center md:hidden">
            <Button
              variant="outline"
              className="rounded-full h-12 px-8 bg-card border-border w-full"
            >
              Lihat Seluruh Tim
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

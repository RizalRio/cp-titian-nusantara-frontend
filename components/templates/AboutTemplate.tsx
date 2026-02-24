"use client";

import { motion } from "framer-motion";
import {
  Leaf,
  Target,
  ArrowRight,
  Linkedin,
  Instagram,
  Facebook,
  CheckCircle2,
  Heart,
  Scale,
  Compass,
  Star,
  Shield,
} from "lucide-react";

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
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

export function AboutTemplate({ content }: { content: AboutContent }) {
  // Placeholder Data Tim (Sesuai Wireframe: ada Bio dan Sosmed)
  const teamMembers = [
    {
      name: "Dr. Allen Sudrajat",
      role: "Pendiri & Visioner",
      bio: "Berpengalaman 15 tahun dalam pengembangan masyarakat akar rumput.",
      image: "https://i.pravatar.cc/300?img=11",
    },
    {
      name: "Siti Narasi",
      role: "Direktur Ekosistem",
      bio: "Ahli konservasi budaya yang menjembatani tradisi dan modernitas.",
      image: "https://i.pravatar.cc/300?img=5",
    },
    {
      name: "Budi Dampak",
      role: "Kepala Kolaborasi",
      bio: "Strategist kemitraan yang menghubungkan desa dengan global.",
      image: "https://i.pravatar.cc/300?img=12",
    },
  ];

  // Placeholder Data Jika CMS Kosong
  const fallbackValues = [
    {
      title: "Bermakna",
      icon: "Heart",
      description: "Solusi dari akar rumput.",
    },
    {
      title: "Adil",
      icon: "Scale",
      description: "Akses setara, meruntuhkan batas.",
    },
    {
      title: "Membumi",
      icon: "Leaf",
      description: "Menghargai kearifan lokal.",
    },
    {
      title: "Berkelanjutan",
      icon: "Compass",
      description: "Membangun ekosistem mandiri.",
    },
  ];

  const fallbackTimeline = [
    {
      year: "2020",
      title: "Langkah Pertama",
      description:
        "Titian Nusantara didirikan sebagai inisiatif kecil di desa terpencil.",
    },
    {
      year: "2022",
      title: "Ekspansi Ekosistem",
      description:
        "Membuka program pemberdayaan di 5 provinsi di Indonesia Timur.",
    },
    {
      year: "2024",
      title: "Kolaborasi Global",
      description:
        "Menjadi mitra resmi program pembangunan berkelanjutan internasional.",
    },
  ];

  const renderValues = content.values?.length ? content.values : fallbackValues;
  const renderTimeline = content.timeline_details?.length
    ? content.timeline_details
    : fallbackTimeline;

  return (
    <div className="flex flex-col w-full bg-background font-sans text-foreground overflow-hidden">
      {/* 🌟 1. HERO SECTION (Image Placeholder besar sesuai wireframe) */}
      <section className="relative pt-32 pb-20 px-4 lg:px-8 bg-card border-b border-border">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6"
            >
              {content.hero_title || "Menelusuri Jejak, Merawat Harapan."}
            </motion.h1>
          </motion.div>
          {/* Placeholder Image Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-full h-[40vh] md:h-[60vh] bg-muted/50 rounded-[40px] flex items-center justify-center border border-border overflow-hidden relative group"
          >
            <Leaf className="w-32 h-32 text-muted-foreground/20 group-hover:scale-110 transition-transform duration-700" />
          </motion.div>
        </div>
      </section>

      {/* 🌟 2. SIAPA KAMI & MENGAPA KAMI (2 Kolom: Kiri Teks, Kanan Gambar) */}
      <section className="py-24 lg:py-32 px-4 lg:px-8 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Kiri: Teks */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-12"
            >
              <motion.div variants={fadeInUp}>
                <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-4">
                  <span className="w-8 h-1 bg-primary rounded-full"></span>{" "}
                  Siapa Kami
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {content.who_we_are ||
                    "Titian Nusantara adalah simpul pergerakan yang berfokus pada kesejahteraan akar rumput. Kami hadir untuk memastikan bahwa laju perkembangan tidak meninggalkan mereka yang berada di tapal batas."}
                </p>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-4">
                  <span className="w-8 h-1 bg-primary rounded-full"></span>{" "}
                  Mengapa Kami
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {content.why_us ||
                    "Karena perubahan sejati tidak datang dari instruksi atas, melainkan dari tumbuhnya kesadaran dan kemandirian di tingkat paling dasar. Kami percaya pada kolaborasi yang setara."}
                </p>
              </motion.div>
            </motion.div>
            {/* Kanan: Placeholder Gambar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="h-full min-h-[400px] bg-secondary/20 rounded-[40px] border border-border flex items-center justify-center p-8"
            >
              <div className="w-full h-full border-2 border-dashed border-primary/20 rounded-3xl flex items-center justify-center bg-card/50">
                <span className="text-muted-foreground font-medium">
                  Ilustrasi / Foto Dokumentasi
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🌟 3. MANIFESTO TITIAN NUSANTARA (Misi & Visi 2 Kolom) */}
      <section className="py-24 lg:py-32 px-4 lg:px-8 bg-muted/30 border-y border-border">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold tracking-tight mb-6">
              Manifesto Titian Nusantara
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {content.manifesto_intro ||
                "Komitmen kami terukir dalam langkah nyata, diarahkan oleh pandangan jauh ke depan dan dijalankan melalui dedikasi hari ini."}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 relative">
            {/* Garis pemisah tengah di Desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2"></div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center md:text-right pr-0 md:pr-8"
            >
              <h3 className="text-2xl font-bold mb-6 text-primary tracking-widest uppercase">
                Misi
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {content.mission ||
                  "Menjadi jembatan yang menghubungkan potensi lokal dengan peluang global, memberdayakan komunitas melalui pendidikan dan aksi nyata."}
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center md:text-left pl-0 md:pl-8"
            >
              <h3 className="text-2xl font-bold mb-6 text-primary tracking-widest uppercase">
                Visi
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {content.vision ||
                  "Mewujudkan tatanan masyarakat yang mandiri, inklusif, dan hidup selaras dengan alam serta akar budayanya."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🌟 4. NILAI DAN PRINSIP (Sama dengan Beranda) */}
      <section className="py-24 lg:py-32 bg-background relative z-10">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl font-bold tracking-tight text-foreground mb-6">
              Nilai dan Prinsip
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {renderValues.map((item, idx) => {
              const IconComponent = IconMap[item.icon] || Leaf;
              return (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  whileHover={{ y: -10 }}
                  className="group p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <IconComponent className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 🌟 5. TIMELINE (Vertical Progress) */}
      <section className="py-24 lg:py-32 px-4 lg:px-8 bg-card/30 border-t border-border">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Kiri: Rangkuman */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="lg:col-span-4 lg:sticky lg:top-32 self-start"
            >
              <h2 className="text-4xl font-bold tracking-tight mb-6">
                Timeline
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {content.timeline_summary ||
                  "Perjalanan kami bukanlah garis lurus, melainkan proses belajar tanpa henti dari setiap langkah yang kami jejakkan bersama masyarakat."}
              </p>
            </motion.div>

            {/* Kanan: Vertical Progress */}
            <div className="lg:col-span-8 relative">
              {/* Garis Vertikal Utama */}
              <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-border"></div>

              <div className="space-y-12">
                {renderTimeline.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15 }}
                    className="relative pl-20 group"
                  >
                    {/* Lingkaran Timeline */}
                    <div className="absolute left-4 top-1.5 w-8 h-8 rounded-full bg-background border-4 border-primary z-10 group-hover:bg-primary transition-colors"></div>

                    {/* Konten Timeline */}
                    <div className="bg-background border border-border p-6 md:p-8 rounded-2xl shadow-sm group-hover:shadow-md transition-shadow">
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-bold text-sm rounded-full mb-4">
                        {item.year}
                      </span>
                      <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
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

      {/* 🌟 6. TEAM (Dengan Bio dan Sosmed) */}
      <section className="py-24 lg:py-32 px-4 lg:px-8 bg-background">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex justify-between items-end mb-16"
          >
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Team
            </h2>
            <div className="px-6 py-2 bg-foreground text-background font-semibold rounded-full hover:bg-primary transition-colors cursor-pointer text-sm">
              See All
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: idx * 0.1 }}
                className="group bg-card border border-border rounded-3xl p-6 hover:shadow-xl hover:border-primary/40 transition-all duration-500 flex flex-col items-center text-center"
              >
                {/* Foto Profil Kotak Membulat */}
                <div className="w-full aspect-square rounded-2xl overflow-hidden mb-6 bg-muted relative">
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-multiply" />
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
                  />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {member.name}
                </h3>
                <h4 className="text-primary font-medium text-sm tracking-wide uppercase mb-4">
                  {member.role}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 border-b border-border pb-6">
                  {member.bio}
                </p>

                {/* Social Media Icons */}
                <div className="flex items-center gap-4 text-muted-foreground mt-auto">
                  <a href="#" className="hover:text-primary transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className="hover:text-primary transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="hover:text-primary transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

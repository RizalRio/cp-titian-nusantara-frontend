"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  Layers,
  Leaf,
  Network,
  Handshake,
  MessageCircleQuestion,
  Plus,
  Minus,
  Shield,
  Compass,
  Heart,
  Target,
  Lightbulb,
  ClipboardCheck,
  HeartPulse,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

// 🌟 INTERFACE
interface ServiceData {
  id: string;
  name: string;
  slug: string;
  short_description?: string;
  media?: { file_url: string; media_type: string }[];
}

// 🌟 ANIMASI
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

// 🌟 IKON FALLBACK
const fallbackIcons = [Leaf, Shield, Compass, Heart, Target, Lightbulb];

export default function LayananIndexPage() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // 🌟 DATA FAQ
  const faqs = [
    {
      q: "Siapa saja yang bisa menggunakan layanan dari Titian Nusantara?",
      a: "Layanan kami dirancang inklusif untuk berbagai kalangan. Mulai dari Individu, Institusi Pendidikan (Sekolah), Korporasi & Organisasi Swasta, Instansi Pemerintah, hingga tataran Komunitas & Desa.",
    },
    {
      q: "Apa itu Wellbeing Project Nusantara dan apa saja fiturnya?",
      a: "Wellbeing Project Nusantara adalah platform komprehensif untuk merawat kesehatan mental Anda. Di dalamnya terdapat fitur pencatatan emosi harian, pelacakan waktu tidur, pemantauan tingkat stres, forum komunitas, hingga akses konsultasi langsung dengan psikolog atau psikiater profesional.",
    },
    {
      q: "Jenis tes atau asesmen psikologis apa saja yang disediakan?",
      a: "Kami menyediakan beragam instrumen asesmen yang disesuaikan dengan sektornya: Tes Minat Karir (untuk pengembangan individu, siswa sekolah, dan warga desa), Tes Kesiapan Pekerja Migran Indonesia (sektor Organisasi & Kebijakan), serta Tes ION untuk pemetaan potensi tingkat komunitas.",
    },
    {
      q: "Apakah instansi pemerintah atau desa dapat berkolaborasi untuk program khusus?",
      a: "Tentu saja. Kami sangat terbuka berkolaborasi dengan Instansi Pemerintah maupun Pemerintah Desa untuk merancang program pemetaan potensi (seperti tes ION dan minat karir) atau program kebijakan pekerja migran (PMI) yang disesuaikan dengan kebutuhan daerah Anda.",
    },
  ];

  // Fetch Data
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/api/v1/services");
        setServices(res.data.data || []);
      } catch (error) {
        console.error("Gagal memuat ekosistem layanan:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F7] dark:bg-background text-foreground font-sans">
      {/* 🌟 1. HERO SECTION (Organic, Soft Blend) */}
      <section className="relative pt-40 pb-28 px-4 lg:px-8 overflow-hidden text-center border-b border-border/40">
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-secondary/30 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-[11px] font-bold text-primary mb-8 shadow-sm backdrop-blur-sm uppercase tracking-[0.2em]"
          >
            <Network className="w-3.5 h-3.5 mr-2.5" />
            Ekosistem Layanan
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold text-foreground tracking-tight leading-[1.1] mb-8 text-balance mx-auto"
          >
            Jembatan Menuju Perubahan Inklusif.
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Jelajahi berbagai ruang inisiatif kami. Setiap ekosistem dirancang
            secara khusus untuk memberdayakan, mengedukasi, dan menciptakan
            dampak berkelanjutan.
          </motion.p>
        </div>
      </section>

      {/* 🌟 2. NARASI / PENDEKATAN KAMI (Bento-style Cards) */}
      <section className="py-32 px-4 lg:px-8 max-w-7xl mx-auto relative z-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            Pendekatan Holistik
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Kami membangun ekosistem pengembangan potensi dan kesejahteraan yang
            terintegrasi, didasari oleh tiga pilar utama.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: ClipboardCheck,
              title: "Asesmen Berbasis Data",
              desc: "Memanfaatkan instrumen teruji (Tes Minat Karir, Tes ION, Kesiapan PMI) untuk memetakan potensi individu hingga desa secara akurat.",
            },
            {
              icon: HeartPulse,
              title: "Kesejahteraan Terpadu",
              desc: "Menyediakan ruang aman pemantauan emosi, pelacakan gaya hidup, hingga konsultasi profesional via Wellbeing Project Nusantara.",
            },
            {
              icon: Handshake,
              title: "Sinergi Lintas Sektor",
              desc: "Menghubungkan elemen individu, organisasi swasta, pemerintah, dan komunitas untuk menciptakan kebijakan berdampak jangka panjang.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="bg-card p-10 rounded-[2.5rem] border border-border shadow-sm text-center flex flex-col items-center group hover:shadow-xl hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 relative z-10">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 relative z-10">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed relative z-10">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 🌟 3. KARTU DAFTAR LAYANAN (Dinamis dari API) */}
      <section className="py-32 bg-secondary/10 px-4 lg:px-8 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground flex items-center gap-4 mb-6">
                Pilihan Ruang Gerak
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Temukan layanan spesifik yang sesuai dengan kebutuhan
                pengembangan organisasi, komunitas, maupun diri Anda.
              </p>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 bg-card rounded-[3rem] shadow-sm border border-border">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="text-primary font-medium tracking-wide">
                Memetakan ekosistem layanan...
              </p>
            </div>
          ) : services.length === 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-center py-32 bg-card rounded-[3rem] border border-border border-dashed shadow-sm"
            >
              <Layers className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Belum Ada Layanan
              </h3>
              <p className="text-muted-foreground">
                Kami sedang menyusun struktur ekosistem layanan saat ini.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {services.map((layanan, idx) => {
                const thumbnail = layanan.media?.find(
                  (m) => m.media_type === "thumbnail",
                )?.file_url;
                const FallbackIcon = fallbackIcons[idx % fallbackIcons.length];

                return (
                  <motion.div
                    key={layanan.id}
                    variants={fadeInUp}
                    className="h-full"
                  >
                    <Link
                      href={`/layanan/${layanan.slug}`}
                      className="group flex flex-col h-full bg-card rounded-[2.5rem] overflow-hidden border border-border shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 p-4 relative"
                    >
                      {/* Bagian Gambar (Rounded di dalam kartu) */}
                      <div className="w-full aspect-[4/3] bg-muted rounded-[2rem] relative overflow-hidden flex items-center justify-center shrink-0 mb-6">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-overlay" />
                        {thumbnail ? (
                          <img
                            src={thumbnail}
                            alt={layanan.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <div className="w-full h-full bg-secondary/30 flex items-center justify-center relative">
                            <div className="absolute w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
                            <FallbackIcon className="w-16 h-16 text-primary/30 group-hover:scale-110 transition-transform duration-500 relative z-10" />
                          </div>
                        )}
                      </div>

                      <div className="px-4 pb-4 flex flex-col flex-grow">
                        <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-[1.2]">
                          {layanan.name}
                        </h3>

                        <p className="text-muted-foreground leading-relaxed mb-8 line-clamp-3 flex-grow">
                          {layanan.short_description ||
                            "Pelajari lebih lanjut mengenai ekosistem layanan ini dan dampaknya bagi masyarakat."}
                        </p>

                        <div className="mt-auto flex justify-between items-center pt-5 border-t border-border/50">
                          <span className="font-bold text-sm tracking-widest uppercase text-primary">
                            Jelajahi Program
                          </span>
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-all duration-300">
                            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* 🌟 4. FAQ SECTION (Minimalist Accordion) */}
      <section className="py-32 px-4 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <div className="w-16 h-16 mx-auto bg-secondary text-primary rounded-2xl flex items-center justify-center mb-6">
            <MessageCircleQuestion className="w-8 h-8" />
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Pusat Bantuan Cepat
          </h2>
          <p className="text-xl text-muted-foreground">
            Temukan jawaban atas pertanyaan yang sering diajukan.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-card border border-border rounded-3xl overflow-hidden transition-all duration-300 shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full px-6 py-6 md:px-8 md:py-7 text-left flex items-center justify-between focus:outline-none group"
              >
                <span className="text-[1.15rem] font-bold text-foreground pr-8 group-hover:text-primary transition-colors">
                  {faq.q}
                </span>
                <div
                  className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    openFaq === index
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  }`}
                >
                  {openFaq === index ? (
                    <Minus className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 md:px-8 pb-8 text-muted-foreground leading-[1.8] text-lg border-t border-border pt-6 mt-2">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 🌟 5. CALL TO ACTION (CTA) */}
      <section className="pb-32 px-4 lg:px-8 max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="bg-primary rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/20"
        >
          {/* Latar CTA yang mewah */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-60" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground tracking-tight mb-8 text-balance">
              Siap Merajut Dampak Bersama?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-12 max-w-2xl leading-relaxed font-medium">
              Diskusikan ide, kebutuhan asesmen, atau potensi kolaborasi
              organisasi Anda. Mari ciptakan ekosistem inklusif bersama.
            </p>
            <Link
              href="/hubungi-kami"
              className="inline-flex items-center px-10 py-5 bg-background text-primary text-lg font-extrabold tracking-wide rounded-full hover:scale-105 transition-transform duration-300 shadow-xl"
            >
              Mulai Percakapan
              <ArrowRight className="w-6 h-6 ml-3" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

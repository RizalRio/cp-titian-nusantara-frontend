"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
  Image as ImageIcon,
  Sparkles,
  Handshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// --- TIPE DATA DARI CMS ---
export interface ModelItem {
  title: string;
  description: string;
  features: string[];
  recommended_for: string;
}

export interface PerbandinganFeature {
  feature_name: string;
  model_1_has: boolean;
  model_2_has: boolean;
  model_3_has: boolean;
}

export interface AlurItem {
  step: string;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ModelKolaborasiData {
  hero_title?: string;
  hero_subtitle?: string;
  hero_image?: string;
  model_title?: string;
  model_subtitle?: string;
  models?: ModelItem[];
  perbandingan_features?: PerbandinganFeature[];
  alur_title?: string;
  alur_description?: string;
  alur?: AlurItem[];
  faqs?: FaqItem[];
  cta_title?: string;
  cta_link?: string;
  cta_text?: string;
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

// 🌟 KOMPONEN TEMPLATE
export function ModelKolaborasiTemplate({
  data,
}: {
  data?: ModelKolaborasiData;
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // --- DATA FALLBACK BAWAAN ---
  const fallbackModels: ModelItem[] = [
    {
      title: "Implementasi Layanan Tematik",
      description:
        "Mitra mengadopsi pilar layanan spesifik kami—seperti Asesmen & Pengembangan, Pendidikan & Talenta, atau Wellbeing Nusantara—untuk diterapkan pada target penerima manfaat tertentu.\n\nPendekatan ini bersifat taktis, cepat dieksekusi, dan menggunakan modul-modul kami yang telah teruji efektivitasnya di lapangan untuk menyelesaikan satu isu krusial.",
      features: [
        "Eksekusi modul layanan standar dengan kustomisasi lokal.",
        "Fokus pada penyelesaian satu hingga dua isu utama.",
        "Pelaporan evaluasi efektivitas program (output & outcome).",
      ],
      recommended_for: "Perusahaan dengan CSR Tematik & Yayasan Filantropi",
    },
    {
      title: "Kemitraan Wilayah Terintegrasi",
      description:
        "Kolaborasi jangka panjang yang mengorkestrasi seluruh ekosistem layanan kami secara holistik. Mulai dari pemetaan (Asesmen), pemberdayaan (Komunitas & Pendidikan), dukungan mental (Wellbeing), hingga advokasi (Organisasi).\n\nModel ini bertujuan menciptakan transformasi dan kemandirian utuh di suatu kawasan, menjadikannya ideal untuk program desa binaan atau area Ring 1 perusahaan.",
      features: [
        "Intervensi multi-sektor lintas layanan secara paralel.",
        "Penguatan kelembagaan lokal (BUMDes, Koperasi, Sekolah).",
        "Pengukuran dampak komprehensif jangka panjang (ESG/SDGs).",
      ],
      recommended_for: "Korporasi Skala Besar (MNC/BUMN) & Pemerintah Daerah",
    },
    {
      title: "Ko-Kreasi & Advokasi Strategis",
      description:
        "Memadukan keahlian teknis mitra dengan penguasaan akar rumput kami untuk merancang inovasi sosial baru. Melalui layanan Organisasi & Kebijakan, kita berfokus pada tataran makro.\n\nOutput kolaborasi ini dapat berupa penyusunan modul kurikulum baru, riset aksi partisipatif, hingga rekomendasi kebijakan publik (policy brief) yang dapat di-scale up ke tingkat nasional.",
      features: [
        "Desain program, kurikulum, atau riset secara kolaboratif.",
        "Advokasi kebijakan dan kampanye kesadaran publik.",
        "Hak kekayaan intelektual (IP) atas inovasi dimiliki bersama.",
      ],
      recommended_for: "Lembaga Penelitian, NGO Internasional & Universitas",
    },
  ];

  const fallbackPerbandingan: PerbandinganFeature[] = [
    {
      feature_name: "Penerapan Modul Layanan Jadi (Spesifik)",
      model_1_has: true,
      model_2_has: true,
      model_3_has: false,
    },
    {
      feature_name: "Intervensi Lintas Layanan Secara Holistik",
      model_1_has: false,
      model_2_has: true,
      model_3_has: false,
    },
    {
      feature_name: "Riset, Pengembangan Modul Baru & Advokasi",
      model_1_has: false,
      model_2_has: false,
      model_3_has: true,
    },
    {
      feature_name: "Fokus Transformasi Kawasan/Desa Binaan",
      model_1_has: false,
      model_2_has: true,
      model_3_has: true,
    },
    {
      feature_name: "Pelaporan Terukur Berbasis Indikator Dampak",
      model_1_has: true,
      model_2_has: true,
      model_3_has: true,
    },
  ];

  const fallbackAlur: AlurItem[] = [
    {
      step: "1",
      title: "Inisiasi & Pemetaan Kebutuhan",
      description:
        "Mendiskusikan objektif mitra dan mencocokkannya dengan portofolio layanan kami yang paling relevan.",
    },
    {
      step: "2",
      title: "Perancangan Skema",
      description:
        "Menyusun rute intervensi, indikator keberhasilan, timeline, serta integrasi layanan yang dibutuhkan.",
    },
    {
      step: "3",
      title: "Implementasi Lapangan",
      description:
        "Eksekusi layanan secara langsung di akar rumput oleh para fasilitator ahli Titian Nusantara.",
    },
    {
      step: "4",
      title: "Evaluasi & Serah Terima",
      description:
        "Pengukuran dampak program, penyerahan laporan komprehensif, dan strategi exit agar komunitas mandiri.",
    },
  ];

  const fallbackFaqs: FaqItem[] = [
    {
      question:
        "Apakah mitra bisa menggabungkan layanan Asesmen dengan Pendidikan?",
      answer:
        "Sangat bisa. Praktik terbaik kami biasanya mengawali program Pendidikan & Talenta dengan melakukan Asesmen komprehensif terlebih dahulu agar intervensi tepat sasaran.",
    },
    {
      question: "Berapa lama durasi untuk Kemitraan Wilayah Terintegrasi?",
      answer:
        "Karena melibatkan lintas layanan untuk mengubah ekosistem, kami merekomendasikan komitmen minimal 1 hingga 3 tahun agar kemandirian masyarakat (terutama di pilar Komunitas & Desa) benar-benar terbentuk.",
    },
    {
      question: "Apakah Titian menyediakan fasilitator untuk model Tematik?",
      answer:
        "Ya. Seluruh program implementasi sudah termasuk pengerahan kader penggerak lokal dan fasilitator ahli kami di lapangan.",
    },
  ];

  // Penentuan Data Akhir (Mengutamakan Data CMS jika ada)
  const models = data?.models?.length ? data.models : fallbackModels;
  const perbandingan = data?.perbandingan_features?.length
    ? data.perbandingan_features
    : fallbackPerbandingan;
  const alur = data?.alur?.length ? data.alur : fallbackAlur;
  const faqs = data?.faqs?.length ? data.faqs : fallbackFaqs;

  return (
    <div className="flex flex-col w-full bg-[#F9F9F7] dark:bg-background font-sans text-foreground overflow-hidden min-h-screen">
      {/* 🌟 1. HERO SECTION (Organic Blend) */}
      <section className="relative pt-40 pb-28 px-4 lg:px-8 bg-card border-b border-border/40 overflow-hidden">
        {/* Ornamen Latar */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-secondary/30 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <motion.div
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
                Pilih Jalur Kolaborasi
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-[4rem] font-extrabold tracking-tight text-foreground leading-[1.1] text-balance"
              >
                {data?.hero_title || "Model Kolaborasi Berbasis Dampak."}
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium"
              >
                {data?.hero_subtitle ||
                  "Mulai dari intervensi spesifik hingga transformasi holistik, kami menstrukturisasi portofolio layanan agar sejalan dengan ambisi program Anda."}
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="pt-4 flex justify-center lg:justify-start"
              >
                <Button
                  size="lg"
                  className="h-14 px-8 rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 text-base font-bold group"
                  asChild
                >
                  <Link href={data?.cta_link || "/proposal-kerjasama"}>
                    Mulai Diskusi{" "}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Kanan: Placeholder Gambar Hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative w-full max-w-md mx-auto lg:max-w-lg aspect-[4/3] bg-muted border border-border/50 rounded-[3rem] overflow-hidden flex items-center justify-center group shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>
              {data?.hero_image ? (
                <img
                  src={data.hero_image}
                  alt="Hero Kolaborasi"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
              ) : (
                <div className="w-full h-full bg-secondary/30 flex items-center justify-center relative">
                  <div className="absolute w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
                  <Handshake className="w-24 h-24 text-primary/20 relative z-10 group-hover:scale-110 transition-transform duration-700" />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🌟 2. PERBANDINGAN MODEL (Komparasi Fitur) */}
      <section className="py-24 lg:py-32 px-4 lg:px-8 bg-background border-b border-border/50">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              Perbandingan Pendekatan
            </h2>
            <div className="w-16 h-1 bg-primary rounded-full mx-auto mt-6 mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Analisis komparatif untuk membantu Anda memetakan kebutuhan dan
              skala integrasi layanan yang paling tepat.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {models.map((model, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="group bg-card border border-border/60 rounded-[2.5rem] p-8 lg:p-10 shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-2 transition-all duration-500 flex flex-col relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="text-center mb-8 border-b border-border/60 pb-6 relative z-10">
                  <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-tight">
                    {model.title}
                  </h3>
                </div>

                <ul className="space-y-5 flex-grow relative z-10">
                  {perbandingan.map((feat, fIdx) => {
                    const hasFeature =
                      idx === 0
                        ? feat.model_1_has
                        : idx === 1
                          ? feat.model_2_has
                          : feat.model_3_has;
                    return (
                      <li key={fIdx} className="flex items-start gap-4">
                        {hasFeature ? (
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                            <Minus className="w-4 h-4 text-muted-foreground/40" />
                          </div>
                        )}
                        <span
                          className={`text-[0.95rem] leading-relaxed ${hasFeature ? "text-foreground font-medium" : "text-muted-foreground line-through opacity-60"}`}
                        >
                          {feat.feature_name}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 🌟 3. DEFAULT MODEL (Tab Dinamis Penjelasan Lengkap) */}
      <section className="py-24 lg:py-32 px-4 lg:px-8 bg-secondary/10 border-b border-border/50">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="mb-12 text-center md:text-left"
          >
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              {data?.model_title || "Detail Integrasi Layanan"}
            </h2>
            <p className="text-lg text-muted-foreground mt-4">
              {data?.model_subtitle ||
                "Pelajari lebih dalam mengenai fokus dan cara kerja dari tiap skema kolaborasi."}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
          >
            {/* Navigasi Tab */}
            <div className="flex flex-col md:flex-row rounded-t-[2rem] border border-border/60 overflow-hidden bg-background shadow-sm">
              {models.map((model, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`flex-1 py-5 px-6 text-center font-bold text-sm md:text-base transition-all duration-300 ${
                    activeTab === idx
                      ? "bg-primary/10 text-primary border-b-2 border-primary"
                      : "bg-transparent text-muted-foreground hover:bg-secondary/50 hover:text-foreground border-b-2 border-transparent"
                  }`}
                >
                  {model.title}
                </button>
              ))}
            </div>

            {/* Konten Tab */}
            <div className="border border-t-0 border-border/60 rounded-b-[2rem] bg-card p-8 md:p-12 shadow-lg shadow-primary/5 min-h-[350px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <p className="text-lg md:text-[1.15rem] text-muted-foreground leading-[1.8] whitespace-pre-wrap mb-10 font-medium">
                    {models[activeTab].description}
                  </p>

                  <div className="bg-background border border-border/60 rounded-[2rem] p-6 lg:p-10 shadow-sm">
                    <h4 className="font-extrabold text-foreground mb-6 uppercase tracking-widest text-xs flex items-center gap-3">
                      <div className="w-8 h-px bg-primary"></div> Fokus Eksekusi
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {models[activeTab].features.map((feat, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-4 bg-secondary/30 p-5 rounded-2xl hover:bg-secondary/60 transition-colors"
                        >
                          <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                          <span className="text-foreground text-[0.95rem] leading-relaxed font-medium">
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 pt-6 border-t border-border/60 flex flex-wrap items-center gap-3">
                      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Rekomendasi untuk:
                      </span>
                      <span className="text-sm text-primary font-bold bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 shadow-sm">
                        {models[activeTab].recommended_for}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🌟 4. ALUR KOLABORASI (Vertical Stepper) */}
      <section className="py-24 lg:py-32 px-4 lg:px-8 bg-background">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 relative items-start"
          >
            <motion.div
              variants={fadeInUp}
              className="lg:col-span-5 lg:sticky lg:top-32"
            >
              <div className="inline-flex items-center rounded-full px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase text-primary bg-primary/10 mb-6">
                Tahapan Kerja
              </div>
              <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-8 leading-[1.1]">
                {data?.alur_title || "Alur Kolaborasi"}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap font-medium">
                {data?.alur_description ||
                  "Kolaborasi yang sukses diawali dengan komunikasi transparan dan perencanaan matang.\n\nProses ini sangat fleksibel, diadaptasi khusus menyesuaikan kompleksitas pilar layanan yang akan kita eksekusi bersama."}
              </p>
            </motion.div>

            {/* Garis Vertikal Penghubung di Desktop */}
            <div className="hidden lg:block absolute left-[41.66%] top-0 bottom-0 w-[2px] bg-border/60"></div>

            <motion.div
              variants={staggerContainer}
              className="lg:col-span-7 flex flex-col gap-8 relative"
            >
              {alur.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="bg-card border border-border/60 p-8 md:p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-500 group relative overflow-hidden"
                >
                  {/* Node Bulat Melayang di pinggir kiri untuk Desktop */}
                  <div className="hidden lg:flex absolute -left-[2.8rem] top-12 w-10 h-10 bg-background border-4 border-card rounded-full items-center justify-center z-10 group-hover:border-primary transition-colors">
                    <div className="w-2.5 h-2.5 bg-muted-foreground group-hover:bg-primary rounded-full"></div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-secondary group-hover:bg-primary transition-colors flex items-center justify-center text-xl font-black text-foreground group-hover:text-primary-foreground shadow-sm">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-[1.05rem]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 🌟 5. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section className="py-24 lg:py-32 px-4 lg:px-8 bg-card border-t border-border/50">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-6">
              Pertanyaan Umum
            </h2>
            <p className="text-xl text-muted-foreground">
              Temukan jawaban cepat seputar mekanisme kolaborasi kami.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="space-y-4"
          >
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className={`border rounded-[2rem] transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "bg-background border-primary/30 shadow-md"
                      : "bg-transparent border-border/60 hover:border-primary/30 hover:bg-background/50"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none group"
                  >
                    <span className="text-[1.15rem] font-bold pr-8 text-foreground group-hover:text-primary transition-colors">
                      {faq.question}
                    </span>
                    <div
                      className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                        isOpen
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      }`}
                    >
                      {isOpen ? (
                        <Minus className="w-5 h-5" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 md:px-8 pb-8 text-muted-foreground leading-[1.8] text-lg border-t border-border/50 pt-6 mt-2">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 🌟 6. CTA (GRAND CALL TO ACTION) */}
      <section className="py-32 px-4 lg:px-8 bg-background relative overflow-hidden">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="bg-primary rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/20"
          >
            {/* Latar Belakang CTA Premium */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-60" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-black/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <Handshake className="w-16 h-16 text-primary-foreground/90 mb-8" />
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary-foreground mb-12 text-balance">
                {data?.cta_title ||
                  "Mari bahas model yang paling tepat untuk Anda."}
              </h2>
              <Button
                size="lg"
                className="h-16 px-10 text-lg font-bold rounded-full bg-background text-primary hover:bg-secondary hover:scale-105 transition-all duration-300 shadow-xl group"
                asChild
              >
                <Link href={data?.cta_link || "/proposal-kerjasama"}>
                  {data?.cta_text || "Hubungi Tim Kemitraan"}
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

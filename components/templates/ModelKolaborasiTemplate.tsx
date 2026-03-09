"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

  // --- DATA FALLBACK (DISESUAIKAN DENGAN LAYANAN) ---
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

  // Penentuan Data Akhir
  const models = data?.models?.length ? data.models : fallbackModels;
  const perbandingan = data?.perbandingan_features?.length
    ? data.perbandingan_features
    : fallbackPerbandingan;
  const alur = data?.alur?.length ? data.alur : fallbackAlur;
  const faqs = data?.faqs?.length ? data.faqs : fallbackFaqs;

  return (
    <div className="flex flex-col w-full bg-background font-sans text-foreground overflow-hidden">
      {/* 🌟 1. HERO SECTION */}
      <section className="relative pt-16 pb-16 lg:pt-24 lg:pb-16 px-4 lg:px-8 bg-card border-b border-border overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-6 text-center lg:text-left"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold text-primary bg-primary/10 border border-primary/20"
              >
                Pilih Jalur Kolaborasi
              </motion.div>
              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]"
              >
                {data?.hero_title ||
                  "Model Kolaborasi Berbasis Dampak & Layanan"}
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0"
              >
                {data?.hero_subtitle ||
                  "Mulai dari intervensi spesifik hingga transformasi holistik, kami menstrukturisasi portofolio layanan kami agar sejalan dengan skala dan ambisi program Anda."}
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-md mx-auto lg:max-w-lg aspect-[4/3] bg-muted border border-border rounded-[32px] md:rounded-[40px] overflow-hidden flex items-center justify-center group shadow-xl"
            >
              <ImageIcon className="w-16 h-16 md:w-20 md:h-20 text-muted-foreground/30 group-hover:scale-110 transition-transform duration-700" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🌟 2. PERBANDINGAN MODEL (3 Kolom Kartu Sesuai Wireframe) */}
      <section className="py-20 lg:py-28 px-4 lg:px-8 bg-background border-b border-border">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Perbandingan Pendekatan
            </h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
              Analisis komparatif untuk membantu Anda memetakan kebutuhan
              integrasi layanan.
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
                className="group bg-card border border-border rounded-[32px] p-8 shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="text-center mb-8 border-b border-border pb-6">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {model.title}
                  </h3>
                </div>

                <ul className="space-y-4 flex-grow">
                  {perbandingan.map((feat, fIdx) => {
                    const hasFeature =
                      idx === 0
                        ? feat.model_1_has
                        : idx === 1
                          ? feat.model_2_has
                          : feat.model_3_has;

                    return (
                      <li key={fIdx} className="flex items-start gap-3">
                        {hasFeature ? (
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        ) : (
                          <Minus className="w-5 h-5 text-muted-foreground/30 shrink-0 mt-0.5" />
                        )}
                        <span
                          className={`text-sm leading-relaxed ${hasFeature ? "text-foreground font-medium" : "text-muted-foreground line-through opacity-70"}`}
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

      {/* 🌟 3. DEFAULT MODEL (Tab Dinamis Sesuai Wireframe) */}
      <section className="py-20 lg:py-28 px-4 lg:px-8 bg-secondary/10 border-b border-border">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="mb-10 text-center md:text-left"
          >
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              {data?.model_title || "Detail Integrasi Layanan"}
            </h2>
            <p className="text-lg text-muted-foreground mt-4">
              {data?.model_subtitle ||
                "Pelajari lebih dalam mengenai cara kerja tiap skema kolaborasi."}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
          >
            <div className="flex flex-col md:flex-row rounded-t-2xl border border-border overflow-hidden bg-background">
              {models.map((model, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`flex-1 py-5 px-6 text-center font-bold text-sm md:text-base transition-all ${
                    activeTab === idx
                      ? "bg-primary/10 text-primary border-b-2 border-primary"
                      : "bg-transparent text-muted-foreground hover:bg-secondary/50 hover:text-foreground border-b-2 border-transparent"
                  }`}
                >
                  {model.title}
                </button>
              ))}
            </div>

            <div className="border border-t-0 border-border rounded-b-2xl bg-card p-8 lg:p-12 shadow-sm min-h-[350px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-lg text-foreground leading-relaxed whitespace-pre-wrap mb-10">
                    {models[activeTab].description}
                  </p>

                  <div className="bg-background border border-border rounded-xl p-6 lg:p-8">
                    <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-sm">
                      Fokus Eksekusi:
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {models[activeTab].features.map((feat, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 bg-secondary/30 p-4 rounded-lg"
                        >
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                          <span className="text-muted-foreground text-sm leading-relaxed">
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 pt-6 border-t border-border flex items-center gap-3">
                      <span className="text-sm font-semibold text-muted-foreground">
                        Rekomendasi untuk:{" "}
                      </span>
                      <span className="text-sm text-primary font-bold bg-primary/10 px-3 py-1 rounded-full">
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

      {/* 🌟 4. ALUR KOLABORASI */}
      <section className="py-20 lg:py-28 px-4 lg:px-8 bg-background">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 relative"
          >
            <motion.div variants={fadeInUp} className="lg:pr-8">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-8">
                {data?.alur_title || "Alur Kolaborasi"}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap text-justify md:text-left">
                {data?.alur_description ||
                  "Kami percaya bahwa kolaborasi yang sukses diawali dengan komunikasi yang transparan dan perencanaan yang matang untuk memastikan layanan kami relevan dengan tujuan Anda.\n\nProses ini sangat fleksibel dan dapat diadaptasi menyesuaikan kompleksitas serta pilar layanan yang akan kita eksekusi bersama di lapangan."}
              </p>
            </motion.div>

            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2"></div>

            <motion.div
              variants={staggerContainer}
              className="flex flex-col gap-6 lg:pl-8"
            >
              {alur.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="bg-card border border-border p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all group"
                >
                  <div className="flex gap-6 items-start">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary group-hover:bg-primary transition-colors flex items-center justify-center text-xl font-black text-foreground group-hover:text-primary-foreground">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
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

      {/* 🌟 5. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 lg:py-28 px-4 lg:px-8 bg-card border-t border-border">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
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
                  className={`border rounded-2xl transition-colors duration-300 ${
                    isOpen
                      ? "bg-background border-primary/30 shadow-sm"
                      : "bg-transparent border-border hover:bg-background/50"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <span className="text-lg font-bold pr-8 text-foreground">
                      {faq.question}
                    </span>
                    <div
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isOpen
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      {isOpen ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
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
                        <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
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

      {/* 🌟 6. CTA */}
      <section className="py-24 px-4 lg:px-8 bg-background text-center relative border-t border-border">
        <div className="container mx-auto max-w-2xl relative z-10">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-8">
            {data?.cta_title ||
              "Mari bahas model yang paling tepat untuk Anda."}
          </h2>
          <Button
            size="lg"
            className="h-14 px-10 text-base rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-300 group"
            asChild
          >
            <a href={data?.cta_link || "/proposal-kerjasama"}>
              Hubungi Tim Kami{" "}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}

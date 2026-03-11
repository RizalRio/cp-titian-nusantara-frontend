"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Grip,
  Upload,
  CheckCircle2,
  X,
  Sparkles,
  Loader2,
  AlertCircle,
  FileCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

// --- TIPE DATA DARI CMS ---
export interface ProposalKerjasamaData {
  hero_title?: string;
  hero_subtitle?: string;
}

// --- VARIABEL ANIMASI ---
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

export function ProposalKerjasamaTemplate({
  data,
}: {
  data?: ProposalKerjasamaData;
}) {
  const [role, setRole] = useState<"instansi" | "perusahaan" | null>(null);
  const [formData, setFormData] = useState({
    namaLengkap: "",
    email: "",
    namaOrganisasi: "",
    identitasTambahan: "",
    jenisKerjasama: "",
    catatan: "",
    file: null as File | null,
  });

  const [agreed, setAgreed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // State Pengiriman Data
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleReset = () => {
    setRole(null);
    setFormData({
      namaLengkap: "",
      email: "",
      namaOrganisasi: "",
      identitasTambahan: "",
      jenisKerjasama: "",
      catatan: "",
      file: null,
    });
    setAgreed(false);
    setSubmitStatus({ type: null, message: "" });
  };

  useEffect(() => {
    let filledFields = 0;
    const totalFields = 8;
    if (role !== null) filledFields++;
    if (formData.namaLengkap.trim() !== "") filledFields++;
    if (formData.email.trim() !== "") filledFields++;
    if (formData.namaOrganisasi.trim() !== "") filledFields++;
    if (formData.identitasTambahan.trim() !== "") filledFields++;
    if (formData.jenisKerjasama.trim() !== "") filledFields++;
    if (formData.catatan.trim() !== "") filledFields++;
    if (formData.file !== null) filledFields++;

    setProgress(Math.round((filledFields / totalFields) * 100));
  }, [formData, role]);

  // --- FUNGSI SUBMIT KE API ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (progress < 100 || !agreed) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Menggunakan FormData karena ada unggahan file fisik
      const payload = new FormData();
      payload.append("contact_person", formData.namaLengkap);
      payload.append("email", formData.email);
      payload.append("organization_name", formData.namaOrganisasi);
      payload.append("additional_identity", formData.identitasTambahan); // Misal NIP/Website
      payload.append("collaboration_type", formData.jenisKerjasama);
      payload.append("message", formData.catatan);
      payload.append("role_type", role || "");
      if (formData.file) {
        payload.append("proposal_file", formData.file);
      }

      await api.post("/api/v1/collaboration-requests/upload", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmitStatus({
        type: "success",
        message:
          "Proposal berhasil dikirim. Tim kami akan segera meninjau dan menghubungi Anda.",
      });

      // Reset form otomatis setelah sukses
      setTimeout(() => {
        handleReset();
      }, 3000);
    } catch (error) {
      console.error("Error submitting proposal:", error);
      setSubmitStatus({
        type: "error",
        message:
          "Gagal mengirim proposal. Pastikan koneksi stabil dan ukuran file maksimal 5MB.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelOrganisasi =
    role === "instansi"
      ? "Nama Instansi / Dinas"
      : role === "perusahaan"
        ? "Nama Perusahaan"
        : "Nama Instansi / Perusahaan";
  const labelIdentitasTambahan =
    role === "instansi"
      ? "NIP / Jabatan"
      : role === "perusahaan"
        ? "Website Perusahaan"
        : "NIP / Website";

  return (
    <div className="flex flex-col w-full bg-[#F9F9F7] dark:bg-background font-sans text-foreground min-h-screen pb-32 relative">
      {/* 🌟 MODAL KEBIJAKAN PRIVASI */}
      <AnimatePresence>
        {isPrivacyModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-card border border-border w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 md:p-8 border-b border-border/50 flex justify-between items-center bg-secondary/20">
                <h3 className="text-xl font-extrabold text-foreground">
                  Kebijakan Privasi
                </h3>
                <button
                  onClick={() => setIsPrivacyModalOpen(false)}
                  className="p-2 rounded-full bg-background border border-border hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-sm group"
                >
                  <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                </button>
              </div>
              <div className="p-6 md:p-8 text-muted-foreground leading-relaxed text-[1.05rem] space-y-4">
                <p>
                  Seluruh data identitas dan dokumen proposal yang Anda unggah
                  dijamin kerahasiaannya. Data tersebut hanya akan digunakan
                  untuk keperluan asesmen internal Titian Nusantara dan tidak
                  akan disebarluaskan kepada pihak ketiga tanpa persetujuan
                  tertulis dari Anda.
                </p>
              </div>
              <div className="p-6 border-t border-border/50 bg-secondary/10 flex justify-end">
                <Button
                  size="lg"
                  className="w-full md:w-auto rounded-full font-bold px-8"
                  onClick={() => setIsPrivacyModalOpen(false)}
                >
                  Saya Mengerti
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 1. HERO SECTION */}
      <section className="relative pt-36 pb-24 lg:pt-40 lg:pb-32 px-4 lg:px-8 bg-card border-b border-border/40 overflow-hidden rounded-b-[3rem] md:rounded-b-[4rem] shadow-sm">
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6 flex flex-col items-center"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center rounded-full px-5 py-2 text-[11px] font-bold tracking-[0.2em] uppercase text-primary bg-primary/5 border border-primary/10 shadow-sm backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 mr-2 text-amber-500" />
              Pengajuan Kerjasama
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] text-balance"
            >
              {data?.hero_title || "Kirimkan Proposal Kolaborasi Anda."}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl font-medium"
            >
              {data?.hero_subtitle ||
                "Lengkapi formulir di bawah ini dengan detail yang komprehensif untuk memulai langkah transformasi bersama kami."}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 🌟 2. STICKY PROGRESS BAR (Glassmorphism) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="sticky top-[4.5rem] md:top-20 z-40 px-4 lg:px-8 py-4 -mt-10"
      >
        <div className="container mx-auto max-w-3xl bg-background/80 backdrop-blur-xl border border-border/60 shadow-lg shadow-primary/5 rounded-3xl px-6 py-5 flex items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex justify-between text-sm font-extrabold tracking-wide text-foreground mb-3">
              <span className="uppercase text-muted-foreground">
                Kelengkapan Data
              </span>
              <span
                className={
                  progress === 100 ? "text-primary" : "text-foreground"
                }
              >
                {progress}%
              </span>
            </div>
            <div className="w-full bg-secondary/50 rounded-full h-3 overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-primary to-primary/80 h-full rounded-full transition-all duration-700 ease-out"
              ></motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 🌟 3. FORM SECTION */}
      <section className="py-16 px-4 lg:px-8 relative z-10">
        <div className="container mx-auto max-w-3xl">
          {/* Notifikasi Status Pengiriman */}
          <AnimatePresence mode="wait">
            {submitStatus.type && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-6 mb-10 rounded-[2rem] font-bold flex items-center gap-4 text-sm shadow-sm border ${
                  submitStatus.type === "success"
                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/50"
                    : "bg-destructive/10 text-destructive border-destructive/20"
                }`}
              >
                {submitStatus.type === "success" ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <AlertCircle className="w-6 h-6" />
                )}
                <p className="text-[1.05rem]">{submitStatus.message}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="space-y-12"
            >
              {/* --- SAYA SEBAGAI (Role Selection) --- */}
              <motion.div variants={fadeInUp} className="space-y-5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-black flex items-center justify-center text-sm shadow-sm">
                    1
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    Identitas Entitas
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl">
                  {["instansi", "perusahaan"].map((r) => (
                    <button
                      key={r}
                      type="button" // Penting: agar tidak memicu form submit saat diklik
                      onClick={() => setRole(r as any)}
                      className={`flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 transition-all duration-300 group outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${
                        role === r
                          ? "border-primary bg-primary/5 shadow-xl shadow-primary/10 scale-105"
                          : "border-border bg-card hover:bg-secondary/50 hover:border-primary/30"
                      }`}
                    >
                      <Grip
                        className={`w-10 h-10 mb-4 transition-transform duration-300 ${role === r ? "text-primary" : "text-muted-foreground group-hover:scale-110"}`}
                      />
                      <span
                        className={`font-bold tracking-wide uppercase text-sm ${role === r ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}
                      >
                        {r === "instansi"
                          ? "Instansi Pemerintah"
                          : "Korporasi Swasta"}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* --- KONTAK --- */}
              <motion.div variants={fadeInUp} className="space-y-5">
                <div className="flex items-center gap-3 mb-6 pt-8 border-t border-border/50">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-black flex items-center justify-center text-sm shadow-sm">
                    2
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    Informasi Narahubung
                  </h3>
                </div>

                <div className="bg-card border border-border/60 rounded-[2.5rem] p-8 md:p-10 space-y-6 shadow-xl shadow-primary/5">
                  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-3 md:gap-6">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      Nama Lengkap PIC
                    </label>
                    <input
                      type="text"
                      name="namaLengkap"
                      required
                      placeholder="Misal: Budi Santoso"
                      value={formData.namaLengkap}
                      onChange={handleChange}
                      className="w-full bg-muted/30 border border-border/60 rounded-2xl px-5 py-3.5 text-foreground focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-3 md:gap-6">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="email@domain.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-muted/30 border border-border/60 rounded-2xl px-5 py-3.5 text-foreground focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-3 md:gap-6">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      {labelOrganisasi}
                    </label>
                    <input
                      type="text"
                      name="namaOrganisasi"
                      required
                      placeholder="Ketik nama organisasi..."
                      value={formData.namaOrganisasi}
                      onChange={handleChange}
                      className="w-full bg-muted/30 border border-border/60 rounded-2xl px-5 py-3.5 text-foreground focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-3 md:gap-6">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      {labelIdentitasTambahan}
                    </label>
                    <input
                      type="text"
                      name="identitasTambahan"
                      placeholder="Opsional / Bisa diisi NIP atau URL Website"
                      value={formData.identitasTambahan}
                      onChange={handleChange}
                      className="w-full bg-muted/30 border border-border/60 rounded-2xl px-5 py-3.5 text-foreground focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all font-medium"
                    />
                  </div>
                </div>
              </motion.div>

              {/* --- DETAIL PROPOSAL --- */}
              <motion.div variants={fadeInUp} className="space-y-5">
                <div className="flex items-center gap-3 mb-6 pt-8 border-t border-border/50">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-black flex items-center justify-center text-sm shadow-sm">
                    3
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    Detail Dokumen Proposal
                  </h3>
                </div>

                <div className="bg-card border border-border/60 rounded-[2.5rem] p-8 md:p-10 space-y-8 shadow-xl shadow-primary/5">
                  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-3 md:gap-6">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      Skema Kerjasama
                    </label>
                    <select
                      name="jenisKerjasama"
                      required
                      value={formData.jenisKerjasama}
                      onChange={handleChange}
                      className="w-full bg-muted/30 border border-border/60 rounded-2xl px-5 py-3.5 text-foreground focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all font-medium cursor-pointer appearance-none"
                    >
                      <option value="" disabled>
                        Pilih kerangka kolaborasi...
                      </option>
                      <option value="Implementasi Layanan Tematik">
                        Implementasi Layanan Tematik
                      </option>
                      <option value="Kemitraan Wilayah Terintegrasi">
                        Kemitraan Wilayah Terintegrasi
                      </option>
                      <option value="Ko-Kreasi & Advokasi Strategis">
                        Ko-Kreasi & Advokasi Strategis
                      </option>
                    </select>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest block">
                      Catatan Kebutuhan Singkat
                    </label>
                    <textarea
                      name="catatan"
                      required
                      value={formData.catatan}
                      onChange={handleChange}
                      placeholder="Jelaskan secara ringkas poin-poin utama dari proposal atau tujuan akhir yang ingin dicapai..."
                      rows={5}
                      className="w-full bg-muted/30 border border-border/60 rounded-[1.5rem] px-5 py-4 text-foreground focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all resize-none font-medium leading-relaxed"
                    ></textarea>
                  </div>

                  {/* Area Upload File Custom */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest block">
                      Unggah File Proposal
                    </label>
                    <div className="relative group">
                      <input
                        type="file"
                        id="file-upload"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div
                        className={`w-full border-2 border-dashed rounded-[1.5rem] p-8 flex flex-col items-center justify-center text-center transition-all duration-300 ${
                          formData.file
                            ? "border-primary bg-primary/5"
                            : "border-border/60 bg-muted/30 group-hover:bg-background group-hover:border-primary/50"
                        }`}
                      >
                        {formData.file ? (
                          <>
                            <FileCheck2 className="w-12 h-12 text-primary mb-3" />
                            <span className="text-foreground font-bold text-lg mb-1">
                              {formData.file.name}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                              • Siap dikirim
                            </span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-10 h-10 text-muted-foreground/50 mb-3 group-hover:text-primary transition-colors" />
                            <span className="text-foreground font-bold mb-1">
                              Klik atau seret file ke area ini
                            </span>
                            <span className="text-muted-foreground text-sm">
                              Mendukung format PDF, DOC, DOCX (Maks. 5MB)
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Persetujuan */}
                  <div className="flex items-start gap-4 pt-6 border-t border-border/60 mt-8">
                    <input
                      type="checkbox"
                      id="setuju"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1 w-6 h-6 rounded border-2 border-border/80 text-primary focus:ring-primary/20 bg-background cursor-pointer shrink-0 transition-all"
                    />
                    <label
                      htmlFor="setuju"
                      className="text-[1.05rem] text-muted-foreground leading-relaxed cursor-pointer select-none font-medium"
                    >
                      Dengan mencentang kotak ini, saya menyetujui bahwa data
                      yang diunggah akan diproses sesuai dengan{" "}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsPrivacyModalOpen(true);
                        }}
                        className="text-primary font-bold hover:underline transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                      >
                        Kebijakan Privasi
                      </button>{" "}
                      Titian Nusantara.
                    </label>
                  </div>

                  {/* Tombol Aksi */}
                  <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-8">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto px-8 rounded-full h-14 font-bold text-base border-border hover:bg-secondary"
                      onClick={handleReset}
                      disabled={isSubmitting}
                    >
                      Reset Form
                    </Button>
                    <Button
                      type="submit"
                      disabled={progress < 100 || !agreed || isSubmitting}
                      className={`w-full sm:w-auto px-12 rounded-full h-14 font-extrabold text-base transition-all duration-300 ${
                        progress === 100 && agreed
                          ? "shadow-xl shadow-primary/30 hover:-translate-y-1 bg-primary text-primary-foreground"
                          : "opacity-60 cursor-not-allowed bg-muted text-muted-foreground"
                      }`}
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        "Kirim Proposal"
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </form>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grip, Upload, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const labelOrganisasi =
    role === "instansi"
      ? "Nama Instansi"
      : role === "perusahaan"
        ? "Nama Perusahaan"
        : "Nama Instansi / Perusahaan";
  const labelIdentitasTambahan =
    role === "instansi"
      ? "NIP"
      : role === "perusahaan"
        ? "Website"
        : "NIP / Website";

  return (
    <div className="flex flex-col w-full bg-background font-sans text-foreground min-h-screen pb-24 relative">
      <AnimatePresence>
        {isPrivacyModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-card border border-border w-full max-w-lg rounded-3xl shadow-xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/30">
                <h3 className="text-xl font-bold text-foreground">
                  Kebijakan Privasi
                </h3>
                <button
                  onClick={() => setIsPrivacyModalOpen(false)}
                  className="p-2 rounded-full hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 text-muted-foreground leading-relaxed text-sm space-y-4">
                <p>
                  Seluruh data dan dokumen proposal Anda dijamin kerahasiaannya
                  untuk keperluan internal Titian Nusantara.
                </p>
              </div>
              <div className="p-6 border-t border-border bg-secondary/10">
                <Button
                  className="w-full rounded-xl"
                  onClick={() => setIsPrivacyModalOpen(false)}
                >
                  Saya Mengerti
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 1. HERO SECTION (Muncul otomatis saat load) */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-20 px-4 lg:px-8 bg-card border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold text-primary bg-primary/10 border border-primary/20"
            >
              Pengajuan Kerjasama
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground"
            >
              {data?.hero_title || "Kirimkan Proposal Anda"}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            >
              {data?.hero_subtitle ||
                "Lengkapi formulir di bawah ini untuk memulai langkah kolaborasi."}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 🌟 2. STICKY PROGRESS BAR */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="sticky top-16 z-40 bg-background/90 backdrop-blur-xl border-b border-border shadow-sm px-4 lg:px-8 py-4"
      >
        <div className="container mx-auto max-w-3xl flex items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex justify-between text-sm font-bold text-foreground mb-2">
              <span>Kelengkapan Data</span>
              <span className={progress === 100 ? "text-primary" : ""}>
                {progress}%
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
              ></motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 🌟 3. FORM SECTION (Menggunakan whileInView untuk animasi scroll) */}
      <section className="py-16 px-4 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-12"
          >
            {/* --- SAYA SEBAGAI --- */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Saya Sebagai:
              </h3>
              <div className="grid grid-cols-2 gap-6 max-w-lg">
                {["instansi", "perusahaan"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r as any)}
                    className={`flex flex-col items-center justify-center p-8 rounded-2xl border transition-all duration-300 ${role === r ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-border bg-card hover:bg-secondary/50"}`}
                  >
                    <Grip
                      className={`w-10 h-10 mb-4 ${role === r ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <span
                      className={`font-semibold capitalize ${role === r ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {r}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* --- KONTAK --- */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <h3 className="text-xl font-bold text-foreground">Kontak</h3>
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-2 md:gap-4">
                  <label className="text-sm font-medium text-muted-foreground">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="namaLengkap"
                    value={formData.namaLengkap}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-2 md:gap-4">
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-2 md:gap-4">
                  <label className="text-sm font-medium text-muted-foreground">
                    {labelOrganisasi}
                  </label>
                  <input
                    type="text"
                    name="namaOrganisasi"
                    value={formData.namaOrganisasi}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-2 md:gap-4">
                  <label className="text-sm font-medium text-muted-foreground">
                    {labelIdentitasTambahan}
                  </label>
                  <input
                    type="text"
                    name="identitasTambahan"
                    value={formData.identitasTambahan}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>
            </motion.div>

            {/* --- KIRIM PROPOSAL --- */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <h3 className="text-xl font-bold text-foreground">
                Kirim Proposal Anda
              </h3>
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-2 md:gap-4">
                  <label className="text-sm font-medium text-muted-foreground">
                    Jenis Kerjasama
                  </label>
                  <select
                    name="jenisKerjasama"
                    value={formData.jenisKerjasama}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
                  >
                    <option value="">Pilih jenis kerjasama...</option>
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
                <div className="space-y-2 pt-2">
                  <label className="text-sm font-medium text-muted-foreground block">
                    Catatan Kebutuhan
                  </label>
                  <textarea
                    name="catatan"
                    value={formData.catatan}
                    onChange={handleChange}
                    rows={6}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  ></textarea>
                </div>
                <div className="flex border border-border rounded-lg overflow-hidden bg-background shadow-sm mt-4">
                  <div className="flex-1 px-4 py-3 text-muted-foreground text-sm flex items-center overflow-hidden whitespace-nowrap">
                    {formData.file ? (
                      <span className="text-foreground font-medium truncate">
                        {formData.file.name}
                      </span>
                    ) : (
                      "Proposal.pdf / .doc"
                    )}
                  </div>
                  <label className="bg-secondary hover:bg-secondary/80 text-foreground px-8 py-3 cursor-pointer font-medium border-l border-border transition-colors flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Upload
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex items-start gap-3 pt-4 border-t border-border mt-6">
                  <input
                    type="checkbox"
                    id="setuju"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded text-primary border-border bg-background cursor-pointer shrink-0"
                  />
                  <label
                    htmlFor="setuju"
                    className="text-sm text-muted-foreground leading-relaxed cursor-pointer select-none"
                  >
                    Saya menyetujui pengumpulan data sesuai dengan{" "}
                    <button
                      type="button"
                      onClick={() => setIsPrivacyModalOpen(true)}
                      className="text-primary font-bold underline hover:text-primary/80 transition-colors"
                    >
                      Kebijakan Privasi
                    </button>{" "}
                    Titian Nusantara.
                  </label>
                </div>
                <div className="flex items-center justify-between pt-6">
                  <Button
                    variant="outline"
                    className="px-8 rounded-lg h-11"
                    onClick={handleReset}
                  >
                    Kembali
                  </Button>
                  <Button
                    disabled={progress < 100 || !agreed}
                    className={`px-10 rounded-lg h-11 transition-all ${progress === 100 && agreed ? "shadow-md shadow-primary/20 hover:scale-105 bg-primary text-primary-foreground" : "opacity-50 cursor-not-allowed bg-muted text-muted-foreground"}`}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

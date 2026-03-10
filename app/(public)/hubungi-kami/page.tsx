"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Handshake,
  Mail,
  MapPin,
  Phone,
  Loader2,
  FileUp,
  MessageSquare,
  Globe,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function HubungiKamiPage() {
  const [activeTab, setActiveTab] = useState<"pesan" | "kolaborasi">("pesan");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 🌟 State untuk Informasi Kontak Dinamis (Dari CMS)
  const [contactInfo, setContactInfo] = useState({
    address: "Jl. Nusantara No. 1, Jakarta, Indonesia",
    email: "halo@titiannusantara.com",
    phone: "+62 811 0000 0000",
  });
  const [isLoadingInfo, setIsLoadingInfo] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/api/v1/settings");
        if (res.data.status === "success" && res.data.data) {
          const data = res.data.data;

          if (!Array.isArray(data)) {
            setContactInfo((prev) => ({
              ...prev,
              email: data.email || prev.email,
              address: data.address || prev.address,
              phone: data.phone || prev.phone, // Asumsi ada field contact_phone
            }));
          } else {
            const getVal = (key: string) =>
              data.find((item: any) => item.key === key)?.value;
            setContactInfo((prev) => ({
              ...prev,
              email: getVal("contact_email") || prev.email,
              address: getVal("contact_address") || prev.address,
              phone: getVal("contact_phone") || prev.phone,
            }));
          }
        }
      } catch (error) {
        console.error("Gagal memuat info kontak:", error);
      } finally {
        setIsLoadingInfo(false);
      }
    };

    fetchSettings();
  }, []);

  // State Pesan Umum
  const [msgData, setMsgData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // State Kolaborasi
  const [collabData, setCollabData] = useState({
    organization_name: "",
    contact_person: "",
    email: "",
    phone: "",
    collaboration_type: "CSR & Sponsorship",
    message: "",
    proposal_file_url: "",
  });

  const handleMsgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await api.post("/api/v1/contact-messages", msgData);
      setSuccessMsg(
        "Pesan berhasil dikirim. Tim kami akan segera merespons ke email Anda.",
      );
      setMsgData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setErrorMsg(
        "Gagal mengirim pesan. Pastikan koneksi internet Anda stabil dan coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCollabSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await api.post("/api/v1/collaboration-requests", collabData);
      setSuccessMsg(
        "Pengajuan kolaborasi diterima! Tim kemitraan kami akan segera menghubungi Anda.",
      );
      setCollabData({
        organization_name: "",
        contact_person: "",
        email: "",
        phone: "",
        collaboration_type: "CSR & Sponsorship",
        message: "",
        proposal_file_url: "",
      });
    } catch (error) {
      setErrorMsg(
        "Gagal mengirim pengajuan kolaborasi. Silakan coba lagi nanti.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] dark:bg-background text-foreground font-sans pb-32">
      {/* 🌟 1. HERO SECTION (Organic & Texturized) */}
      <section className="relative pt-40 pb-36 px-4 lg:px-8 bg-primary overflow-hidden text-center rounded-b-[3rem] md:rounded-b-[5rem] shadow-sm">
        {/* Ornamen Latar Belakang */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-black/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold text-primary-foreground mb-8 tracking-tight leading-[1.1]">
              Sapa Kami, <br /> Rajut Kolaborasi.
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed max-w-2xl mx-auto font-medium text-balance">
              Pintu kami selalu terbuka untuk pertanyaan, diskusi, maupun
              ide-ide visioner guna menciptakan transformasi nyata di akar
              rumput.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 🌟 2. KONTEN UTAMA */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* INFORMASI KONTAK (Kiri) */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-card p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-primary/5 border border-border lg:sticky lg:top-32"
            >
              <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <Globe className="text-primary w-6 h-6" /> Kontak Resmi
              </h3>

              <ul className="space-y-8">
                <li className="group flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                      Lokasi Utama
                    </p>
                    {isLoadingInfo ? (
                      <div className="h-10 bg-muted animate-pulse rounded-lg w-48"></div>
                    ) : (
                      <p className="text-foreground leading-relaxed font-medium text-sm">
                        {contactInfo.address}
                      </p>
                    )}
                  </div>
                </li>

                <li className="group flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                      Surel / Email
                    </p>
                    {isLoadingInfo ? (
                      <div className="h-5 bg-muted animate-pulse rounded-lg w-40"></div>
                    ) : (
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="text-foreground font-semibold text-sm hover:text-primary transition-colors"
                      >
                        {contactInfo.email}
                      </a>
                    )}
                  </div>
                </li>

                <li className="group flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                      Telepon / WA
                    </p>
                    {isLoadingInfo ? (
                      <div className="h-5 bg-muted animate-pulse rounded-lg w-32"></div>
                    ) : (
                      <a
                        href={`tel:${contactInfo.phone}`}
                        className="text-foreground font-semibold text-sm hover:text-primary transition-colors"
                      >
                        {contactInfo.phone}
                      </a>
                    )}
                  </div>
                </li>
              </ul>

              <div className="mt-10 pt-8 border-t border-border/60">
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  "Menghubungkan niat baik dengan aksi nyata melalui kolaborasi
                  lintas sektor yang setara."
                </p>
              </div>
            </motion.div>
          </div>

          {/* FORMULIR (Kanan) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-8 bg-card p-6 md:p-12 rounded-[2.5rem] shadow-xl shadow-primary/5 border border-border"
          >
            {/* TABS PENGENDALI */}
            <div className="inline-flex bg-muted/50 p-1.5 rounded-2xl w-full max-w-md mx-auto mb-10 border border-border/50 flex-col sm:flex-row">
              <button
                onClick={() => {
                  setActiveTab("pesan");
                  setSuccessMsg("");
                  setErrorMsg("");
                }}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex justify-center items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  activeTab === "pesan"
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <MessageSquare className="w-4 h-4" /> Pesan Umum
              </button>
              <button
                onClick={() => {
                  setActiveTab("kolaborasi");
                  setSuccessMsg("");
                  setErrorMsg("");
                }}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex justify-center items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  activeTab === "kolaborasi"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Handshake className="w-4 h-4" /> Ajukan Kolaborasi
              </button>
            </div>

            {/* AREA NOTIFIKASI */}
            <AnimatePresence mode="wait">
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-5 mb-8 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 rounded-2xl border border-green-200 dark:border-green-900 font-bold text-center flex items-center justify-center gap-3 text-sm shadow-sm"
                >
                  <Handshake className="w-5 h-5" /> {successMsg}
                </motion.div>
              )}
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-5 mb-8 bg-destructive/10 text-destructive rounded-2xl border border-destructive/20 font-bold text-center flex items-center justify-center gap-3 text-sm shadow-sm"
                >
                  <AlertCircle className="w-5 h-5" /> {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>

            {/* FORM PESAN UMUM */}
            <AnimatePresence mode="wait">
              {activeTab === "pesan" ? (
                <motion.form
                  key="form-pesan"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleMsgSubmit}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <Label className="font-bold ml-1 text-foreground/80">
                        Nama Lengkap
                      </Label>
                      <Input
                        required
                        placeholder="Misal: Budi Santoso"
                        className="h-14 rounded-2xl bg-muted/30 border-border/50 focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-base"
                        value={msgData.name}
                        onChange={(e) =>
                          setMsgData({ ...msgData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2.5">
                      <Label className="font-bold ml-1 text-foreground/80">
                        Alamat Email
                      </Label>
                      <Input
                        type="email"
                        required
                        placeholder="alamat@email.com"
                        className="h-14 rounded-2xl bg-muted/30 border-border/50 focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-base"
                        value={msgData.email}
                        onChange={(e) =>
                          setMsgData({ ...msgData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <Label className="font-bold ml-1 text-foreground/80">
                      Subjek Diskusi
                    </Label>
                    <Input
                      required
                      placeholder="Apa yang ingin Anda sampaikan?"
                      className="h-14 rounded-2xl bg-muted/30 border-border/50 focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-base"
                      value={msgData.subject}
                      onChange={(e) =>
                        setMsgData({ ...msgData, subject: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="font-bold ml-1 text-foreground/80">
                      Detail Pesan
                    </Label>
                    <Textarea
                      required
                      placeholder="Tuliskan pesan Anda secara lengkap di sini..."
                      className="min-h-[180px] rounded-[24px] bg-muted/30 border-border/50 focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all resize-none p-5 text-base leading-relaxed"
                      value={msgData.message}
                      onChange={(e) =>
                        setMsgData({ ...msgData, message: e.target.value })
                      }
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-base font-bold transition-all shadow-xl shadow-primary/20 hover:-translate-y-1"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-3" /> Kirim Pesan Umum
                      </>
                    )}
                  </Button>
                </motion.form>
              ) : (
                /* FORM KOLABORASI */
                <motion.form
                  key="form-kolaborasi"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleCollabSubmit}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <Label className="font-bold ml-1 text-foreground/80">
                        Institusi / Perusahaan
                      </Label>
                      <Input
                        required
                        placeholder="Nama organisasi Anda..."
                        className="h-14 rounded-2xl bg-muted/30 border-border/50 focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-base"
                        value={collabData.organization_name}
                        onChange={(e) =>
                          setCollabData({
                            ...collabData,
                            organization_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2.5">
                      <Label className="font-bold ml-1 text-foreground/80">
                        Narahubung (PIC)
                      </Label>
                      <Input
                        required
                        placeholder="Nama lengkap PIC..."
                        className="h-14 rounded-2xl bg-muted/30 border-border/50 focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-base"
                        value={collabData.contact_person}
                        onChange={(e) =>
                          setCollabData({
                            ...collabData,
                            contact_person: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2.5">
                      <Label className="font-bold ml-1 text-foreground/80">
                        Email Resmi
                      </Label>
                      <Input
                        type="email"
                        required
                        placeholder="email@institusi.com"
                        className="h-14 rounded-2xl bg-muted/30 border-border/50 focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-base"
                        value={collabData.email}
                        onChange={(e) =>
                          setCollabData({
                            ...collabData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2.5">
                      <Label className="font-bold ml-1 text-foreground/80">
                        Nomor Telepon / WA
                      </Label>
                      <Input
                        required
                        placeholder="+62 8..."
                        className="h-14 rounded-2xl bg-muted/30 border-border/50 focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-base"
                        value={collabData.phone}
                        onChange={(e) =>
                          setCollabData({
                            ...collabData,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label className="font-bold ml-1 text-foreground/80">
                      Skema Kolaborasi
                    </Label>
                    <select
                      required
                      className="flex h-14 w-full items-center justify-between rounded-2xl border border-border/50 bg-muted/30 px-4 py-2 text-base focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium appearance-none"
                      value={collabData.collaboration_type}
                      onChange={(e) =>
                        setCollabData({
                          ...collabData,
                          collaboration_type: e.target.value,
                        })
                      }
                    >
                      <option value="CSR & Sponsorship">
                        Program CSR & Investasi Sosial
                      </option>
                      <option value="Media Partner">
                        Kemitraan Media & Publikasi
                      </option>
                      <option value="Relawan & Komunitas">
                        Gerakan Relawan & Komunitas
                      </option>
                      <option value="Penelitian & Akademik">
                        Kolaborasi Riset & Akademik
                      </option>
                      <option value="Lainnya">Bentuk Kerja Sama Lainnya</option>
                    </select>
                  </div>

                  <div className="space-y-2.5">
                    <Label className="font-bold ml-1 text-foreground/80">
                      Ringkasan Ide Kerjasama
                    </Label>
                    <Textarea
                      required
                      placeholder="Jelaskan secara singkat visi atau tawaran kolaborasi Anda..."
                      className="min-h-[140px] rounded-[24px] bg-muted/30 border-border/50 focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all resize-none p-5 text-base leading-relaxed"
                      value={collabData.message}
                      onChange={(e) =>
                        setCollabData({
                          ...collabData,
                          message: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2.5 p-6 bg-primary/5 rounded-[24px] border-2 border-primary/20 border-dashed hover:border-primary/40 transition-colors">
                    <Label className="flex items-center gap-2 text-primary font-bold mb-3">
                      <FileUp className="w-5 h-5" /> Tautan Proposal / Pitch
                      Deck (Opsional)
                    </Label>
                    <Input
                      placeholder="Masukkan URL Google Drive, Dropbox, atau Notion..."
                      className="h-14 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
                      value={collabData.proposal_file_url}
                      onChange={(e) =>
                        setCollabData({
                          ...collabData,
                          proposal_file_url: e.target.value,
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground ml-1 mt-2 font-medium">
                      *Pastikan tautan dapat diakses secara publik (Anyone with
                      the link can view).
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-base font-bold transition-all shadow-xl shadow-primary/20 hover:-translate-y-1"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <Handshake className="w-6 h-6 mr-3" /> Ajukan Kolaborasi
                        Sekarang
                      </>
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
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
    try {
      await api.post("/api/v1/contact-messages", msgData);
      setSuccessMsg("Pesan berhasil dikirim. Tim kami akan segera merespons.");
      setMsgData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      alert("Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCollabSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg("");
    try {
      await api.post("/api/v1/collaboration-requests", collabData);
      setSuccessMsg(
        "Pengajuan kolaborasi diterima. Mari merajut dampak bersama!",
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
      alert("Gagal mengirim pengajuan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/10 text-foreground font-sans pb-32">
      {/* 🌟 1. HERO SECTION */}
      <section className="relative pt-32 pb-28 px-4 lg:px-8 bg-primary overflow-hidden text-center rounded-b-[40px] md:rounded-b-[80px]">
        {/* Ornamen Latar Belakang */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-black/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground mb-8 tracking-tight leading-tight">
              Sapa Kami, <br /> Rajut Kolaborasi
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto font-medium">
              Pintu kami selalu terbuka untuk pertanyaan, diskusi, maupun
              ide-ide visioner guna menciptakan transformasi berkelanjutan bagi
              masyarakat.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 🌟 2. KONTEN UTAMA */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* INFORMASI KONTAK (Kiri) */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card p-8 md:p-10 rounded-[40px] shadow-xl shadow-primary/5 border border-border sticky top-28"
            >
              <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <Globe className="text-primary w-6 h-6" /> Hubungi Kami
              </h3>

              <ul className="space-y-8">
                <li className="group flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">
                      Lokasi
                    </p>
                    <p className="text-foreground leading-relaxed font-medium">
                      Jl. Jend. Sudirman No. 45, <br />
                      Jakarta Selatan, 12190 <br />
                      Indonesia
                    </p>
                  </div>
                </li>

                <li className="group flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">
                      Email Resmi
                    </p>
                    <p className="text-foreground font-semibold">
                      halo@titiannusantara.org
                    </p>
                  </div>
                </li>

                <li className="group flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">
                      Telepon / WA
                    </p>
                    <p className="text-foreground font-semibold">
                      +62 21 555 1234
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-12 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  "Menghubungkan niat baik dengan aksi nyata melalui kolaborasi
                  lintas sektor."
                </p>
              </div>
            </motion.div>
          </div>

          {/* FORMULIR (Kanan) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-8 bg-card p-6 md:p-12 rounded-[40px] shadow-2xl shadow-primary/5 border border-border"
          >
            {/* TABS PENGENDALI */}
            <div className="inline-flex bg-secondary/50 p-1.5 rounded-2xl w-full max-w-md mx-auto mb-12 border border-border">
              <button
                onClick={() => setActiveTab("pesan")}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex justify-center items-center gap-2 ${
                  activeTab === "pesan"
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <MessageSquare className="w-4 h-4" /> Pesan Umum
              </button>
              <button
                onClick={() => setActiveTab("kolaborasi")}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex justify-center items-center gap-2 ${
                  activeTab === "kolaborasi"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Handshake className="w-4 h-4" /> Ajukan Kolaborasi
              </button>
            </div>

            <AnimatePresence mode="wait">
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-6 mb-8 bg-primary/10 text-primary rounded-[24px] border border-primary/20 font-bold text-center flex items-center justify-center gap-3"
                >
                  <Handshake className="w-6 h-6" /> {successMsg}
                </motion.div>
              )}
            </AnimatePresence>

            {/* FORM PESAN UMUM */}
            <AnimatePresence mode="wait">
              {activeTab === "pesan" ? (
                <motion.form
                  key="form-pesan"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleMsgSubmit}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold ml-1">Nama Lengkap</Label>
                      <Input
                        required
                        placeholder="Masukkan nama Anda..."
                        className="h-14 rounded-2xl bg-secondary/30 border-border focus:bg-background transition-all"
                        value={msgData.name}
                        onChange={(e) =>
                          setMsgData({ ...msgData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold ml-1">Alamat Email</Label>
                      <Input
                        type="email"
                        required
                        placeholder="alamat@email.com"
                        className="h-14 rounded-2xl bg-secondary/30 border-border focus:bg-background transition-all"
                        value={msgData.email}
                        onChange={(e) =>
                          setMsgData({ ...msgData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold ml-1">Subjek</Label>
                    <Input
                      required
                      placeholder="Apa yang ingin Anda diskusikan?"
                      className="h-14 rounded-2xl bg-secondary/30 border-border focus:bg-background transition-all"
                      value={msgData.subject}
                      onChange={(e) =>
                        setMsgData({ ...msgData, subject: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold ml-1">Detail Pesan</Label>
                    <Textarea
                      required
                      placeholder="Tuliskan pesan Anda secara lengkap..."
                      className="min-h-[180px] rounded-[24px] bg-secondary/30 border-border focus:bg-background transition-all resize-none p-4"
                      value={msgData.message}
                      onChange={(e) =>
                        setMsgData({ ...msgData, message: e.target.value })
                      }
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-black transition-all shadow-xl shadow-primary/20"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-3" /> Kirim Pesan Sekarang
                      </>
                    )}
                  </Button>
                </motion.form>
              ) : (
                /* FORM KOLABORASI */
                <motion.form
                  key="form-kolaborasi"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleCollabSubmit}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold ml-1">
                        Institusi / Perusahaan
                      </Label>
                      <Input
                        required
                        placeholder="Nama organisasi Anda..."
                        className="h-14 rounded-2xl bg-secondary/30 border-border"
                        value={collabData.organization_name}
                        onChange={(e) =>
                          setCollabData({
                            ...collabData,
                            organization_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold ml-1">Narahubung (PIC)</Label>
                      <Input
                        required
                        placeholder="Nama lengkap PIC..."
                        className="h-14 rounded-2xl bg-secondary/30 border-border"
                        value={collabData.contact_person}
                        onChange={(e) =>
                          setCollabData({
                            ...collabData,
                            contact_person: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold ml-1">Email Kontak</Label>
                      <Input
                        type="email"
                        required
                        placeholder="email@institusi.com"
                        className="h-14 rounded-2xl bg-secondary/30 border-border"
                        value={collabData.email}
                        onChange={(e) =>
                          setCollabData({
                            ...collabData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold ml-1">
                        Nomor WA / Telepon
                      </Label>
                      <Input
                        required
                        placeholder="+62..."
                        className="h-14 rounded-2xl bg-secondary/30 border-border"
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

                  <div className="space-y-2">
                    <Label className="font-bold ml-1">Skema Kolaborasi</Label>
                    <select
                      required
                      className="flex h-14 w-full items-center justify-between rounded-2xl border border-border bg-secondary/30 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
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

                  <div className="space-y-2">
                    <Label className="font-bold ml-1">
                      Ringkasan Ide Kerjasama
                    </Label>
                    <Textarea
                      required
                      placeholder="Jelaskan secara singkat visi atau tawaran kolaborasi Anda..."
                      className="min-h-[140px] rounded-[24px] bg-secondary/30 border-border focus:bg-background transition-all resize-none p-4"
                      value={collabData.message}
                      onChange={(e) =>
                        setCollabData({
                          ...collabData,
                          message: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2 p-6 bg-primary/5 rounded-[24px] border border-primary/10 border-dashed">
                    <Label className="flex items-center gap-2 text-primary font-bold mb-2">
                      <FileUp className="w-5 h-5" /> Tautan Proposal (Opsional)
                    </Label>
                    <Input
                      placeholder="URL Google Drive / Dropbox dokumen Anda..."
                      className="h-12 rounded-xl bg-background border-border"
                      value={collabData.proposal_file_url}
                      onChange={(e) =>
                        setCollabData({
                          ...collabData,
                          proposal_file_url: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-black transition-all shadow-xl shadow-primary/20"
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

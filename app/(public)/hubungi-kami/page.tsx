"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Handshake,
  Mail,
  MapPin,
  Phone,
  Loader2,
  FileUp,
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
      setSuccessMsg(
        "Pesan Anda telah berhasil dikirim. Tim kami akan segera merespons.",
      );
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
      // Simulasi upload file jika ada sistem upload publik (bisa ditambahkan nanti)
      await api.post("/api/v1/collaboration-requests", collabData);
      setSuccessMsg(
        "Pengajuan kolaborasi berhasil dikirim. Mari merajut dampak bersama!",
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
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 font-sans pb-32">
      {/* 🌟 HERO SECTION */}
      <section className="pt-32 pb-20 px-6 lg:px-12 bg-[#2D4A22] text-center rounded-b-[60px]">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Sapa Kami, Rajut Kolaborasi
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            Pintu kami selalu terbuka untuk pertanyaan, diskusi, maupun ide-ide
            visioner untuk menciptakan dampak nyata bagi masyarakat.
          </p>
        </div>
      </section>

      {/* 🌟 KONTEN UTAMA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* INFORMASI KONTAK (Kiri) */}
          <div className="lg:col-span-4 space-y-8 mt-16">
            <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-[#2D4A22]/5 border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                Kantor Pusat
              </h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4 text-slate-600">
                  <div className="w-10 h-10 rounded-full bg-[#2D4A22]/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#2D4A22]" />
                  </div>
                  <p>
                    Jl. Jend. Sudirman No. 45
                    <br />
                    Jakarta Selatan, 12190
                    <br />
                    Indonesia
                  </p>
                </li>
                <li className="flex items-center gap-4 text-slate-600">
                  <div className="w-10 h-10 rounded-full bg-[#2D4A22]/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#2D4A22]" />
                  </div>
                  <p>halo@titiannusantara.org</p>
                </li>
                <li className="flex items-center gap-4 text-slate-600">
                  <div className="w-10 h-10 rounded-full bg-[#2D4A22]/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#2D4A22]" />
                  </div>
                  <p>+62 21 555 1234</p>
                </li>
              </ul>
            </div>
          </div>

          {/* FORMULIR (Kanan) */}
          <div className="lg:col-span-8 bg-white p-6 md:p-10 rounded-[40px] shadow-2xl shadow-[#2D4A22]/10 border border-slate-100">
            {/* TABS PENGENDALI */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full max-w-md mx-auto mb-10">
              <button
                onClick={() => setActiveTab("pesan")}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex justify-center items-center gap-2 ${activeTab === "pesan" ? "bg-white text-[#2D4A22] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                <Mail className="w-4 h-4" /> Pesan Umum
              </button>
              <button
                onClick={() => setActiveTab("kolaborasi")}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex justify-center items-center gap-2 ${activeTab === "kolaborasi" ? "bg-[#2D4A22] text-white shadow-md" : "text-slate-500 hover:text-slate-700"}`}
              >
                <Handshake className="w-4 h-4" /> Ajukan Kolaborasi
              </button>
            </div>

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 mb-8 bg-green-50 text-green-700 rounded-2xl border border-green-200 font-medium text-center"
              >
                {successMsg}
              </motion.div>
            )}

            {/* FORM PESAN UMUM */}
            {activeTab === "pesan" && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleMsgSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Nama Lengkap</Label>
                    <Input
                      required
                      placeholder="Masukkan nama Anda..."
                      className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white"
                      value={msgData.name}
                      onChange={(e) =>
                        setMsgData({ ...msgData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      required
                      placeholder="alamat@email.com"
                      className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white"
                      value={msgData.email}
                      onChange={(e) =>
                        setMsgData({ ...msgData, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Subjek Pesan</Label>
                  <Input
                    required
                    placeholder="Apa yang ingin didiskusikan?"
                    className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white"
                    value={msgData.subject}
                    onChange={(e) =>
                      setMsgData({ ...msgData, subject: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Isi Pesan</Label>
                  <Textarea
                    required
                    placeholder="Tuliskan pesan Anda secara detail..."
                    className="min-h-[150px] rounded-xl bg-slate-50 border-transparent focus:bg-white resize-none"
                    value={msgData.message}
                    onChange={(e) =>
                      setMsgData({ ...msgData, message: e.target.value })
                    }
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-full bg-[#2D4A22] hover:bg-[#1a2d14] text-lg font-bold transition-all"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" /> Kirim Pesan
                    </>
                  )}
                </Button>
              </motion.form>
            )}

            {/* FORM KOLABORASI */}
            {activeTab === "kolaborasi" && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleCollabSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Nama Organisasi / Perusahaan</Label>
                    <Input
                      required
                      placeholder="Nama instansi Anda..."
                      className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white"
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
                    <Label>Nama Narahubung (PIC)</Label>
                    <Input
                      required
                      placeholder="Nama Anda..."
                      className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white"
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
                    <Label>Email Institusi</Label>
                    <Input
                      type="email"
                      required
                      placeholder="email@institusi.com"
                      className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white"
                      value={collabData.email}
                      onChange={(e) =>
                        setCollabData({ ...collabData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nomor Telepon / WhatsApp</Label>
                    <Input
                      required
                      placeholder="+62..."
                      className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white"
                      value={collabData.phone}
                      onChange={(e) =>
                        setCollabData({ ...collabData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tipe Kolaborasi</Label>
                  <select
                    required
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-transparent bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4A22]/20 focus:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                    value={collabData.collaboration_type}
                    onChange={(e) =>
                      setCollabData({
                        ...collabData,
                        collaboration_type: e.target.value,
                      })
                    }
                  >
                    <option value="CSR & Sponsorship">
                      CSR & Sponsorship Program
                    </option>
                    <option value="Media Partner">
                      Media & Publication Partner
                    </option>
                    <option value="Relawan & Komunitas">
                      Relawan & Gerakan Komunitas
                    </option>
                    <option value="Penelitian & Akademik">
                      Penelitian & Akademik
                    </option>
                    <option value="Lainnya">Bentuk Kolaborasi Lainnya</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Pesan / Ringkasan Ide Kolaborasi</Label>
                  <Textarea
                    required
                    placeholder="Ceritakan ide kolaborasi atau tawaran kerja sama Anda..."
                    className="min-h-[120px] rounded-xl bg-slate-50 border-transparent focus:bg-white resize-none"
                    value={collabData.message}
                    onChange={(e) =>
                      setCollabData({ ...collabData, message: e.target.value })
                    }
                  />
                </div>

                {/* Opsional: Tautan Proposal (Jika file upload blm diimplementasikan publik) */}
                <div className="space-y-2 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 border-dashed">
                  <Label className="flex items-center gap-2 text-blue-800">
                    <FileUp className="w-4 h-4" /> Tautan Proposal / Dokumen
                    (Opsional)
                  </Label>
                  <Input
                    placeholder="URL Google Drive / Dropbox ke proposal Anda..."
                    className="h-11 rounded-xl bg-white border-blue-200"
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
                  className="w-full h-14 rounded-full bg-[#2D4A22] hover:bg-[#1a2d14] text-lg font-bold transition-all shadow-lg shadow-[#2D4A22]/20"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Handshake className="w-5 h-5 mr-2" /> Ajukan Kolaborasi
                    </>
                  )}
                </Button>
              </motion.form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

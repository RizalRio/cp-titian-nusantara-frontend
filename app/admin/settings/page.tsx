"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Loader2,
  Settings,
  Globe,
  Phone,
  MapPin,
  Share2,
  Building2,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import api from "@/lib/api";

export default function SiteSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // 🌟 STATE FORM PAYLOAD (Disesuaikan dengan field standar profil lembaga)
  const [formData, setFormData] = useState({
    site_name: "",
    tagline: "",
    description: "",
    logo_url: "",
    favicon_url: "",
    email: "",
    phone: "",
    address: "",
    instagram_url: "",
    linkedin_url: "",
    youtube_url: "",
  });

  // 1. FETCH DATA SETTING SAAT HALAMAN DIMUAT
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Asumsi endpoint untuk mengambil data setting tunggal
        const res = await api.get("/api/v1/settings");
        if (res.data.data) {
          setFormData({
            site_name: res.data.data.site_name || "",
            tagline: res.data.data.tagline || "",
            description: res.data.data.description || "",
            logo_url: res.data.data.logo_url || "",
            favicon_url: res.data.data.favicon_url || "",
            email: res.data.data.email || "",
            phone: res.data.data.phone || "",
            address: res.data.data.address || "",
            instagram_url: res.data.data.instagram_url || "",
            linkedin_url: res.data.data.linkedin_url || "",
            youtube_url: res.data.data.youtube_url || "",
          });
        }
      } catch (error) {
        console.error("Gagal memuat pengaturan situs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // 2. SUBMIT UPDATE KE BACKEND
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg("");

    try {
      // Asumsi endpoint untuk update setting (biasanya PUT ke satu endpoint tunggal)
      await api.put("/api/v1/admin/settings", formData);
      setSuccessMsg("Pengaturan situs berhasil diperbarui!");

      // Hilangkan pesan sukses setelah 3 detik
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal menyimpan pengaturan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">
          Memuat konfigurasi situs...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 font-sans animate-in fade-in">
      {/* 🌟 HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-3">
            <Settings className="w-3.5 h-3.5 mr-2" />
            <span>Konfigurasi Global</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Pengaturan Situs
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola identitas, kontak, dan tautan sosial Titian Nusantara.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 text-green-700 rounded-2xl border border-green-200 font-medium flex items-center">
          <Globe className="w-5 h-5 mr-3" /> {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 🌟 SECTION 1: IDENTITAS UTAMA */}
        <Card className="rounded-[24px] shadow-sm border-border bg-card overflow-hidden">
          <CardHeader className="bg-muted/10 border-b border-border/50 pb-6">
            <CardTitle className="text-xl flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" /> Identitas Utama
            </CardTitle>
            <CardDescription>
              Informasi dasar yang akan ditampilkan di header, footer, dan meta
              SEO.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Kolom Kiri: Teks */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="font-semibold">Nama Situs / Lembaga</Label>
                  <Input
                    value={formData.site_name}
                    onChange={(e) =>
                      setFormData({ ...formData, site_name: e.target.value })
                    }
                    placeholder="Titian Nusantara"
                    className="h-12 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label className="font-semibold">Slogan (Tagline)</Label>
                  <Input
                    value={formData.tagline}
                    onChange={(e) =>
                      setFormData({ ...formData, tagline: e.target.value })
                    }
                    placeholder="Merajut Asa, Membangun Bangsa..."
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="font-semibold">
                    Deskripsi Singkat (Footer & SEO)
                  </Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Titian Nusantara adalah organisasi non-profit yang..."
                    className="min-h-[120px] rounded-xl resize-none"
                  />
                </div>
              </div>

              {/* Kolom Kanan: Gambar */}
              <div className="space-y-6">
                <div className="p-6 bg-muted/10 rounded-2xl border border-border/50 space-y-4">
                  <Label className="font-semibold flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-primary" /> Logo Utama
                  </Label>
                  <ImageUpload
                    value={formData.logo_url}
                    onChange={(url) =>
                      setFormData({ ...formData, logo_url: url })
                    }
                    onRemove={() => setFormData({ ...formData, logo_url: "" })}
                    label="Unggah Logo"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 🌟 SECTION 2: KONTAK & ALAMAT */}
          <Card className="rounded-[24px] shadow-sm border-border bg-card overflow-hidden">
            <CardHeader className="bg-muted/10 border-b border-border/50 pb-6">
              <CardTitle className="text-xl flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" /> Kontak & Alamat
              </CardTitle>
              <CardDescription>
                Informasi yang digunakan pada halaman Hubungi Kami dan Footer.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-3">
                <Label className="font-semibold">Email Resmi</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="halo@titiannusantara.org"
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-3">
                <Label className="font-semibold">
                  Nomor Telepon / WhatsApp
                </Label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+62 21..."
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-3">
                <Label className="font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Alamat Lengkap
                </Label>
                <Textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Jl. Sudirman No. 45..."
                  className="min-h-[100px] rounded-xl resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* 🌟 SECTION 3: MEDIA SOSIAL */}
          <Card className="rounded-[24px] shadow-sm border-border bg-card overflow-hidden">
            <CardHeader className="bg-muted/10 border-b border-border/50 pb-6">
              <CardTitle className="text-xl flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" /> Tautan Media Sosial
              </CardTitle>
              <CardDescription>
                Kosongkan kolom jika Anda tidak ingin menampilkan ikon sosial
                tersebut.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-3">
                <Label className="font-semibold text-pink-600">
                  Instagram URL
                </Label>
                <Input
                  value={formData.instagram_url}
                  onChange={(e) =>
                    setFormData({ ...formData, instagram_url: e.target.value })
                  }
                  placeholder="https://instagram.com/..."
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-3">
                <Label className="font-semibold text-blue-700">
                  LinkedIn URL
                </Label>
                <Input
                  value={formData.linkedin_url}
                  onChange={(e) =>
                    setFormData({ ...formData, linkedin_url: e.target.value })
                  }
                  placeholder="https://linkedin.com/company/..."
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-3">
                <Label className="font-semibold text-red-600">
                  YouTube URL
                </Label>
                <Input
                  value={formData.youtube_url}
                  onChange={(e) =>
                    setFormData({ ...formData, youtube_url: e.target.value })
                  }
                  placeholder="https://youtube.com/..."
                  className="h-12 rounded-xl"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 🌟 TOMBOL SIMPAN */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || !formData.site_name}
            className="h-14 px-10 rounded-full text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            Simpan Pengaturan Situs
          </Button>
        </div>
      </form>
    </div>
  );
}

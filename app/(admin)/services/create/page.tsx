"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  Save,
  Briefcase,
  Plus,
  X,
  Target,
  Link as LinkIcon,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/api";

// 🌟 Import Quill dan Tema CSS-nya
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default function CreateServicePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Referensi untuk Quill Editor
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<Quill | null>(null);

  // State Form Payload
  const [formData, setFormData] = useState({
    name: "",
    short_description: "",
    description: "", // HTML dari Quill
    icon_name: "",
    is_flagship: false,
    status: "draft",
    impact_points: [""], // Dynamic List, mulai dengan 1 input kosong
    cta_text: "",
    cta_link: "",
    thumbnail_url: "",
  });

  // 1. Inisialisasi Quill Editor
  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      // CUSTOM IMAGE HANDLER (Sesuai dengan referensi Post)
      const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute(
          "accept",
          "image/png, image/jpeg, image/webp, image/gif",
        );
        input.click();

        input.onchange = async () => {
          const file = input.files ? input.files[0] : null;
          if (!file) return;

          if (file.size > 5 * 1024 * 1024) {
            alert("Ukuran gambar maksimal 5MB.");
            return;
          }

          try {
            const fd = new FormData();
            fd.append("image", file);
            const res = await api.post("/api/v1/admin/media/upload", fd, {
              headers: { "Content-Type": "multipart/form-data" },
            });

            const imageUrl = res.data.data.url;
            const quill = quillInstance.current;

            if (quill) {
              const range = quill.getSelection(true);
              quill.insertEmbed(range.index, "image", imageUrl);
              quill.setSelection(range.index + 1);
            }
          } catch (error: any) {
            console.error("Gagal mengunggah gambar inline:", error);
            alert(error.response?.data?.message || "Gagal menyisipkan gambar.");
          }
        };
      };

      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Jelaskan visi, misi, dan detail layanan ini...",
        modules: {
          toolbar: {
            container: [
              [{ header: [2, 3, 4, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["blockquote", "link", "image"],
              ["clean"],
            ],
            handlers: {
              image: imageHandler,
            },
          },
        },
      });

      quillInstance.current.on("text-change", () => {
        if (quillInstance.current) {
          const htmlContent = quillInstance.current.root.innerHTML;
          const isEmpty = htmlContent === "<p><br></p>";
          setFormData((prev) => ({
            ...prev,
            description: isEmpty ? "" : htmlContent,
          }));
        }
      });
    }
  }, []);

  // 2. Fungsi Pengelola Poin Dampak (Dynamic Input)
  const handleImpactChange = (index: number, value: string) => {
    const newImpacts = [...formData.impact_points];
    newImpacts[index] = value;
    setFormData({ ...formData, impact_points: newImpacts });
  };

  const addImpactPoint = () => {
    setFormData({
      ...formData,
      impact_points: [...formData.impact_points, ""],
    });
  };

  const removeImpactPoint = (index: number) => {
    const newImpacts = formData.impact_points.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      impact_points: newImpacts.length ? newImpacts : [""],
    });
  };

  // 3. Submit ke Backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      alert("Deskripsi lengkap tidak boleh kosong!");
      return;
    }

    // Bersihkan poin dampak yang kosong sebelum dikirim
    const cleanedImpacts = formData.impact_points.filter(
      (point) => point.trim() !== "",
    );

    const payload = {
      ...formData,
      impact_points: cleanedImpacts,
    };

    setIsSubmitting(true);
    try {
      await api.post("/api/v1/admin/services", payload);
      router.push("/services");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal menyimpan layanan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 font-sans">
      {/* 🌟 HEADER NAVIGASI */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="rounded-full h-10 w-10 hover:bg-muted/50 border border-transparent hover:border-border transition-all"
        >
          <Link href="/services">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Tambah Layanan Baru
          </h1>
          <p className="text-muted-foreground mt-1">
            Bangun ekosistem program yang berdampak bagi Titian Nusantara.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 📝 KOLOM KIRI (Lebar 8/12): Editor Utama */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="rounded-[24px] shadow-sm border-border overflow-hidden">
              <CardContent className="p-8 space-y-8">
                {/* Nama Layanan */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-primary flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Nama Layanan
                  </Label>
                  <Input
                    placeholder="Misal: Pemberdayaan Ekonomi Desa..."
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    minLength={3}
                    className="h-14 text-lg font-medium rounded-xl border-border focus-visible:ring-primary/20 focus-visible:border-primary shadow-sm"
                  />
                </div>

                {/* Ringkasan */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    Ringkasan Singkat
                  </Label>
                  <Textarea
                    placeholder="Tuliskan 1-2 kalimat ringkasan yang akan muncul di kartu layanan..."
                    value={formData.short_description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        short_description: e.target.value,
                      })
                    }
                    className="min-h-[100px] rounded-xl resize-none border-border focus-visible:ring-primary/20 shadow-sm"
                    required
                  />
                </div>

                {/* Quill Editor */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    Narasi Konteks (Deskripsi Lengkap)
                  </Label>
                  <div className="rounded-xl overflow-hidden border border-border shadow-sm focus-within:ring-1 focus-within:ring-primary/20 focus-within:border-primary transition-all bg-background">
                    <div ref={editorRef} className="min-h-[400px] text-base" />
                  </div>

                  <style jsx global>{`
                    .ql-toolbar.ql-snow {
                      border: none !important;
                      border-bottom: 1px solid hsl(var(--border)) !important;
                      background-color: hsl(var(--muted) / 0.3);
                      padding: 12px !important;
                      font-family: inherit;
                    }
                    .ql-container.ql-snow {
                      border: none !important;
                      font-family: inherit;
                      font-size: 1rem;
                    }
                    .ql-editor {
                      min-height: 400px;
                      padding: 20px;
                      line-height: 1.7;
                    }
                    .ql-editor p {
                      margin-bottom: 1em;
                    }
                  `}</style>
                </div>

                {/* 🌟 POIN DAMPAK (Dynamic List) */}
                <div className="space-y-4 pt-6 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-semibold text-foreground flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" /> Dampak yang
                        Dihasilkan
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Tambahkan poin capaian/target dari layanan ini
                        (Opsional).
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {formData.impact_points.map((point, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <div className="pt-3">
                          <div className="w-2 h-2 rounded-full bg-primary/50" />
                        </div>
                        <Input
                          placeholder="Misal: Menciptakan kemandirian ekonomi pada 50 desa..."
                          value={point}
                          onChange={(e) =>
                            handleImpactChange(index, e.target.value)
                          }
                          className="flex-1 bg-muted/10 border-border rounded-xl"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeImpactPoint(index)}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addImpactPoint}
                      className="mt-2 border-dashed border-primary/30 text-primary hover:bg-primary/5 rounded-xl"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Tambah Poin Dampak
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ⚙️ KOLOM KANAN (Lebar 4/12): Pengaturan Metadata (Sticky) */}
          <div className="lg:col-span-4 space-y-6 sticky top-6">
            <Card className="rounded-[24px] shadow-sm border-border bg-card">
              <CardContent className="p-6 space-y-8">
                {/* Image Upload */}
                <ImageUpload
                  value={formData.thumbnail_url}
                  onChange={(url) =>
                    setFormData({ ...formData, thumbnail_url: url })
                  }
                  onRemove={() =>
                    setFormData({ ...formData, thumbnail_url: "" })
                  }
                  label="Gambar Layanan Utama"
                />

                {/* Tipe Layanan (Flagship) */}
                <div className="space-y-3">
                  <Label className="font-semibold text-foreground flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Tipe Layanan
                  </Label>
                  <Select
                    value={formData.is_flagship ? "true" : "false"}
                    onValueChange={(val) =>
                      setFormData({ ...formData, is_flagship: val === "true" })
                    }
                  >
                    <SelectTrigger className="rounded-xl h-12 bg-background border-border shadow-sm">
                      <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false" className="font-medium">
                        Layanan Reguler
                      </SelectItem>
                      <SelectItem
                        value="true"
                        className="font-medium text-amber-600 focus:text-amber-700"
                      >
                        ⭐ Layanan Unggulan
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Publikasi */}
                <div className="space-y-3">
                  <Label className="font-semibold text-foreground">
                    Status Publikasi
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(val) =>
                      setFormData({ ...formData, status: val })
                    }
                  >
                    <SelectTrigger className="rounded-xl h-12 bg-background border-border shadow-sm">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft" className="font-medium">
                        Simpan sebagai Draf
                      </SelectItem>
                      <SelectItem
                        value="published"
                        className="font-medium text-green-600 focus:text-green-700"
                      >
                        Publikasikan Sekarang
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* CTA Settings */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <Label className="font-semibold text-foreground flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-primary" /> Call to Action
                    (CTA)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Tombol aksi yang akan muncul di detail layanan.
                  </p>

                  <div className="space-y-3">
                    <Input
                      placeholder="Teks Tombol (Cth: Hubungi Kami)"
                      value={formData.cta_text}
                      onChange={(e) =>
                        setFormData({ ...formData, cta_text: e.target.value })
                      }
                      className="rounded-xl border-border bg-muted/10"
                    />
                    <Input
                      placeholder="URL Tujuan (Cth: /kontak)"
                      value={formData.cta_link}
                      onChange={(e) =>
                        setFormData({ ...formData, cta_link: e.target.value })
                      }
                      className="rounded-xl border-border bg-muted/10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={isSubmitting || formData.name.length < 3}
              className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {formData.status === "published"
                ? "Terbitkan Layanan"
                : "Simpan Draf"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

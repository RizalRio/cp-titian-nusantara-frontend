"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  Save,
  FolderKanban,
  Plus,
  X,
  BarChart3,
  MapPin,
  Calendar,
  Images,
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

import Quill from "quill";
import "quill/dist/quill.snow.css";

export default function CreateProjectPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<Quill | null>(null);

  // 🌟 STATE FORM PAYLOAD
  const [formData, setFormData] = useState({
    service_id: serviceId,
    title: "",
    summary: "",
    description: "",
    location: "",
    start_date: "",
    end_date: "",
    status: "draft",
    is_featured: false,
    thumbnail_url: "",
    gallery_urls: [""], // Dimulai dengan 1 slot kosong untuk galeri
    metrics: [{ metric_label: "", metric_value: 0, metric_unit: "", order: 1 }], // Metrik dinamis
  });

  // 1. INISIALISASI QUILL EDITOR
  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
          const file = input.files ? input.files[0] : null;
          if (!file) return;

          try {
            const fd = new FormData();
            fd.append("image", file);
            const res = await api.post("/api/v1/admin/media/upload", fd);
            const imageUrl = res.data.data.url;
            const quill = quillInstance.current;
            if (quill) {
              const range = quill.getSelection(true);
              quill.insertEmbed(range.index, "image", imageUrl);
              quill.setSelection(range.index + 1);
            }
          } catch (error) {
            alert("Gagal mengunggah gambar inline.");
          }
        };
      };

      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder:
          "Ceritakan latar belakang, perjalanan, dan hasil program ini...",
        modules: {
          toolbar: {
            container: [
              [{ header: [2, 3, 4, false] }],
              ["bold", "italic", "underline"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image", "video"],
              ["clean"],
            ],
            handlers: { image: imageHandler },
          },
        },
      });

      quillInstance.current.on("text-change", () => {
        if (quillInstance.current) {
          const htmlContent = quillInstance.current.root.innerHTML;
          setFormData((prev) => ({
            ...prev,
            description: htmlContent === "<p><br></p>" ? "" : htmlContent,
          }));
        }
      });
    }
  }, []);

  // 2. FUNGSI PENGELOLA METRIK DINAMIS
  const handleMetricChange = (index: number, field: string, value: any) => {
    const newMetrics = [...formData.metrics];
    newMetrics[index] = { ...newMetrics[index], [field]: value };
    setFormData({ ...formData, metrics: newMetrics });
  };

  const addMetric = () => {
    setFormData({
      ...formData,
      metrics: [
        ...formData.metrics,
        {
          metric_label: "",
          metric_value: 0,
          metric_unit: "",
          order: formData.metrics.length + 1,
        },
      ],
    });
  };

  const removeMetric = (index: number) => {
    const newMetrics = formData.metrics.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      metrics: newMetrics.length
        ? newMetrics
        : [{ metric_label: "", metric_value: 0, metric_unit: "", order: 1 }],
    });
  };

  // 3. FUNGSI PENGELOLA GALERI FOTO
  const handleGalleryChange = (index: number, url: string) => {
    const newGallery = [...formData.gallery_urls];
    newGallery[index] = url;
    setFormData({ ...formData, gallery_urls: newGallery });
  };

  const addGallerySlot = () => {
    setFormData({ ...formData, gallery_urls: [...formData.gallery_urls, ""] });
  };

  const removeGallerySlot = (index: number) => {
    const newGallery = formData.gallery_urls.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      gallery_urls: newGallery.length ? newGallery : [""],
    });
  };

  // 4. SUBMIT KE BACKEND
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim())
      return alert("Konten deskripsi tidak boleh kosong!");

    // Bersihkan data kosong sebelum dikirim
    const cleanedGallery = formData.gallery_urls.filter(
      (url) => url.trim() !== "",
    );
    const cleanedMetrics = formData.metrics.filter(
      (m) => m.metric_label.trim() !== "",
    );

    // Format tanggal untuk API (Kirim null jika string kosong)
    const start_date = formData.start_date
      ? new Date(formData.start_date).toISOString()
      : null;
    const end_date = formData.end_date
      ? new Date(formData.end_date).toISOString()
      : null;

    const payload = {
      ...formData,
      start_date,
      end_date,
      gallery_urls: cleanedGallery,
      metrics: cleanedMetrics,
    };

    setIsSubmitting(true);
    try {
      await api.post("/api/v1/admin/projects", payload);
      router.push(`/admin/services/${serviceId}/projects`);
      router.refresh();
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal menyimpan program.");
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
          className="rounded-full h-10 w-10 hover:bg-muted/50 border border-transparent transition-all"
        >
          <Link href={`/admin/services/${serviceId}/projects`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Tambah Program Baru
          </h1>
          <p className="text-muted-foreground mt-1">
            Catat perjalanan dan dampak nyata dari layanan ini.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 📝 KOLOM KIRI (Lebar 8/12): Editor Utama & Metrik */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="rounded-[24px] shadow-sm border-border overflow-hidden bg-card">
              <CardContent className="p-8 space-y-8">
                {/* Judul, Lokasi & Tanggal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Judul (Lebar Penuh) */}
                  <div className="space-y-3 md:col-span-2">
                    <Label className="text-sm font-semibold text-primary flex items-center gap-2">
                      <FolderKanban className="w-4 h-4" /> Judul Program
                    </Label>
                    <Input
                      placeholder="Misal: Pelatihan UMKM Desa Harapan..."
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                      minLength={3}
                      className="h-14 text-lg font-medium rounded-xl border-border focus-visible:ring-primary/20 shadow-sm"
                    />
                  </div>

                  {/* Lokasi (Lebar Penuh) */}
                  <div className="space-y-3 md:col-span-2">
                    <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />{" "}
                      Lokasi Program
                    </Label>
                    <Input
                      placeholder="Misal: Kec. Cibatu, Jawa Barat"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="rounded-xl border-border bg-muted/10 h-12"
                    />
                  </div>

                  {/* Tanggal Mulai (Kiri di Desktop, Penuh di HP) */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />{" "}
                      Tanggal Mulai
                    </Label>
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                      className="rounded-xl border-border bg-muted/10 h-12 w-full block"
                    />
                  </div>

                  {/* Tanggal Selesai (Kanan di Desktop, Penuh di HP) */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />{" "}
                      Tanggal Selesai
                    </Label>
                    <Input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                      className="rounded-xl border-border bg-muted/10 h-12 w-full block"
                    />
                  </div>
                </div>

                {/* Ringkasan & Quill Editor */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    Ringkasan (Summary)
                  </Label>
                  <Textarea
                    placeholder="Tuliskan 1-2 kalimat ringkasan tentang program ini..."
                    value={formData.summary}
                    onChange={(e) =>
                      setFormData({ ...formData, summary: e.target.value })
                    }
                    className="min-h-[100px] rounded-xl resize-none border-border focus-visible:ring-primary/20 shadow-sm"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    Cerita Lengkap
                  </Label>
                  <div className="rounded-xl overflow-hidden border border-border shadow-sm focus-within:ring-1 focus-within:ring-primary/20 bg-background">
                    <div ref={editorRef} className="min-h-[300px] text-base" />
                  </div>
                  <style jsx global>{`
                    .ql-toolbar.ql-snow {
                      border: none !important;
                      border-bottom: 1px solid hsl(var(--border)) !important;
                      background-color: hsl(var(--muted) / 0.3);
                      padding: 12px !important;
                    }
                    .ql-container.ql-snow {
                      border: none !important;
                      font-size: 1rem;
                    }
                    .ql-editor {
                      min-height: 300px;
                      padding: 20px;
                      line-height: 1.7;
                    }
                  `}</style>
                </div>

                {/* 🌟 METRIK ANGKA (Dynamic List) */}
                <div className="space-y-4 pt-6 border-t border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Label className="text-base font-semibold text-foreground flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-primary" /> Metrik
                        Capaian Program
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Tampilkan angka dampak terukur untuk komponen UI publik.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {formData.metrics.map((metric, index) => (
                      <div
                        key={index}
                        className="flex flex-wrap md:flex-nowrap gap-3 items-end p-4 bg-muted/10 rounded-2xl border border-border/50"
                      >
                        <div className="flex-1 space-y-2 min-w-[200px]">
                          <Label className="text-xs text-muted-foreground">
                            Label Metrik
                          </Label>
                          <Input
                            placeholder="Cth: UMKM Terbantu"
                            value={metric.metric_label}
                            onChange={(e) =>
                              handleMetricChange(
                                index,
                                "metric_label",
                                e.target.value,
                              )
                            }
                            className="bg-background rounded-xl"
                          />
                        </div>
                        <div className="w-full md:w-32 space-y-2">
                          <Label className="text-xs text-muted-foreground">
                            Angka
                          </Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={metric.metric_value || ""}
                            onChange={(e) =>
                              handleMetricChange(
                                index,
                                "metric_value",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="bg-background rounded-xl"
                          />
                        </div>
                        <div className="w-full md:w-32 space-y-2">
                          <Label className="text-xs text-muted-foreground">
                            Satuan (Opsional)
                          </Label>
                          <Input
                            placeholder="Cth: Desa, Orang"
                            value={metric.metric_unit}
                            onChange={(e) =>
                              handleMetricChange(
                                index,
                                "metric_unit",
                                e.target.value,
                              )
                            }
                            className="bg-background rounded-xl"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMetric(index)}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl mb-0.5"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addMetric}
                      className="border-dashed border-primary/30 text-primary hover:bg-primary/5 rounded-xl"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Tambah Metrik
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ⚙️ KOLOM KANAN (Lebar 4/12): Thumbnail, Galeri, Metadata */}
          <div className="lg:col-span-4 space-y-6 sticky top-6">
            <Card className="rounded-[24px] shadow-sm border-border bg-card">
              <CardContent className="p-6 space-y-8">
                {/* 🌟 GAMBAR UTAMA */}
                <ImageUpload
                  value={formData.thumbnail_url}
                  onChange={(url) =>
                    setFormData({ ...formData, thumbnail_url: url })
                  }
                  onRemove={() =>
                    setFormData({ ...formData, thumbnail_url: "" })
                  }
                  label="Gambar Utama (Thumbnail)"
                />

                {/* 🌟 GALERI FOTO */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <Label className="font-semibold text-foreground flex items-center gap-2">
                    <Images className="w-4 h-4 text-primary" /> Galeri
                    Dokumentasi
                  </Label>
                  <div className="space-y-4">
                    {formData.gallery_urls.map((url, index) => (
                      <div key={index} className="relative">
                        <ImageUpload
                          value={url}
                          onChange={(newUrl) =>
                            handleGalleryChange(index, newUrl)
                          }
                          onRemove={() => handleGalleryChange(index, "")}
                          label={`Foto ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeGallerySlot(index)}
                          className="absolute -top-3 -right-3 w-7 h-7 rounded-full shadow-md z-10"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addGallerySlot}
                      className="w-full border-dashed rounded-xl h-12 text-muted-foreground"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Tambah Slot Foto
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <Label className="font-semibold text-foreground">
                    Tipe Program
                  </Label>
                  <Select
                    value={formData.is_featured ? "true" : "false"}
                    onValueChange={(val) =>
                      setFormData({ ...formData, is_featured: val === "true" })
                    }
                  >
                    <SelectTrigger className="rounded-xl h-12 bg-background border-border shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false" className="font-medium">
                        Program Biasa
                      </SelectItem>
                      <SelectItem
                        value="true"
                        className="font-medium text-amber-600 focus:text-amber-700"
                      >
                        ⭐ Program Sorotan
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft" className="font-medium">
                        Simpan sebagai Draf
                      </SelectItem>
                      <SelectItem
                        value="published"
                        className="font-medium text-green-600 focus:text-green-700"
                      >
                        Publikasikan
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={isSubmitting || formData.title.length < 3}
              className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {formData.status === "published"
                ? "Terbitkan Program"
                : "Simpan Draf"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

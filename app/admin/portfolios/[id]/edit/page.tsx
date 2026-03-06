"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  Save,
  Compass,
  Plus,
  X,
  MapPin,
  Layers,
  Quote,
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

export default function EditPortfolioPage() {
  const router = useRouter();
  const params = useParams();
  const portfolioId = params.id as string;

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🌟 STATE FORM PAYLOAD
  const [formData, setFormData] = useState({
    title: "",
    sector: "",
    short_story: "",
    impact: "",
    location: "",
    status: "draft",
    thumbnail_url: "",
    gallery_urls: [""],
    testimonials: [
      {
        author_name: "",
        author_role: "",
        content: "",
        avatar_url: "",
        order: 1,
      },
    ],
  });

  // 🌟 1. FETCH DATA LAMA DARI BACKEND
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await api.get(`/api/v1/portfolios/${portfolioId}`);
        const data = res.data.data;

        // Ekstraksi Media Polimorfik
        const thumbnail =
          data.media?.find((m: any) => m.media_type === "thumbnail")
            ?.file_url || "";
        const gallery =
          data.media
            ?.filter((m: any) => m.media_type === "gallery")
            .map((m: any) => m.file_url) || [];

        // Penanganan jika testimoni kosong dari database
        const testimonialsData =
          data.testimonials && data.testimonials.length > 0
            ? data.testimonials
            : [
                {
                  author_name: "",
                  author_role: "",
                  content: "",
                  avatar_url: "",
                  order: 1,
                },
              ];

        setFormData({
          title: data.title,
          sector: data.sector,
          short_story: data.short_story,
          impact: data.impact,
          location: data.location,
          status: data.status,
          thumbnail_url: thumbnail,
          gallery_urls: gallery.length > 0 ? gallery : [""],
          testimonials: testimonialsData,
        });
      } catch (error) {
        alert("Data jejak karya tidak ditemukan.");
        router.push("/admin/portfolios");
      } finally {
        setIsPageLoading(false);
      }
    };

    if (portfolioId) fetchPortfolio();
  }, [portfolioId, router]);

  // 2. FUNGSI PENGELOLA TESTIMONI DINAMIS
  const handleTestimonialChange = (
    index: number,
    field: string,
    value: any,
  ) => {
    const newTestimonials = [...formData.testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    setFormData({ ...formData, testimonials: newTestimonials });
  };

  const addTestimonial = () => {
    setFormData({
      ...formData,
      testimonials: [
        ...formData.testimonials,
        {
          author_name: "",
          author_role: "",
          content: "",
          avatar_url: "",
          order: formData.testimonials.length + 1,
        },
      ],
    });
  };

  const removeTestimonial = (index: number) => {
    const newTestimonials = formData.testimonials.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      testimonials: newTestimonials.length
        ? newTestimonials
        : [
            {
              author_name: "",
              author_role: "",
              content: "",
              avatar_url: "",
              order: 1,
            },
          ],
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

  // 4. SUBMIT UPDATE KE BACKEND
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.sector) return alert("Silakan pilih Sektor Jejak Karya.");

    // Bersihkan data kosong
    const cleanedGallery = formData.gallery_urls.filter(
      (url) => url.trim() !== "",
    );
    const cleanedTestimonials = formData.testimonials.filter(
      (t) => t.author_name.trim() !== "" && t.content.trim() !== "",
    );

    const payload = {
      ...formData,
      gallery_urls: cleanedGallery,
      testimonials: cleanedTestimonials,
    };

    setIsSubmitting(true);
    try {
      await api.put(`/api/v1/admin/portfolios/${portfolioId}`, payload);
      router.push("/admin/portfolios");
      router.refresh();
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal memperbarui jejak karya.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">
          Memuat data jejak karya...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 font-sans animate-in fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="rounded-full h-10 w-10 hover:bg-muted/50 border border-transparent transition-all"
        >
          <Link href="/admin/portfolios">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Edit Jejak Karya
          </h1>
          <p className="text-muted-foreground mt-1">
            Perbarui rekam jejak portofolio Titian Nusantara.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 📝 KOLOM KIRI (Lebar 8/12) */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="rounded-[24px] shadow-sm border-border overflow-hidden bg-card">
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 md:col-span-2">
                    <Label className="text-sm font-semibold text-primary flex items-center gap-2">
                      <Compass className="w-4 h-4" /> Judul Jejak Karya
                    </Label>
                    <Input
                      placeholder="Misal: Membangun Sanitasi Bersih di Sumba..."
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                      minLength={3}
                      className="h-14 text-lg font-medium rounded-xl border-border focus-visible:ring-primary/20 shadow-sm"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Layers className="w-4 h-4 text-muted-foreground" />{" "}
                      Sektor Jejak Karya
                    </Label>
                    <Input
                      placeholder="Misal: Pendidikan, Lingkungan, Kesehatan..."
                      value={formData.sector}
                      onChange={(e) =>
                        setFormData({ ...formData, sector: e.target.value })
                      }
                      required
                      className="rounded-xl border-border bg-muted/10 h-12"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />{" "}
                      Lokasi / Wilayah
                    </Label>
                    <Input
                      placeholder="Misal: Sumba Timur, NTT"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      required
                      className="rounded-xl border-border bg-muted/10 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    Cerita Singkat (Konteks)
                  </Label>
                  <Textarea
                    placeholder="Ceritakan latar belakang dan tantangan..."
                    value={formData.short_story}
                    onChange={(e) =>
                      setFormData({ ...formData, short_story: e.target.value })
                    }
                    className="min-h-[120px] rounded-xl resize-none border-border focus-visible:ring-primary/20 shadow-sm"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    Dampak yang Diberikan
                  </Label>
                  <Textarea
                    placeholder="Jelaskan perubahan nyata atau solusi..."
                    value={formData.impact}
                    onChange={(e) =>
                      setFormData({ ...formData, impact: e.target.value })
                    }
                    className="min-h-[120px] rounded-xl resize-none border-border focus-visible:ring-primary/20 shadow-sm"
                    required
                  />
                </div>

                {/* 🌟 TESTIMONI (Dynamic Form) */}
                <div className="space-y-4 pt-6 border-t border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Label className="text-base font-semibold text-foreground flex items-center gap-2">
                        <Quote className="w-4 h-4 text-primary" /> Testimoni
                        (Suara Mereka)
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Kutipan langsung dari penerima manfaat atau tokoh
                        terkait.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {formData.testimonials.map((testimonial, index) => (
                      <div
                        key={index}
                        className="relative p-6 bg-muted/5 rounded-[24px] border border-border/50 shadow-sm"
                      >
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeTestimonial(index)}
                          className="absolute -top-3 -right-3 w-8 h-8 rounded-full shadow-md z-10"
                        >
                          <X className="w-4 h-4" />
                        </Button>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                          <div className="md:col-span-4 lg:col-span-3">
                            <ImageUpload
                              value={testimonial.avatar_url}
                              onChange={(url) =>
                                handleTestimonialChange(
                                  index,
                                  "avatar_url",
                                  url,
                                )
                              }
                              onRemove={() =>
                                handleTestimonialChange(index, "avatar_url", "")
                              }
                              label="Foto Profil"
                            />
                          </div>

                          <div className="md:col-span-8 lg:col-span-9 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">
                                  Nama Lengkap
                                </Label>
                                <Input
                                  placeholder="Cth: Yohanes"
                                  value={testimonial.author_name}
                                  onChange={(e) =>
                                    handleTestimonialChange(
                                      index,
                                      "author_name",
                                      e.target.value,
                                    )
                                  }
                                  className="bg-background rounded-xl h-11"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">
                                  Peran / Jabatan
                                </Label>
                                <Input
                                  placeholder="Cth: Tokoh Masyarakat"
                                  value={testimonial.author_role}
                                  onChange={(e) =>
                                    handleTestimonialChange(
                                      index,
                                      "author_role",
                                      e.target.value,
                                    )
                                  }
                                  className="bg-background rounded-xl h-11"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">
                                Kutipan Testimoni
                              </Label>
                              <Textarea
                                placeholder="Tuliskan pengalaman atau pendapat mereka di sini..."
                                value={testimonial.content}
                                onChange={(e) =>
                                  handleTestimonialChange(
                                    index,
                                    "content",
                                    e.target.value,
                                  )
                                }
                                className="bg-background rounded-xl min-h-[80px] resize-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTestimonial}
                      className="w-full border-dashed border-primary/30 text-primary hover:bg-primary/5 rounded-xl h-12"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Tambah Testimoni Lainnya
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ⚙️ KOLOM KANAN (Lebar 4/12) */}
          <div className="lg:col-span-4 space-y-6 sticky top-6">
            <Card className="rounded-[24px] shadow-sm border-border bg-card">
              <CardContent className="p-6 space-y-8">
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

                <div className="space-y-4 pt-4 border-t border-border">
                  <Label className="font-semibold text-foreground flex items-center gap-2">
                    <Images className="w-4 h-4 text-primary" /> Galeri
                    Dokumentasi
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Opsional: Tambahkan foto pendukung kegiatan.
                  </p>
                  <div className="space-y-4">
                    {formData.gallery_urls.map((url, index) => (
                      <div key={index} className="relative">
                        <ImageUpload
                          value={url}
                          onChange={(newUrl) =>
                            handleGalleryChange(index, newUrl)
                          }
                          onRemove={() => handleGalleryChange(index, "")}
                          label={`Foto Galeri ${index + 1}`}
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
              Simpan Perubahan
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

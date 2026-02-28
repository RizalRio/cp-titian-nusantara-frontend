"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save, FileText } from "lucide-react";
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

interface Category {
  id: string;
  name: string;
}
interface Tag {
  id: string;
  name: string;
}

export default function CreatePostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  // Referensi untuk Quill Editor
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<Quill | null>(null);

  // State Form Payload
  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    status: "draft",
    excerpt: "",
    content: "", // Akan diisi oleh HTML dari Quill
    tag_ids: [] as string[],
    thumbnail_url: "",
  });

  // 1. Fetch Master Data (Kategori & Tag)
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          api.get("/api/v1/categories"),
          api.get("/api/v1/tags"),
        ]);
        setCategories(catRes.data.data || []);
        setTags(tagRes.data.data || []);
      } catch (error) {
        console.error("Gagal memuat master data:", error);
      }
    };
    fetchMasterData();
  }, []);

  // 2. Inisialisasi Quill Editor (Hanya berjalan di sisi Client)
  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      // 🌟 CUSTOM IMAGE HANDLER: Mencegah Base64, gunakan API Upload kita
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

          // Validasi ukuran (Maks 5MB)
          if (file.size > 5 * 1024 * 1024) {
            alert("Ukuran gambar maksimal 5MB.");
            return;
          }

          try {
            // Gunakan API Upload yang sama dengan Thumbnail
            const formData = new FormData();
            formData.append("image", file);

            // Toast/Alert Loading bisa ditambahkan di sini
            const res = await api.post("/api/v1/admin/media/upload", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });

            const imageUrl = res.data.data.url;
            const quill = quillInstance.current;

            if (quill) {
              // Dapatkan posisi kursor saat ini
              const range = quill.getSelection(true);
              // Sisipkan elemen <img> dengan URL dari Backend Golang kita
              quill.insertEmbed(range.index, "image", imageUrl);
              // Pindahkan kursor ke setelah gambar
              quill.setSelection(range.index + 1);
            }
          } catch (error: any) {
            console.error("Gagal mengunggah gambar inline:", error);
            alert(
              error.response?.data?.message ||
                "Gagal menyisipkan gambar ke dalam teks.",
            );
          }
        };
      };

      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Tuliskan cerita dan wawasan lengkap Anda di sini...",
        modules: {
          toolbar: {
            container: [
              [{ header: [2, 3, 4, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["blockquote", "link", "image"], // 🌟 Tambahkan tombol "image"
              ["clean"],
            ],
            handlers: {
              image: imageHandler, // 🌟 Daftarkan custom handler kita
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
            content: isEmpty ? "" : htmlContent,
          }));
        }
      });
    }
  }, []);

  // 3. Toggle untuk Tag (Bisa pilih lebih dari satu)
  const handleTagToggle = (tagId: string) => {
    setFormData((prev) => {
      const isSelected = prev.tag_ids.includes(tagId);
      if (isSelected) {
        return { ...prev, tag_ids: prev.tag_ids.filter((id) => id !== tagId) };
      } else {
        return { ...prev, tag_ids: [...prev.tag_ids, tagId] };
      }
    });
  };

  // 4. Submit ke Backend Golang
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi tambahan agar konten tidak kosong
    if (!formData.content.trim()) {
      alert("Konten artikel tidak boleh kosong!");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/api/v1/admin/posts", formData);
      router.push("/posts");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal menyimpan artikel.");
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
          <Link href="/admin/posts">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Tulis Wawasan Baru
          </h1>
          <p className="text-muted-foreground mt-1">
            Bagikan cerita, laporan, atau gagasan Titian Nusantara.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 📝 KOLOM KIRI (Lebar 8/12): Editor Utama */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="rounded-[24px] shadow-sm border-border overflow-hidden">
              <CardContent className="p-8 space-y-8">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-primary flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Judul Artikel Utama
                  </Label>
                  <Input
                    placeholder="Masukkan judul artikel yang menarik..."
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    minLength={5}
                    className="h-14 text-lg font-medium rounded-xl border-border focus-visible:ring-primary/20 focus-visible:border-primary shadow-sm"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    Ringkasan (Excerpt)
                  </Label>
                  <Textarea
                    placeholder="Tuliskan 1-2 kalimat ringkasan yang akan muncul di halaman depan website..."
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    className="min-h-[100px] rounded-xl resize-none border-border focus-visible:ring-primary/20 shadow-sm"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Ringkasan ini penting untuk SEO dan cuplikan di daftar
                    artikel.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    Konten Lengkap
                  </Label>

                  {/* 🌟 KONTANER QUILL EDITOR */}
                  <div className="rounded-xl overflow-hidden border border-border shadow-sm focus-within:ring-1 focus-within:ring-primary/20 focus-within:border-primary transition-all bg-background">
                    {/* Elemen ini akan "dibajak" oleh Quill untuk dirender */}
                    <div ref={editorRef} className="min-h-[400px] text-base" />
                  </div>

                  {/* 💡 Override CSS bawaan Quill agar match dengan Shadcn */}
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
              </CardContent>
            </Card>
          </div>

          {/* ⚙️ KOLOM KANAN (Lebar 4/12): Pengaturan Metadata (Sticky) */}
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

                <div className="space-y-3">
                  <Label className="font-semibold text-foreground">
                    Kategori Wawasan
                  </Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(val) =>
                      setFormData({ ...formData, category_id: val })
                    }
                    required
                  >
                    <SelectTrigger className="rounded-xl h-12 bg-background border-border shadow-sm">
                      <SelectValue placeholder="Pilih Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 pt-2">
                  <Label className="font-semibold block mb-3 text-foreground">
                    Tag Terkait (Pilih ganda)
                  </Label>
                  {tags.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic bg-muted/20 p-4 rounded-xl text-center border border-dashed border-border">
                      Belum ada tag tersedia.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => {
                        const isSelected = formData.tag_ids.includes(tag.id);
                        return (
                          <button
                            type="button"
                            key={tag.id}
                            onClick={() => handleTagToggle(tag.id)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                              isSelected
                                ? "bg-primary text-primary-foreground border-primary shadow-sm hover:bg-primary/90"
                                : "bg-transparent text-muted-foreground border-border hover:border-primary/40 hover:bg-primary/5"
                            }`}
                          >
                            #{tag.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {formData.status === "published"
                ? "Terbitkan Artikel"
                : "Simpan Draf"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

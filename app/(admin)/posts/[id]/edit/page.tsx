"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, ArrowLeft, Save, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
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

interface Category {
  id: string;
  name: string;
}
interface Tag {
  id: string;
  name: string;
}

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  // 🌟 STATE MANAJEMEN
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<Quill | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    status: "draft",
    excerpt: "",
    content: "",
    tag_ids: [] as string[],
    thumbnail_url: "",
  });

  // 1. Fetch Data Artikel, Kategori, dan Tag secara bersamaan
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [catRes, tagRes, postRes] = await Promise.all([
          api.get("/api/v1/categories"),
          api.get("/api/v1/tags"),
          api.get(`/api/v1/posts/${postId}`), // Fetch data artikel spesifik
        ]);

        setCategories(catRes.data.data || []);
        setTags(tagRes.data.data || []);

        const postData = postRes.data.data;

        // Memetakan relasi Tag menjadi array string UUID untuk formData
        const existingTagIds = postData.tags
          ? postData.tags.map((t: any) => t.id)
          : [];

        const thumbnailMedia = postData.media?.find(
          (m: any) => m.media_type === "thumbnail",
        );
        const existingThumbnailUrl = thumbnailMedia
          ? thumbnailMedia.file_url
          : "";

        setFormData({
          title: postData.title,
          category_id: postData.category.id, // Ambil ID dari objek category
          status: postData.status,
          excerpt: postData.excerpt || "",
          content: postData.content,
          tag_ids: existingTagIds,
          thumbnail_url: existingThumbnailUrl,
        });
      } catch (error) {
        console.error("Gagal memuat data:", error);
        alert("Gagal memuat data artikel. Mungkin artikel sudah dihapus.");
        router.push("/admin/posts");
      } finally {
        // Tandai bahwa pengambilan data selesai, siap merender Quill
        setIsPageLoading(false);
      }
    };

    if (postId) {
      fetchAllData();
    }
  }, [postId, router]);

  // 2. Inisialisasi Quill (Berjalan HANYA setelah isPageLoading = false)
  useEffect(() => {
    if (!isPageLoading && editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Lanjutkan menulis wawasan Anda...",
        modules: {
          toolbar: [
            [{ header: [2, 3, 4, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "link"],
            ["clean"],
          ],
        },
      });

      // 🌟 SUNTIKKAN KONTEN LAMA KE DALAM QUILL
      if (formData.content) {
        // clipboard.dangerouslyPasteHTML adalah cara standar Quill membaca string HTML dari Database
        quillInstance.current.clipboard.dangerouslyPasteHTML(formData.content);
      }

      // Deteksi perubahan teks baru
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
    // Dependency ini memastikan Quill hanya dirender setelah data dimuat
  }, [isPageLoading]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) {
      alert("Konten artikel tidak boleh kosong!");
      return;
    }

    setIsSubmitting(true);
    try {
      // 🌟 METHOD PUT untuk Update
      await api.put(`/api/v1/admin/posts/${postId}`, formData);
      router.push("/posts");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal memperbarui artikel.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tampilkan layar loading mewah jika data belum siap
  if (isPageLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">
          Menyiapkan ruang kerja Anda...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 font-sans animate-in fade-in duration-500">
      {/* 🌟 HEADER NAVIGASI */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="rounded-full h-10 w-10 hover:bg-muted/50"
        >
          <Link href="/posts">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Edit Wawasan
          </h1>
          <p className="text-muted-foreground mt-1">
            Perbarui konten dan metadata artikel Anda.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 📝 KOLOM KIRI: Editor Utama */}
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
                    placeholder="Tuliskan 1-2 kalimat ringkasan..."
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    className="min-h-[100px] rounded-xl resize-none border-border shadow-sm"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    Konten Lengkap
                  </Label>
                  <div className="rounded-xl overflow-hidden border border-border shadow-sm focus-within:ring-1 focus-within:ring-primary/20 focus-within:border-primary transition-all bg-background">
                    <div ref={editorRef} className="min-h-[400px] text-base" />
                  </div>

                  {/* CSS Injection Quill */}
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

          {/* ⚙️ KOLOM KANAN: Metadata */}
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
                        className="font-medium text-green-600"
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
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={isSubmitting || formData.title.length < 5}
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

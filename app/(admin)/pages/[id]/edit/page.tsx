"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

// Skema Zod (Sama dengan Create)
const pageSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  slug: z
    .string()
    .regex(
      /^[a-z0-9-]+$/,
      "Slug hanya boleh berisi huruf kecil, angka, dan strip (-) tanpa spasi",
    ),
  template_name: z.string().min(1, "Pilih template"),
  status: z.enum(["draft", "published"]),

  // Template Home
  hero_title: z.string().optional(),
  hero_subtitle: z.string().optional(),
  manifesto_quote: z.string().optional(),

  // Template About
  about_history: z.string().optional(),
  about_vision: z.string().optional(),
  about_mission: z.string().optional(),
});

type PageFormValues = z.infer<typeof pageSchema>;

export default function EditPage() {
  const router = useRouter();
  const params = useParams(); // Mengambil ID dari URL: /pages/[id]/edit
  const pageId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
  });

  const selectedTemplate = watch("template_name");

  // 🪄 MENGAMBIL DATA LAMA DAN MENGISI FORM
  useEffect(() => {
    const fetchPageDetail = async () => {
      try {
        const res = await api.get(`/api/v1/admin/pages/${pageId}`);
        const data = res.data.data;

        // Membongkar content_json agar masuk ke field input masing-masing
        const content = data.content_json || {};

        // Fungsi reset() akan menimpa semua value form secara reaktif
        reset({
          title: data.title,
          slug: data.slug,
          template_name: data.template_name,
          status: data.status,

          // Mapping data Home
          hero_title: content.hero_title || "",
          hero_subtitle: content.hero_subtitle || "",
          manifesto_quote: content.manifesto_quote || "",

          // Mapping data About (jika ada)
          about_history: content.history || "",
          about_vision: content.vision || "",
          about_mission: content.mission || "",
        });
      } catch (error) {
        toast.error("Gagal memuat data halaman.");
        router.push("/pages");
      } finally {
        setIsFetching(false);
      }
    };

    if (pageId) fetchPageDetail();
  }, [pageId, reset, router]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue("title", title, { shouldValidate: true });

    const autoSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setValue("slug", autoSlug, { shouldValidate: true });
  };

  const onSubmit = async (data: PageFormValues) => {
    setIsLoading(true);

    try {
      // 🏗️ RAKIT ULANG JSON: Mapping input kembali menjadi content_json
      let contentJson = {};
      if (data.template_name === "home") {
        contentJson = {
          hero_title: data.hero_title || "",
          hero_subtitle: data.hero_subtitle || "",
          manifesto_quote: data.manifesto_quote || "",
        };
      } else if (data.template_name === "about") {
        contentJson = {
          history: data.about_history || "",
          vision: data.about_vision || "",
          mission: data.about_mission || "",
        };
      }

      // Payload untuk PUT Request
      const payload = {
        title: data.title,
        slug: data.slug,
        template_name: data.template_name,
        status: data.status,
        content_json: contentJson,
      };

      const res = await api.put(`/api/v1/admin/pages/${pageId}`, payload);

      if (res.data.status === "success") {
        toast.success("Perubahan halaman berhasil disimpan!");
        router.push("/pages");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Gagal menyimpan perubahan.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Tampilkan loading skeleton/spinner jika data sedang di-fetch
  if (isFetching) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground font-medium">
          Memuat data halaman...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="flex items-center gap-4">
        <Link href="/pages">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Halaman</h1>
          <p className="text-muted-foreground text-sm">
            Perbarui informasi dan konten halaman publik.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* BAGIAN 1: PENGATURAN UMUM */}
        <Card className="border-border shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Judul Halaman <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  {...register("title")}
                  onChange={handleTitleChange}
                />
                {errors.title && (
                  <p className="text-xs text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">
                  URL Slug <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center">
                  <span className="bg-muted px-3 py-2 border border-r-0 border-border rounded-l-md text-muted-foreground text-sm">
                    /
                  </span>
                  <Input
                    id="slug"
                    className="rounded-l-none"
                    {...register("slug")}
                  />
                </div>
                {errors.slug && (
                  <p className="text-xs text-destructive">
                    {errors.slug.message}
                  </p>
                )}
              </div>

              {/* Catatan: Komponen <Select> milik Shadcn sedikit unik karena status value-nya terpisah dari default input HTML.
                  Oleh karena itu kita wajib mengirim value={watch("template_name")} agar dia berubah saat reset() dipanggil */}
              <div className="space-y-2">
                <Label>
                  Template Halaman <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={watch("template_name")}
                  onValueChange={(val) => setValue("template_name", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home (Beranda)</SelectItem>
                    <SelectItem value="about">About (Tentang Kami)</SelectItem>
                    <SelectItem value="contact">Contact (Kontak)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  Status Publikasi <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={watch("status")}
                  onValueChange={(val: "draft" | "published") =>
                    setValue("status", val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draf (Sembunyikan)</SelectItem>
                    <SelectItem value="published">
                      Publikasi (Tampilkan)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BAGIAN 2: KONTEN DINAMIS (TEMPLATE HOME) */}
        {selectedTemplate === "home" && (
          <Card className="border-border shadow-sm border-t-4 border-t-primary">
            <CardContent className="p-6 space-y-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Konten Template: Home
                </h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Teks Utama (Hero Title)</Label>
                  <Input {...register("hero_title")} />
                </div>
                <div className="space-y-2">
                  <Label>Teks Pendukung (Hero Subtitle)</Label>
                  <Input {...register("hero_subtitle")} />
                </div>
                <div className="space-y-2">
                  <Label>Kutipan Manifesto</Label>
                  <Textarea
                    className="min-h-[100px]"
                    {...register("manifesto_quote")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* KONTEN DINAMIS (TEMPLATE ABOUT) */}
        {selectedTemplate === "about" && (
          <Card className="border-border shadow-sm border-t-4 border-t-secondary">
            <CardContent className="p-6 space-y-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Konten Template: Tentang Kami
                </h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Sejarah Singkat</Label>
                  <Textarea {...register("about_history")} />
                </div>
                <div className="space-y-2">
                  <Label>Visi Perusahaan</Label>
                  <Input {...register("about_vision")} />
                </div>
                <div className="space-y-2">
                  <Label>Misi Perusahaan</Label>
                  <Textarea {...register("about_mission")} />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/pages">
            <Button variant="ghost" type="button">
              Batal
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading} className="min-w-[150px]">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Loader2,
  ArrowLeft,
  Plus,
  Trash2,
  Leaf,
  Target,
  Heart,
  ArrowRight,
} from "lucide-react";
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

// 🌟 Skema Zod yang Diperbarui
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

  // Field Home (Opsional)
  hero_title: z.string().optional(),
  hero_subtitle: z.string().optional(),
  manifesto_quote: z.string().optional(),

  // Array Dinamis Nilai Perusahaan (Digunakan di Home & About)
  values: z
    .array(
      z.object({
        title: z.string().optional(),
        icon: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .optional(),

  // 🌟 Field About (Opsional)
  about_hero_title: z.string().optional(),
  about_who_we_are: z.string().optional(),
  about_why_us: z.string().optional(),
  about_manifesto_intro: z.string().optional(),
  about_vision: z.string().optional(),
  about_mission: z.string().optional(),
  about_timeline_summary: z.string().optional(),

  // 🌟 Array Dinamis Timeline (Khusus About)
  timeline_details: z
    .array(
      z.object({
        year: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .optional(),
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
    control,
    formState: { errors },
  } = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
  });

  const selectedTemplate = watch("template_name");

  // 🌟 Inisialisasi Fitur Array Dinamis
  // Inisialisasi Fitur Array Dinamis untuk Nilai (Sudah ada)
  const {
    fields: valueFields,
    append: appendValue,
    remove: removeValue,
  } = useFieldArray({
    control,
    name: "values",
  });

  // 🌟 Inisialisasi Fitur Array Dinamis untuk Timeline
  const {
    fields: timelineFields,
    append: appendTimeline,
    remove: removeTimeline,
  } = useFieldArray({
    control,
    name: "timeline_details",
  });

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

          // 🌟 Mapping data About Baru
          about_hero_title: content.hero_title || "",
          about_who_we_are: content.who_we_are || "",
          about_why_us: content.why_us || "",
          about_manifesto_intro: content.manifesto_intro || "",
          about_vision: content.vision || "",
          about_mission: content.mission || "",
          about_timeline_summary: content.timeline_summary || "",

          // Array Dinamis
          values: content.values || [],
          timeline_details: content.timeline_details || [],
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
          values: data.values || [], // 🌟 Pastikan array nilai ikut terkirim!
        };
      } else if (data.template_name === "about") {
        contentJson = {
          hero_title: data.about_hero_title || "",
          who_we_are: data.about_who_we_are || "",
          why_us: data.about_why_us || "",
          manifesto_intro: data.about_manifesto_intro || "",
          vision: data.about_vision || "",
          mission: data.about_mission || "",
          timeline_summary: data.about_timeline_summary || "",

          // Data Array Dinamis
          timeline_details: data.timeline_details || [],
          values: data.values || [], // Membawa data nilai & prinsip
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
              {/* 🌟 FITUR BARU: MANAJEMEN NILAI DINAMIS */}
              <div className="pt-6 border-t border-border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">
                      Daftar Nilai Perusahaan
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Tambah, ubah, atau hapus nilai-nilai utama.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      appendValue({ title: "", icon: "Leaf", description: "" })
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" /> Tambah Nilai Baru
                  </Button>
                </div>

                <div className="space-y-4">
                  {valueFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex gap-4 items-start p-4 border border-border rounded-lg bg-muted/20 relative group"
                    >
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Judul Nilai</Label>
                          <Input
                            placeholder="Misal: Adil"
                            {...register(`values.${index}.title`)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Pilih Ikon</Label>
                          {/* Dropdown ikon manual agar lebih aman */}
                          <Select
                            onValueChange={(val) =>
                              setValue(`values.${index}.icon`, val)
                            }
                            defaultValue={field.icon}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Ikon" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Heart">
                                Heart (Hati)
                              </SelectItem>
                              <SelectItem value="Scale">
                                Scale (Timbangan)
                              </SelectItem>
                              <SelectItem value="Leaf">Leaf (Daun)</SelectItem>
                              <SelectItem value="Compass">
                                Compass (Kompas)
                              </SelectItem>
                              <SelectItem value="Star">
                                Star (Bintang)
                              </SelectItem>
                              <SelectItem value="Shield">
                                Shield (Perisai)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2 md:col-span-3">
                          <Label>Deskripsi Nilai</Label>
                          <Textarea
                            placeholder="Penjelasan singkat..."
                            {...register(`values.${index}.description`)}
                          />
                        </div>
                      </div>

                      {/* Tombol Hapus Nilai */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => removeValue(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* KONTEN DINAMIS (TEMPLATE ABOUT) */}
        {selectedTemplate === "about" && (
          <Card className="border-border shadow-sm border-t-4 border-t-secondary">
            <CardContent className="p-6 space-y-10">
              <div className="mb-4 border-b border-border pb-4">
                <h3 className="text-xl font-bold text-foreground">
                  Konten Template: Tentang Kami
                </h3>
                <p className="text-sm text-muted-foreground">
                  Lengkapi narasi, manifesto, dan sejarah perjalanan Titian
                  Nusantara.
                </p>
              </div>

              {/* 1. SEKSI NARASI UTAMA */}
              <div className="space-y-6">
                <h4 className="font-semibold text-primary flex items-center gap-2">
                  <Leaf className="w-4 h-4" /> 1. Narasi Utama
                </h4>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label>Headline / Judul Halaman</Label>
                    <Input
                      placeholder="Misal: Menelusuri Jejak, Merawat Harapan."
                      {...register("about_hero_title")}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Siapa Kami</Label>
                      <Textarea
                        className="min-h-[150px]"
                        placeholder="Titian Nusantara adalah simpul pergerakan..."
                        {...register("about_who_we_are")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mengapa Kami</Label>
                      <Textarea
                        className="min-h-[150px]"
                        placeholder="Karena perubahan sejati tidak datang dari atas..."
                        {...register("about_why_us")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. SEKSI MANIFESTO */}
              <div className="space-y-6 pt-6 border-t border-border">
                <h4 className="font-semibold text-primary flex items-center gap-2">
                  <Target className="w-4 h-4" /> 2. Manifesto & Visi Misi
                </h4>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label>Pengantar Manifesto</Label>
                    <Input
                      placeholder="Komitmen kami terukir dalam langkah nyata..."
                      {...register("about_manifesto_intro")}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Visi</Label>
                      <Textarea
                        className="min-h-[120px]"
                        placeholder="Mewujudkan tatanan masyarakat yang mandiri..."
                        {...register("about_vision")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Misi</Label>
                      <Textarea
                        className="min-h-[120px]"
                        placeholder="Menjadi jembatan yang menghubungkan..."
                        {...register("about_mission")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. SEKSI TIMELINE */}
              <div className="space-y-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-primary flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" /> 3. Jejak Waktu (Timeline)
                  </h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      appendTimeline({ year: "", title: "", description: "" })
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" /> Tambah Jejak Waktu
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Rangkuman Timeline (Teks Sisi Kiri)</Label>
                  <Textarea
                    placeholder="Perjalanan kami bukanlah garis lurus..."
                    {...register("about_timeline_summary")}
                  />
                </div>

                <div className="space-y-4 mt-4">
                  {timelineFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex gap-4 items-start p-4 border border-border rounded-lg bg-muted/20"
                    >
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2 md:col-span-1">
                          <Label>Tahun</Label>
                          <Input
                            placeholder="Misal: 2020"
                            {...register(`timeline_details.${index}.year`)}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-3">
                          <Label>Judul Momen</Label>
                          <Input
                            placeholder="Misal: Langkah Pertama"
                            {...register(`timeline_details.${index}.title`)}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-4">
                          <Label>Deskripsi Momen</Label>
                          <Textarea
                            placeholder="Titian Nusantara didirikan..."
                            {...register(
                              `timeline_details.${index}.description`,
                            )}
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 mt-6"
                        onClick={() => removeTimeline(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. SEKSI NILAI & PRINSIP */}
              <div className="space-y-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-primary flex items-center gap-2">
                    <Heart className="w-4 h-4" /> 4. Nilai dan Prinsip
                  </h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      appendValue({ title: "", icon: "Leaf", description: "" })
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" /> Tambah Nilai Baru
                  </Button>
                </div>

                <div className="space-y-4">
                  {valueFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex gap-4 items-start p-4 border border-border rounded-lg bg-muted/20"
                    >
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Judul Nilai</Label>
                          <Input
                            placeholder="Misal: Adil"
                            {...register(`values.${index}.title`)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Pilih Ikon</Label>
                          <Select
                            onValueChange={(val) =>
                              setValue(`values.${index}.icon`, val)
                            }
                            defaultValue={field.icon}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Ikon" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Heart">
                                Heart (Hati)
                              </SelectItem>
                              <SelectItem value="Scale">
                                Scale (Timbangan)
                              </SelectItem>
                              <SelectItem value="Leaf">Leaf (Daun)</SelectItem>
                              <SelectItem value="Compass">
                                Compass (Kompas)
                              </SelectItem>
                              <SelectItem value="Star">
                                Star (Bintang)
                              </SelectItem>
                              <SelectItem value="Shield">
                                Shield (Perisai)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 md:col-span-3">
                          <Label>Deskripsi Nilai</Label>
                          <Textarea
                            placeholder="Penjelasan singkat..."
                            {...register(`values.${index}.description`)}
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 mt-6"
                        onClick={() => removeValue(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
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

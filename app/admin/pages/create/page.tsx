"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Save,
  LayoutTemplate,
  Settings2,
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

// 🛡️ KEAMANAN: Validasi Skema Zod
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

  // Field Home
  hero_title: z.string().optional(),
  hero_subtitle: z.string().optional(),
  manifesto_quote: z.string().optional(),

  // Array Dinamis Nilai Perusahaan (Home & About)
  values: z
    .array(
      z.object({
        title: z.string().optional(),
        icon: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .optional(),

  // Field About
  about_hero_title: z.string().optional(),
  about_who_we_are: z.string().optional(),
  about_why_us: z.string().optional(),
  about_manifesto_intro: z.string().optional(),
  about_vision: z.string().optional(),
  about_mission: z.string().optional(),
  about_timeline_summary: z.string().optional(),

  // Array Dinamis Timeline (About)
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

export default function CreatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      status: "draft",
      template_name: "home",
      values: [{ title: "Bermakna", icon: "Heart", description: "" }],
    },
  });

  const selectedTemplate = watch("template_name");
  const currentStatus = watch("status");
  const currentTitle = watch("title");

  // Inisialisasi Fitur Array Dinamis untuk Nilai
  const {
    fields: valueFields,
    append: appendValue,
    remove: removeValue,
  } = useFieldArray({
    control,
    name: "values",
  });

  // Inisialisasi Fitur Array Dinamis untuk Timeline
  const {
    fields: timelineFields,
    append: appendTimeline,
    remove: removeTimeline,
  } = useFieldArray({
    control,
    name: "timeline_details",
  });

  // UX FEATURE: Auto-generate Slug dari Title
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
      let contentJson = {};
      if (data.template_name === "home") {
        contentJson = {
          hero_title: data.hero_title || "",
          hero_subtitle: data.hero_subtitle || "",
          manifesto_quote: data.manifesto_quote || "",
          values: data.values || [],
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
          timeline_details: data.timeline_details || [],
          values: data.values || [],
        };
      }

      const payload = {
        title: data.title,
        slug: data.slug,
        template_name: data.template_name,
        status: data.status,
        content_json: contentJson,
      };

      const res = await api.post("/api/v1/admin/pages", payload);

      if (res.data.status === "success") {
        toast.success("Halaman berhasil dibuat!");
        router.push("/admin/pages");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menyimpan halaman.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 font-sans pb-24">
      {/* 🌟 HEADER NAVIGASI */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="rounded-full h-10 w-10 hover:bg-muted/50 border border-transparent hover:border-border transition-all"
        >
          <Link href="/admin/pages">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Buat Halaman Baru
          </h1>
          <p className="text-muted-foreground mt-1">
            Tambahkan halaman dinamis dan atur strukturnya.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* ==============================================================
            BAGIAN ATAS: GRID PENGATURAN UMUM & METADATA (8/4)
            ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 📝 KOLOM KIRI: Pengaturan Utama */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="rounded-[24px] shadow-sm border-border overflow-hidden">
              <CardContent className="p-8 space-y-8">
                {/* Judul Halaman */}
                <div className="space-y-3">
                  <Label
                    htmlFor="title"
                    className="text-sm font-semibold text-primary flex items-center gap-2"
                  >
                    <LayoutTemplate className="w-4 h-4" /> Judul Halaman
                  </Label>
                  <Input
                    id="title"
                    placeholder="Misal: Beranda Utama"
                    {...register("title")}
                    onChange={handleTitleChange}
                    className="h-14 text-lg font-medium rounded-xl border-border focus-visible:ring-primary/20 shadow-sm"
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* URL Slug & Template - Seragam h-12 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="slug" className="text-sm font-semibold">
                      URL Slug
                    </Label>
                    <div className="flex items-center h-12">
                      <span className="bg-muted px-4 flex items-center justify-center h-full border border-r-0 border-border rounded-l-xl text-muted-foreground text-sm">
                        /
                      </span>
                      <Input
                        id="slug"
                        className="rounded-l-none rounded-r-xl h-full focus-visible:ring-primary/20"
                        placeholder="beranda-utama"
                        {...register("slug")}
                      />
                    </div>
                    {errors.slug && (
                      <p className="text-xs text-destructive">
                        {errors.slug.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">
                      Template Halaman
                    </Label>
                    <Select
                      onValueChange={(val) => setValue("template_name", val)}
                      defaultValue="home"
                    >
                      <SelectTrigger className="rounded-xl h-12 border-border focus:ring-primary/20 shadow-sm">
                        <SelectValue placeholder="Pilih template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Home (Beranda)</SelectItem>
                        <SelectItem value="about">
                          About (Tentang Kami)
                        </SelectItem>
                        <SelectItem value="contact">
                          Contact (Kontak)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ⚙️ KOLOM KANAN: Sidebar Sticky */}
          <div className="lg:col-span-4 space-y-6 sticky top-6 z-10">
            <Card className="rounded-[24px] shadow-sm border-border bg-card">
              <CardContent className="p-6 space-y-8">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <Settings2 className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">
                    Pengaturan Halaman
                  </h3>
                </div>

                <div className="space-y-3">
                  <Label className="font-semibold text-foreground">
                    Status Publikasi
                  </Label>
                  <Select
                    onValueChange={(val: "draft" | "published") =>
                      setValue("status", val)
                    }
                    defaultValue="draft"
                  >
                    <SelectTrigger className="rounded-xl h-12 bg-background border-border shadow-sm focus:ring-primary/20">
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
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={isLoading || !currentTitle || currentTitle.length < 3}
              className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {currentStatus === "published"
                ? "Terbitkan Halaman"
                : "Simpan Draf"}
            </Button>
          </div>
        </div>

        {/* ==============================================================
            BAGIAN BAWAH: FULL WIDTH KONTEN TEMPLATE
            ============================================================== */}
        <div className="w-full">
          {/* 🌟 KONTEN DINAMIS: TEMPLATE HOME */}
          {selectedTemplate === "home" && (
            <Card className="rounded-[24px] border-border shadow-sm overflow-hidden w-full">
              <div className="h-2 w-full bg-primary" />
              <CardContent className="p-8 space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    Konten Template: Home
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Isi teks yang akan muncul di halaman beranda utama.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="font-semibold">
                      Teks Utama (Hero Title)
                    </Label>
                    <Input
                      className="rounded-xl h-12 border-border bg-muted/10"
                      placeholder="Misal: Manusia sebagai pusat..."
                      {...register("hero_title")}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="font-semibold">
                      Teks Pendukung (Hero Subtitle)
                    </Label>
                    <Input
                      className="rounded-xl h-12 border-border bg-muted/10"
                      placeholder="Misal: Melangkah bersama untuk dampak..."
                      {...register("hero_subtitle")}
                    />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <Label className="font-semibold">Kutipan Manifesto</Label>
                    <Textarea
                      className="min-h-[100px] rounded-xl border-border bg-muted/10 resize-none"
                      placeholder="Misal: Titian Nusantara bukan sekadar platform..."
                      {...register("manifesto_quote")}
                    />
                  </div>
                </div>

                {/* NILAI PERUSAHAAN (HOME) */}
                <div className="pt-8 border-t border-border">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Heart className="w-5 h-5 text-primary" /> Daftar Nilai
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Tambah, ubah, atau hapus nilai-nilai utama.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl h-11 px-4 border-dashed border-primary/30 text-primary hover:bg-primary/5"
                      onClick={() =>
                        appendValue({
                          title: "",
                          icon: "Leaf",
                          description: "",
                        })
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" /> Tambah Nilai
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {valueFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex gap-4 items-start p-5 border border-border rounded-2xl bg-background shadow-sm"
                      >
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-3">
                            <Label className="text-xs">Judul Nilai</Label>
                            <Input
                              className="rounded-xl h-11 bg-muted/10 border-border"
                              placeholder="Misal: Adil"
                              {...register(`values.${index}.title`)}
                            />
                          </div>
                          <div className="space-y-3">
                            <Label className="text-xs">Pilih Ikon</Label>
                            <Select
                              onValueChange={(val) =>
                                setValue(`values.${index}.icon`, val)
                              }
                              defaultValue={field.icon}
                            >
                              <SelectTrigger className="rounded-xl h-11 bg-muted/10 border-border">
                                <SelectValue placeholder="Pilih Ikon" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Heart">
                                  Heart (Hati)
                                </SelectItem>
                                <SelectItem value="Scale">
                                  Scale (Timbangan)
                                </SelectItem>
                                <SelectItem value="Leaf">
                                  Leaf (Daun)
                                </SelectItem>
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
                          <div className="space-y-3 md:col-span-2">
                            <Label className="text-xs">Deskripsi Nilai</Label>
                            <Textarea
                              className="rounded-xl bg-muted/10 border-border min-h-[80px] resize-none"
                              placeholder="Penjelasan singkat..."
                              {...register(`values.${index}.description`)}
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
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

          {/* 🌟 KONTEN DINAMIS: TEMPLATE ABOUT */}
          {selectedTemplate === "about" && (
            <Card className="rounded-[24px] border-border shadow-sm overflow-hidden w-full">
              <div className="h-2 w-full bg-secondary" />
              <CardContent className="p-8 space-y-10">
                <div className="border-b border-border pb-6">
                  <h3 className="text-xl font-bold text-foreground">
                    Konten Template: Tentang Kami
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Lengkapi narasi, manifesto, dan sejarah perjalanan Titian
                    Nusantara.
                  </p>
                </div>

                {/* 1. Narasi Utama */}
                <div className="space-y-6">
                  <h4 className="text-lg font-bold text-primary flex items-center gap-2">
                    <Leaf className="w-5 h-5" /> 1. Narasi Utama
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 md:col-span-2">
                      <Label className="font-semibold">
                        Headline / Judul Halaman
                      </Label>
                      <Input
                        className="rounded-xl h-12 bg-muted/10 border-border"
                        placeholder="Misal: Menelusuri Jejak, Merawat Harapan."
                        {...register("about_hero_title")}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-semibold">Siapa Kami</Label>
                      <Textarea
                        className="min-h-[150px] rounded-xl bg-muted/10 border-border"
                        placeholder="Titian Nusantara adalah simpul pergerakan..."
                        {...register("about_who_we_are")}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-semibold">Mengapa Kami</Label>
                      <Textarea
                        className="min-h-[150px] rounded-xl bg-muted/10 border-border"
                        placeholder="Karena perubahan sejati tidak datang dari atas..."
                        {...register("about_why_us")}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Manifesto & Visi Misi */}
                <div className="space-y-6 pt-8 border-t border-border">
                  <h4 className="text-lg font-bold text-primary flex items-center gap-2">
                    <Target className="w-5 h-5" /> 2. Manifesto & Visi Misi
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 md:col-span-2">
                      <Label className="font-semibold">
                        Pengantar Manifesto
                      </Label>
                      <Input
                        className="rounded-xl h-12 bg-muted/10 border-border"
                        placeholder="Komitmen kami terukir dalam langkah nyata..."
                        {...register("about_manifesto_intro")}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-semibold">Visi</Label>
                      <Textarea
                        className="min-h-[120px] rounded-xl bg-muted/10 border-border"
                        placeholder="Mewujudkan tatanan masyarakat yang mandiri..."
                        {...register("about_vision")}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-semibold">Misi</Label>
                      <Textarea
                        className="min-h-[120px] rounded-xl bg-muted/10 border-border"
                        placeholder="Menjadi jembatan yang menghubungkan..."
                        {...register("about_mission")}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Timeline */}
                <div className="space-y-6 pt-8 border-t border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h4 className="text-lg font-bold text-primary flex items-center gap-2">
                      <ArrowRight className="w-5 h-5" /> 3. Jejak Waktu
                      (Timeline)
                    </h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl h-11 px-4 border-dashed border-primary/30 text-primary hover:bg-primary/5"
                      onClick={() =>
                        appendTimeline({
                          year: "",
                          title: "",
                          description: "",
                        })
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" /> Tambah Momen
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-semibold">
                      Rangkuman Timeline (Teks Kiri)
                    </Label>
                    <Textarea
                      className="rounded-xl bg-muted/10 border-border min-h-[100px]"
                      placeholder="Perjalanan kami bukanlah garis lurus..."
                      {...register("about_timeline_summary")}
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                    {timelineFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex gap-4 items-start p-5 border border-border rounded-2xl bg-background shadow-sm"
                      >
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-5">
                          <div className="space-y-3 md:col-span-1">
                            <Label className="text-xs">Tahun</Label>
                            <Input
                              className="rounded-xl h-11 bg-muted/10 border-border"
                              placeholder="Misal: 2020"
                              {...register(`timeline_details.${index}.year`)}
                            />
                          </div>
                          <div className="space-y-3 md:col-span-3">
                            <Label className="text-xs">Judul Momen</Label>
                            <Input
                              className="rounded-xl h-11 bg-muted/10 border-border"
                              placeholder="Misal: Langkah Pertama"
                              {...register(`timeline_details.${index}.title`)}
                            />
                          </div>
                          <div className="space-y-3 md:col-span-4">
                            <Label className="text-xs">Deskripsi Momen</Label>
                            <Textarea
                              className="rounded-xl bg-muted/10 border-border resize-none"
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
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                          onClick={() => removeTimeline(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Nilai & Prinsip (ABOUT) */}
                <div className="space-y-6 pt-8 border-t border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-bold text-primary flex items-center gap-2">
                        <Heart className="w-5 h-5" /> 4. Nilai dan Prinsip
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Nilai yang dianut dalam pergerakan.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl h-11 px-4 border-dashed border-primary/30 text-primary hover:bg-primary/5"
                      onClick={() =>
                        appendValue({
                          title: "",
                          icon: "Leaf",
                          description: "",
                        })
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" /> Tambah Nilai
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {valueFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex gap-4 items-start p-5 border border-border rounded-2xl bg-background shadow-sm"
                      >
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-3">
                            <Label className="text-xs">Judul Nilai</Label>
                            <Input
                              className="rounded-xl h-11 bg-muted/10 border-border"
                              placeholder="Misal: Adil"
                              {...register(`values.${index}.title`)}
                            />
                          </div>
                          <div className="space-y-3">
                            <Label className="text-xs">Pilih Ikon</Label>
                            <Select
                              onValueChange={(val) =>
                                setValue(`values.${index}.icon`, val)
                              }
                              defaultValue={field.icon}
                            >
                              <SelectTrigger className="rounded-xl h-11 bg-muted/10 border-border">
                                <SelectValue placeholder="Pilih Ikon" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Heart">
                                  Heart (Hati)
                                </SelectItem>
                                <SelectItem value="Scale">
                                  Scale (Timbangan)
                                </SelectItem>
                                <SelectItem value="Leaf">
                                  Leaf (Daun)
                                </SelectItem>
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
                          <div className="space-y-3 md:col-span-2">
                            <Label className="text-xs">Deskripsi Nilai</Label>
                            <Textarea
                              className="rounded-xl bg-muted/10 border-border min-h-[80px] resize-none"
                              placeholder="Penjelasan singkat..."
                              {...register(`values.${index}.description`)}
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
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
        </div>
      </form>
    </div>
  );
}

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
  Handshake,
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

// 🛡️ SKEMA VALIDASI ZOD (Mencakup 4 Template)
const pageSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Hanya huruf kecil, angka, dan strip"),
  template_name: z.string().min(1, "Pilih template"),
  status: z.enum(["draft", "published"]),

  // Field Home
  hero_title: z.string().optional(),
  hero_subtitle: z.string().optional(),
  manifesto_quote: z.string().optional(),

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

  timeline_details: z
    .array(
      z.object({
        year: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .optional(),

  // Field Collaboration (Sektoral)
  collab_badge_text: z.string().optional(),
  collab_hero_title: z.string().optional(),
  collab_hero_subtitle: z.string().optional(),
  collab_hero_image: z.string().optional(),
  collab_penjelasan_title: z.string().optional(),
  collab_penjelasan_teks: z.string().optional(),
  collab_penjelasan_image: z.string().optional(),
  collab_benefit_title: z.string().optional(),
  collab_cta_title: z.string().optional(),
  collab_cta_text: z.string().optional(),
  collab_cta_link: z.string().optional(),

  collab_benefits: z
    .array(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        icon: z.string().optional(),
      }),
    )
    .optional(),

  // 🌟 BARU: Field Model Kolaborasi
  model_hero_title: z.string().optional(),
  model_hero_subtitle: z.string().optional(),
  model_hero_image: z.string().optional(),
  model_detail_title: z.string().optional(),
  model_detail_subtitle: z.string().optional(),

  model_items: z
    .array(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        features: z.string().optional(),
        recommended_for: z.string().optional(),
      }),
    )
    .optional(),

  model_perbandingan: z
    .array(
      z.object({
        feature_name: z.string().optional(),
        model_1_has: z.boolean().default(false),
        model_2_has: z.boolean().default(false),
        model_3_has: z.boolean().default(false),
      }),
    )
    .optional(),

  model_alur_title: z.string().optional(),
  model_alur_description: z.string().optional(),
  model_alurs: z
    .array(
      z.object({
        step: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .optional(),

  model_faqs: z
    .array(
      z.object({
        question: z.string().optional(),
        answer: z.string().optional(),
      }),
    )
    .optional(),

  model_cta_title: z.string().optional(),
  model_cta_link: z.string().optional(),
  model_cta_text: z.string().optional(),
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
      timeline_details: [{ year: "", title: "", description: "" }],
      collab_benefits: [{ title: "", icon: "Briefcase", description: "" }],
      model_items: [
        { title: "", description: "", features: "", recommended_for: "" },
      ],
      model_perbandingan: [
        {
          feature_name: "",
          model_1_has: false,
          model_2_has: false,
          model_3_has: false,
        },
      ],
      model_alurs: [{ step: "1", title: "", description: "" }],
      model_faqs: [{ question: "", answer: "" }],
    },
  });

  const selectedTemplate = watch("template_name");
  const currentStatus = watch("status");
  const currentTitle = watch("title");

  // Inisialisasi Fitur Array Dinamis
  const {
    fields: valueFields,
    append: appendValue,
    remove: removeValue,
  } = useFieldArray({ control, name: "values" });
  const {
    fields: timelineFields,
    append: appendTimeline,
    remove: removeTimeline,
  } = useFieldArray({ control, name: "timeline_details" });
  const {
    fields: collabBenefitFields,
    append: appendCollabBenefit,
    remove: removeCollabBenefit,
  } = useFieldArray({ control, name: "collab_benefits" });
  const {
    fields: modelFields,
    append: appendModel,
    remove: removeModel,
  } = useFieldArray({ control, name: "model_items" });
  const {
    fields: perbandinganFields,
    append: appendPerbandingan,
    remove: removePerbandingan,
  } = useFieldArray({ control, name: "model_perbandingan" });
  const {
    fields: alurFields,
    append: appendAlur,
    remove: removeAlur,
  } = useFieldArray({ control, name: "model_alurs" });
  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({ control, name: "model_faqs" });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue("title", title, { shouldValidate: true });
    setValue(
      "slug",
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, ""),
      { shouldValidate: true },
    );
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
      } else if (data.template_name === "collaboration") {
        contentJson = {
          badge_text: data.collab_badge_text || "",
          hero_title: data.collab_hero_title || "",
          hero_subtitle: data.collab_hero_subtitle || "",
          hero_image: data.collab_hero_image || "",
          penjelasan_title: data.collab_penjelasan_title || "",
          penjelasan_teks: data.collab_penjelasan_teks || "",
          penjelasan_image: data.collab_penjelasan_image || "",
          benefit_title: data.collab_benefit_title || "",
          benefits: data.collab_benefits || [],
          cta_title: data.collab_cta_title || "",
          cta_text: data.collab_cta_text || "",
          cta_link: data.collab_cta_link || "",
        };
      } else if (data.template_name === "collaboration-model") {
        const formattedModels =
          data.model_items?.map((m) => ({
            ...m,
            features: m.features
              ? m.features.split(",").map((f) => f.trim())
              : [],
          })) || [];

        contentJson = {
          hero_title: data.model_hero_title || "",
          hero_subtitle: data.model_hero_subtitle || "",
          hero_image: data.model_hero_image || "",
          model_title: data.model_detail_title || "",
          model_subtitle: data.model_detail_subtitle || "",
          models: formattedModels,
          perbandingan_features: data.model_perbandingan || [],
          alur_title: data.model_alur_title || "",
          alur_description: data.model_alur_description || "",
          alur: data.model_alurs || [],
          faqs: data.model_faqs || [],
          cta_title: data.model_cta_title || "",
          cta_link: data.model_cta_link || "",
          cta_text: data.model_cta_text || "",
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
          <h1 className="text-3xl font-bold">Buat Halaman Baru</h1>
          <p className="text-muted-foreground mt-1">
            Tambahkan halaman dinamis dan atur strukturnya.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* ==============================================================
            BAGIAN ATAS: PENGATURAN UMUM & METADATA
            ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            <Card className="rounded-[24px] shadow-sm border-border">
              <CardContent className="p-8 space-y-8">
                <div className="space-y-3">
                  <Label
                    htmlFor="title"
                    className="font-semibold text-primary flex items-center gap-2"
                  >
                    <LayoutTemplate className="w-4 h-4" /> Judul Halaman
                    Internal
                  </Label>
                  <Input
                    id="title"
                    placeholder="Misal: Model Kolaborasi"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="slug" className="text-sm font-semibold">
                      URL Slug
                    </Label>
                    <div className="flex h-12">
                      <span className="bg-muted px-4 flex items-center border border-r-0 rounded-l-xl text-muted-foreground text-sm">
                        /
                      </span>
                      <Input
                        id="slug"
                        className="rounded-l-none rounded-r-xl h-full focus-visible:ring-primary/20"
                        placeholder="model-kolaborasi"
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
                        <SelectItem value="collaboration">
                          Collaboration (Kolaborasi Sektoral)
                        </SelectItem>
                        <SelectItem value="collaboration-model">
                          Model Kerjasama
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-6 sticky top-6 z-10">
            <Card className="rounded-[24px] shadow-sm bg-card border-border">
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
                    value={watch("status")}
                    onValueChange={(val: "draft" | "published") =>
                      setValue("status", val)
                    }
                  >
                    <SelectTrigger className="rounded-xl h-12 bg-background border-border shadow-sm focus:ring-primary/20">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Simpan sebagai Draf</SelectItem>
                      <SelectItem value="published" className="text-green-600">
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
          {/* 🌟 TEMPLATE: HOME */}
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
                      className="rounded-xl h-12 bg-muted/10 border-border"
                      placeholder="Misal: Menyemai Harapan, Menuai Perubahan"
                      {...register("hero_title")}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="font-semibold">
                      Teks Pendukung (Hero Subtitle)
                    </Label>
                    <Input
                      className="rounded-xl h-12 bg-muted/10 border-border"
                      placeholder="Misal: Ruang kolaborasi akar rumput..."
                      {...register("hero_subtitle")}
                    />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <Label className="font-semibold">Kutipan Manifesto</Label>
                    <Textarea
                      className="min-h-[100px] rounded-xl bg-muted/10 border-border resize-none"
                      placeholder="Misal: Manusia sebagai pusat, keberagaman sebagai kekuatan..."
                      {...register("manifesto_quote")}
                    />
                  </div>
                </div>

                <div className="pt-8 border-t border-border">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-lg font-bold flex items-center gap-2">
                        <Heart className="w-5 h-5 text-primary" /> Daftar Nilai
                      </h4>
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
                        className="flex gap-4 p-5 border border-border rounded-2xl bg-background shadow-sm"
                      >
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-3">
                            <Label className="text-xs">Judul Nilai</Label>
                            <Input
                              className="rounded-xl h-11 bg-muted/10 border-border"
                              placeholder="Misal: Berkelanjutan"
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
                                <SelectItem value="Heart">Heart</SelectItem>
                                <SelectItem value="Scale">Scale</SelectItem>
                                <SelectItem value="Leaf">Leaf</SelectItem>
                                <SelectItem value="Compass">Compass</SelectItem>
                                <SelectItem value="Star">Star</SelectItem>
                                <SelectItem value="Shield">Shield</SelectItem>
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

          {/* 🌟 TEMPLATE: ABOUT */}
          {selectedTemplate === "about" && (
            <Card className="rounded-[24px] border-border shadow-sm overflow-hidden w-full">
              <div className="h-2 w-full bg-secondary" />
              <CardContent className="p-8 space-y-10">
                <div className="border-b border-border pb-6">
                  <h3 className="text-xl font-bold text-foreground">
                    Konten Template: Tentang Kami
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Lengkapi narasi, manifesto, dan sejarah perjalanan.
                  </p>
                </div>

                <div className="space-y-6">
                  <h4 className="text-lg font-bold text-primary flex items-center gap-2">
                    <Leaf className="w-5 h-5" /> 1. Narasi Utama
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 md:col-span-2">
                      <Label className="font-semibold">
                        Headline / Judul Pahlawan
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
                        className="min-h-[150px] rounded-xl bg-muted/10 border-border resize-none"
                        placeholder="Tuliskan latar belakang Titian Nusantara adalah..."
                        {...register("about_who_we_are")}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-semibold">Mengapa Kami</Label>
                      <Textarea
                        className="min-h-[150px] rounded-xl bg-muted/10 border-border resize-none"
                        placeholder="Alasan mengapa organisasi ini dibentuk..."
                        {...register("about_why_us")}
                      />
                    </div>
                  </div>
                </div>

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
                        placeholder="Misal: Komitmen kami terukir dalam langkah nyata..."
                        {...register("about_manifesto_intro")}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-semibold">Visi</Label>
                      <Textarea
                        className="min-h-[120px] rounded-xl bg-muted/10 border-border resize-none"
                        placeholder="Mewujudkan tatanan masyarakat yang..."
                        {...register("about_vision")}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-semibold">Misi</Label>
                      <Textarea
                        className="min-h-[120px] rounded-xl bg-muted/10 border-border resize-none"
                        placeholder="Menjadi jembatan yang menghubungkan..."
                        {...register("about_mission")}
                      />
                    </div>
                  </div>
                </div>

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
                        appendTimeline({ year: "", title: "", description: "" })
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" /> Tambah Momen
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <Label className="font-semibold">
                      Rangkuman Timeline (Paragraf Pengantar)
                    </Label>
                    <Textarea
                      className="rounded-xl bg-muted/10 border-border min-h-[100px] resize-none"
                      placeholder="Perjalanan kami bukanlah garis lurus..."
                      {...register("about_timeline_summary")}
                    />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                    {timelineFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex gap-4 p-5 border border-border rounded-2xl bg-background shadow-sm"
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
                              placeholder="Jelaskan sejarah di tahun tersebut..."
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
              </CardContent>
            </Card>
          )}

          {/* 🌟 TEMPLATE: COLLABORATION (SEKTORAL) */}
          {selectedTemplate === "collaboration" && (
            <Card className="rounded-[24px] border-border shadow-sm overflow-hidden w-full">
              <div className="h-2 w-full bg-blue-500" />
              <CardContent className="p-8 space-y-10">
                <div className="border-b border-border pb-6">
                  <h3 className="text-xl font-bold text-foreground">
                    Konten Template: Kolaborasi Sektoral
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cocok untuk halaman Institusi Publik atau Mitra Industri.
                  </p>
                </div>

                <div className="space-y-6">
                  <h4 className="text-lg font-bold text-blue-500 flex items-center gap-2">
                    <Handshake className="w-5 h-5" /> 1. Area Hero
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 md:col-span-2">
                      <Label className="font-semibold">Lencana (Badge)</Label>
                      <Input
                        className="rounded-xl h-12 bg-muted/10 border-border"
                        placeholder="Misal: Sinergi B2G (Pemerintah)"
                        {...register("collab_badge_text")}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-semibold">Hero Title</Label>
                      <Textarea
                        className="min-h-[100px] rounded-xl bg-muted/10 border-border resize-none"
                        placeholder="Akselerasi Program..."
                        {...register("collab_hero_title")}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-semibold">Hero Subtitle</Label>
                      <Textarea
                        className="min-h-[100px] rounded-xl bg-muted/10 border-border resize-none"
                        placeholder="Deskripsi singkat hero..."
                        {...register("collab_hero_subtitle")}
                      />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <Label className="font-semibold">
                        URL Gambar Hero (Opsional)
                      </Label>
                      <Input
                        className="rounded-xl h-12 bg-muted/10 border-border"
                        placeholder="https://..."
                        {...register("collab_hero_image")}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-8 border-t border-border">
                  <h4 className="text-lg font-bold text-blue-500 flex items-center gap-2">
                    <LayoutTemplate className="w-5 h-5" /> 2. Penjelasan
                  </h4>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-3">
                      <Label className="font-semibold">Judul Penjelasan</Label>
                      <Input
                        className="rounded-xl h-12 bg-muted/10 border-border"
                        placeholder="Misal: Menjembatani Birokrasi..."
                        {...register("collab_penjelasan_title")}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-semibold">
                        Teks Penjelasan Panjang
                      </Label>
                      <Textarea
                        className="min-h-[150px] rounded-xl bg-muted/10 border-border resize-none"
                        placeholder="Tulis paragraf narasi di sini..."
                        {...register("collab_penjelasan_teks")}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-semibold">
                        URL Gambar Landscape (Opsional)
                      </Label>
                      <Input
                        className="rounded-xl h-12 bg-muted/10 border-border"
                        placeholder="https://..."
                        {...register("collab_penjelasan_image")}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-8 border-t border-border">
                  <div className="flex justify-between">
                    <h4 className="text-lg font-bold text-blue-500 flex items-center gap-2">
                      <Target className="w-5 h-5" /> 3. Keunggulan
                    </h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl h-11 px-4 border-dashed text-blue-500"
                      onClick={() =>
                        appendCollabBenefit({
                          title: "",
                          icon: "Briefcase",
                          description: "",
                        })
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" /> Tambah Poin
                    </Button>
                  </div>
                  <div className="space-y-3 mb-4">
                    <Label className="font-semibold">
                      Judul Seksi Keunggulan
                    </Label>
                    <Input
                      className="rounded-xl h-12 bg-muted/10 border-border"
                      placeholder="Misal: Nilai Tambah Sinergi..."
                      {...register("collab_benefit_title")}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {collabBenefitFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex gap-4 p-5 border border-border rounded-2xl bg-background shadow-sm"
                      >
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-3">
                            <Label className="text-xs">Judul Poin</Label>
                            <Input
                              className="rounded-xl h-11 bg-muted/10 border-border"
                              placeholder="Misal: Pelaporan Akuntabel"
                              {...register(`collab_benefits.${index}.title`)}
                            />
                          </div>
                          <div className="space-y-3">
                            <Label className="text-xs">Pilih Ikon</Label>
                            <Select
                              onValueChange={(val) =>
                                setValue(`collab_benefits.${index}.icon`, val)
                              }
                              defaultValue={field.icon || "Briefcase"}
                            >
                              <SelectTrigger className="rounded-xl h-11 bg-muted/10 border-border">
                                <SelectValue placeholder="Pilih Ikon" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Briefcase">
                                  Briefcase
                                </SelectItem>
                                <SelectItem value="Building">
                                  Building
                                </SelectItem>
                                <SelectItem value="Globe">Globe</SelectItem>
                                <SelectItem value="ShieldCheck">
                                  Shield Check
                                </SelectItem>
                                <SelectItem value="TrendingUp">
                                  Trending Up
                                </SelectItem>
                                <SelectItem value="Handshake">
                                  Handshake
                                </SelectItem>
                                <SelectItem value="LayoutGrid">
                                  Layout Grid
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-3 md:col-span-2">
                            <Label className="text-xs">Deskripsi Singkat</Label>
                            <Textarea
                              className="rounded-xl bg-muted/10 border-border min-h-[80px] resize-none"
                              placeholder="Penjelasan poin..."
                              {...register(
                                `collab_benefits.${index}.description`,
                              )}
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                          onClick={() => removeCollabBenefit(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 pt-8 border-t border-border">
                  <h4 className="text-lg font-bold text-blue-500 flex items-center gap-2">
                    <ArrowRight className="w-5 h-5" /> 4. Tombol Aksi Bawah
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 md:col-span-2">
                      <Label className="font-semibold">
                        Judul Ajakan (CTA Title)
                      </Label>
                      <Input
                        className="rounded-xl h-12 bg-muted/10 border-border"
                        placeholder="Misal: Mari Wujudkan Program..."
                        {...register("collab_cta_title")}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-semibold">Teks Tombol</Label>
                      <Input
                        className="rounded-xl h-12 bg-muted/10 border-border"
                        placeholder="Misal: Hubungi Kami"
                        {...register("collab_cta_text")}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-semibold">
                        Tautan Tombol (URL)
                      </Label>
                      <Input
                        className="rounded-xl h-12 bg-muted/10 border-border"
                        placeholder="Misal: /hubungi-kami"
                        {...register("collab_cta_link")}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 🌟 TEMPLATE: MODEL KERJASAMA (TABBED + TIMELINE) */}
          {selectedTemplate === "collaboration-model" && (
            <Card className="rounded-[24px] border-border shadow-sm overflow-hidden w-full">
              <div className="h-2 w-full bg-violet-500" />
              <CardContent className="p-8 space-y-10">
                <div className="border-b border-border pb-6">
                  <h3 className="text-xl font-bold text-foreground">
                    Konten Template: Model Kerjasama
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Lengkapi data untuk halaman komparasi model dan alur kerja.
                  </p>
                </div>

                <div className="space-y-6">
                  <h4 className="text-lg font-bold text-violet-500 flex items-center gap-2">
                    1. Area Hero (Paling Atas)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="font-semibold">Hero Title</Label>
                      <Input
                        className="rounded-xl h-12 bg-muted/10 border-border"
                        placeholder="Misal: Model Kolaborasi Berbasis Dampak"
                        {...register("model_hero_title")}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-semibold">Hero Subtitle</Label>
                      <Input
                        className="rounded-xl h-12 bg-muted/10 border-border"
                        placeholder="Misal: Mulai dari intervensi spesifik hingga..."
                        {...register("model_hero_subtitle")}
                      />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <Label className="font-semibold">
                        URL Gambar Hero (Opsional)
                      </Label>
                      <Input
                        className="rounded-xl h-12 bg-muted/10 border-border"
                        placeholder="https://..."
                        {...register("model_hero_image")}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-8 border-t border-border">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-bold text-violet-500">
                      2. Detail Model (Bentuk Tab)
                    </h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl h-11 px-4 border-dashed border-violet-500/30 text-violet-500 hover:bg-violet-500/10"
                      onClick={() =>
                        appendModel({
                          title: "",
                          description: "",
                          features: "",
                          recommended_for: "",
                        })
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" /> Tambah Model
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                      <Label className="font-semibold">Judul Seksi Model</Label>
                      <Input
                        className="rounded-xl h-12 bg-muted/10 border-border"
                        placeholder="Misal: Detail Integrasi Layanan"
                        {...register("model_detail_title")}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-semibold">
                        Subjudul Seksi Model
                      </Label>
                      <Input
                        className="rounded-xl h-12 bg-muted/10 border-border"
                        placeholder="Misal: Pelajari lebih dalam mengenai..."
                        {...register("model_detail_subtitle")}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    {modelFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="p-5 border border-border rounded-2xl bg-background flex gap-4 items-start shadow-sm"
                      >
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label>Judul Tab Model</Label>
                            <Input
                              className="rounded-xl h-11 bg-muted/10"
                              placeholder="Misal: Implementasi Tematik"
                              {...register(`model_items.${index}.title`)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Rekomendasi Untuk</Label>
                            <Input
                              className="rounded-xl h-11 bg-muted/10"
                              placeholder="Misal: Yayasan / CSR"
                              {...register(
                                `model_items.${index}.recommended_for`,
                              )}
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Deskripsi Utama</Label>
                            <Textarea
                              className="rounded-xl bg-muted/10 min-h-[80px] resize-none"
                              placeholder="Penjelasan model ini..."
                              {...register(`model_items.${index}.description`)}
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Fokus Eksekusi (Pisahkan dengan koma)</Label>
                            <Input
                              className="rounded-xl h-11 bg-muted/10"
                              placeholder="Misal: Intervensi multi-sektor, Penguatan kelembagaan, Pengukuran dampak"
                              {...register(`model_items.${index}.features`)}
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                          onClick={() => removeModel(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 pt-8 border-t border-border">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-bold text-violet-500">
                      3. Matriks Perbandingan Model
                    </h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl h-11 px-4 border-dashed border-violet-500/30 text-violet-500 hover:bg-violet-500/10"
                      onClick={() =>
                        appendPerbandingan({
                          feature_name: "",
                          model_1_has: false,
                          model_2_has: false,
                          model_3_has: false,
                        })
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" /> Tambah Fitur Komparasi
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {perbandinganFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="p-5 border border-border rounded-2xl bg-background flex gap-4 items-center shadow-sm"
                      >
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                          <div className="space-y-2 md:col-span-2">
                            <Label>Nama Fitur / Poin (Teks Kiri)</Label>
                            <Input
                              className="rounded-xl h-11 bg-muted/10"
                              placeholder="Misal: Pelaporan Terukur"
                              {...register(
                                `model_perbandingan.${index}.feature_name`,
                              )}
                            />
                          </div>
                          <div className="flex flex-col gap-3 col-span-2 md:col-span-2 pt-6">
                            <label className="flex items-center gap-2 cursor-pointer font-medium text-sm">
                              <input
                                type="checkbox"
                                className="w-4 h-4 rounded text-primary"
                                {...register(
                                  `model_perbandingan.${index}.model_1_has`,
                                )}
                              />{" "}
                              Ada di Model 1
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer font-medium text-sm">
                              <input
                                type="checkbox"
                                className="w-4 h-4 rounded text-primary"
                                {...register(
                                  `model_perbandingan.${index}.model_2_has`,
                                )}
                              />{" "}
                              Ada di Model 2
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer font-medium text-sm">
                              <input
                                type="checkbox"
                                className="w-4 h-4 rounded text-primary"
                                {...register(
                                  `model_perbandingan.${index}.model_3_has`,
                                )}
                              />{" "}
                              Ada di Model 3
                            </label>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                          onClick={() => removePerbandingan(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 pt-8 border-t border-border">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-bold text-violet-500">
                      4. Alur Kolaborasi (Timeline Vertical)
                    </h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl h-11 px-4 border-dashed border-violet-500/30 text-violet-500 hover:bg-violet-500/10"
                      onClick={() =>
                        appendAlur({
                          step: String(alurFields.length + 1),
                          title: "",
                          description: "",
                        })
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" /> Tambah Langkah
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                      <Label className="font-semibold">Judul Seksi Alur</Label>
                      <Input
                        className="rounded-xl h-12 bg-muted/10 border-border"
                        placeholder="Misal: Alur Kolaborasi"
                        {...register("model_alur_title")}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-semibold">
                        Deskripsi Seksi Alur
                      </Label>
                      <Textarea
                        className="rounded-xl bg-muted/10 min-h-[50px] border-border resize-none"
                        placeholder="Misal: Kolaborasi yang sukses diawali dengan komunikasi transparan..."
                        {...register("model_alur_description")}
                      />
                    </div>
                  </div>
                  <div className="space-y-4 mt-4">
                    {alurFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="p-5 border border-border rounded-2xl bg-background flex gap-4 items-start shadow-sm"
                      >
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label>Nomor / Step</Label>
                            <Input
                              className="rounded-xl h-11 bg-muted/10"
                              placeholder="Misal: 1"
                              {...register(`model_alurs.${index}.step`)}
                            />
                          </div>
                          <div className="space-y-2 md:col-span-3">
                            <Label>Judul Langkah</Label>
                            <Input
                              className="rounded-xl h-11 bg-muted/10"
                              placeholder="Misal: Inisiasi & Pemetaan"
                              {...register(`model_alurs.${index}.title`)}
                            />
                          </div>
                          <div className="space-y-2 md:col-span-4">
                            <Label>Deskripsi Langkah</Label>
                            <Textarea
                              className="rounded-xl bg-muted/10 min-h-[60px] resize-none"
                              placeholder="Penjelasan langkah..."
                              {...register(`model_alurs.${index}.description`)}
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                          onClick={() => removeAlur(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 pt-8 border-t border-border">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-bold text-violet-500">
                      5. Pertanyaan Umum (FAQ)
                    </h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl h-11 px-4 border-dashed border-violet-500/30 text-violet-500 hover:bg-violet-500/10"
                      onClick={() => appendFaq({ question: "", answer: "" })}
                    >
                      <Plus className="w-4 h-4 mr-2" /> Tambah FAQ
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {faqFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="p-5 border border-border rounded-2xl bg-background flex gap-4 items-start shadow-sm"
                      >
                        <div className="flex-1 grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label>Pertanyaan</Label>
                            <Input
                              className="rounded-xl h-11 bg-muted/10"
                              placeholder="Misal: Berapa lama durasi kemitraan?"
                              {...register(`model_faqs.${index}.question`)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Jawaban</Label>
                            <Textarea
                              className="rounded-xl bg-muted/10 min-h-[60px] resize-none"
                              placeholder="Jawaban..."
                              {...register(`model_faqs.${index}.answer`)}
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                          onClick={() => removeFaq(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 pt-8 border-t border-border">
                  <h4 className="text-lg font-bold text-violet-500">
                    6. Tombol Aksi (CTA) Bawah
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 md:col-span-2">
                      <Label className="font-semibold">
                        Judul Ajakan (CTA Title)
                      </Label>
                      <Input
                        className="rounded-xl h-12 bg-muted/10 border-border"
                        placeholder="Misal: Mari bahas model yang tepat..."
                        {...register("model_cta_title")}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-semibold">Teks Tombol</Label>
                      <Input
                        className="rounded-xl h-12 bg-muted/10 border-border"
                        placeholder="Misal: Hubungi Tim Kemitraan"
                        {...register("model_cta_text")}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-semibold">Link Tombol (URL)</Label>
                      <Input
                        className="rounded-xl h-12 bg-muted/10 border-border"
                        placeholder="Misal: /proposal-kerjasama"
                        {...register("model_cta_link")}
                      />
                    </div>
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

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(1, { message: "Password tidak boleh kosong" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      const response = await api.post("/api/v1/auth/login", {
        email: data.email,
        password: data.password,
      });

      const result = response.data;

      if (result.status === "success") {
        setAuth(result.data.token, result.data.user);
        toast.success(result.message);
        router.push("/dashboard");
      }
    } catch (error: any) {
      // Sekarang pesan ini akan muncul dan halaman TIDAK akan ke-refresh!
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan saat menghubungi server.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-background text-foreground">
      {/* 🌟 SISI KIRI: Branding (Hanya muncul di layar Desktop) */}
      <div className="hidden lg:flex flex-col justify-between bg-primary text-primary-foreground p-12 lg:p-16">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Titian Nusantara
          </h1>
          <p className="text-primary-foreground/80 mt-2 font-medium">
            Sistem Manajemen Konten (CMS)
          </p>
        </div>

        <div className="mb-8">
          <blockquote className="text-xl lg:text-2xl font-medium italic border-l-4 border-primary-foreground/50 pl-6 leading-relaxed">
            "Manusia sebagai pusat, keberagaman sebagai kekuatan. Melangkah
            bersama untuk dampak yang lebih luas."
          </blockquote>
          <div className="mt-6 flex items-center gap-4">
            <div className="h-px w-8 bg-primary-foreground/50"></div>
            <p className="text-sm font-semibold tracking-wider uppercase text-primary-foreground/80">
              Nilai Perusahaan
            </p>
          </div>
        </div>
      </div>

      {/* 🌟 SISI KANAN: Form Login */}
      <div className="flex items-center justify-center p-8 h-screen lg:h-auto">
        <div className="mx-auto w-full max-w-sm space-y-8">
          {/* Header Form */}
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-foreground">
              Selamat Datang
            </h1>
            <p className="text-muted-foreground text-sm">
              Masukkan email dan password admin Anda untuk mengelola ekosistem.
            </p>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">
                Email Akses
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@titiannusantara.com"
                disabled={isLoading}
                className={`bg-card ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm font-medium text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground/80">
                  Katasandi
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                disabled={isLoading}
                className={`bg-card ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm font-medium text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-medium shadow-md transition-transform active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Memverifikasi identitas...
                </>
              ) : (
                "Masuk ke Dashboard"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

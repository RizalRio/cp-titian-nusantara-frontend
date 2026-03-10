"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Leaf,
  Mail,
  MapPin,
  Loader2,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import api from "@/lib/api";

export function PublicFooter() {
  const [settings, setSettings] = useState({
    siteName: "Titian Nusantara",
    siteDescription:
      "Manusia sebagai pusat, keberagaman sebagai kekuatan. Melangkah bersama untuk dampak yang lebih luas dan berkelanjutan.",
    contactEmail: "halo@titiannusantara.com",
    contactAddress: "Jl. Nusantara No. 1, Jakarta, Indonesia",
    socialInstagram: "",
    socialLinkedin: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  // 🌟 Fetching Site Settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/api/v1/settings");
        if (res.data.status === "success" && res.data.data) {
          const data = res.data.data;

          // Cek apakah data berupa Object atau Array (untuk keamanan)
          if (!Array.isArray(data)) {
            setSettings((prev) => ({
              ...prev,
              siteName: data.site_name || prev.siteName,
              siteDescription: data.description || prev.siteDescription,
              contactEmail: data.email || prev.contactEmail,
              contactAddress: data.address || prev.contactAddress,
              socialInstagram: data.instagram_url || "",
              socialLinkedin: data.linkedin_url || "",
            }));
          } else {
            // Jika data berupa Array (Pola lama key-value fallback)
            const getVal = (key: string) =>
              data.find((item: any) => item.key === key)?.value;
            setSettings((prev) => ({
              ...prev,
              siteName: getVal("site_name") || prev.siteName,
              siteDescription: getVal("description") || prev.siteDescription,
              contactEmail: getVal("email") || prev.contactEmail,
              contactAddress: getVal("address") || prev.contactAddress,
              socialInstagram: getVal("instagram_url") || "",
              socialLinkedin: getVal("linkedin_url") || "",
            }));
          }
        }
      } catch (error) {
        console.error("Gagal memuat pengaturan footer:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <footer className="bg-card border-t border-border pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Branding & Deskripsi Dinamis */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                ) : (
                  settings.siteName
                )}
              </span>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              {isLoading ? (
                <span className="flex flex-col gap-1.5 animate-pulse">
                  <span className="h-2.5 bg-muted rounded w-full"></span>
                  <span className="h-2.5 bg-muted rounded w-5/6"></span>
                  <span className="h-2.5 bg-muted rounded w-4/6"></span>
                </span>
              ) : (
                settings.siteDescription
              )}
            </p>

            {/* Ikon Sosial Media (Muncul otomatis jika link tersedia di database) */}
            <div className="flex items-center gap-3 pt-2">
              {settings.socialInstagram && (
                <a
                  href={settings.socialInstagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinkedin && (
                <a
                  href={settings.socialLinkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Navigasi Cepat (Tetap Statis sesuai routing Next.js) */}
          <div className="space-y-4">
            <h4 className="font-bold text-foreground tracking-wide">
              Navigasi Utama
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/tentang-kami"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>{" "}
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/layanan"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>{" "}
                  Ekosistem Layanan
                </Link>
              </li>
              <li>
                <Link
                  href="/kolaborasi"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>{" "}
                  Kolaborasi
                </Link>
              </li>
              <li>
                <Link
                  href="/jejak-karya"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>{" "}
                  Jejak Karya
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak Dinamis */}
          <div className="space-y-4">
            <h4 className="font-bold text-foreground tracking-wide">
              Hubungi Kami
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-0.5 w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-foreground mb-0.5">
                    Email Resmi
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {isLoading ? "Memuat..." : settings.contactEmail}
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-foreground mb-0.5">
                    Alamat
                  </span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    {isLoading ? "Memuat..." : settings.contactAddress}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {settings.siteName}. Hak Cipta
            Dilindungi.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Kebijakan Privasi
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

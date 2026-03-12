import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🌟 FUNGSI PENGHASIL METADATA DINAMIS (SEO)
export async function generateMetadata(): Promise<Metadata> {
  // Nilai Fallback Default jika API mati atau terjadi error
  const defaultMeta: Metadata = {
    title: "Titian Nusantara",
    description: "Company Profile & Ekosistem Titian Nusantara",
  };

  try {
    // 1. Tentukan Base URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    // 2. Ambil data dari Backend (Menggunakan no-store untuk bypass cache sementara)
    const res = await fetch(`${baseUrl}/api/v1/settings`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`[SEO Error] API merespons dengan status: ${res.status}`);
      return defaultMeta;
    }

    const json = await res.json();

    // --- 🛠️ PERBAIKAN: PARSING DATA ADAPTIF ---
    // Backend bisa mengembalikan json.data atau datanya ada di root json
    const responseData = json.data || json;
    let settings: Record<string, string> = {};

    if (Array.isArray(responseData)) {
      // Jika bentuknya Array: [ {key: "site_name", value: "Titian"}, ... ]
      responseData.forEach((item: any) => {
        if (item && item.key) {
          settings[item.key] = item.value;
        }
      });
    } else if (typeof responseData === "object" && responseData !== null) {
      // Jika bentuknya Object: { site_name: "Titian", description: "..." }
      settings = responseData;
    }

    console.log("[SEO Success] Data Settings berhasil ditarik dan di-parse!");

    // 4. Ekstrak Data untuk SEO
    const siteName = settings["site_name"] || "Titian Nusantara";
    const description =
      settings["description"] || "Company Profile & Ekosistem Titian Nusantara";
    const tagline = settings["tagline"] || "";
    const faviconUrl = settings["favicon_url"] || "/favicon.ico";
    const logoUrl = settings["logo_url"] || "";

    // 5. Kembalikan Konfigurasi Metadata
    return {
      title: {
        default: siteName, // Dipakai di Beranda
        template: `%s | ${siteName}`, // Dipakai di Halaman Lain (Wawasan | Titian Nusantara)
      },
      description: tagline ? `${description} - ${tagline}` : description,
      icons: {
        icon: faviconUrl,
        shortcut: faviconUrl,
        apple: faviconUrl,
      },
      openGraph: {
        title: siteName,
        description: description,
        url: "/",
        siteName: siteName,
        images: logoUrl ? [{ url: logoUrl, alt: siteName }] : [],
        locale: "id_ID",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: siteName,
        description: description,
        images: logoUrl ? [logoUrl] : [],
      },
    };
  } catch (error) {
    console.error("[SEO Fatal Error] Fetch gagal:", error);
    return defaultMeta;
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}

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

export const metadata: Metadata = {
  title: "Titian Nusantara",
  description: "Company Profile & Ekosistem Titian Nusantara",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      {/* antialiased membuat font lebih halus */}
      <body className="antialiased bg-background text-foreground">
        {children}
        {/* Sonner dipasang di root agar notifikasi bisa muncul di semua halaman */}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}

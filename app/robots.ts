import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Gunakan URL Production jika ada di .env, jika tidak gunakan URL default
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://titiannusantara.com";

  return {
    rules: {
      userAgent: "*", // Berlaku untuk semua mesin pencari (Google, Bing, Yahoo, dll)
      allow: "/", // Izinkan merayapi semua halaman publik
      disallow: [
        "/admin/", // 🚫 DILARANG keras mengindeks halaman Dashboard Admin
        "/api/", // 🚫 DILARANG mengindeks data raw API
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`, // Beri tahu Google letak peta situs kita
  };
}

import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://titiannusantara.com";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // 🌟 1. RUTE STATIS (Halaman Utama)
  const staticRoutes = [
    "",
    "/tentang-kami",
    "/layanan",
    "/jejak-karya",
    "/wawasan",
    "/hubungi-kami",
    "/proposal-kerjasama",
    "/model-kolaborasi",
    "/kolaborasi/institusi-publik",
    "/kolaborasi/mitra-industri",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8, // Beranda prioritas tertinggi (1.0)
  }));

  // 🌟 2. RUTE DINAMIS (Ditarik dari Backend CMS)
  let dynamicPages: MetadataRoute.Sitemap = [];
  let dynamicPosts: MetadataRoute.Sitemap = [];

  try {
    // Menarik data Pages dan Posts secara paralel agar lebih cepat
    // next: { revalidate: 3600 } -> Cache sitemap selama 1 jam agar server tidak jebol
    const [pagesRes, postsRes] = await Promise.all([
      fetch(`${apiUrl}/api/v1/pages?limit=100`, { next: { revalidate: 3600 } }),
      fetch(`${apiUrl}/api/v1/posts?limit=100`, { next: { revalidate: 3600 } }),
    ]);

    // Format URL untuk Halaman CMS (Pages) -> /slug
    if (pagesRes.ok) {
      const pagesJson = await pagesRes.json();
      // Sesuaikan 'items' dengan struktur respons pagination API Anda
      const pages = pagesJson.data?.items || pagesJson.data || [];
      dynamicPages = pages.map((page: any) => ({
        url: `${baseUrl}/${page.slug}`,
        lastModified: new Date(page.updated_at || new Date()),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    }

    // Format URL untuk Artikel Wawasan (Posts) -> /wawasan/slug
    if (postsRes.ok) {
      const postsJson = await postsRes.json();
      const posts = postsJson.data?.items || postsJson.data || [];
      dynamicPosts = posts.map((post: any) => ({
        url: `${baseUrl}/wawasan/${post.slug}`,
        lastModified: new Date(post.updated_at || new Date()),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error("[Sitemap Error] Gagal menarik data dinamis:", error);
    // Jika API mati, tidak apa-apa. Tetap kembalikan rute statis agar web tidak crash.
  }

  // 🌟 3. GABUNGKAN SEMUA RUTE
  return [...staticRoutes, ...dynamicPages, ...dynamicPosts];
}

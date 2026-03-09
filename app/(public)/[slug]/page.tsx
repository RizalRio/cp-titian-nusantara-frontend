import { notFound } from "next/navigation";
import { HomeTemplate } from "@/components/templates/HomeTemplate";
import { AboutTemplate } from "@/components/templates/AboutTemplate";
import { CollaborationTemplate } from "@/components/templates/CollaborationTemplate";
import { ModelKolaborasiTemplate } from "@/components/templates/ModelKolaborasiTemplate";
import { ProposalKerjasamaTemplate } from "@/components/templates/ProposalKerjasamaTemplate";

async function getPageData(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const fetchUrl = `${baseUrl}/api/v1/pages/${slug}`;

    console.log(`📡 Mencoba fetch data ke: ${fetchUrl}`);

    const res = await fetch(fetchUrl, {
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.log(
        `❌ API mengembalikan status: ${res.status} untuk slug: ${slug}`,
      );
      return null;
    }

    const json = await res.json();
    console.log(`✅ Berhasil mengambil data untuk slug: ${slug}`);
    return json.data;
  } catch (error) {
    console.error("🚨 Gagal melakukan fetch ke Golang:", error);
    return null;
  }
}

// 🌟 PERBAIKAN 1: Tipe data params diubah menjadi Promise
export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // 🌟 PERBAIKAN 2: Kita harus "await" params sebelum mengambil slug-nya
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  console.log("👉 URL Slug yang ditangkap browser:", slug);

  // Jika entah kenapa slug tetap kosong, langsung lempar ke 404
  if (!slug) {
    notFound();
  }

  const page = await getPageData(slug);

  if (!page) {
    notFound();
  }

  // Sistem Penyalur Desain
  switch (page.template_name) {
    case "home":
      return <HomeTemplate content={page.content_json} />;

    case "about":
      return <AboutTemplate content={page.content_json} />;

    case "collaboration":
      return <CollaborationTemplate data={page.content_json} />;

    case "collaboration-model":
      return <ModelKolaborasiTemplate data={page.content_json} />;

    case "proposal":
      return <ProposalKerjasamaTemplate data={page.content_json} />;

    default:
      return (
        <div className="container mx-auto py-24 px-4 text-center min-h-[50vh] flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {page.title}
          </h1>
          <p className="text-muted-foreground">
            Template "{page.template_name}" belum diimplementasikan di sisi
            Frontend.
          </p>
        </div>
      );
  }
}

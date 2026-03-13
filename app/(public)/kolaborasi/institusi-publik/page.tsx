import {
  CollaborationTemplate,
  KolaborasiData,
} from "@/components/templates/CollaborationTemplate";

export default function InstitusiPublikPage() {
  const dataB2G: KolaborasiData = {
    id: "institusi-publik",
    badge_text: "Untuk Pemerintah & Institusi Publik",
    hero_title: "Akselerasi Kebijakan Melalui Aksi Kolaboratif.",
    hero_subtitle:
      "Kami menjadi mitra strategis pemerintah dalam mengeksekusi program pemberdayaan, memperluas jangkauan kebijakan, dan memastikan dampak langsung hingga ke akar rumput.",
    benefit_title: "Nilai Tambah Kolaborasi B2G",
    benefits: [
      {
        icon: "Globe",
        title: "Skalabilitas Program",
        description:
          "Memperluas jangkauan program pemerintah dengan infrastruktur komunitas yang sudah mapan.",
      },
      {
        icon: "ShieldCheck",
        title: "Kepatuhan & Transparansi",
        description:
          "Sistem pelaporan yang akuntabel dan sejalan dengan standar birokrasi pemerintahan.",
      },
      {
        icon: "TrendingUp",
        title: "Dampak Terukur",
        description:
          "Data kuantitatif dan kualitatif untuk mendukung evaluasi dan perumusan kebijakan lanjutan.",
      },
    ],
    penjelasan_title: "Menjembatani Visi Negara dengan Realitas Lapangan",
    penjelasan_teks:
      "Seringkali, kebijakan yang dirancang dengan baik menemui tantangan saat diimplementasikan di tingkat akar rumput. Titian Nusantara hadir sebagai katalisator. \n\nDengan pengalaman bertahun-tahun merawat ekosistem lokal, kami membantu institusi publik menerjemahkan program menjadi aksi yang relevan dengan konteks sosial budaya masyarakat setempat.",
    cta_title: "Siap Mewujudkan Program Inklusif?",
    cta_text: "Ajukan Proposal Kerjasama",
    cta_link: "/proposal-kerjasama",
  };

  return <CollaborationTemplate data={dataB2G} />;
}

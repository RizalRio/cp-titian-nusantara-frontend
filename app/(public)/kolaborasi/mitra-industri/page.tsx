import {
  CollaborationTemplate,
  KolaborasiData,
} from "@/components/templates/CollaborationTemplate";

export default function MitraIndustriPage() {
  const dataB2B: KolaborasiData = {
    id: "mitra-industri",
    badge_text: "Untuk Korporasi & Pelaku Industri",
    hero_title: "Investasi Sosial yang Melampaui Sekadar Angka.",
    hero_subtitle:
      "Ubah dana CSR dan inisiatif keberlanjutan perusahaan Anda menjadi ekosistem pemberdayaan nyata yang selaras dengan prinsip ESG dan visi bisnis jangka panjang.",
    benefit_title: "Mengapa Berinvestasi Bersama Kami?",
    benefits: [
      {
        icon: "Briefcase",
        title: "Penyelarasan ESG",
        description:
          "Memastikan inisiatif sosial perusahaan Anda memenuhi standar Environment, Social, & Governance.",
      },
      {
        icon: "Building",
        title: "Eksekusi End-to-End",
        description:
          "Dari riset komunitas, pelaksanaan, hingga pelaporan dampak, semua kami kelola secara profesional.",
      },
      {
        icon: "Handshake",
        title: "Brand Resonance",
        description:
          "Meningkatkan reputasi perusahaan di mata publik melalui cerita perubahan nyata yang terverifikasi.",
      },
    ],
    penjelasan_title: "Dampak Sosial sebagai Motor Penggerak Bisnis",
    penjelasan_teks:
      "Keberlanjutan bisnis tidak bisa dipisahkan dari kesejahteraan masyarakat di sekitarnya. Titian Nusantara mendampingi korporasi merancang program investasi sosial yang bukan berwujud 'amal' sesaat, melainkan pemberdayaan mandiri. \n\nKami membantu Anda menciptakan program inovatif yang tidak hanya berdampak positif bagi komunitas, tetapi juga memberikan nilai tambah (shared value) bagi kelangsungan bisnis Anda.",
    cta_title: "Diskusikan Kebutuhan CSR Anda",
    cta_text: "Hubungi Tim Kemitraan",
    cta_link: "/proposal-kerjasama",
  };

  return <CollaborationTemplate data={dataB2B} />;
}

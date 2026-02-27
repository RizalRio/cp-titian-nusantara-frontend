"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Leaf,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  created_at: string;
  category: { name: string };
  media?: { file_url: string; media_type: string }[];
}

// Konfigurasi Animasi Framer Motion
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function WawasanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Membaca parameter URL yang ada, dengan nilai default
  const urlPage = parseInt(searchParams.get("page") || "1");
  const urlCategory = searchParams.get("category_id") || "all";
  const urlSearch = searchParams.get("search") || "";

  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [meta, setMeta] = useState({
    total_data: 0,
    page: 1,
    limit: 9,
    total_pages: 1,
  });

  // Local state untuk form input (sebelum di-submit ke URL)
  const [searchInput, setSearchInput] = useState(urlSearch);

  // Ambil Master Data Kategori
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/v1/categories");
        setCategories(res.data.data || []);
      } catch (error) {
        console.error("Gagal memuat kategori", error);
      }
    };
    fetchCategories();
  }, []);

  // Ambil Data Artikel berdasarkan URL Params
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: urlPage.toString(),
          limit: "9",
          status: "published", // Hanya ambil yang sudah dipublikasi
        });

        if (urlSearch) params.append("search", urlSearch);
        if (urlCategory !== "all") params.append("category_id", urlCategory);

        const res = await api.get(`/api/v1/posts?${params.toString()}`);
        setPosts(res.data.data || []);

        if (res.data.meta) {
          const limit = res.data.meta.limit;
          const total = res.data.meta.total_data;
          setMeta({
            ...res.data.meta,
            total_pages: Math.ceil(total / limit) || 1,
          });
        }
      } catch (error) {
        console.error("Gagal memuat wawasan", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [urlPage, urlCategory, urlSearch]);

  // Handler untuk memperbarui URL Params (Memicu useEffect di atas)
  const updateQueryParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset ke halaman 1 setiap kali filter diubah
    if (key !== "page") {
      params.set("page", "1");
    }

    router.push(`/wawasan?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParams("search", searchInput);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 font-sans selection:bg-[#2D4A22] selection:text-white">
      {/* 🌟 HERO SECTION (Warm & Reflective) */}
      <section className="relative pt-32 pb-20 px-6 lg:px-12 overflow-hidden flex flex-col items-center text-center">
        {/* Dekorasi Organik Abstract */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#E3E8E1] rounded-full mix-blend-multiply filter blur-3xl opacity-70 pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#D6DFD0] rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-3xl"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium text-[#2D4A22] bg-[#2D4A22]/5 border border-[#2D4A22]/10 backdrop-blur-md mb-8"
          >
            <Leaf className="w-4 h-4 mr-2" />
            <span className="tracking-wide uppercase text-xs font-semibold">
              Ruang Berbagi
            </span>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight"
          >
            Menelusuri Gagasan, <br className="hidden md:block" /> Merawat
            Ingatan.
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-slate-600 leading-relaxed"
          >
            Kumpulan pemikiran, cerita dari akar rumput, dan laporan perjalanan
            dalam upaya merajut langkah nyata untuk Nusantara.
          </motion.p>
        </motion.div>
      </section>

      {/* 🌟 FILTER & SEARCH (SEO-Ready URL Query) */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto mb-16 relative z-10">
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-3 md:p-4 rounded-full shadow-lg shadow-[#2D4A22]/5 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Daftar Kategori Horizontal (Scrollable di Mobile) */}
          <div className="flex w-full md:w-auto overflow-x-auto hide-scrollbar gap-2 px-2 pb-2 md:pb-0">
            <button
              onClick={() => updateQueryParams("category_id", "all")}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${urlCategory === "all" ? "bg-[#2D4A22] text-white shadow-md" : "text-slate-500 hover:bg-[#2D4A22]/10 hover:text-[#2D4A22]"}`}
            >
              Semua Tulisan
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateQueryParams("category_id", cat.id)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${urlCategory === cat.id ? "bg-[#2D4A22] text-white shadow-md" : "text-slate-500 hover:bg-[#2D4A22]/10 hover:text-[#2D4A22]"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Kolom Pencarian */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full md:w-72 relative"
          >
            <input
              type="text"
              placeholder="Cari judul tulisan..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-5 pr-12 py-3 bg-white/80 border border-[#E3E8E1] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4A22]/20 transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-[#2D4A22]/5 hover:bg-[#2D4A22]/10 text-[#2D4A22] rounded-full transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* 🌟 POST GRID */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto pb-32">
        {isLoading ? (
          /* SKELETON LOADING (Halus & Konsisten) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white/40 rounded-[32px] p-6 animate-pulse border border-white/50"
              >
                <div className="w-full h-48 bg-[#E3E8E1]/50 rounded-[24px] mb-6" />
                <div className="h-4 w-24 bg-[#E3E8E1] rounded-full mb-4" />
                <div className="h-7 w-full bg-[#E3E8E1] rounded-lg mb-2" />
                <div className="h-7 w-2/3 bg-[#E3E8E1] rounded-lg mb-4" />
                <div className="h-4 w-full bg-[#E3E8E1]/60 rounded-full mb-2" />
                <div className="h-4 w-4/5 bg-[#E3E8E1]/60 rounded-full" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-[#E3E8E1] rounded-full flex items-center justify-center mb-6">
              <BookOpen className="w-10 h-10 text-[#2D4A22]/40" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              Belum Ada Tulisan
            </h3>
            <p className="text-slate-500">
              Kami sedang merajut gagasan. Silakan sesuaikan filter pencarian
              Anda.
            </p>
          </div>
        ) : (
          /* DATA GRID */
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {posts.map((post) => (
                <motion.div key={post.id} variants={fadeInUp}>
                  <Link
                    href={`/wawasan/${post.slug}`}
                    className="group block h-full bg-white/50 backdrop-blur-sm border border-white/60 rounded-[32px] p-4 hover:bg-white hover:shadow-xl hover:shadow-[#2D4A22]/5 transition-all duration-500 hover:-translate-y-1"
                  >
                    {/* Placeholder Gambar (Abstrak Earth Tone) */}
                    {post.media &&
                    post.media.find((m) => m.media_type === "thumbnail") ? (
                      <div className="w-full h-56 bg-slate-100 rounded-[24px] mb-6 relative overflow-hidden group-hover:shadow-md transition-all duration-500">
                        <img
                          src={
                            post.media.find((m) => m.media_type === "thumbnail")
                              ?.file_url
                          }
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      /* Placeholder Gambar (Abstrak Earth Tone) */
                      <div className="w-full h-56 bg-[#F3F5F1] rounded-[24px] mb-6 relative overflow-hidden flex items-center justify-center group-hover:bg-[#EAECE7] transition-colors duration-500">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#2D4A22]/5 rounded-full blur-3xl group-hover:bg-[#2D4A22]/10 transition-colors" />
                        <div className="absolute -left-10 -top-10 w-32 h-32 bg-slate-400/5 rounded-full blur-2xl" />
                        <Leaf className="w-12 h-12 text-[#2D4A22]/10 group-hover:scale-110 transition-transform duration-700" />
                      </div>
                    )}

                    <div className="px-2">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#2D4A22]">
                          {post.category?.name || "Tanpa Kategori"}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-xs font-medium text-slate-500">
                          {formatDate(post.created_at)}
                        </span>
                      </div>

                      <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-3 group-hover:text-[#2D4A22] transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      <p className="text-slate-600 leading-relaxed line-clamp-3 mb-6">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center text-[#2D4A22] font-semibold text-sm">
                        Baca Selengkapnya
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* 🌟 PAGINASI BAWAH */}
            {meta.total_pages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-4">
                <button
                  onClick={() =>
                    updateQueryParams("page", (meta.page - 1).toString())
                  }
                  disabled={meta.page === 1}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-[#2D4A22] hover:text-white hover:border-[#2D4A22] disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-600 transition-all shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="text-slate-600 font-medium px-4">
                  Halaman{" "}
                  <span className="text-slate-900 font-bold">{meta.page}</span>{" "}
                  dari {meta.total_pages}
                </div>
                <button
                  onClick={() =>
                    updateQueryParams("page", (meta.page + 1).toString())
                  }
                  disabled={meta.page === meta.total_pages}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-[#2D4A22] hover:text-white hover:border-[#2D4A22] disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-600 transition-all shadow-sm"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

// Komponen Utama yang dibungkus Suspense (Wajib untuk penggunaan useSearchParams)
export default function WawasanPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-[#2D4A22]/20 border-t-[#2D4A22] rounded-full animate-spin mb-4" />
            <p className="text-[#2D4A22] font-medium">
              Memuat ruang berbagi...
            </p>
          </div>
        </div>
      }
    >
      <WawasanContent />
    </Suspense>
  );
}

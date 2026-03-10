"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Leaf,
  BookOpen,
  ArrowRight,
  Loader2,
  Sparkles,
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function WawasanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  const [searchInput, setSearchInput] = useState(urlSearch);

  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

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

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: urlPage.toString(),
          limit: "9",
          status: "published",
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

  const updateQueryParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all" && value !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (key !== "page") {
      params.set("page", "1");
    }

    router.push(`/wawasan?${params.toString()}`, { scroll: false });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParams("search", searchInput);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] dark:bg-background text-foreground font-sans pb-32">
      {/* 🌟 HERO SECTION */}
      <section className="relative pt-40 pb-28 px-6 lg:px-12 overflow-hidden flex flex-col items-center text-center bg-card border-b border-border/40">
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-secondary/30 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="inline-flex items-center rounded-full px-5 py-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/5 border border-primary/10 mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 mr-2" />
            Ruang Berbagi Gagasan
          </motion.div>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1] text-balance"
          >
            Menelusuri Gagasan, Merawat Ingatan.
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-lg md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium"
          >
            Kumpulan pemikiran, cerita dari akar rumput, dan laporan perjalanan
            dalam upaya merajut langkah nyata untuk Nusantara.
          </motion.p>
        </div>
      </section>

      {/* 🌟 FILTER & SEARCH PANEL (Sticky) */}
      <section className="sticky top-20 z-40 px-4 lg:px-8 py-6 max-w-7xl mx-auto -mt-10">
        <div className="bg-background/90 backdrop-blur-xl border border-border p-2 md:p-3 rounded-[2rem] shadow-lg shadow-primary/5 flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Daftar Kategori Horizontal */}
          <div className="flex w-full md:w-auto overflow-x-auto hide-scrollbar gap-2 px-2 pb-2 md:pb-0">
            <button
              onClick={() => updateQueryParams("category_id", "all")}
              className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${
                urlCategory === "all"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Semua Tulisan
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateQueryParams("category_id", cat.id)}
                className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${
                  urlCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Kolom Pencarian */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full md:w-[320px] relative shrink-0 px-2 md:px-0"
          >
            <input
              type="text"
              placeholder="Cari judul tulisan..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-6 pr-12 py-3.5 bg-muted/30 border border-border rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-colors shadow-sm"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* 🌟 POST GRID */}
      <section className="px-4 lg:px-8 max-w-7xl mx-auto mt-10">
        <AnimatePresence mode="wait">
          {isLoading ? (
            /* SKELETON LOADING (Sesuai dengan bentuk kartu asli) */
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-card rounded-[2.5rem] p-4 flex flex-col border border-border shadow-sm"
                >
                  <div className="w-full aspect-[4/3] bg-muted animate-pulse rounded-[2rem] mb-6" />
                  <div className="px-4 pb-4">
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
                      <div className="h-6 w-24 bg-muted animate-pulse rounded-full" />
                    </div>
                    <div className="h-8 w-full bg-muted animate-pulse rounded-lg mb-3" />
                    <div className="h-8 w-3/4 bg-muted animate-pulse rounded-lg mb-6" />
                    <div className="h-4 w-full bg-muted animate-pulse rounded-full mb-2" />
                    <div className="h-4 w-4/5 bg-muted animate-pulse rounded-full mb-8" />
                    <div className="h-5 w-32 bg-muted animate-pulse rounded-md mt-auto" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : posts.length === 0 ? (
            /* EMPTY STATE */
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center bg-card rounded-[3rem] border border-border border-dashed mx-4"
            >
              <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-10 h-10 text-primary/40" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Belum Ada Tulisan
              </h3>
              <p className="text-muted-foreground max-w-sm">
                Kami tidak dapat menemukan artikel yang sesuai dengan filter
                pencarian Anda.
              </p>
            </motion.div>
          ) : (
            /* DATA GRID */
            <motion.div
              key={`${urlCategory}-${urlSearch}-${urlPage}`}
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={fadeInUp}
                  className="h-full"
                >
                  <Link
                    href={`/wawasan/${post.slug}`}
                    className="group bg-card rounded-[2.5rem] p-4 border border-border shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col h-full relative"
                  >
                    {/* Gambar Artikel */}
                    {post.media &&
                    post.media.find((m) => m.media_type === "thumbnail") ? (
                      <div className="w-full aspect-[4/3] rounded-[2rem] mb-6 relative overflow-hidden bg-muted">
                        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                        <img
                          src={
                            post.media.find((m) => m.media_type === "thumbnail")
                              ?.file_url
                          }
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      </div>
                    ) : (
                      /* Fallback Gambar Abstrak */
                      <div className="w-full aspect-[4/3] bg-secondary/20 rounded-[2rem] mb-6 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
                        <Leaf className="w-12 h-12 text-primary/20 group-hover:scale-110 transition-transform duration-700" />
                      </div>
                    )}

                    <div className="px-4 pb-4 flex flex-col flex-grow">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                          {post.category?.name || "Uncategorized"}
                        </span>
                        <span className="text-[13px] font-semibold text-muted-foreground">
                          {formatDate(post.created_at)}
                        </span>
                      </div>

                      <h2 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-[1.3] text-balance">
                        {post.title}
                      </h2>

                      <p className="text-muted-foreground leading-relaxed flex-grow line-clamp-3 mb-8">
                        {post.excerpt}
                      </p>

                      <div className="inline-flex items-center text-primary font-bold text-sm mt-auto group-hover:tracking-wider transition-all duration-300">
                        Baca Selengkapnya
                        <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🌟 PAGINASI */}
        {!isLoading && meta.total_pages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-20 flex justify-center items-center gap-4"
          >
            <button
              onClick={() => {
                updateQueryParams("page", (meta.page - 1).toString());
                window.scrollTo({ top: 400, behavior: "smooth" });
              }}
              disabled={meta.page === 1}
              className="w-14 h-14 flex items-center justify-center rounded-full bg-card border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="bg-card px-8 py-4 rounded-full border border-border text-muted-foreground font-medium shadow-sm text-sm">
              Hal{" "}
              <span className="text-foreground font-bold mx-1">
                {meta.page}
              </span>{" "}
              dari {meta.total_pages}
            </div>

            <button
              onClick={() => {
                updateQueryParams("page", (meta.page + 1).toString());
                window.scrollTo({ top: 400, behavior: "smooth" });
              }}
              disabled={meta.page === meta.total_pages}
              className="w-14 h-14 flex items-center justify-center rounded-full bg-card border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </section>
    </div>
  );
}

// 🌟 KOMPONEN UTAMA (Wajib Suspense)
export default function WawasanPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground font-medium tracking-wide">
              Membuka lembaran...
            </p>
          </div>
        </div>
      }
    >
      <WawasanContent />
    </Suspense>
  );
}

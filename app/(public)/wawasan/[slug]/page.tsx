"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Tag,
  Leaf,
  Share2,
  Loader2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { toast } from "sonner"; // Tambahkan toast untuk notifikasi share

interface PostDetail {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  category: { name: string };
  tags: { id: string; name: string }[];
  author: { name: string };
  media?: { file_url: string; media_type: string }[];
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export default function WawasanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [post, setPost] = useState<PostDetail | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<PostDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPostDetail = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/api/v1/posts/slug/${slug}`);
        const currentPost = res.data.data;
        setPost(currentPost);
        try {
          const relRes = await api.get(
            "/api/v1/posts?limit=5&status=published",
          );
          const allPosts = relRes.data.data || [];

          // Saring agar post yang sedang dibaca tidak muncul, lalu ambil maksimal 3
          const filteredRelated = allPosts
            .filter((p: PostDetail) => p.id !== currentPost.id)
            .slice(0, 3);

          setRelatedPosts(filteredRelated);
        } catch (relError) {
          console.error("Gagal memuat postingan terkait", relError);
        }
      } catch (error) {
        console.error("Gagal memuat detail artikel", error);
        router.push("/wawasan"); // Kembalikan ke halaman daftar jika tidak ditemukan
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchPostDetail();
    }
  }, [slug, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: post?.title,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Tautan artikel berhasil disalin!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] dark:bg-background pt-32 pb-20 px-6 flex justify-center">
        <div className="max-w-4xl w-full animate-pulse space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-muted rounded-full" />
            <div className="w-48 h-6 bg-muted rounded-full" />
          </div>
          <div className="h-16 md:h-20 w-full bg-muted rounded-2xl mt-8" />
          <div className="h-16 w-3/4 bg-muted rounded-2xl" />
          <div className="w-full aspect-[21/9] bg-muted rounded-[2.5rem] my-10" />
          <div className="bg-card border border-border rounded-[3rem] p-8 md:p-12">
            <div className="space-y-5">
              <div className="h-4 w-full bg-muted rounded-full" />
              <div className="h-4 w-full bg-muted rounded-full" />
              <div className="h-4 w-4/5 bg-muted rounded-full" />
              <div className="h-4 w-5/6 bg-muted rounded-full pt-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-[#F9F9F7] dark:bg-background text-foreground font-sans pb-32">
      {/* 🌟 NAVIGASI KEMBALI */}
      <div className="max-w-[54rem] mx-auto px-4 lg:px-8 pt-32 pb-8 relative z-20">
        <Link
          href="/wawasan"
          className="inline-flex items-center text-muted-foreground font-semibold tracking-wide hover:text-primary transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center mr-3 group-hover:border-primary group-hover:bg-primary/5 transition-all shadow-sm">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
          Kembali ke Wawasan
        </Link>
      </div>

      <article className="max-w-[54rem] mx-auto px-4 lg:px-8 pb-16 relative z-10">
        {/* 🌟 HEADER ARTIKEL */}
        <motion.header
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-10"
        >
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 opacity-80" />
              {post.category?.name || "Tanpa Kategori"}
            </span>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground bg-background border border-border shadow-sm">
              <Calendar className="w-4 h-4 mr-2 opacity-70" />
              {formatDate(post.created_at)}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-foreground leading-[1.15] mb-10 text-balance">
            {post.title}
          </h1>

          <div className="flex items-center justify-between py-6 border-y border-border/60">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-secondary/50 flex items-center justify-center border border-border">
                <span className="font-bold text-primary text-xl font-serif">
                  {post.author?.name?.charAt(0).toUpperCase() || "T"}
                </span>
              </div>
              <div>
                <p className="font-bold text-foreground text-lg">
                  {post.author?.name || "Titian Nusantara"}
                </p>
                <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
                  Penulis Wawasan
                </p>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="w-14 h-14 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all shadow-sm group"
              aria-label="Bagikan Artikel"
            >
              <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </motion.header>

        {/* 🌟 HERO IMAGE */}
        {post.media && post.media.find((m) => m.media_type === "thumbnail") ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="w-full aspect-[4/3] md:aspect-[21/9] rounded-[2.5rem] mb-12 relative overflow-hidden shadow-xl shadow-primary/5 border border-border bg-muted"
          >
            <div className="absolute inset-0 bg-primary/5 mix-blend-overlay z-10" />
            <img
              src={
                post.media.find((m) => m.media_type === "thumbnail")?.file_url
              }
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="w-full aspect-[4/3] md:aspect-[21/9] bg-secondary/20 rounded-[2.5rem] mb-12 relative overflow-hidden flex items-center justify-center border border-border shadow-sm"
          >
            <div className="absolute -left-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-slate-400/10 rounded-full blur-[80px]" />
            <Leaf className="w-24 h-24 text-muted-foreground/20 relative z-10" />
          </motion.div>
        )}

        {/* 🌟 KONTEN ARTIKEL (QUILL RENDERER) */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-card border border-border rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-xl shadow-primary/5"
        >
          <div
            className="quill-content text-lg md:text-[1.3rem] text-muted-foreground leading-relaxed md:leading-[1.9] font-medium"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* === CSS PENYESUAIAN KHUSUS UNTUK QUILL HTML === */}
          <style jsx global>{`
            .quill-content p {
              margin-bottom: 1.5em;
              color: hsl(var(--foreground) / 0.85);
            }
            .quill-content h2,
            .quill-content h3,
            .quill-content h4 {
              color: hsl(var(--foreground));
              font-weight: 800;
              line-height: 1.2;
              letter-spacing: -0.02em;
            }
            .quill-content h2 {
              font-size: 2.25rem;
              margin-top: 2em;
              margin-bottom: 1em;
            }
            .quill-content h3 {
              font-size: 1.5rem;
              margin-top: 1.8em;
              margin-bottom: 0.8em;
            }
            .quill-content a {
              color: hsl(var(--primary));
              text-decoration: underline;
              text-decoration-thickness: 2px;
              text-underline-offset: 4px;
              transition: all 0.2s;
              font-weight: 600;
            }
            .quill-content a:hover {
              background-color: hsl(var(--primary) / 0.1);
              text-decoration-color: transparent;
            }

            /* --- LIST (BULLET & NUMBER) --- */
            .quill-content ul,
            .quill-content ol {
              padding-left: 1.5rem;
              margin-bottom: 1.75em;
              color: hsl(var(--foreground) / 0.85);
            }
            .quill-content ul {
              list-style-type: disc;
            }
            .quill-content ol {
              list-style-type: decimal;
            }
            .quill-content li[data-list="bullet"] {
              list-style-type: disc;
            }
            .quill-content li[data-list="ordered"] {
              list-style-type: decimal;
            }
            .quill-content .ql-ui {
              display: none;
            }
            .quill-content li {
              margin-bottom: 0.5em;
              padding-left: 0.5rem;
            }

            /* --- KUTIPAN (BLOCKQUOTE) YANG LEBIH ELEGAN --- */
            .quill-content blockquote {
              border-left: none;
              font-style: italic;
              color: hsl(var(--foreground));
              margin: 3em 0;
              background: hsl(var(--secondary) / 0.3);
              padding: 2.5rem 2rem;
              border-radius: 1.5rem;
              position: relative;
              text-align: center;
              font-size: 1.25em;
              line-height: 1.6;
            }
            .quill-content blockquote::before {
              content: '"';
              position: absolute;
              top: -20px;
              left: 50%;
              transform: translateX(-50%);
              font-family: Georgia, serif;
              font-weight: 900;
              color: hsl(var(--primary));
              font-size: 4rem;
              line-height: 1;
              background: hsl(var(--card));
              padding: 0 10px;
              border-radius: 50%;
            }

            /* --- FORMAT TEKS --- */
            .quill-content strong {
              font-weight: 700;
              color: hsl(var(--foreground));
            }
            .quill-content em {
              font-style: italic;
            }

            /* --- MEDIA --- */
            .quill-content img {
              border-radius: 1.5rem;
              margin: 2.5em auto;
              max-width: 100%;
              border: 1px solid hsl(var(--border) / 0.5);
              box-shadow: 0 10px 30px -10px hsl(var(--primary) / 0.05);
            }
            .quill-content iframe {
              width: 100%;
              aspect-ratio: 16/9;
              border-radius: 1.5rem;
              margin: 2.5em 0;
              border: none;
            }
          `}</style>

          {/* 🌟 TAGS ARTIKEL */}
          {post.tags && post.tags.length > 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="mt-16 flex flex-wrap items-center gap-3 px-2"
            >
              <Tag className="w-5 h-5 text-muted-foreground mr-2" />
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-4 py-2 rounded-full bg-card border border-border text-muted-foreground text-sm font-medium hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-colors cursor-pointer shadow-sm"
                >
                  #{tag.name}
                </span>
              ))}
            </motion.div>
          )}
        </motion.div>
      </article>

      {/* 🌟 POSTINGAN TERKAIT */}
      {relatedPosts.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 lg:px-8 mt-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Postingan Terkait
            </h2>
            <div className="w-16 h-1 bg-primary rounded-full mt-4" />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {relatedPosts.map((relPost) => {
              const thumb = relPost.media?.find(
                (m) => m.media_type === "thumbnail",
              )?.file_url;
              return (
                <motion.div
                  key={relPost.id}
                  variants={fadeInUp}
                  className="h-full"
                >
                  <Link
                    href={`/wawasan/${relPost.slug}`}
                    className="group flex flex-col h-full bg-card rounded-[24px] overflow-hidden border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500"
                  >
                    {/* Thumbnail Image */}
                    <div className="w-full aspect-[4/3] bg-muted relative overflow-hidden shrink-0">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={relPost.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Leaf className="w-10 h-10 text-primary/20" />
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
                        {relPost.category?.name || "Wawasan"}
                      </span>

                      <h3 className="text-lg font-bold text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                        {relPost.title}
                      </h3>

                      {/* Tombol Panah Bawah Kanan */}
                      <div className="mt-auto flex justify-end pt-4 border-t border-border/50">
                        <div className="w-auto h-auto p-2 rounded-xl bg-secondary/50 text-foreground group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-all duration-300">
                          Baca
                          <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      )}
    </div>
  );
}

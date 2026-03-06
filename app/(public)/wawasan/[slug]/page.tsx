"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Tag, Leaf, Share2, Loader2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

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

export default function WawasanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPostDetail = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/api/v1/posts/slug/${slug}`);
        setPost(res.data.data);
      } catch (error) {
        console.error("Gagal memuat detail artikel", error);
        router.push("/wawasan");
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
      alert("Tautan berhasil disalin!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary/10 pt-32 pb-20 px-6 flex justify-center">
        <div className="max-w-4xl w-full animate-pulse space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-muted rounded-full" />
            <div className="w-48 h-6 bg-muted rounded-full" />
          </div>
          <div className="h-12 md:h-16 w-full bg-muted rounded-2xl mt-8" />
          <div className="h-12 w-3/4 bg-muted rounded-2xl" />
          <div className="w-full aspect-video bg-muted rounded-[32px] my-10" />
          <div className="bg-card border border-border rounded-[40px] p-8 md:p-12">
            <div className="space-y-4">
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
    <div className="min-h-screen bg-secondary/10 text-foreground font-sans pb-32">
      {/* 🌟 NAVIGASI KEMBALI */}
      <div className="max-w-4xl mx-auto px-4 lg:px-8 pt-28 pb-8 relative z-20">
        <Link
          href="/wawasan"
          className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary/20 transition-colors">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </div>
          Kembali ke Ruang Berbagi
        </Link>
      </div>

      <article className="max-w-4xl mx-auto px-4 lg:px-8 pb-16 relative z-10">
        {/* 🌟 HEADER ARTIKEL */}
        <motion.header
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-10"
        >
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground shadow-sm">
              {post.category?.name || "Tanpa Kategori"}
            </span>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground bg-background border border-border">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(post.created_at)}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15] mb-8">
            {post.title}
          </h1>

          <div className="flex items-center justify-between py-6 border-y border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <span className="font-bold text-foreground text-lg">
                  {post.author?.name?.charAt(0) || "T"}
                </span>
              </div>
              <div>
                <p className="font-bold text-foreground">
                  {post.author?.name || "Titian Nusantara"}
                </p>
                <p className="text-sm text-muted-foreground">Penulis Wawasan</p>
              </div>
            </div>
            <button
              onClick={handleShare}
              className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all shadow-sm"
              aria-label="Bagikan Artikel"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </motion.header>

        {/* 🌟 HERO IMAGE */}
        {post.media && post.media.find((m) => m.media_type === "thumbnail") ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="w-full aspect-video md:aspect-[21/9] rounded-[32px] mb-12 relative overflow-hidden shadow-sm border border-border bg-muted"
          >
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
            className="w-full aspect-video md:aspect-[21/9] bg-muted rounded-[32px] mb-12 relative overflow-hidden flex items-center justify-center border border-border shadow-sm"
          >
            <div className="absolute inset-0 bg-primary/5 mix-blend-multiply" />
            <Leaf className="w-20 h-20 text-muted-foreground/20 relative z-10" />
          </motion.div>
        )}

        {/* 🌟 KONTEN ARTIKEL (QUILL RENDERER) */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-card border border-border rounded-[40px] p-8 md:p-12 lg:p-16 shadow-sm"
        >
          <div
            className="quill-content text-lg md:text-xl text-muted-foreground leading-relaxed md:leading-[1.9]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* === CSS PENYESUAIAN KHUSUS UNTUK QUILL HTML === */}
          <style jsx global>{`
            .quill-content p {
              margin-bottom: 1.5em;
            }
            .quill-content h2,
            .quill-content h3,
            .quill-content h4 {
              color: hsl(var(--foreground));
              font-weight: 700;
              line-height: 1.2;
              letter-spacing: -0.025em;
            }
            .quill-content h2 {
              font-size: 2.25rem;
              font-weight: 800;
              margin-top: 2em;
              margin-bottom: 1em;
            }
            .quill-content h3 {
              font-size: 1.5rem;
              margin-top: 1.5em;
              margin-bottom: 0.75em;
            }
            .quill-content h4 {
              font-size: 1.25rem;
              margin-top: 1.5em;
              margin-bottom: 0.75em;
            }
            .quill-content a {
              color: hsl(var(--primary));
              text-decoration: underline;
              text-decoration-thickness: 2px;
              text-underline-offset: 4px;
              transition: opacity 0.2s;
            }
            .quill-content a:hover {
              opacity: 0.8;
            }

            /* --- PERBAIKAN LIST (BULLET & NUMBER) UNTUK QUILL --- */
            .quill-content ul,
            .quill-content ol {
              padding-left: 1.5rem;
              margin-bottom: 1.75em;
            }
            /* Styling Default HTML */
            .quill-content ul {
              list-style-type: disc;
            }
            .quill-content ol {
              list-style-type: decimal;
            }

            /* Override Khusus Jika Quill Menggunakan Atribut data-list */
            .quill-content li[data-list="bullet"] {
              list-style-type: disc;
            }
            .quill-content li[data-list="ordered"] {
              list-style-type: decimal;
            }
            /* Sembunyikan elemen span bawaan Quill agar nomor/titik tidak muncul ganda */
            .quill-content .ql-ui {
              display: none;
            }
            .quill-content li {
              margin-bottom: 0.5em;
              padding-left: 0.5rem;
            }

            /* --- PERBAIKAN KUTIPAN (TANDA PETIK BESAR) --- */
            .quill-content blockquote {
              border-left: 4px solid hsl(var(--primary));
              font-style: italic;
              color: hsl(var(--muted-foreground));
              margin: 2.5em 0;
              background: hsl(var(--secondary) / 0.5);
              padding: 1.5rem 1.5rem 1.5rem 4rem; /* Padding kiri dilebarkan untuk ikon petik */
              border-radius: 0 16px 16px 0;
            }
            /* Tanda Kutip Pembuka */
            .quill-content blockquote::before {
              content: '"';
              font-family: Georgia, serif;
              font-weight: bold;
              color: hsl(var(--primary));
              margin-right: 4px;
              font-size: 2rem;
            }
            /* Tanda Kutip Penutup */
            .quill-content blockquote::after {
              content: '"';
              font-family: Georgia, serif;
              font-weight: bold;
              color: hsl(var(--primary));
              margin-left: 4px;
              font-size: 2rem;
            }

            /* --- FORMAT TEKS --- */
            .quill-content strong {
              font-weight: 700;
              color: hsl(var(--foreground));
            }
            .quill-content em {
              font-style: italic;
            }
            .quill-content u {
              text-decoration: underline;
              text-underline-offset: 3px;
            }
            .quill-content s {
              text-decoration: line-through;
              opacity: 0.7;
            }

            /* --- MEDIA --- */
            .quill-content img {
              border-radius: 24px;
              margin: 2em 0;
              max-width: 100%;
              border: 1px solid hsl(var(--border));
            }
            .quill-content iframe {
              width: 100%;
              aspect-ratio: 16/9;
              border-radius: 24px;
              margin: 2em 0;
            }
          `}</style>
        </motion.div>

        {/* 🌟 TAGS ARTIKEL */}
        {post.tags && post.tags.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mt-12 flex flex-wrap items-center gap-3"
          >
            <Tag className="w-5 h-5 text-muted-foreground mr-2" />
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-4 py-2 rounded-full bg-background border border-border text-muted-foreground text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors cursor-pointer"
              >
                #{tag.name}
              </span>
            ))}
          </motion.div>
        )}
      </article>
    </div>
  );
}

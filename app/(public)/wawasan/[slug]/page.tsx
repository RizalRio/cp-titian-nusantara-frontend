"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Tag, Leaf, Share2 } from "lucide-react";
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
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
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
        // CATATAN: Pastikan Backend Golang Anda memiliki endpoint yang mendukung pencarian berdasarkan slug
        // Contoh: GET /api/v1/posts/slug/:slug
        const res = await api.get(`/api/v1/posts/slug/${slug}`);
        setPost(res.data.data);
      } catch (error) {
        console.error("Gagal memuat detail artikel", error);
        // Redirect kembali jika artikel tidak ditemukan
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
      <div className="min-h-screen bg-[#FAF9F6] pt-32 pb-20 px-6 flex justify-center">
        <div className="max-w-3xl w-full animate-pulse space-y-8">
          <div className="w-24 h-6 bg-[#E3E8E1] rounded-full" />
          <div className="h-12 md:h-16 w-full bg-[#E3E8E1] rounded-2xl" />
          <div className="h-12 w-3/4 bg-[#E3E8E1] rounded-2xl" />
          <div className="flex gap-4">
            <div className="w-32 h-6 bg-[#E3E8E1] rounded-full" />
            <div className="w-32 h-6 bg-[#E3E8E1] rounded-full" />
          </div>
          <div className="w-full h-64 bg-[#E3E8E1]/50 rounded-[32px] my-10" />
          <div className="space-y-4">
            <div className="h-4 w-full bg-[#E3E8E1] rounded-full" />
            <div className="h-4 w-full bg-[#E3E8E1] rounded-full" />
            <div className="h-4 w-4/5 bg-[#E3E8E1] rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 font-sans selection:bg-[#2D4A22] selection:text-white">
      {/* 🌟 NAVIGASI KEMBALI */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 pt-28 pb-8 relative z-20">
        <Link
          href="/wawasan"
          className="inline-flex items-center text-[#2D4A22] font-semibold hover:text-[#1a2e13] transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-[#2D4A22]/5 flex items-center justify-center mr-3 group-hover:bg-[#2D4A22]/10 transition-colors">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </div>
          Kembali ke Ruang Berbagi
        </Link>
      </div>

      <article className="max-w-4xl mx-auto px-6 lg:px-12 pb-32 relative z-10">
        {/* 🌟 HEADER ARTIKEL */}
        <motion.header
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-12"
        >
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#2D4A22] text-white shadow-sm">
              {post.category?.name || "Tanpa Kategori"}
            </span>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium text-slate-500 bg-white border border-slate-200">
              <Calendar className="w-4 h-4 mr-2 text-slate-400" />
              {formatDate(post.created_at)}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-8">
            {post.title}
          </h1>

          <div className="flex items-center justify-between py-6 border-y border-slate-200/60">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E3E8E1] flex items-center justify-center">
                <span className="font-bold text-[#2D4A22]">
                  {post.author?.name?.charAt(0) || "T"}
                </span>
              </div>
              <div>
                <p className="font-bold text-slate-900">
                  {post.author?.name || "Titian Nusantara"}
                </p>
                <p className="text-sm text-slate-500">Penulis Wawasan</p>
              </div>
            </div>
            <button
              onClick={handleShare}
              className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#2D4A22] hover:border-[#2D4A22] hover:bg-[#2D4A22]/5 transition-all shadow-sm"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </motion.header>

        {/* 🌟 HERO IMAGE PLACEHOLDER (Abstrak Earth Tone) */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="w-full h-[40vh] md:h-[60vh] bg-[#F3F5F1] rounded-[40px] mb-16 relative overflow-hidden flex items-center justify-center border border-white/60 shadow-lg shadow-[#2D4A22]/5"
        >
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#E3E8E1] rounded-full mix-blend-multiply filter blur-3xl opacity-70" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#D6DFD0] rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
          <Leaf className="w-24 h-24 text-[#2D4A22]/10 relative z-10" />
        </motion.div>

        {/* 🌟 KONTEN ARTIKEL (QUILL RENDERER) */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="prose-container max-w-3xl mx-auto"
        >
          {/* Inject HTML dari Quill secara aman */}
          <div
            className="quill-content text-lg md:text-xl text-slate-700 leading-relaxed md:leading-[1.8]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CSS Khusus untuk merender elemen HTML Quill agar bernuansa "Berpikir dalam, berbicara membumi" */}
          <style jsx global>{`
            .quill-content p {
              margin-bottom: 1.75em;
            }
            .quill-content h2 {
              font-size: 2.25rem;
              font-weight: 800;
              color: #0f172a;
              margin-top: 2em;
              margin-bottom: 1em;
              line-height: 1.2;
              letter-spacing: -0.025em;
            }
            .quill-content h3 {
              font-size: 1.5rem;
              font-weight: 700;
              color: #1e293b;
              margin-top: 1.5em;
              margin-bottom: 0.75em;
            }
            .quill-content a {
              color: #2d4a22;
              text-decoration: underline;
              text-decoration-thickness: 2px;
              text-underline-offset: 4px;
              transition: color 0.2s;
            }
            .quill-content a:hover {
              color: #1a2e13;
            }
            .quill-content blockquote {
              border-left: 4px solid #2d4a22;
              padding-left: 1.5rem;
              font-style: italic;
              color: #475569;
              margin: 2em 0;
              background: rgba(45, 74, 34, 0.03);
              padding: 1.5rem;
              border-radius: 0 16px 16px 0;
            }
            .quill-content ul {
              list-style-type: disc;
              padding-left: 1.5rem;
              margin-bottom: 1.75em;
            }
            .quill-content ol {
              list-style-type: decimal;
              padding-left: 1.5rem;
              margin-bottom: 1.75em;
            }
            .quill-content li {
              margin-bottom: 0.5em;
            }
          `}</style>
        </motion.div>

        {/* 🌟 TAGS ARTIKEL */}
        {post.tags && post.tags.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-3xl mx-auto mt-16 pt-8 border-t border-slate-200/60 flex flex-wrap items-center gap-3"
          >
            <Tag className="w-5 h-5 text-slate-400 mr-2" />
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium hover:bg-[#2D4A22]/10 hover:text-[#2D4A22] transition-colors cursor-pointer"
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

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Map, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F9F9F7] dark:bg-background flex flex-col items-center justify-center relative overflow-hidden px-6 font-sans selection:bg-primary/20">
      {/* 🌟 ORNAMEN LATAR: Earth & Archipelago Tones (Pasir, Hijau Lumut, Biru Laut) */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-0"></div>

      {/* Blob Hijau Lumut (Primary) */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.15, 0.25, 0.15],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] -left-[10%] w-[40rem] h-[40rem] bg-primary/30 rounded-[100%] blur-[120px] pointer-events-none"
      />

      {/* Blob Biru Laut (Secondary) */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-[-15%] -right-[10%] w-[45rem] h-[45rem] bg-secondary/40 rounded-[100%] blur-[130px] pointer-events-none"
      />

      {/* 🌟 KONTEN UTAMA (Editorial Asymmetric Layout) */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
        {/* KIRI: Elemen Visual Organik (Hanya tampil di tablet/desktop) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[32rem] lg:h-[32rem] shrink-0 hidden md:flex items-center justify-center"
        >
          {/* Bentuk Organik Ekstrim (Menyerupai batu/pulau) */}
          <div
            className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent border border-primary/20 backdrop-blur-xl flex items-center justify-center shadow-2xl shadow-primary/10 transition-transform duration-1000 hover:scale-105"
            style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
          >
            <Compass
              className="w-24 h-24 lg:w-32 lg:h-32 text-primary opacity-60"
              strokeWidth={1}
            />
          </div>

          {/* Floating Badge 404 */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="absolute bottom-12 right-4 lg:bottom-16 lg:-right-4 bg-background/80 backdrop-blur-md px-8 py-4 rounded-[2rem] border border-border/60 shadow-xl"
          >
            <span className="text-2xl lg:text-3xl font-black tracking-[0.2em] text-foreground">
              404
            </span>
          </motion.div>
        </motion.div>

        {/* KANAN: Teks Reflektif */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.2 },
            },
          }}
          className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start"
        >
          {/* Garis Aksen Kecil untuk Mobile */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="w-16 h-1 bg-primary rounded-full mb-8 md:hidden"
          />

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="inline-flex items-center rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-primary bg-primary/10 mb-8 border border-primary/20 backdrop-blur-sm"
          >
            Titik Hilang
          </motion.div>

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-5xl md:text-6xl lg:text-[5rem] font-extrabold tracking-tight text-foreground mb-8 leading-[1.1] text-balance"
          >
            Jejak Ini Belum Terpetakan.
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-lg lg:text-[1.35rem] text-muted-foreground leading-[1.8] mb-12 max-w-xl font-medium text-balance"
          >
            Seperti menyusuri pulau yang tak ada di peta, halaman yang Anda tuju
            mungkin telah berpindah arah atau tak lagi menjadi bagian dari
            perjalanan kita.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
          >
            <Button
              size="lg"
              className="h-16 px-10 rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 text-[1.05rem] font-bold group"
              asChild
            >
              <Link href="/">
                Kembali ke Beranda{" "}
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-16 px-10 rounded-full bg-card/40 backdrop-blur-xl border-border/80 hover:bg-card hover:-translate-y-1 transition-all duration-300 text-[1.05rem] font-bold text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/layanan">
                <Map className="w-5 h-5 mr-3" /> Eksplorasi Layanan
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

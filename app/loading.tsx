"use client";

import { motion } from "framer-motion";

export default function GlobalLoading() {
  return (
    // 🌟 Menggunakan min-h-[75vh] agar Navbar dan Footer tetap terlihat (tidak tertutup)
    // Ini memberikan UX "Perceived Performance" yang jauh lebih baik daripada menutupi seluruh layar.
    <div className="w-full min-h-[75vh] flex flex-col items-center justify-center relative overflow-hidden bg-transparent font-sans">
      {/* 🌟 Latar Belakang Organik (Napas Halus) */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[20rem] h-[20rem] md:w-[30rem] md:h-[30rem] bg-primary/20 rounded-full blur-[100px] pointer-events-none"
      />

      {/* 🌟 Konten Loader */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Morphing Organic Spinner */}
        <motion.div
          animate={{
            rotate: 360,
            borderRadius: [
              "60% 40% 30% 70% / 60% 30% 70% 40%", // Bentuk Organik 1
              "30% 60% 70% 40% / 50% 60% 30% 60%", // Bentuk Organik 2
              "60% 40% 30% 70% / 60% 30% 70% 40%", // Kembali ke Bentuk 1
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-16 h-16 md:w-20 md:h-20 border-[3px] border-primary border-r-transparent border-b-transparent bg-primary/5 backdrop-blur-md shadow-xl shadow-primary/10"
        />

        {/* Teks Editorial */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex flex-col items-center gap-3 text-center"
        >
          <span className="text-[11px] md:text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Titian Nusantara
          </span>
          <span className="text-sm md:text-[1.05rem] text-muted-foreground font-medium animate-pulse">
            Menyusun jejak halaman...
          </span>
        </motion.div>
      </div>
    </div>
  );
}

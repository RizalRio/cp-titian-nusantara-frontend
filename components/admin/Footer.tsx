"use client";

import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto w-full py-4 px-6 border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        {/* Bagian Kiri: Copyright */}
        <div className="flex items-center gap-1.5 font-medium">
          <span>&copy; {new Date().getFullYear()}</span>
          <span className="text-foreground">Titian Nusantara.</span>
          <span>Sistem Manajemen Konten.</span>
        </div>

        {/* Bagian Kanan: Etalase / Versi */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span>Digerakkan oleh</span>
            <Leaf className="w-3.5 h-3.5 text-primary" />
            <span>Harapan</span>
          </div>
          <div className="hidden md:block w-1 h-1 rounded-full bg-border" />{" "}
          {/* Pemisah titik */}
          <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-md bg-muted border border-border font-mono text-[10px] tracking-wider">
            v1.0.0-beta
          </span>
        </div>
      </div>
    </footer>
  );
}

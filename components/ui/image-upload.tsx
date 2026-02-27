"use client";

import { useState, useRef } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import api from "@/lib/api";
import { Button } from "./button";

interface ImageUploadProps {
  value: string; // Berisi URL gambar jika sudah ada
  onChange: (url: string) => void; // Fungsi yang dipanggil setelah upload sukses
  onRemove: () => void; // Fungsi untuk menghapus gambar
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  label = "Unggah Gambar Utama",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger klik pada input file yang disembunyikan
  const handleContainerClick = () => {
    if (!value && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processFile = async (file: File) => {
    // Validasi tipe file
    if (!file.type.includes("image/")) {
      alert("Hanya format gambar yang diperbolehkan.");
      return;
    }

    // Validasi ukuran (Maks 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5MB.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file); // Key "image" harus sesuai dengan handler Golang

      const res = await api.post("/api/v1/admin/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Kembalikan URL yang didapat dari Backend ke komponen Form induk
      onChange(res.data.data.url);
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(error.response?.data?.message || "Gagal mengunggah gambar.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  // Event handler untuk Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="space-y-3">
      <span className="text-sm font-semibold text-foreground flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-primary" /> {label}
      </span>

      <div
        onClick={handleContainerClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center w-full min-h-[240px] rounded-[24px] border-2 transition-all duration-300 overflow-hidden ${
          value
            ? "border-transparent shadow-sm"
            : "border-dashed cursor-pointer"
        } ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        }`}
      >
        {/* Input File Tersembunyi */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp, image/gif"
          className="hidden"
        />

        {/* State 1: Sedang Upload */}
        {isUploading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-sm font-medium text-primary animate-pulse">
              Mengunggah gambar...
            </p>
          </div>
        )}

        {/* State 2: Gambar Sudah Ada */}
        {value ? (
          <div className="relative w-full h-full min-h-[240px] group">
            {/* Menggunakan tag img standar agar lebih fleksibel dengan URL eksternal (localhost) */}
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            />
            {/* Overlay Gelap saat Hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation(); // Mencegah klik men-trigger upload baru
                  onRemove();
                }}
                className="rounded-xl shadow-lg"
              >
                <X className="w-4 h-4 mr-2" /> Hapus Gambar
              </Button>
            </div>
          </div>
        ) : (
          /* State 3: Kosong / Siap Upload */
          <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <UploadCloud className="w-8 h-8" />
            </div>
            <p className="font-semibold text-foreground mb-1">
              Klik untuk mengunggah atau seret file ke sini
            </p>
            <p className="text-sm text-muted-foreground">
              PNG, JPG, WEBP hingga 5MB. Direkomendasikan rasio 16:9.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function PagesIndex() {
  const [pages, setPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk modal konfirmasi Delete
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/api/v1/admin/pages");
      if (res.data.status === "success") {
        setPages(res.data.data || []);
      }
    } catch (error) {
      toast.error("Gagal memuat data halaman");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  // Fungsi yang dipanggil saat tombol hapus (tong sampah) diklik
  const confirmDelete = (id: string, title: string) => {
    setPageToDelete({ id, title });
    setIsDeleteDialogOpen(true);
  };

  // Fungsi eksekusi ke API Golang
  const handleDelete = async () => {
    if (!pageToDelete) return;
    setIsDeleting(true);

    try {
      const res = await api.delete(`/api/v1/admin/pages/${pageToDelete.id}`);
      if (res.data.status === "success") {
        toast.success(
          `Halaman "${pageToDelete.title}" berhasil dihapus (Soft Delete).`,
        );
        fetchPages(); // Refresh tabel setelah hapus
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menghapus halaman.");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setPageToDelete(null);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Kelola Halaman
          </h1>
          <p className="text-muted-foreground text-sm">
            Daftar semua halaman publik Titian Nusantara.
          </p>
        </div>
        <Link href="/pages/create">
          <Button className="shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> Tambah Halaman
          </Button>
        </Link>
      </div>

      <div className="rounded-md border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Judul Halaman</TableHead>
              <TableHead>URL (Slug)</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : pages.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-24 text-muted-foreground"
                >
                  Belum ada halaman. Silakan buat baru.
                </TableCell>
              </TableRow>
            ) : (
              pages.map((page) => (
                <TableRow
                  key={page.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    /{page.slug}
                  </TableCell>
                  <TableCell className="capitalize">
                    {page.template_name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        page.status === "published" ? "default" : "secondary"
                      }
                      className={
                        page.status === "published"
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }
                    >
                      {page.status === "published" ? "Publik" : "Draf"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {/* 🌟 TOMBOL EDIT: Mengarah ke rute dinamis /[id]/edit */}
                    <Link href={`/pages/${page.id}/edit`}>
                      <Button variant="outline" size="icon" title="Edit">
                        <Edit className="h-4 w-4 text-foreground/70" />
                      </Button>
                    </Link>

                    {/* 🌟 TOMBOL DELETE: Membuka Modal */}
                    <Button
                      variant="outline"
                      size="icon"
                      title="Hapus"
                      className="hover:text-destructive hover:border-destructive"
                      onClick={() => confirmDelete(page.id, page.title)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 🌟 MODAL KONFIRMASI HAPUS */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menyembunyikan halaman{" "}
              <strong>"{pageToDelete?.title}"</strong> dari publik. Data tidak
              akan hilang secara permanen berkat fitur Soft Delete.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault(); // Mencegah modal tertutup instan sebelum API selesai
                handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menghapus...
                </>
              ) : (
                "Ya, Hapus Halaman"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

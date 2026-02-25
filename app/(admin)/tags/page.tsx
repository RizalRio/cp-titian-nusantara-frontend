"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Tag, LayoutGrid, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

import api from "@/lib/api";

interface Tag {
  id: string;
  name: string;
  slug: string;
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Dialog (Modal)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ id: "", name: "" });

  // State Alert Delete
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);

  const fetchTags = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/api/v1/tags");
      setTags(res.data.data || []);
    } catch (error) {
      console.error("Gagal mengambil tag:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleOpenAdd = () => {
    setFormData({ id: "", name: "" });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (tag: Tag) => {
    setFormData({ id: tag.id, name: tag.name });
    setIsDialogOpen(true);
  };

  const handleOpenDelete = (tag: Tag) => {
    setTagToDelete(tag);
    setIsAlertOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      if (formData.id) {
        await api.put(`/api/v1/admin/tags/${formData.id}`, {
          name: formData.name,
        });
      } else {
        await api.post("/api/v1/admin/tags", { name: formData.name });
      }
      setIsDialogOpen(false);
      fetchTags();
    } catch (error: any) {
      console.error("Gagal menyimpan:", error);
      alert(
        error.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan data.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!tagToDelete) return;

    try {
      await api.delete(`/api/v1/admin/tags/${tagToDelete.id}`);
      setIsAlertOpen(false);
      setTagToDelete(null);
      fetchTags();
    } catch (error: any) {
      console.error("Gagal menghapus:", error);
      alert(
        error.response?.data?.message ||
          "Tag tidak dapat dihapus karena masih digunakan oleh artikel.",
      );
      setIsAlertOpen(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      {/* 🌟 HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-3">
            <LayoutGrid className="w-3.5 h-3.5 mr-2" />
            <span>Master Data</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Tag Wawasan
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola topik dan klasifikasi untuk artikel.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="shadow-sm rounded-xl h-11 px-6"
        >
          <Plus className="w-4 h-4 mr-2" /> Tag Baru
        </Button>
      </div>

      {/* 🌟 TABEL DATA (Bersih, Rounded Soft, Shadow Halus) */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
            <p>Memuat data...</p>
          </div>
        ) : tags.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Tag className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Belum ada tag
            </h3>
            <p className="text-muted-foreground mb-6">
              Tambahkan tag pertama Anda untuk memulai.
            </p>
            <Button
              onClick={handleOpenAdd}
              variant="outline"
              className="rounded-xl"
            >
              Tambah Tag
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-b-border">
                <TableHead className="w-[40%] py-4 pl-6 font-semibold text-foreground">
                  Nama Tag
                </TableHead>
                <TableHead className="py-4 font-semibold text-foreground">
                  Slug URL
                </TableHead>
                <TableHead className="py-4 pr-6 text-right font-semibold text-foreground">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((cat) => (
                <TableRow
                  key={cat.id}
                  className="hover:bg-muted/30 transition-colors border-b-border/50"
                >
                  <TableCell className="py-4 pl-6 font-medium text-foreground text-base">
                    {cat.name}
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-secondary/50 text-secondary-foreground font-mono text-xs font-medium">
                      {cat.slug}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(cat)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg h-9 w-9 p-0"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDelete(cat)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg h-9 w-9 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* 🌟 MODAL FORM (Telah Diperbaiki menggunakan DialogFooter Shadcn) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {/* Hapus class p-0 dan max-w yang aneh, gunakan standar Shadcn sm:max-w-md */}
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {formData.id ? "Edit Tag" : "Tag Baru"}
            </DialogTitle>
            <DialogDescription>
              Berikan nama tag. URL (slug) akan menyesuaikan secara otomatis.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">
                Nama Tag
              </Label>
              <Input
                id="name"
                placeholder="Misal: Pemberdayaan Desa"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="h-11 rounded-xl"
                autoFocus
              />
            </div>

            {/* Menggunakan DialogFooter agar layout flexbox-nya diurus otomatis oleh komponen bawaan */}
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl w-full sm:w-auto"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.name}
                className="rounded-xl w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 🌟 ALERT DIALOG (Konfirmasi Hapus) */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="rounded-2xl sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Tag?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan menghapus tag{" "}
              <span className="font-bold text-foreground">
                "{tagToDelete?.name}"
              </span>
              . Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting} className="rounded-xl">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Search,
  FilterX,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutTemplate,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

  // 🌟 STATE UNTUK FILTER, SORT, & PAGINATION (Client-Side)
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // State Modal Delete
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

  // 🌟 LOGIKA FILTER & PAGINASI CLIENT-SIDE
  const filteredPages = useMemo(() => {
    return pages.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [pages, search, statusFilter]);

  const totalPages = Math.ceil(filteredPages.length / limit) || 1;
  const currentPages = filteredPages.slice((page - 1) * limit, page * limit);

  // Reset Filter
  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  const confirmDelete = (id: string, title: string) => {
    setPageToDelete({ id, title });
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!pageToDelete) return;
    setIsDeleting(true);

    try {
      const res = await api.delete(`/api/v1/admin/pages/${pageToDelete.id}`);
      if (res.data.status === "success") {
        toast.success(`Halaman "${pageToDelete.title}" berhasil dihapus.`);
        fetchPages(); // Refresh data
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menghapus halaman.");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setPageToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 font-sans">
      {/* 🌟 HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-3">
            <LayoutTemplate className="w-3.5 h-3.5 mr-2" />
            <span>Manajemen Konten</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Kelola Halaman
          </h1>
        </div>
        <Button asChild className="shadow-sm rounded-xl h-11 px-6">
          <Link href="/pages/create">
            <Plus className="w-4 h-4 mr-2" /> Tambah Halaman Baru
          </Link>
        </Button>
      </div>

      {/* 🌟 FILTER BAR */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-sm">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari judul atau URL..."
            className="pl-9 bg-background rounded-xl"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full md:w-[180px] rounded-xl bg-background">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="published">Dipublikasi</SelectItem>
            <SelectItem value="draft">Draf</SelectItem>
          </SelectContent>
        </Select>

        {(search || statusFilter !== "all") && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="text-muted-foreground hover:text-destructive"
          >
            <FilterX className="w-4 h-4 mr-2" /> Reset
          </Button>
        )}
      </div>

      {/* 🌟 TABEL DATA */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
            <p>Memuat halaman...</p>
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Halaman tidak ditemukan
            </h3>
            <p className="text-muted-foreground mb-6">
              Coba ubah kata kunci pencarian atau buat halaman baru.
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-b-border">
                  <TableHead className="py-4 pl-6 font-semibold text-foreground w-[35%]">
                    Judul Halaman
                  </TableHead>
                  <TableHead className="py-4 font-semibold text-foreground">
                    Template
                  </TableHead>
                  <TableHead className="py-4 font-semibold text-foreground">
                    Status
                  </TableHead>
                  <TableHead className="py-4 font-semibold text-foreground">
                    Dibuat Pada
                  </TableHead>
                  <TableHead className="py-4 pr-6 text-right font-semibold text-foreground">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPages.map((pageData) => (
                  <TableRow
                    key={pageData.id}
                    className="hover:bg-muted/30 transition-colors border-b-border/50 group"
                  >
                    <TableCell className="py-4 pl-6">
                      <p className="font-semibold text-foreground text-base line-clamp-1">
                        {pageData.title}
                      </p>
                      <p className="text-muted-foreground font-mono text-xs mt-1 truncate max-w-[250px]">
                        /{pageData.slug}
                      </p>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 capitalize">
                        {pageData.template_name?.replace("_", " ")}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          pageData.status === "published"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {pageData.status === "published" ? "Publik" : "Draf"}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-muted-foreground">
                      {formatDate(pageData.created_at)}
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:bg-blue-50 rounded-lg h-9 w-9 p-0"
                          title="Edit Halaman"
                        >
                          <Link href={`/pages/${pageData.id}/edit`}>
                            <Edit2 className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            confirmDelete(pageData.id, pageData.title)
                          }
                          className="text-destructive hover:bg-destructive/10 rounded-lg h-9 w-9 p-0"
                          title="Hapus Halaman"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* 🌟 PAGINATION CONTROLS */}
            <div className="flex items-center justify-between px-6 py-4 bg-muted/10 border-t border-border">
              <span className="text-sm text-muted-foreground">
                Menampilkan{" "}
                <span className="font-medium text-foreground">
                  {currentPages.length}
                </span>{" "}
                dari{" "}
                <span className="font-medium text-foreground">
                  {filteredPages.length}
                </span>{" "}
                halaman
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl h-9 px-4"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isLoading}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                </Button>
                <div className="text-sm font-medium px-4">
                  Halaman {page} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl h-9 px-4"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || isLoading}
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 🌟 MODAL KONFIRMASI HAPUS */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="rounded-2xl sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Halaman?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menyembunyikan halaman{" "}
              <strong className="text-foreground">
                "{pageToDelete?.title}"
              </strong>{" "}
              dari publik. Data tidak akan hilang secara permanen (Soft Delete).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="rounded-xl">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl"
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

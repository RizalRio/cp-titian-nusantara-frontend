"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Search,
  FilterX,
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowLeft,
  MapPin,
  FolderKanban,
} from "lucide-react";
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

import api from "@/lib/api";

interface Project {
  id: string;
  title: string;
  slug: string;
  location: string;
  status: string;
  is_featured: boolean;
  created_at: string;
}

interface Service {
  id: string;
  name: string;
}

export default function ServiceProjectsPage() {
  const params = useParams();
  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🌟 STATE UNTUK FILTER, SORT, & PAGINATION
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");

  // State Alert Hapus
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // 1. Ambil Data Induk (Layanan) untuk Judul Halaman
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await api.get(`/api/v1/services/${serviceId}`);
        setService(res.data.data);
      } catch (error) {
        console.error("Gagal mengambil data layanan induk");
      }
    };
    if (serviceId) fetchService();
  }, [serviceId]);

  // Efek Debounce untuk Pencarian (Menunggu 500ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // 2. Mengambil Data Contoh Program (Projects)
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        service_id: serviceId, // 🌟 Wajib: Hanya ambil program dari layanan ini
      });

      if (debouncedSearch) queryParams.append("search", debouncedSearch);
      if (statusFilter !== "all") queryParams.append("status", statusFilter);
      if (featuredFilter !== "all")
        queryParams.append("is_featured", featuredFilter);

      const res = await api.get(`/api/v1/projects?${queryParams.toString()}`);

      setProjects(res.data.data || []);

      if (res.data.meta) {
        setTotalData(res.data.meta.total_data);
        setTotalPages(Math.ceil(res.data.meta.total_data / limit) || 1);
      }
    } catch (error) {
      console.error("Gagal mengambil program:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, statusFilter, featuredFilter, serviceId]);

  // Jalankan fetchProjects saat dependensi berubah
  useEffect(() => {
    if (serviceId) fetchProjects();
  }, [fetchProjects, serviceId]);

  // Reset Filter
  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setFeaturedFilter("all");
    setPage(1);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      await api.delete(`/api/v1/admin/projects/${projectToDelete.id}`);
      setIsAlertOpen(false);
      setProjectToDelete(null);
      fetchProjects();
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal menghapus program.");
      setIsAlertOpen(false);
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
      {/* 🌟 HEADER & BREADCRUMB */}
      <div className="flex flex-col gap-4">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="w-fit text-muted-foreground hover:text-primary pl-0"
        >
          <Link href="/admin/services">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar Layanan
          </Link>
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-3">
              <FolderKanban className="w-3.5 h-3.5 mr-2" />
              <span>Contoh Program Layanan</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {service ? `Program: ${service.name}` : "Memuat..."}
            </h1>
          </div>
          <Button asChild className="shadow-sm rounded-xl h-11 px-6">
            <Link href={`/admin/services/${serviceId}/projects/create`}>
              <Plus className="w-4 h-4 mr-2" /> Tambah Program
            </Link>
          </Button>
        </div>
      </div>

      {/* 🌟 FILTER BAR */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-sm">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari judul atau lokasi..."
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

        <Select
          value={featuredFilter}
          onValueChange={(val) => {
            setFeaturedFilter(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full md:w-[220px] rounded-xl bg-background">
            <SelectValue placeholder="Semua Tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe Program</SelectItem>
            <SelectItem value="true">⭐ Program Sorotan</SelectItem>
            <SelectItem value="false">Program Biasa</SelectItem>
          </SelectContent>
        </Select>

        {(search || statusFilter !== "all" || featuredFilter !== "all") && (
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
            <p>Memuat daftar program...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FolderKanban className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Belum ada program
            </h3>
            <p className="text-muted-foreground mb-6">
              Tambahkan contoh program nyata untuk layanan ini.
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-b-border">
                  <TableHead className="py-4 pl-6 font-semibold text-foreground w-[35%]">
                    Judul Program
                  </TableHead>
                  <TableHead className="py-4 font-semibold text-foreground">
                    Lokasi
                  </TableHead>
                  <TableHead className="py-4 font-semibold text-foreground">
                    Status & Tipe
                  </TableHead>
                  <TableHead className="py-4 pr-6 text-right font-semibold text-foreground">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow
                    key={project.id}
                    className="hover:bg-muted/30 transition-colors border-b-border/50 group"
                  >
                    <TableCell className="py-4 pl-6">
                      <p className="font-semibold text-foreground text-base line-clamp-2">
                        {project.title}
                      </p>
                      <p className="text-muted-foreground font-mono text-xs mt-1 truncate max-w-[250px]">
                        {project.slug}
                      </p>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center text-muted-foreground text-sm">
                        <MapPin className="w-4 h-4 mr-1.5 opacity-70" />{" "}
                        {project.location || "-"}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 space-y-2">
                      <div className="flex flex-col items-start gap-1.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${project.status === "published" ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-100 text-slate-700 border-slate-200"}`}
                        >
                          {project.status === "published"
                            ? "Dipublikasi"
                            : "Draf"}
                        </span>
                        {project.is_featured && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                            <Star className="w-3 h-3 mr-1 fill-amber-500" />{" "}
                            Sorotan
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:bg-blue-50 rounded-lg h-9 w-9 p-0"
                        >
                          {/* 🌟 Route ke Halaman Edit Program */}
                          <Link
                            href={`/admin/services/${serviceId}/projects/${project.id}/edit`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setProjectToDelete(project);
                            setIsAlertOpen(true);
                          }}
                          className="text-destructive hover:bg-destructive/10 rounded-lg h-9 w-9 p-0"
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
                  {projects.length}
                </span>{" "}
                dari{" "}
                <span className="font-medium text-foreground">{totalData}</span>{" "}
                program
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

      {/* 🌟 ALERT DIALOG HAPUS */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="rounded-2xl sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Program?</AlertDialogTitle>
            <AlertDialogDescription>
              Program{" "}
              <span className="font-bold text-foreground">
                "{projectToDelete?.title}"
              </span>{" "}
              akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
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

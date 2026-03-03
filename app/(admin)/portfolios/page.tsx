"use client";

import { useState, useEffect, useCallback } from "react";
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
  Compass,
  MapPin,
  Layers,
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

interface Portfolio {
  id: string;
  title: string;
  slug: string;
  sector: string;
  location: string;
  status: string;
  created_at: string;
}

export default function PortfoliosPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🌟 STATE UNTUK FILTER & PAGINATION
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");

  // State Alert Hapus
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState<Portfolio | null>(
    null,
  );

  // Efek Debounce untuk Pencarian (Menunggu 500ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Mengambil Data Jejak Karya
  const fetchPortfolios = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (debouncedSearch) params.append("search", debouncedSearch);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (sectorFilter !== "all") params.append("sector", sectorFilter);

      const res = await api.get(`/api/v1/portfolios?${params.toString()}`);

      setPortfolios(res.data.data || []);

      if (res.data.meta) {
        setTotalData(res.data.meta.total_data);
        setTotalPages(Math.ceil(res.data.meta.total_data / limit) || 1);
      }
    } catch (error) {
      console.error("Gagal mengambil jejak karya:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, statusFilter, sectorFilter]);

  // Jalankan fetchPortfolios saat dependensi berubah
  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  // Reset Filter
  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setSectorFilter("all");
    setPage(1);
  };

  const handleConfirmDelete = async () => {
    if (!portfolioToDelete) return;
    try {
      await api.delete(`/api/v1/admin/portfolios/${portfolioToDelete.id}`);
      setIsAlertOpen(false);
      setPortfolioToDelete(null);
      fetchPortfolios();
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal menghapus jejak karya.");
      setIsAlertOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Helper untuk warna badge sektor
  const getSectorColor = (sector: string) => {
    switch (sector) {
      case "Pendidikan":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Publik":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Industri":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Komunitas":
        return "bg-teal-50 text-teal-700 border-teal-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 font-sans">
      {/* 🌟 HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-3">
            <Compass className="w-3.5 h-3.5 mr-2" />
            <span>Portofolio Utama</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Jejak Karya
          </h1>
        </div>
        <Button asChild className="shadow-sm rounded-xl h-11 px-6">
          <Link href="/portfolios/create">
            <Plus className="w-4 h-4 mr-2" /> Tambah Jejak Karya
          </Link>
        </Button>
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
          value={sectorFilter}
          onValueChange={(val) => {
            setSectorFilter(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full md:w-[200px] rounded-xl bg-background">
            <SelectValue placeholder="Semua Sektor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Sektor</SelectItem>
            <SelectItem value="Pendidikan">Pendidikan</SelectItem>
            <SelectItem value="Publik">Publik</SelectItem>
            <SelectItem value="Industri">Industri</SelectItem>
            <SelectItem value="Komunitas">Komunitas</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full md:w-[160px] rounded-xl bg-background">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="published">Dipublikasi</SelectItem>
            <SelectItem value="draft">Draf</SelectItem>
          </SelectContent>
        </Select>

        {(search || statusFilter !== "all" || sectorFilter !== "all") && (
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
            <p>Memuat jejak karya...</p>
          </div>
        ) : portfolios.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Layers className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Jejak Karya tidak ditemukan
            </h3>
            <p className="text-muted-foreground mb-6">
              Mulai tambahkan rekam jejak portofolio lintas sektor Anda.
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-b-border">
                  <TableHead className="py-4 pl-6 font-semibold text-foreground w-[35%]">
                    Judul & Lokasi
                  </TableHead>
                  <TableHead className="py-4 font-semibold text-foreground">
                    Sektor
                  </TableHead>
                  <TableHead className="py-4 font-semibold text-foreground">
                    Status
                  </TableHead>
                  <TableHead className="py-4 pr-6 text-right font-semibold text-foreground">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolios.map((portfolio) => (
                  <TableRow
                    key={portfolio.id}
                    className="hover:bg-muted/30 transition-colors border-b-border/50 group"
                  >
                    <TableCell className="py-4 pl-6">
                      <p className="font-semibold text-foreground text-base line-clamp-2">
                        {portfolio.title}
                      </p>
                      <div className="flex items-center text-muted-foreground text-xs mt-1.5">
                        <MapPin className="w-3.5 h-3.5 mr-1 opacity-70" />
                        <span className="truncate max-w-[250px]">
                          {portfolio.location || "-"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getSectorColor(portfolio.sector)}`}
                      >
                        {portfolio.sector}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          portfolio.status === "published"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {portfolio.status === "published"
                          ? "Dipublikasi"
                          : "Draf"}
                      </span>
                      <div className="text-muted-foreground text-[11px] mt-1.5 ml-1">
                        {formatDate(portfolio.created_at)}
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
                          <Link href={`/portfolios/${portfolio.id}/edit`}>
                            <Edit2 className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setPortfolioToDelete(portfolio);
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
                  {portfolios.length}
                </span>{" "}
                dari{" "}
                <span className="font-medium text-foreground">{totalData}</span>{" "}
                jejak karya
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
            <AlertDialogTitle>Hapus Jejak Karya?</AlertDialogTitle>
            <AlertDialogDescription>
              Jejak Karya{" "}
              <span className="font-bold text-foreground">
                "{portfolioToDelete?.title}"
              </span>{" "}
              akan dihapus permanen beserta seluruh media dan testimoni yang
              terkait dengannya.
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

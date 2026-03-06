"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Activity,
  Search,
  FilterX,
  User,
  Loader2,
  Eye,
  ShieldAlert,
  MonitorSmartphone,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/lib/api";

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination & Filter States
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");

  // Detail Modal State
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (moduleFilter !== "all") params.append("module", moduleFilter);
      if (actionFilter !== "all") params.append("action", actionFilter);

      const res = await api.get(
        `/api/v1/admin/activity-logs?${params.toString()}`,
      );
      setLogs(res.data.data || []);
      if (res.data.meta) {
        setTotalData(res.data.meta.total_data);
        setTotalPages(res.data.meta.total_pages || 1);
      }
    } catch (error) {
      console.error("Gagal memuat log:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, moduleFilter, actionFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setModuleFilter("all");
    setActionFilter("all");
    setPage(1);
  };

  const openDetail = (log: any) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case "CREATE":
        return "bg-green-50 text-green-700 border-green-200";
      case "UPDATE":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "DELETE":
        return "bg-red-50 text-red-700 border-red-200";
      case "LOGIN":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 font-sans">
      {/* 🌟 HEADER */}
      <div>
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-3">
          <ShieldAlert className="w-3.5 h-3.5 mr-2" /> Audit Trail
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Log Aktivitas Sistem
        </h1>
        <p className="text-muted-foreground mt-1">
          Pantau pergerakan data dan aktivitas pengguna di seluruh modul.
        </p>
      </div>

      {/* 🌟 FILTER BAR */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col md:flex-row gap-4 shadow-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari deskripsi atau IP Address..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 bg-background rounded-xl"
          />
        </div>
        <Select
          value={moduleFilter}
          onValueChange={(v) => {
            setModuleFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full md:w-[180px] rounded-xl bg-background">
            <SelectValue placeholder="Semua Modul" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Modul</SelectItem>
            <SelectItem value="Portfolios">Jejak Karya</SelectItem>
            <SelectItem value="Posts">Wawasan</SelectItem>
            <SelectItem value="Settings">Pengaturan</SelectItem>
            <SelectItem value="Auth">Autentikasi</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={actionFilter}
          onValueChange={(v) => {
            setActionFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full md:w-[150px] rounded-xl bg-background">
            <SelectValue placeholder="Semua Aksi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Aksi</SelectItem>
            <SelectItem value="CREATE">Create</SelectItem>
            <SelectItem value="UPDATE">Update</SelectItem>
            <SelectItem value="DELETE">Delete</SelectItem>
            <SelectItem value="LOGIN">Login</SelectItem>
          </SelectContent>
        </Select>
        {(search || moduleFilter !== "all" || actionFilter !== "all") && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="text-muted-foreground hover:text-destructive"
          >
            <FilterX className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* 🌟 TABEL */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
            <p>Memuat log...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <Activity className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold">Tidak ada log ditemukan</h3>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="py-4 pl-6">Pengguna & Waktu</TableHead>
                  <TableHead className="py-4">Aksi / Modul</TableHead>
                  <TableHead className="py-4">Deskripsi</TableHead>
                  <TableHead className="py-4 text-right pr-6">Detail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/30">
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-2 font-medium text-foreground">
                        <User className="w-4 h-4 text-muted-foreground" />{" "}
                        {log.user?.name || "Sistem"}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDate(log.created_at)}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${getActionColor(log.action)}`}
                      >
                        {log.action}
                      </span>
                      <div className="text-xs text-muted-foreground font-medium mt-1.5">
                        {log.module}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 max-w-[300px]">
                      <p className="text-sm truncate" title={log.description}>
                        {log.description}
                      </p>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                        <MonitorSmartphone className="w-3 h-3" />{" "}
                        {log.ip_address || "-"}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-right">
                      {(log.old_data || log.new_data) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDetail(log)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4 mr-1.5" /> Lihat
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-6 py-4 bg-muted/10 border-t border-border text-sm">
              <span className="text-muted-foreground">
                Menampilkan{" "}
                <span className="font-medium text-foreground">
                  {logs.length}
                </span>{" "}
                dari{" "}
                <span className="font-medium text-foreground">{totalData}</span>{" "}
                log
              </span>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isLoading}
                >
                  Prev
                </Button>
                <span className="font-medium">
                  Hal {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || isLoading}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 🌟 MODAL DETAIL DATA */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-3xl rounded-[24px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Rincian Perubahan
              Data
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-bold text-red-600">
                Data Lama (Old Data)
              </div>
              <pre className="bg-slate-950 text-green-400 p-4 rounded-xl text-xs overflow-auto max-h-[400px]">
                {selectedLog?.old_data
                  ? JSON.stringify(JSON.parse(selectedLog.old_data), null, 2)
                  : "Tidak ada data lama"}
              </pre>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-bold text-blue-600">
                Data Baru (New Data)
              </div>
              <pre className="bg-slate-950 text-green-400 p-4 rounded-xl text-xs overflow-auto max-h-[400px]">
                {selectedLog?.new_data
                  ? JSON.stringify(JSON.parse(selectedLog.new_data), null, 2)
                  : "Tidak ada data baru"}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

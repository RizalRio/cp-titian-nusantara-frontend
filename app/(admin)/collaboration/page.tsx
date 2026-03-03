"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Handshake,
  Mail,
  Eye,
  Trash2,
  CheckCircle,
  Loader2,
  FileText,
  Download,
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
  DialogDescription,
} from "@/components/ui/dialog";
import api from "@/lib/api";

export default function CollaborationAdminPage() {
  const [activeTab, setActiveTab] = useState<"kolaborasi" | "pesan">(
    "kolaborasi",
  );

  // States
  const [dataList, setDataList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal Detail State
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch Data Dinamis berdasarkan Tab
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const endpoint =
        activeTab === "kolaborasi"
          ? "/api/v1/admin/collaboration-requests"
          : "/api/v1/admin/contact-messages";

      const params = new URLSearchParams({ page: "1", limit: "50" });
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (activeTab === "kolaborasi" && statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const res = await api.get(`${endpoint}?${params.toString()}`);
      setDataList(res.data.data || []);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fungsi Aksi Kolaborasi
  const updateCollabStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/api/v1/admin/collaboration-requests/${id}/status`, {
        status: newStatus,
      });
      fetchData();
      if (selectedItem && selectedItem.id === id)
        setSelectedItem({ ...selectedItem, status: newStatus });
    } catch (error) {
      alert("Gagal mengubah status.");
    }
  };

  // Fungsi Aksi Pesan
  const markMessageAsRead = async (id: string) => {
    try {
      await api.put(`/api/v1/admin/contact-messages/${id}/read`);
      fetchData();
      if (selectedItem && selectedItem.id === id)
        setSelectedItem({ ...selectedItem, is_read: true });
    } catch (error) {
      console.error("Gagal menandai pesan:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini permanen?"))
      return;
    try {
      const endpoint =
        activeTab === "kolaborasi"
          ? `/api/v1/admin/collaboration-requests/${id}`
          : `/api/v1/admin/contact-messages/${id}`;
      await api.delete(endpoint);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert("Gagal menghapus data.");
    }
  };

  const openDetail = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    if (activeTab === "pesan" && !item.is_read) {
      markMessageAsRead(item.id);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 font-sans">
      {/* 🌟 HEADER & TABS */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Hubungan Eksternal
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola pengajuan kolaborasi dan pesan masuk dari publik.
          </p>
        </div>

        <div className="flex bg-card p-1.5 rounded-2xl w-full max-w-md border border-border shadow-sm">
          <button
            onClick={() => {
              setActiveTab("kolaborasi");
              setSearch("");
              setStatusFilter("all");
            }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all flex justify-center items-center gap-2 ${activeTab === "kolaborasi" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Handshake className="w-4 h-4" /> Kolaborasi
          </button>
          <button
            onClick={() => {
              setActiveTab("pesan");
              setSearch("");
              setStatusFilter("all");
            }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all flex justify-center items-center gap-2 ${activeTab === "pesan" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Mail className="w-4 h-4" /> Pesan Umum
          </button>
        </div>
      </div>

      {/* 🌟 FILTER BAR */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={
              activeTab === "kolaborasi"
                ? "Cari instansi atau narahubung..."
                : "Cari nama pengirim..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background rounded-xl"
          />
        </div>

        {activeTab === "kolaborasi" && (
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px] rounded-xl bg-background">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending">Menunggu (Pending)</SelectItem>
              <SelectItem value="reviewed">Sedang Direviu</SelectItem>
              <SelectItem value="accepted">Diterima</SelectItem>
              <SelectItem value="rejected">Ditolak</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* 🌟 TABEL DATA */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 text-muted-foreground h-full">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
            <p>Memuat data...</p>
          </div>
        ) : dataList.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center h-full">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              {activeTab === "kolaborasi" ? (
                <Handshake className="w-8 h-8 text-muted-foreground/50" />
              ) : (
                <Mail className="w-8 h-8 text-muted-foreground/50" />
              )}
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Belum ada data
            </h3>
            <p className="text-muted-foreground">
              Data{" "}
              {activeTab === "kolaborasi"
                ? "pengajuan kolaborasi"
                : "pesan masuk"}{" "}
              belum tersedia.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-b-border">
                {activeTab === "kolaborasi" ? (
                  <>
                    <TableHead className="py-4 pl-6 font-semibold">
                      Organisasi & Tipe
                    </TableHead>
                    <TableHead className="py-4 font-semibold">
                      Narahubung
                    </TableHead>
                    <TableHead className="py-4 font-semibold">Status</TableHead>
                    <TableHead className="py-4 font-semibold">
                      Tanggal
                    </TableHead>
                  </>
                ) : (
                  <>
                    <TableHead className="py-4 pl-6 font-semibold">
                      Pengirim
                    </TableHead>
                    <TableHead className="py-4 font-semibold">Subjek</TableHead>
                    <TableHead className="py-4 font-semibold">Status</TableHead>
                    <TableHead className="py-4 font-semibold">
                      Tanggal
                    </TableHead>
                  </>
                )}
                <TableHead className="py-4 pr-6 text-right font-semibold">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataList.map((item) => (
                <TableRow
                  key={item.id}
                  className={`hover:bg-muted/30 transition-colors border-b-border/50 ${activeTab === "pesan" && !item.is_read ? "bg-primary/5" : ""}`}
                >
                  {/* RENDER KOLOM KOLABORASI */}
                  {activeTab === "kolaborasi" ? (
                    <>
                      <TableCell className="py-4 pl-6">
                        <p className="font-bold text-foreground">
                          {item.organization_name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.collaboration_type}
                        </p>
                      </TableCell>
                      <TableCell className="py-4">
                        <p className="font-medium">{item.contact_person}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.email}
                        </p>
                      </TableCell>
                      <TableCell className="py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border
                          ${
                            item.status === "pending"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : item.status === "reviewed"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : item.status === "accepted"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                    </>
                  ) : (
                    /* RENDER KOLOM PESAN UMUM */
                    <>
                      <TableCell className="py-4 pl-6">
                        <p
                          className={`font-medium ${!item.is_read ? "text-foreground font-bold" : "text-muted-foreground"}`}
                        >
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.email}
                        </p>
                      </TableCell>
                      <TableCell className="py-4 max-w-[250px] truncate font-medium text-foreground">
                        {item.subject}
                      </TableCell>
                      <TableCell className="py-4">
                        {item.is_read ? (
                          <span className="flex items-center text-xs font-medium text-slate-500">
                            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Dibaca
                          </span>
                        ) : (
                          <span className="flex items-center text-xs font-bold text-primary">
                            <Mail className="w-3.5 h-3.5 mr-1" /> Baru
                          </span>
                        )}
                      </TableCell>
                    </>
                  )}

                  {/* KOLOM GLOBAL */}
                  <TableCell className="py-4 text-sm text-muted-foreground">
                    {formatDate(item.created_at)}
                  </TableCell>
                  <TableCell className="py-4 pr-6 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDetail(item)}
                      className="text-blue-600 hover:bg-blue-50 rounded-lg mr-2"
                    >
                      <Eye className="w-4 h-4 mr-1.5" /> Detail
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:bg-destructive/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* 🌟 MODAL DETAIL ITEM */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl rounded-[24px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              {activeTab === "kolaborasi" ? (
                <Handshake className="w-5 h-5 text-primary" />
              ) : (
                <Mail className="w-5 h-5 text-primary" />
              )}
              Detail{" "}
              {activeTab === "kolaborasi"
                ? "Pengajuan Kolaborasi"
                : "Pesan Masuk"}
            </DialogTitle>
            <DialogDescription>
              Diterima pada{" "}
              {selectedItem && formatDate(selectedItem.created_at)}
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl text-sm">
                {activeTab === "kolaborasi" ? (
                  <>
                    <div>
                      <span className="block text-muted-foreground text-xs mb-1">
                        Organisasi
                      </span>
                      <span className="font-semibold">
                        {selectedItem.organization_name}
                      </span>
                    </div>
                    <div>
                      <span className="block text-muted-foreground text-xs mb-1">
                        Narahubung
                      </span>
                      <span className="font-semibold">
                        {selectedItem.contact_person}
                      </span>
                    </div>
                    <div>
                      <span className="block text-muted-foreground text-xs mb-1">
                        Email
                      </span>
                      <span className="font-semibold">
                        {selectedItem.email}
                      </span>
                    </div>
                    <div>
                      <span className="block text-muted-foreground text-xs mb-1">
                        Telepon / WA
                      </span>
                      <span className="font-semibold">
                        {selectedItem.phone}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="block text-muted-foreground text-xs mb-1">
                        Tipe Kolaborasi
                      </span>
                      <span className="font-semibold">
                        {selectedItem.collaboration_type}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="block text-muted-foreground text-xs mb-1">
                        Nama Pengirim
                      </span>
                      <span className="font-semibold">{selectedItem.name}</span>
                    </div>
                    <div>
                      <span className="block text-muted-foreground text-xs mb-1">
                        Email
                      </span>
                      <span className="font-semibold">
                        {selectedItem.email}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="block text-muted-foreground text-xs mb-1">
                        Subjek
                      </span>
                      <span className="font-semibold">
                        {selectedItem.subject}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div>
                <span className="block font-bold text-foreground mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Isi Pesan / Rincian Ide
                </span>
                <div className="bg-card border border-border rounded-xl p-5 text-slate-700 leading-relaxed whitespace-pre-line max-h-[300px] overflow-y-auto">
                  {selectedItem.message}
                </div>
              </div>

              {activeTab === "kolaborasi" && selectedItem.proposal_file_url && (
                <div>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-xl w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <a
                      href={selectedItem.proposal_file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="w-4 h-4 mr-2" /> Lihat Lampiran
                      Proposal
                    </a>
                  </Button>
                </div>
              )}

              {/* Aksi Ubah Status Kolaborasi */}
              {activeTab === "kolaborasi" && (
                <div className="pt-4 border-t border-border flex flex-wrap gap-2 justify-end">
                  <Button
                    variant={
                      selectedItem.status === "pending" ? "default" : "outline"
                    }
                    onClick={() =>
                      updateCollabStatus(selectedItem.id, "pending")
                    }
                    className="rounded-xl"
                  >
                    Pending
                  </Button>
                  <Button
                    variant={
                      selectedItem.status === "reviewed" ? "default" : "outline"
                    }
                    onClick={() =>
                      updateCollabStatus(selectedItem.id, "reviewed")
                    }
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Direviu
                  </Button>
                  <Button
                    variant={
                      selectedItem.status === "accepted" ? "default" : "outline"
                    }
                    onClick={() =>
                      updateCollabStatus(selectedItem.id, "accepted")
                    }
                    className="rounded-xl bg-green-600 hover:bg-green-700 text-white"
                  >
                    Terima
                  </Button>
                  <Button
                    variant={
                      selectedItem.status === "rejected"
                        ? "destructive"
                        : "outline"
                    }
                    onClick={() =>
                      updateCollabStatus(selectedItem.id, "rejected")
                    }
                    className="rounded-xl"
                  >
                    Tolak
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

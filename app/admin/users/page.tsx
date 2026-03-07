"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/api";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

// Interface Data
interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  last_login_at: string | null;
  created_at: string;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  // State Modal Form (Create / Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    status: "active",
  });

  // State Modal Delete
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Fetch Data
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/api/v1/admin/users");
      if (res.data.status === "success") {
        setUsers(res.data.data || []);
      }
    } catch (error) {
      toast.error("Gagal memuat data pengguna.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Client-Side Filter
  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()),
    );
  }, [users, search]);

  // 3. Handler Buka Form Create
  const openCreateForm = () => {
    setFormMode("create");
    setFormData({
      id: "",
      name: "",
      email: "",
      password: "",
      status: "active",
    });
    setIsFormOpen(true);
  };

  // 4. Handler Buka Form Edit
  const openEditForm = (user: User) => {
    setFormMode("edit");
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      password: "", // Kosongkan agar password lama tidak tertimpa kecuali diisi
      status: user.status,
    });
    setIsFormOpen(true);
  };

  // 5. Submit Form (Create / Update)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        status: formData.status,
      };

      if (formMode === "create") {
        payload.password = formData.password; // Password wajib saat create
        await api.post("/api/v1/admin/users", payload);
        toast.success("Pengguna berhasil ditambahkan!");
      } else {
        // Pada saat Edit, hanya kirim password jika admin mengisinya
        if (formData.password) {
          payload.password = formData.password;
        }
        // 🌟 MENGUJI FUNGSI UPDATE DI SINI
        await api.put(`/api/v1/admin/users/${formData.id}`, payload);
        toast.success("Data pengguna berhasil diperbarui!");
      }

      setIsFormOpen(false);
      fetchUsers(); // Refresh tabel
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menyimpan pengguna.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 6. Delete Action
  const handleDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);

    try {
      await api.delete(`/api/v1/admin/users/${userToDelete.id}`);
      toast.success(`Pengguna ${userToDelete.name} berhasil dihapus.`);
      setIsDeleteOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menghapus pengguna.");
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  // Utility Tanggal
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Belum pernah login";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 font-sans pb-24">
      {/* 🌟 HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-3">
            <ShieldCheck className="w-3.5 h-3.5 mr-2" /> Manajemen Akses
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Staf & Pengguna
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola akses, tambahkan anggota tim, dan pantau aktivitas pengguna.
          </p>
        </div>
        <Button
          onClick={openCreateForm}
          className="shadow-sm rounded-xl h-11 px-6"
        >
          <Plus className="w-4 h-4 mr-2" /> Tambah Pengguna
        </Button>
      </div>

      {/* 🌟 FILTER BAR */}
      <div className="bg-card border border-border rounded-2xl p-4 flex items-center shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau email..."
            className="pl-9 bg-background rounded-xl h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 🌟 TABEL DATA */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
            <p>Memuat data pengguna...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Tidak ada pengguna
            </h3>
            <p className="text-muted-foreground">
              Data pengguna tidak ditemukan.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-b-border">
                <TableHead className="py-4 pl-6 font-semibold text-foreground">
                  Informasi Pengguna
                </TableHead>
                <TableHead className="py-4 font-semibold text-foreground">
                  Status
                </TableHead>
                <TableHead className="py-4 font-semibold text-foreground">
                  Terakhir Login
                </TableHead>
                <TableHead className="py-4 pr-6 text-right font-semibold text-foreground">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-muted/30 transition-colors border-b-border/50"
                >
                  <TableCell className="py-4 pl-6">
                    <p className="font-semibold text-foreground text-base">
                      {user.name}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {user.email}
                    </p>
                  </TableCell>
                  <TableCell className="py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        user.status === "active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : user.status === "inactive"
                            ? "bg-slate-100 text-slate-700 border-slate-200"
                            : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {user.status === "active"
                        ? "Aktif"
                        : user.status === "inactive"
                          ? "Nonaktif"
                          : "Suspended"}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 text-sm text-muted-foreground">
                    {formatDate(user.last_login_at)}
                  </TableCell>
                  <TableCell className="py-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditForm(user)}
                        className="text-blue-600 hover:bg-blue-50 rounded-lg h-9 w-9 p-0"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setUserToDelete(user);
                          setIsDeleteOpen(true);
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
        )}
      </div>

      {/* 🌟 MODAL FORM (CREATE & EDIT) */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <form onSubmit={handleFormSubmit}>
            <DialogHeader>
              <DialogTitle className="text-xl">
                {formMode === "create"
                  ? "Tambah Pengguna Baru"
                  : "Edit Data Pengguna"}
              </DialogTitle>
              <DialogDescription>
                {formMode === "create"
                  ? "Isi detail di bawah ini untuk membuat akses pengguna baru."
                  : "Ubah detail pengguna. Kosongkan kata sandi jika tidak ingin mengubahnya."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nama Lengkap <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Misal: Budi Santoso"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Alamat Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Misal: budi@titian.id"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">
                  Kata Sandi{" "}
                  {formMode === "create" && (
                    <span className="text-destructive">*</span>
                  )}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={
                    formMode === "create"
                      ? "Minimal 6 karakter"
                      : "Biarkan kosong jika tidak diubah"
                  }
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required={formMode === "create"}
                  minLength={6}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Status Akun</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) =>
                    setFormData({ ...formData, status: val })
                  }
                >
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif (Dapat Login)</SelectItem>
                    <SelectItem value="inactive">Nonaktif</SelectItem>
                    <SelectItem value="suspended">
                      Suspended (Ditangguhkan)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                className="rounded-xl h-11"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl h-11"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                {formMode === "create" ? "Simpan Pengguna" : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 🌟 MODAL KONFIRMASI HAPUS */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="rounded-2xl sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengguna?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus akun{" "}
              <strong>{userToDelete?.name}</strong>? Akses pengguna ini ke dalam
              sistem CMS akan dicabut.
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
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

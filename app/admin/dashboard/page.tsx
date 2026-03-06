"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Briefcase, MessageSquare } from "lucide-react";

export default function DashboardPage() {
  // Mengambil nama admin yang login dari memori Zustand
  const user = useAuthStore((state) => state.user);

  return (
    <div className="p-8 space-y-8 overflow-y-auto">
      {/* Bagian Header Welcome */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Halo, {user?.name || "Admin"}! 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Selamat datang di panel kendali Titian Nusantara. Berikut adalah
          ringkasan sistem Anda hari ini.
        </p>
      </div>

      {/* Grid Statistik Ringkas (Placeholder) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Halaman
            </CardTitle>
            <FileText className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">4</div>
            <p className="text-xs text-muted-foreground mt-1">
              Halaman aktif (Publik)
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Jejak Karya
            </CardTitle>
            <Briefcase className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              Proyek diselesaikan
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pesan Baru
            </CardTitle>
            <MessageSquare className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">3</div>
            <p className="text-xs text-muted-foreground mt-1">
              Proposal kolaborasi belum dibaca
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

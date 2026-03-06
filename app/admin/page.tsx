"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Globe,
  Briefcase,
  MessageSquare,
  Activity,
  ArrowRight,
  Clock,
  User,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    posts: 0,
    services: 0,
    portfolios: 0,
    unreadMessages: 0,
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [greeting, setGreeting] = useState("Selamat Datang");

  useEffect(() => {
    // 1. Set Sapaan Berdasarkan Waktu
    const hour = new Date().getHours();
    if (hour < 11) setGreeting("Selamat Pagi");
    else if (hour < 15) setGreeting("Selamat Siang");
    else if (hour < 19) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");

    // 2. Fetch Semua Data Dashboard Secara Paralel
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Menggunakan Promise.allSettled agar jika 1 gagal, yang lain tetap jalan
        const [postsRes, servicesRes, portfoliosRes, messagesRes, logsRes] =
          await Promise.allSettled([
            api.get("/api/v1/posts?limit=1"), // Cukup limit 1, kita hanya butuh meta.total_data
            api.get("/api/v1/services?limit=1"),
            api.get("/api/v1/portfolios?limit=1"),
            api.get("/api/v1/admin/contact-messages?limit=5"), // Ambil 5 pesan terbaru
            api.get("/api/v1/admin/activity-logs?limit=5"), // Ambil 5 log terbaru
          ]);

        // Hitung Statistik
        const newStats = {
          posts: 0,
          services: 0,
          portfolios: 0,
          unreadMessages: 0,
        };

        if (postsRes.status === "fulfilled")
          newStats.posts = postsRes.value.data.meta?.total_data || 0;
        if (servicesRes.status === "fulfilled")
          newStats.services = servicesRes.value.data.meta?.total_data || 0;
        if (portfoliosRes.status === "fulfilled")
          newStats.portfolios = portfoliosRes.value.data.meta?.total_data || 0;

        if (messagesRes.status === "fulfilled") {
          const msgs = messagesRes.value.data.data || [];
          setRecentMessages(msgs);
          // Hitung pesan yang belum dibaca dari total data (jika endpoint API Anda mendukung filter ini nantinya, lebih baik. Untuk saat ini kita ambil estimasi atau bisa dibiarkan sesuai data total)
          newStats.unreadMessages =
            messagesRes.value.data.meta?.total_data || 0;
        }

        if (logsRes.status === "fulfilled") {
          setRecentLogs(logsRes.value.data.data || []);
        }

        setStats(newStats);
      } catch (error) {
        console.error("Gagal memuat data dashboard", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case "CREATE":
        return "text-green-600 bg-green-50";
      case "UPDATE":
        return "text-blue-600 bg-blue-50";
      case "DELETE":
        return "text-red-600 bg-red-50";
      case "LOGIN":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-slate-600 bg-slate-50";
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 font-sans pb-20">
      {/* 🌟 HEADER (GREETING) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-3">
            <ShieldCheck className="w-3.5 h-3.5 mr-2" /> Pusat Kendali Sistem
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {greeting}, Admin!
          </h1>
          <p className="text-muted-foreground mt-1">
            Berikut adalah ikhtisar aktivitas dan data platform Titian Nusantara
            hari ini.
          </p>
        </div>
      </div>

      {/* 🌟 BENTO GRID STATISTIK (4 Kolom) */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="rounded-[24px] border-border shadow-sm">
              <CardContent className="p-6 flex items-center justify-center min-h-[120px]">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Artikel */}
          <Card className="rounded-[24px] border-border shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <FileText className="w-24 h-24" />
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Wawasan (Artikel)
              </p>
              <h3 className="text-3xl font-bold text-foreground mt-1">
                {stats.posts}
              </h3>
            </CardContent>
          </Card>

          {/* Card 2: Layanan */}
          <Card className="rounded-[24px] border-border shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Globe className="w-24 h-24" />
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
                  <Globe className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Ekosistem Layanan
              </p>
              <h3 className="text-3xl font-bold text-foreground mt-1">
                {stats.services}
              </h3>
            </CardContent>
          </Card>

          {/* Card 3: Jejak Karya */}
          <Card className="rounded-[24px] border-border shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Briefcase className="w-24 h-24" />
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
                  <Briefcase className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Jejak Karya (Portfolio)
              </p>
              <h3 className="text-3xl font-bold text-foreground mt-1">
                {stats.portfolios}
              </h3>
            </CardContent>
          </Card>

          {/* Card 4: Pesan Masuk */}
          <Card className="rounded-[24px] border-border shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <MessageSquare className="w-24 h-24" />
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
                  <MessageSquare className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Pesan Masuk
              </p>
              <h3 className="text-3xl font-bold text-foreground mt-1">
                {stats.unreadMessages}
              </h3>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 🌟 LAYOUT KONTEN UTAMA (GRID 2 KOLOM) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* KOLOM KIRI: Aktivitas Terakhir */}
        <Card className="rounded-[24px] shadow-sm border-border overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between bg-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">
                  Aktivitas Terakhir
                </h3>
                <p className="text-xs text-muted-foreground">
                  Jejak audit (Audit Trail) sistem.
                </p>
              </div>
            </div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-primary hover:bg-primary/5"
            >
              <Link href="/admin/activity-logs">Lihat Semua</Link>
            </Button>
          </div>
          <CardContent className="p-0 flex-1">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                Memuat log...
              </div>
            ) : recentLogs.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Belum ada aktivitas tercatat.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-5 hover:bg-muted/30 transition-colors flex gap-4 items-start"
                  >
                    <div
                      className={`mt-1 text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wider ${getActionColor(log.action)}`}
                    >
                      {log.action}
                    </div>
                    <div className="flex-1">
                      <p
                        className="text-sm font-medium text-foreground line-clamp-1"
                        title={log.description}
                      >
                        {log.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />{" "}
                          {log.user?.name || "Sistem"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />{" "}
                          {formatDate(log.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* KOLOM KANAN: Pesan Masuk Terbaru */}
        <Card className="rounded-[24px] shadow-sm border-border overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between bg-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">
                  Pesan Terbaru
                </h3>
                <p className="text-xs text-muted-foreground">
                  Dari form hubungi kami.
                </p>
              </div>
            </div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-primary hover:bg-primary/5"
            >
              <Link href="/admin/collaborations">Kelola Pesan</Link>
            </Button>
          </div>
          <CardContent className="p-0 flex-1 bg-muted/5">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                Memuat pesan...
              </div>
            ) : recentMessages.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Belum ada pesan masuk.
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {recentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-4 bg-background border border-border rounded-2xl shadow-sm hover:border-primary/30 transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm text-foreground">
                        {msg.name}
                      </h4>
                      {!msg.is_read && (
                        <span
                          className="w-2.5 h-2.5 rounded-full bg-destructive flex-shrink-0"
                          title="Belum dibaca"
                        />
                      )}
                    </div>
                    <p className="text-xs font-medium text-foreground mb-1">
                      {msg.subject}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>
                    <div className="mt-3 text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatDate(msg.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

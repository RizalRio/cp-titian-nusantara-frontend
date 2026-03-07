"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Briefcase,
  MessageSquare,
  Settings,
  Leaf,
  Activity,
  Folder,
  Tag,
  Users,
} from "lucide-react";

import { useUIStore } from "@/store/useUIStore";
import { cn } from "@/lib/utils";

// 🌟 STRUKTUR DATA BARU: Menu dikelompokkan secara logis
const menuGroups = [
  {
    groupLabel: "Menu Utama",
    items: [{ name: "Dashboard", icon: LayoutDashboard, path: "/admin" }],
  },
  {
    groupLabel: "Manajemen Konten",
    items: [
      { name: "Halaman Dinamis", icon: FileText, path: "/admin/pages" },
      { name: "Wawasan (Artikel)", icon: BookOpen, path: "/admin/posts" },
      { name: "Kategori Wawasan", icon: Folder, path: "/admin/categories" },
      { name: "Tag Artikel", icon: Tag, path: "/admin/tags" },
    ],
  },
  {
    groupLabel: "Pilar & Karya",
    items: [
      { name: "Ekosistem Layanan", icon: Leaf, path: "/admin/services" },
      { name: "Jejak Karya", icon: Briefcase, path: "/admin/portfolios" },
    ],
  },
  {
    groupLabel: "Interaksi Publik",
    items: [
      {
        name: "Pesan & Kolaborasi",
        icon: MessageSquare,
        path: "/admin/collaborations",
      },
    ],
  },
  {
    groupLabel: "Konfigurasi Sistem",
    items: [
      { name: "Staf & Pengguna", icon: Users, path: "/admin/users" },
      { name: "Log Aktivitas", icon: Activity, path: "/admin/activity-logs" },
      { name: "Pengaturan Situs", icon: Settings, path: "/admin/settings" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const isCollapsed = useUIStore((state) => state.isSidebarCollapsed);

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-card border-r border-border sticky top-0 transition-all duration-300 ease-in-out z-20 shadow-sm",
        isCollapsed ? "w-20" : "w-[260px]", // Lebar sedikit ditambah agar teks menu lebih lega
      )}
    >
      {/* Area Logo */}
      <div className="h-16 flex items-center justify-center border-b border-border shrink-0 px-4">
        {isCollapsed ? (
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Leaf className="w-6 h-6 text-primary" />
          </div>
        ) : (
          <div className="flex items-center gap-3 w-full">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight truncate">
              Titian Nusantara
            </span>
          </div>
        )}
      </div>

      {/* Area Menu */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6 scrollbar-hide">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-1.5">
            {/* Label Grup Menu (Hanya tampil jika sidebar terbuka) */}
            {!isCollapsed && (
              <h4 className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
                {group.groupLabel}
              </h4>
            )}

            {/* Garis pemisah mini untuk sidebar mode tertutup */}
            {isCollapsed && groupIndex > 0 && (
              <div className="mx-auto w-8 h-px bg-border my-2" />
            )}

            {/* Item Menu */}
            {group.items.map((item) => {
              // 🌟 FIX LOGIKA ACTIVE: Agar /admin tidak menyala saat di /admin/pages
              const isActive =
                item.path === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.path ||
                    pathname.startsWith(`${item.path}/`);

              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.path}
                  title={isCollapsed ? item.name : undefined}
                >
                  <span
                    className={cn(
                      "flex items-center rounded-xl text-sm font-medium transition-all duration-200",
                      isCollapsed ? "justify-center p-3" : "px-3 py-2.5 gap-3",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                    )}
                  >
                    <Icon
                      className={cn(
                        "shrink-0 transition-colors",
                        isCollapsed ? "w-6 h-6" : "w-5 h-5",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    {!isCollapsed && (
                      <span className="truncate">{item.name}</span>
                    )}
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}

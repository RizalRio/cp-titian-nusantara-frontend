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
} from "lucide-react";

import { useUIStore } from "@/store/useUIStore";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Halaman", icon: FileText, path: "/pages" },
  { name: "Wawasan", icon: BookOpen, path: "/posts" },
  { name: "Jejak Karya", icon: Briefcase, path: "/projects" },
  { name: "Kolaborasi", icon: MessageSquare, path: "/messages" },
  { name: "Pengaturan", icon: Settings, path: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const isCollapsed = useUIStore((state) => state.isSidebarCollapsed);

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-card border-r border-border sticky top-0 transition-all duration-300 ease-in-out z-20",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      {/* Area Logo */}
      <div className="h-16 flex items-center justify-center border-b border-border">
        {isCollapsed ? (
          <Leaf className="w-8 h-8 text-primary" />
        ) : (
          <span className="text-xl font-bold text-primary tracking-tight truncate px-4 w-full">
            Titian Nusantara
          </span>
        )}
      </div>

      {/* Area Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 scrollbar-hide">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.path || pathname.startsWith(`${item.path}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.path}
              title={isCollapsed ? item.name : undefined}
            >
              <span
                className={cn(
                  "flex items-center rounded-md text-sm font-medium transition-colors",
                  isCollapsed ? "justify-center p-3" : "px-3 py-2.5 gap-3",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "shrink-0",
                    isCollapsed ? "w-6 h-6" : "w-5 h-5",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

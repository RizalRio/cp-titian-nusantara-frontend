"use client";

import { usePathname, useRouter } from "next/navigation";
import { Menu, User as UserIcon, LogOut, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner"; // Tambahkan toast untuk notifikasi
import Link from "next/link";

import api from "@/lib/api"; // 🌟 Import API instance
import { useUIStore } from "@/store/useUIStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function Navbar() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // 🌟 State untuk efek loading saat proses logout
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 🌟 LOGIKA LOGOUT BARU
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault(); // Mencegah dropdown menutup instan jika kita ingin efek loading
    setIsLoggingOut(true);

    try {
      // 1. Tembak API Backend agar Log Aktivitas tercatat
      await api.post("/api/v1/admin/auth/logout");

      // 2. Bersihkan state lokal (Zustand) & hapus cookie/localStorage
      logout();

      // 3. Beri notifikasi dan redirect
      toast.success("Berhasil keluar dari sistem.");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Meskipun API gagal, kita tetap harus membersihkan sesi lokal agar user tidak nyangkut
      logout();
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Logika Breadcrumb Dinamis ("dashboard/pages" -> ["Dashboard", "Pages"])
  const paths = pathname.split("/").filter((path) => path);

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 bg-card border-b border-border sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Tombol Toggle Sidebar */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <Separator orientation="vertical" className="h-6 hidden md:block" />

        {/* Breadcrumb Dinamis */}
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            {paths.map((path, index) => {
              const href = `/${paths.slice(0, index + 1).join("/")}`;
              const isLast = index === paths.length - 1;
              const title = path.charAt(0).toUpperCase() + path.slice(1);

              return (
                <React.Fragment key={path}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="font-semibold text-primary">
                        {title}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Profil Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {user?.name?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.name || "Administrator"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email || "admin@titian.id"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href="/admin/profile">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profil Saya</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            onClick={handleLogout}
            disabled={isLoggingOut} // Mencegah double click
          >
            {isLoggingOut ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            <span>{isLoggingOut ? "Keluar..." : "Keluar"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

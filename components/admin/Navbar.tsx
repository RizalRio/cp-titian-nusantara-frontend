"use client";

import { usePathname, useRouter } from "next/navigation";
import { Menu, User as UserIcon, LogOut, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

import api from "@/lib/api";
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

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoggingOut(true);

    try {
      await api.post("/api/v1/admin/auth/logout");
      logout();
      toast.success("Berhasil keluar dari sistem.");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      logout();
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // 🌟 LOGIKA BREADCRUMB YANG DISEMPURNAKAN
  const paths = pathname.split("/").filter((path) => path);

  const formatBreadcrumbTitle = (text: string) => {
    if (text.toLowerCase() === "admin") return "Dashboard";
    // Mengubah "activity-logs" menjadi "Activity Logs"
    return text
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 bg-card border-b border-border sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Tombol Toggle Sidebar */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="shrink-0 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors rounded-xl h-10 w-10"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <Separator
          orientation="vertical"
          className="h-6 hidden md:block bg-border"
        />

        {/* Breadcrumb Dinamis */}
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            {paths.map((path, index) => {
              const href = `/${paths.slice(0, index + 1).join("/")}`;
              const isLast = index === paths.length - 1;
              const title = formatBreadcrumbTitle(path);

              return (
                <React.Fragment key={path}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="font-semibold text-primary tracking-tight">
                        {title}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={href}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {title}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && (
                    <BreadcrumbSeparator className="text-muted-foreground/50" />
                  )}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Profil Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full hover:bg-primary/10 transition-colors"
          >
            <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-60 rounded-2xl p-2"
          align="end"
          forceMount
        >
          <DropdownMenuLabel className="font-normal p-2">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-bold leading-none text-foreground">
                {user?.name || "Administrator"}
              </p>
              <p className="text-xs leading-none text-muted-foreground mt-1">
                {user?.email || "admin@titian.id"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem
            className="cursor-pointer rounded-xl p-2.5 focus:bg-primary/10 focus:text-primary transition-colors"
            asChild
          >
            <Link href="/admin/profile">
              <UserIcon className="mr-2 h-4 w-4" />
              <span className="font-medium">Profil Saya</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer rounded-xl p-2.5 text-destructive focus:text-destructive focus:bg-destructive/10 transition-colors mt-1"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            <span className="font-medium">
              {isLoggingOut ? "Sedang keluar..." : "Keluar Sistem"}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

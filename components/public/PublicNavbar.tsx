"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Menu, X, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export function PublicNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState<string | null>(
    null,
  );

  const [siteName, setSiteName] = useState("Titian Nusantara");
  const [isLoadingSiteInfo, setIsLoadingSiteInfo] = useState(true);

  // Ambil Data Site Settings
  useEffect(() => {
    const fetchSiteSettings = async () => {
      setIsLoadingSiteInfo(true);
      try {
        const res = await api.get("/api/v1/settings");
        if (res.data.status === "success" && res.data.data) {
          const settingsData = res.data.data;

          if (!Array.isArray(settingsData) && settingsData.site_name) {
            setSiteName(settingsData.site_name);
          } else if (Array.isArray(settingsData)) {
            const nameSetting = settingsData.find(
              (setting: any) => setting.key === "site_name",
            );
            if (nameSetting && nameSetting.value) {
              setSiteName(nameSetting.value);
            }
          }
        }
      } catch (error) {
        console.error("Gagal memuat pengaturan situs:", error);
      } finally {
        setIsLoadingSiteInfo(false);
      }
    };

    fetchSiteSettings();
  }, []);

  const navLinks = [
    { name: "HOME", href: "/beranda-utama" },
    { name: "TENTANG KAMI", href: "/tentang-kami" },
    { name: "LAYANAN", href: "/layanan" },
    {
      name: "KOLABORASI",
      href: "/kolaborasi",
      subLinks: [
        { name: "Institusi Publik", href: "/kolaborasi/institusi-publik" },
        { name: "Mitra & Industri", href: "/kolaborasi/mitra-industri" },
        { name: "Model Kolaborasi", href: "/model-kolaborasi" },
        {
          name: "Proposal & Kerjasama",
          href: "/proposal-kerjasama",
        },
      ],
    },
    { name: "WAWASAN", href: "/wawasan" },
    { name: "JEJAK KARYA", href: "/jejak-karya" },
    { name: "HUBUNGI KAMI", href: "/hubungi-kami" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
        {/* 🌟 Logo & Site Name Dinamis */}
        <Link
          href="/beranda-utama"
          className="flex items-center gap-3 group outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shadow-sm">
            <Leaf className="w-5 h-5 text-primary" />
          </div>
          {isLoadingSiteInfo ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground ml-2" />
          ) : (
            <span className="font-bold text-[1.15rem] tracking-tight text-foreground group-hover:text-primary transition-colors">
              {siteName}
            </span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group">
              {link.subLinks ? (
                <>
                  <button
                    className={`flex items-center gap-1.5 text-[13px] font-bold tracking-widest transition-colors py-6 outline-none focus-visible:text-primary ${
                      pathname.startsWith(link.href)
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.name}
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180 opacity-70" />
                  </button>

                  {/* Kotak Dropdown Desktop */}
                  <div className="absolute left-0 top-[100%] opacity-0 translate-y-3 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                    <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-2xl shadow-xl p-2.5 w-64 flex flex-col gap-1 relative overflow-hidden">
                      {link.subLinks.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={`px-4 py-3 text-sm font-medium rounded-xl transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                            pathname === sub.href
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          }`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={link.href}
                  className={`text-[13px] font-bold tracking-widest transition-colors py-6 relative outline-none focus-visible:text-primary ${
                    pathname === link.href
                      ? "text-primary after:absolute after:bottom-4 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
        className={`lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-sm overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col py-6 px-6 space-y-6 overflow-y-auto">
          {navLinks.map((link) => (
            <div key={link.name} className="flex flex-col">
              {link.subLinks ? (
                <>
                  <button
                    onClick={() =>
                      setMobileSubMenuOpen(
                        mobileSubMenuOpen === link.name ? null : link.name,
                      )
                    }
                    className={`flex items-center justify-between text-sm font-bold tracking-widest outline-none ${
                      pathname.startsWith(link.href)
                        ? "text-primary"
                        : "text-foreground/80 hover:text-foreground"
                    }`}
                  >
                    {link.name}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        mobileSubMenuOpen === link.name
                          ? "rotate-180 text-primary"
                          : ""
                      }`}
                    />
                  </button>

                  {/* Daftar Submenu Mobile */}
                  <div
                    className={`flex flex-col pl-4 mt-2 space-y-3 border-l-2 border-border/50 ml-1 overflow-hidden transition-all duration-300 ${
                      mobileSubMenuOpen === link.name
                        ? "max-h-[300px] opacity-100 mt-4 mb-2"
                        : "max-h-0 opacity-0 m-0"
                    }`}
                  >
                    {link.subLinks.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`text-sm font-medium py-1.5 transition-colors outline-none ${
                          pathname === sub.href
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm font-bold tracking-widest transition-colors outline-none ${
                    pathname === link.href
                      ? "text-primary"
                      : "text-foreground/80 hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}

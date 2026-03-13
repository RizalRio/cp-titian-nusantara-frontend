"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Menu, X, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";

export function PublicNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState<string | null>(
    null,
  );

  const [siteName, setSiteName] = useState("Titian Nusantara");
  const [isLoadingSiteInfo, setIsLoadingSiteInfo] = useState(true);

  // Ambil Data Site Settings dari CMS
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

  // Mengunci scroll layar saat menu mobile terbuka
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "HOME", href: "/beranda" },
    { name: "TENTANG KAMI", href: "/tentang-kami" },
    { name: "LAYANAN", href: "/layanan" },
    {
      name: "KOLABORASI",
      href: "/kolaborasi",
      subLinks: [
        { name: "Institusi Publik", href: "/kolaborasi/institusi-publik" },
        { name: "Mitra & Industri", href: "/kolaborasi/mitra-industri" },
        { name: "Model Kolaborasi", href: "/model-kolaborasi" },
        { name: "Proposal Kerjasama", href: "/proposal-kerjasama" },
      ],
    },
    { name: "WAWASAN", href: "/wawasan" },
    { name: "JEJAK KARYA", href: "/jejak-karya" },
    { name: "HUBUNGI KAMI", href: "/hubungi-kami" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
        <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          {/* 🌟 Logo & Site Name Dinamis */}
          <Link
            href="/beranda"
            className="flex items-center gap-3 group outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg z-50"
            onClick={() => setIsMobileMenuOpen(false)} // Tutup menu jika klik logo
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

          {/* 🌟 Desktop Navigation */}
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
                      <div className="bg-background/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-xl p-2.5 w-64 flex flex-col gap-1 relative overflow-hidden">
                        {link.subLinks.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className={`px-4 py-3 text-sm font-medium rounded-xl transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                              pathname === sub.href
                                ? "bg-primary/10 text-primary font-bold"
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

          {/* 🌟 Mobile Menu Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-xl text-foreground hover:bg-muted/50 z-50 relative"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>

        {/* 🌟 Mobile Navigation Fullscreen Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop Blur Gelap */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 top-20 bg-background/80 backdrop-blur-md lg:hidden z-40"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Menu List Container */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute top-20 left-0 w-full max-h-[calc(100vh-5rem)] overflow-y-auto bg-card border-b border-border/40 shadow-2xl lg:hidden z-50 pb-8"
              >
                <nav className="flex flex-col py-6 px-6 sm:px-10 space-y-2">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex flex-col border-b border-border/40 last:border-0"
                    >
                      {link.subLinks ? (
                        <>
                          <button
                            onClick={() =>
                              setMobileSubMenuOpen(
                                mobileSubMenuOpen === link.name
                                  ? null
                                  : link.name,
                              )
                            }
                            className={`flex items-center justify-between py-4 text-[0.95rem] font-extrabold tracking-widest outline-none transition-colors ${
                              pathname.startsWith(link.href)
                                ? "text-primary"
                                : "text-foreground/80 hover:text-foreground"
                            }`}
                          >
                            {link.name}
                            <div
                              className={`p-1.5 rounded-md transition-colors ${mobileSubMenuOpen === link.name ? "bg-primary/10" : "bg-muted/50"}`}
                            >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-300 ${
                                  mobileSubMenuOpen === link.name
                                    ? "rotate-180 text-primary"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </div>
                          </button>

                          {/* Daftar Submenu Mobile */}
                          <AnimatePresence>
                            {mobileSubMenuOpen === link.name && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="flex flex-col pl-4 mb-4 space-y-1 border-l-2 border-primary/20 ml-2 overflow-hidden"
                              >
                                {link.subLinks.map((sub) => (
                                  <Link
                                    key={sub.name}
                                    href={sub.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`py-3 px-4 text-sm font-semibold rounded-xl transition-colors outline-none ${
                                      pathname === sub.href
                                        ? "bg-primary/5 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                                    }`}
                                  >
                                    {sub.name}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`py-4 text-[0.95rem] font-extrabold tracking-widest transition-colors outline-none ${
                            pathname === link.href
                              ? "text-primary"
                              : "text-foreground/80 hover:text-foreground"
                          }`}
                        >
                          {link.name}
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

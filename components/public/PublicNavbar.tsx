"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export function PublicNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState<string | null>(
    null,
  );

  // Menu sesuai wireframe Titian Nusantara
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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/beranda-utama" className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl tracking-tight text-primary">
            Titian Nusantara
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group">
              {link.subLinks ? (
                <>
                  <button
                    className={`flex items-center gap-1 text-sm font-semibold tracking-wider transition-colors hover:text-primary ${
                      pathname === link.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {link.name}
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </button>
                  {/* Kotak Dropdown */}
                  <div className="absolute left-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                    <div className="bg-background border border-border rounded-xl shadow-lg py-2 w-64 flex flex-col">
                      {link.subLinks.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={`px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-primary ${
                            pathname === sub.href
                              ? "text-primary bg-secondary/50"
                              : "text-muted-foreground"
                          }`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                /* Tampilan normal jika tidak ada subLinks */
                <Link
                  href={link.href}
                  className={`text-sm font-semibold tracking-wider transition-colors hover:text-primary ${
                    pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground"
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
          className="lg:hidden"
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
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="flex flex-col py-4 px-4 space-y-4">
            {navLinks.map((link) => (
              <div key={link.name} className="flex flex-col">
                {link.subLinks ? (
                  /* --- MULAI TAMBAHAN DROPDOWN MOBILE --- */
                  <>
                    <button
                      onClick={() =>
                        setMobileSubMenuOpen(
                          mobileSubMenuOpen === link.name ? null : link.name,
                        )
                      }
                      className={`flex items-center justify-between text-sm font-semibold tracking-wider ${
                        pathname.startsWith(link.href)
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {link.name}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          mobileSubMenuOpen === link.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Daftar Submenu Mobile (Muncul jika ditekan) */}
                    {mobileSubMenuOpen === link.name && (
                      <div className="flex flex-col pl-4 mt-3 space-y-3 border-l-2 border-border ml-1">
                        {link.subLinks.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-sm font-medium ${
                              pathname === sub.href
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  /* --- AKHIR TAMBAHAN DROPDOWN MOBILE --- */
                  /* Tampilan normal jika tidak ada subLinks */
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-sm font-semibold tracking-wider ${
                      pathname === link.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

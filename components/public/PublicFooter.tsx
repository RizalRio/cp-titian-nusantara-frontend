import Link from "next/link";
import { Leaf, Mail, MapPin } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Branding */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl tracking-tight text-primary">
                Titian Nusantara
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Manusia sebagai pusat, keberagaman sebagai kekuatan. Melangkah
              bersama untuk dampak yang lebih luas dan berkelanjutan.
            </p>
          </div>

          {/* Navigasi Cepat */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground tracking-wide">
              Navigasi
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/tentang-kami"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/layanan"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Ekosistem Layanan
                </Link>
              </li>
              <li>
                <Link
                  href="/kolaborasi"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Kolaborasi
                </Link>
              </li>
              <li>
                <Link
                  href="/jejak-karya"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Jejak Karya
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground tracking-wide">
              Hubungi Kami
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 mt-0.5 text-primary" />
                <span>halo@titiannusantara.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                <span>Jl. Nusantara No. 1, Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Titian Nusantara. Hak Cipta
            Dilindungi.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-primary">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { PublicNavbar } from "@/components/public/PublicNavbar";
import { PublicFooter } from "@/components/public/PublicFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <PublicNavbar />

      {/* flex-1 memastikan konten utama mendorong footer ke bawah layar jika konten sedikit */}
      <main className="flex-1 w-full">{children}</main>

      <PublicFooter />
    </div>
  );
}

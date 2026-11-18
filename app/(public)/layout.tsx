
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({
  children,
}: PublicLayoutProps) {
  return (
    <>
      <Navbar />

      <main className="flex-1">{children}</main>

      <Footer />
    </>
  );
}

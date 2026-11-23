
import type { ReactNode } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({
  children,
}: PublicLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex-1">{children}</main>
      <Footer />
    </>
  );
}

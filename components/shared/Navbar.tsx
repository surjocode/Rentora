
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Wrench,
  Search,
  LogIn,
  UserPlus,
  Menu,
  X,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "All Equipment", href: "/all-equipment" },
  { name: "About Us", href: "/#about" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  // Close mobile menu after navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Active navigation link
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";

    if (href.startsWith("/#")) return false;

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(result.error.message || "Logout failed!");
        return;
      }

      toast.success("Logged out successfully!");

      setIsMenuOpen(false);
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const actionClass =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300";

  return (
    <header className="sticky top-0 z-50 border-b border-[#eee5dc]/80 bg-[#faf7f2]/90 shadow-sm backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#442719] text-orange-400 shadow-md transition-all duration-300 group-hover:-rotate-6 group-hover:bg-orange-600 group-hover:text-white">
            <Wrench size={23} strokeWidth={2.2} />
          </span>

          <span className="text-2xl font-black tracking-tight text-[#442719]">
            Rent<span className="text-orange-600">ora</span>

            <span className="ml-1.5 block text-[9px] font-semibold uppercase tracking-[3px] text-[#947d6d]">
              Rent Smarter. Do More.
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 rounded-2xl border border-[#eee5dc] bg-white/70 p-1.5 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                isActive(link.href)
                  ? "bg-[#442719] text-white shadow-md"
                  : "text-[#493b32] hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <Link
            href="/all-equipment"
            aria-label="Search equipment"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#eee5dc] bg-white text-[#442719] transition-all duration-300 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
          >
            <Search size={19} />
          </Link>

          {!isPending &&
            (user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`${actionClass} bg-[#442719] text-white shadow-md hover:-translate-y-0.5 hover:bg-orange-700`}
                >
                  Dashboard
                  <ArrowRight size={16} />
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className={`${actionClass} border border-red-200 bg-white text-red-600 hover:bg-red-50`}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`${actionClass} border border-[#d9cfc5] bg-white text-[#442719] hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600`}
                >
                  <LogIn size={16} />
                  Login
                </Link>

                <Link
                  href="/register"
                  className={`${actionClass} bg-[#442719] text-white shadow-md hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-lg`}
                >
                  Get Started
                  <ArrowRight size={16} />
                </Link>
              </>
            ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#eee5dc] bg-white text-[#442719] transition-all duration-300 hover:border-orange-300 hover:bg-orange-50 lg:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
          isMenuOpen
            ? "grid-rows-[1fr] border-t border-[#eee5dc]"
            : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-4 bg-[#faf7f2] px-5 py-5 sm:px-6">

            {/* Mobile Links */}
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive(link.href)
                      ? "bg-[#442719] text-white"
                      : "text-[#493b32] hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Actions */}
            {!isPending && (
              <div className="grid grid-cols-2 gap-3 border-t border-[#eee5dc] pt-4">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className={`${actionClass} bg-[#442719] text-white`}
                    >
                      Dashboard
                      <ArrowRight size={16} />
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className={`${actionClass} border border-red-200 bg-white text-red-600 hover:bg-red-50`}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className={`${actionClass} border border-[#d9cfc5] bg-white text-[#442719]`}
                    >
                      <LogIn size={16} />
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className={`${actionClass} bg-[#442719] text-white`}
                    >
                      <UserPlus size={16} />
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}

            {/* Explore Equipment */}
            <Link
              href="/all-equipment"
              onClick={() => setIsMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700 transition hover:bg-orange-100"
            >
              <Search size={17} />
              Explore All Equipment
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

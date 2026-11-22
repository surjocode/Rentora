
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  Sun,
  Moon,
  Search,
  LayoutDashboard,
  LogIn,
  UserPlus,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "next-themes";
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

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { resolvedTheme, setTheme } = useTheme();

  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = Boolean(session?.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isDark = mounted && resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const isActive = (href: string) => {
    if (href.includes("#")) return false;

    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const desktopLinkClass = (href: string) => `
    relative rounded-full px-4 py-2.5 text-sm font-semibold
    transition-all duration-300 ease-in-out
    ${
      isActive(href)
        ? "bg-[#442719] text-white shadow-md dark:bg-[#ea580c]"
        : "text-[#442719] hover:bg-[#ea580c]/10 hover:text-[#ea580c] dark:text-[#f5e9dc] dark:hover:bg-[#ea580c]/15 dark:hover:text-[#fb923c]"
    }
  `;

  const mobileLinkClass = (href: string) => `
    flex items-center justify-between rounded-xl px-4 py-3.5
    text-sm font-semibold transition-all duration-300
    ${
      isActive(href)
        ? "bg-[#442719] text-white shadow-md dark:bg-[#ea580c]"
        : "text-[#442719] hover:bg-[#ea580c]/10 hover:text-[#ea580c] dark:text-[#f5e9dc] dark:hover:bg-white/5 dark:hover:text-[#fb923c]"
    }
  `;

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#442719]/10 bg-[#faf7f2]/90 shadow-sm backdrop-blur-2xl transition-colors duration-300 dark:border-white/10 dark:bg-[#101d19]/90">

      <nav className="mx-auto flex h-[82px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">

        {/* Logo */}
       {/* Logo */}
<Link
  href="/"
  aria-label="Rentora Home"
  className="group flex h-16 w-48 shrink-0 items-center justify-start transition-transform duration-300 hover:scale-[1.03] sm:w-52"
>
  <Image
    src="/images/equipment-logo.png"
    alt="Rentora Logo"
    width={208}
    height={80}
    priority
    className="h-full w-full object-contain object-left"
  />
</Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 rounded-full border border-[#442719]/10 bg-white/70 p-1.5 shadow-sm lg:flex dark:border-white/10 dark:bg-white/[0.04]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={desktopLinkClass(link.href)}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">

          {/* Search */}
          <Link
            href="/all-equipment"
            aria-label="Search equipment"
            title="Search Equipment"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#442719] transition-all duration-300 hover:bg-[#ea580c]/10 hover:text-[#ea580c] dark:text-[#f5e9dc] dark:hover:bg-white/10 dark:hover:text-[#fb923c]"
          >
            <Search size={19} />
          </Link>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              mounted
                ? `Switch to ${isDark ? "light" : "dark"} mode`
                : "Toggle theme"
            }
            title="Toggle Theme"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#442719]/10 bg-white/70 text-[#442719] transition-all duration-300 hover:border-[#ea580c]/30 hover:bg-[#ea580c]/10 hover:text-[#ea580c] dark:border-white/10 dark:bg-white/5 dark:text-[#f5e9dc] dark:hover:bg-white/10 dark:hover:text-[#fb923c]"
          >
            {mounted && isDark ? (
              <Sun size={19} className="transition-transform duration-300" />
            ) : (
              <Moon size={19} className="transition-transform duration-300" />
            )}
          </button>

          {/* Authentication */}
          {!isPending && (
            <>
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="ml-2 flex items-center gap-2 rounded-full bg-[#442719] px-5 py-3 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ea580c] hover:shadow-lg dark:bg-[#ea580c] dark:hover:bg-[#c2410c]"
                >
                  <LayoutDashboard size={17} />
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="ml-2 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold text-[#442719] transition-all duration-300 hover:bg-[#ea580c]/10 hover:text-[#ea580c] dark:text-[#f5e9dc] dark:hover:text-[#fb923c]"
                  >
                    <LogIn size={17} />
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="flex items-center gap-2 rounded-full bg-[#ea580c] px-5 py-3 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#c2410c] hover:shadow-lg"
                  >
                    <UserPlus size={17} />
                    Get Started
                    <ChevronRight size={16} />
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 lg:hidden">

          {/* Mobile Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              mounted
                ? `Switch to ${isDark ? "light" : "dark"} mode`
                : "Toggle theme"
            }
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#442719]/10 bg-white/70 text-[#442719] transition-all duration-300 hover:bg-[#ea580c]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            {mounted && isDark ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#442719] text-white shadow-sm transition-all duration-300 hover:bg-[#ea580c] dark:bg-[#ea580c] dark:hover:bg-[#c2410c]"
          >
            {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
          isMenuOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0">
          <div className="border-t border-[#442719]/10 bg-[#faf7f2] px-4 pb-6 pt-4 dark:border-white/10 dark:bg-[#101d19]">

            {/* Mobile Navigation Links */}
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={mobileLinkClass(link.href)}
                >
                  {link.name}
                  <ChevronRight size={16} className="opacity-50" />
                </Link>
              ))}
            </div>

            {/* Mobile Authentication */}
            {!isPending && (
              <div className="mt-4 border-t border-[#442719]/10 pt-4 dark:border-white/10">
                {isLoggedIn ? (
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#442719] px-5 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-[#ea580c] dark:bg-[#ea580c] dark:hover:bg-[#c2410c]"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="flex items-center justify-center gap-2 rounded-xl border border-[#442719]/15 px-4 py-3.5 text-sm font-bold text-[#442719] transition-all duration-300 hover:bg-[#ea580c]/10 dark:border-white/15 dark:text-white"
                    >
                      <LogIn size={17} />
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={closeMenu}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#ea580c] px-4 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-[#c2410c]"
                    >
                      <UserPlus size={17} />
                      Register
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Explore Equipment */}
            <Link
              href="/all-equipment"
              onClick={closeMenu}
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#ea580c]/10 px-4 py-3.5 text-sm font-bold text-[#ea580c] transition-all duration-300 hover:bg-[#ea580c]/20 dark:bg-[#ea580c]/15 dark:hover:bg-[#ea580c]/25"
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

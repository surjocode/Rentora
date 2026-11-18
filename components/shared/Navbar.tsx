
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Wrench,
  Search,
  ShieldCheck,
  BriefcaseBusiness,
  LogIn,
  UserPlus,
  Menu,
  X,
} from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "All Equipment", href: "/all-equipment" },
  { name: "About Us", href: "/#about" },
  { name: "Contact Us", href: "/#contact" },
  { name: "How It Works", href: "/#how-it-works" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#eee5dc] bg-[#faf7f2]">
      <nav className="mx-auto flex min-h-[68px] max-w-[1440px] items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#442719] text-orange-400 shadow-sm">
            <Wrench size={23} />
          </span>

          <span className="text-xl font-extrabold tracking-tight text-[#442719] sm:text-2xl">
            Rent<span className="text-orange-600">ora</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-5 lg:flex xl:gap-7">
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative whitespace-nowrap text-[13px] font-semibold transition-colors ${
                index === 0
                  ? "text-orange-600 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:bg-orange-600"
                  : "text-[#493b32] hover:text-orange-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden shrink-0 items-center gap-2 xl:flex">

          {/* Demo Admin */}
          <Link
            href="/login?demo=admin"
            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-purple-200 bg-purple-50 px-2.5 py-2 text-xs font-semibold text-purple-700 transition hover:bg-purple-100"
          >
            <ShieldCheck size={14} />
            Demo Admin
          </Link>

          {/* Demo Owner */}
          <Link
            href="/login?demo=owner"
            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
          >
            <BriefcaseBusiness size={14} />
            Demo Owner
          </Link>

          {/* Search */}
          <Link
            href="/all-equipment"
            aria-label="Search equipment"
            className="rounded-lg p-2 text-[#493b32] transition hover:bg-orange-100 hover:text-orange-600"
          >
            <Search size={19} />
          </Link>

          {/* Login */}
          <Link
            href="/login"
            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#d9cfc5] bg-white px-3 py-2 text-xs font-semibold text-[#493b32] transition hover:border-orange-400 hover:text-orange-600"
          >
            <LogIn size={14} />
            Login
          </Link>

          {/* Register */}
          <Link
            href="/register"
            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#442719] px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-700"
          >
            <UserPlus size={14} />
            Register
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="rounded-lg p-2 text-[#442719] transition hover:bg-orange-100 xl:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-[#eee5dc] bg-[#faf7f2] px-5 py-5 xl:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                className="text-sm font-semibold text-[#493b32] transition hover:text-orange-600"
              >
                {link.name}
              </Link>
            ))}

            <div className="grid grid-cols-2 gap-2 border-t border-[#eee5dc] pt-4">
              <Link
                href="/login?demo=admin"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-3 py-2.5 text-xs font-semibold text-purple-700"
              >
                <ShieldCheck size={15} />
                Demo Admin
              </Link>

              <Link
                href="/login?demo=owner"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs font-semibold text-amber-700"
              >
                <BriefcaseBusiness size={15} />
                Demo Owner
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 rounded-lg border border-[#d9cfc5] bg-white px-3 py-2.5 text-sm font-semibold text-[#493b32]"
              >
                <LogIn size={15} />
                Login
              </Link>

              <Link
                href="/register"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#442719] px-3 py-2.5 text-sm font-semibold text-white"
              >
                <UserPlus size={15} />
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

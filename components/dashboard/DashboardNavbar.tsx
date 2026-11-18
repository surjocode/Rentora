
"use client";

import { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  UserRound,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";

interface DashboardNavbarProps {
  onMenuClick: () => void;
}

export default function DashboardNavbar({
  onMenuClick,
}: DashboardNavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#eee4da] bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="rounded-lg p-2 text-[#442719] transition hover:bg-[#f5eee7] lg:hidden"
        >
          <Menu size={24} />
        </button>

        <div>
          <h1 className="text-lg font-bold text-[#442719] sm:text-xl">
            Dashboard
          </h1>

          <p className="hidden text-xs text-[#9b8a7e] sm:block">
            Welcome back to Rentora!
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search */}
        <div className="hidden items-center gap-2 rounded-xl border border-[#eee4da] bg-[#faf7f2] px-3 py-2 md:flex">
          <Search size={18} className="text-[#9b8a7e]" />

          <input
            type="search"
            placeholder="Search anything..."
            className="w-36 bg-transparent text-sm text-[#442719] outline-none placeholder:text-[#b3a69c] lg:w-48"
          />
        </div>

        {/* Notification */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-xl p-2.5 text-[#6b5a50] transition hover:bg-[#f5eee7]"
        >
          <Bell size={21} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ea580c] ring-2 ring-white" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            aria-expanded={profileOpen}
            className="flex items-center gap-2 rounded-xl p-2 transition hover:bg-[#f5eee7]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#442719] text-white">
              <UserRound size={19} />
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-[#442719]">
                My Account
              </p>

              <p className="text-xs text-[#9b8a7e]">
                User
              </p>
            </div>

            <ChevronDown
              size={16}
              className="hidden text-[#9b8a7e] sm:block"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-14 w-48 overflow-hidden rounded-xl border border-[#eee4da] bg-white py-2 shadow-xl">
              <Link
                href="/dashboard/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-[#6b5a50] transition hover:bg-[#faf7f2]"
              >
                <UserRound size={17} />
                My Profile
              </Link>

              <Link
                href="/dashboard/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-[#6b5a50] transition hover:bg-[#faf7f2]"
              >
                <Settings size={17} />
                Settings
              </Link>

              <div className="my-1 border-t border-[#eee4da]" />

              <Link
                href="/login"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={17} />
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

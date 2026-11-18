
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Heart,
  UserRound,
  PlusCircle,
  ClipboardList,
  Users,
  Settings,
  LogOut,
  Wrench,
  X,
} from "lucide-react";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const customerLinks = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Rentals",
    href: "/dashboard/my-rentals",
    icon: Package,
  },
  {
    name: "Favorites",
    href: "/dashboard/favorites",
    icon: Heart,
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: UserRound,
  },
];

const ownerLinks = [
  {
    name: "Add Equipment",
    href: "/dashboard/owner/add-equipment",
    icon: PlusCircle,
  },
  {
    name: "My Equipment",
    href: "/dashboard/owner/my-equipment",
    icon: Package,
  },
  {
    name: "Rental Requests",
    href: "/dashboard/owner/rental-requests",
    icon: ClipboardList,
  },
];

const adminLinks = [
  {
    name: "Manage Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    name: "Manage Equipment",
    href: "/dashboard/admin/equipment",
    icon: Package,
  },
  {
    name: "Manage Rentals",
    href: "/dashboard/admin/rentals",
    icon: ClipboardList,
  },
  {
    name: "Analytics",
    href: "/dashboard/admin/analytics",
    icon: Settings,
  },
];

export default function DashboardSidebar({
  isOpen,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const renderLinks = (
    links: typeof customerLinks
  ) => {
    return links.map((link) => {
      const Icon = link.icon;

      const isActive =
        pathname === link.href;

      return (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClose}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
            isActive
              ? "bg-[#ea580c] text-white shadow-md"
              : "text-[#6b5a50] hover:bg-[#f5eee7] hover:text-[#442719]"
          }`}
        >
          <Icon size={19} />
          <span>{link.name}</span>
        </Link>
      );
    });
  };

  const handleLogout = () => {
    // Authentication logout will be connected later.
    router.push("/login");
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-[#eee4da] bg-[#faf7f2] transition-transform duration-300 lg:sticky lg:top-0 lg:z-20 lg:translate-x-0 ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-[#eee4da] px-6">
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#442719] text-white">
              <Wrench size={22} />
            </div>

            <span className="text-2xl font-extrabold text-[#442719]">
              Rentora
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#442719] hover:bg-[#f0e7dd] lg:hidden"
            aria-label="Close menu"
          >
            <X size={21} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-6">
          <div>
            <p className="mb-3 px-4 text-xs font-bold uppercase tracking-wider text-[#a18d7e]">
              General
            </p>

            <div className="space-y-1">
              {renderLinks(customerLinks)}
            </div>
          </div>

          <div>
            <p className="mb-3 px-4 text-xs font-bold uppercase tracking-wider text-[#a18d7e]">
              Owner Panel
            </p>

            <div className="space-y-1">
              {renderLinks(ownerLinks)}
            </div>
          </div>

          <div>
            <p className="mb-3 px-4 text-xs font-bold uppercase tracking-wider text-[#a18d7e]">
              Admin Panel
            </p>

            <div className="space-y-1">
              {renderLinks(adminLinks)}
            </div>
          </div>
        </nav>

        {/* Logout */}
        <div className="border-t border-[#eee4da] p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={19} />
            Logout
          </button>

          <p className="mt-4 text-center text-xs text-[#a18d7e]">
            © 2026 Rentora
          </p>
        </div>
      </aside>
    </>
  );
}

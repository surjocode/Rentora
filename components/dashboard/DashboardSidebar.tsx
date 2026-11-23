
"use client";

import Link from "next/link";
import Image from "next/image";
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
  X,
  ChartNoAxesCombined,
  ShieldCheck,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DashboardLink {
  name: string;
  href: string;
  icon: LucideIcon;
}

// Customer Sidebar
const customerLinks: DashboardLink[] = [
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

// Owner Sidebar
const ownerLinks: DashboardLink[] = [
  {
    name: "Overview",
    href: "/dashboard/owner",
    icon: LayoutDashboard,
  },
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
  {
    name: "Platform Analytics",
    href: "/dashboard/owner/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    name: "My Profile",
    href: "/dashboard/owner/profile",
    icon: UserRound,
  },
];

// Admin Sidebar
const adminLinks: DashboardLink[] = [
  {
    name: "Dashboard Overview",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
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
    icon: ChartNoAxesCombined,
  },
  {
    name: "My Profile",
    href: "/dashboard/admin/profile",
    icon: UserRound,
  },
];

export default function DashboardSidebar({
  isOpen,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Better Auth session
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const role = user?.role;

  // Role label
  const roleLabel =
    role === "admin"
      ? "Administrator"
      : role === "owner"
        ? "Equipment Owner"
        : role === "renter"
          ? "Customer"
          : "User";

  // Render navigation links
  const renderLinks = (links: DashboardLink[]) => {
    return links.map((link) => {
      const Icon = link.icon;

      const isActive =
        pathname === link.href ||
        (link.href !== "/dashboard" &&
          link.href !== "/dashboard/admin" &&
          link.href !== "/dashboard/owner" &&
          pathname.startsWith(`${link.href}/`)) ||
        (link.href === "/dashboard/admin" &&
          pathname.startsWith("/dashboard/admin") &&
          pathname === "/dashboard/admin") ||
        (link.href === "/dashboard/owner" &&
          pathname === "/dashboard/owner");

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

  // Logout handler
  const handleLogout = async () => {
    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(result.error.message || "Logout failed!");
        return;
      }

      toast.success("Logged out successfully!");

      onClose();
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Loading state
  if (isPending) {
    return (
      <aside className="hidden h-screen w-72 shrink-0 border-r border-[#eee4da] bg-[#faf7f2] lg:block" />
    );
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 shrink-0 flex-col border-r border-[#eee4da] bg-[#faf7f2] transition-transform duration-300 lg:sticky lg:top-0 lg:z-20 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex h-14 shrink-0 items-center justify-end border-b border-[#eee4da] px-4 lg:hidden">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#442719] hover:bg-[#f0e7dd]"
            aria-label="Close menu"
          >
            <X size={21} />
          </button>
        </div>

        {/* Logged-in User Profile */}
        <div className="shrink-0 border-b border-[#eee4da] p-5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#ead7c5] bg-[#f0e7dd]">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User profile"}
                  fill
                  sizes="56px"
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <UserRound size={27} className="text-[#8b5e43]" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-bold text-[#442719]">
                {user?.name || "User"}
              </h3>

              <p className="truncate text-xs text-[#927d6d]">
                {user?.email || "No email available"}
              </p>

              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#f0e7dd] px-2 py-1 text-[10px] font-semibold text-[#8b5e43]">
                {role === "admin" ? (
                  <ShieldCheck size={11} />
                ) : (
                  <UserRound size={11} />
                )}
                {roleLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-6">
          {/* Customer Sidebar */}
          {role === "renter" && (
            <div>
              <p className="mb-3 px-4 text-xs font-bold uppercase tracking-wider text-[#a18d7e]">
                Customer Panel
              </p>

              <div className="space-y-1">
                {renderLinks(customerLinks)}
              </div>
            </div>
          )}

          {/* Owner Sidebar */}
          {role === "owner" && (
            <div>
              <p className="mb-3 px-4 text-xs font-bold uppercase tracking-wider text-[#a18d7e]">
                Owner Panel
              </p>

              <div className="space-y-1">
                {renderLinks(ownerLinks)}
              </div>
            </div>
          )}

          {/* Admin Sidebar */}
          {role === "admin" && (
            <div>
              <p className="mb-3 px-4 text-xs font-bold uppercase tracking-wider text-[#a18d7e]">
                Admin Panel
              </p>

              <div className="space-y-1">
                {renderLinks(adminLinks)}
              </div>
            </div>
          )}
        </nav>

        {/* Logout */}
        <div className="shrink-0 border-t border-[#eee4da] p-4">
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

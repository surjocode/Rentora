
import Link from "next/link";
import {
  Package,
  Heart,
  CalendarCheck,
  Clock,
  ArrowUpRight,
  PlusCircle,
  ClipboardList,
  UserRound,
} from "lucide-react";

const stats = [
  {
    title: "Total Rentals",
    value: "0",
    description: "All your rental bookings",
    icon: Package,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Active Rentals",
    value: "0",
    description: "Currently rented equipment",
    icon: CalendarCheck,
    color: "bg-green-50 text-green-600",
  },
  {
    title: "Favorites",
    value: "0",
    description: "Saved equipment items",
    icon: Heart,
    color: "bg-pink-50 text-pink-600",
  },
  {
    title: "Pending Requests",
    value: "0",
    description: "Waiting for confirmation",
    icon: Clock,
    color: "bg-orange-50 text-orange-600",
  },
];

const quickActions = [
  {
    title: "Explore Equipment",
    description: "Find equipment for your next project.",
    href: "/all-equipment",
    icon: Package,
  },
  {
    title: "My Rentals",
    description: "View and manage your bookings.",
    href: "/dashboard/my-rentals",
    icon: ClipboardList,
  },
  {
    title: "My Favorites",
    description: "Check your saved equipment.",
    href: "/dashboard/favorites",
    icon: Heart,
  },
  {
    title: "My Profile",
    description: "Manage your account information.",
    href: "/dashboard/profile",
    icon: UserRound,
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome Section */}
      <section className="flex flex-col justify-between gap-5 rounded-2xl bg-[#442719] p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <div>
          <p className="mb-2 text-sm font-medium text-orange-300">
            RENTORA DASHBOARD
          </p>

          <h2 className="text-2xl font-bold sm:text-3xl">
            Welcome to Your Dashboard!
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
            Manage your rentals, explore equipment, and keep
            everything organized in one place.
          </p>
        </div>

        <Link
          href="/all-equipment"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#ea580c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          Explore Equipment
          <ArrowUpRight size={18} />
        </Link>
      </section>

      {/* Statistics */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-[#442719]">
            Overview
          </h2>

          <p className="mt-1 text-sm text-[#9b8a7e]">
            Your rental activity at a glance.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-[#eee4da] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    <Icon size={23} />
                  </div>

                  <ArrowUpRight
                    size={19}
                    className="text-[#c5b8ad]"
                  />
                </div>

                <p className="mt-5 text-sm font-medium text-[#9b8a7e]">
                  {stat.title}
                </p>

                <h3 className="mt-1 text-3xl font-bold text-[#442719]">
                  {stat.value}
                </h3>

                <p className="mt-2 text-xs text-[#a18d7e]">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-[#442719]">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-[#9b8a7e]">
            Quickly access your important pages.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group rounded-2xl border border-[#eee4da] bg-white p-5 transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff0e5] text-[#ea580c] transition group-hover:bg-[#ea580c] group-hover:text-white">
                  <Icon size={22} />
                </div>

                <h3 className="mt-4 font-bold text-[#442719]">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#9b8a7e]">
                  {action.description}
                </p>

                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#ea580c]">
                  Open page
                  <ArrowUpRight size={16} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="rounded-2xl border border-[#eee4da] bg-white p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-[#442719]">
              Recent Activities
            </h2>

            <p className="mt-1 text-sm text-[#9b8a7e]">
              Your latest rental activities will appear here.
            </p>
          </div>

          <Link
            href="/dashboard/my-rentals"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#ea580c] hover:text-orange-700"
          >
            View All
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#faf7f2] text-[#a18d7e]">
            <Package size={30} />
          </div>

          <h3 className="mt-4 font-semibold text-[#442719]">
            No Activities Yet
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-[#9b8a7e]">
            Your recent bookings and rental activities will
            appear here once you start using Rentora.
          </p>

          <Link
            href="/all-equipment"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#ea580c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
          >
            <PlusCircle size={18} />
            Browse Equipment
          </Link>
        </div>
      </section>
    </div>
  );
}

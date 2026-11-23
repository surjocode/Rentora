
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  CheckCircle,
  Clock,
  XCircle,
  ClipboardList,
  PlusCircle,
  ArrowRight,
  RefreshCw,
  LayoutDashboard,
} from "lucide-react";

import { getMyEquipment, type Equipment } from "@/services/equipment.service";
import { getOwnerBookings, type Rental } from "@/services/rental.service";

// ==========================================
// TYPES
// ==========================================

interface DashboardStats {
  totalEquipment: number;
  approvedEquipment: number;
  pendingEquipment: number;
  rejectedEquipment: number;
  totalRentals: number;
}

const initialStats: DashboardStats = {
  totalEquipment: 0,
  approvedEquipment: 0,
  pendingEquipment: 0,
  rejectedEquipment: 0,
  totalRentals: 0,
};

// ==========================================
// OWNER DASHBOARD
// ==========================================

export default function OwnerDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH DASHBOARD DATA
  // ==========================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [equipmentResponse, rentalsResponse] = await Promise.all([
        getMyEquipment(),
        getOwnerBookings(),
      ]);

      // Equipment API returns a response wrapper:
      // { success, message, data }

      const equipment: Equipment[] =
        equipmentResponse.success &&
        Array.isArray(equipmentResponse.data)
          ? equipmentResponse.data
          : [];

      // Rental API returns an array of rentals.

      const rentals: Rental[] = Array.isArray(rentalsResponse)
        ? rentalsResponse
        : [];

      // Calculate dashboard statistics.

      setStats({
        totalEquipment: equipment.length,

        approvedEquipment: equipment.filter(
          (item) => item.status === "approved"
        ).length,

        pendingEquipment: equipment.filter(
          (item) => item.status === "pending"
        ).length,

        rejectedEquipment: equipment.filter(
          (item) => item.status === "rejected"
        ).length,

        totalRentals: rentals.length,
      });
    } catch (err) {
      console.error("Owner dashboard error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL DATA LOAD
  // ==========================================

  useEffect(() => {
    void fetchDashboardData();
  }, []);

  // ==========================================
  // STATISTICS CARDS
  // ==========================================

  const statCards = [
    {
      title: "Total Equipment",
      value: stats.totalEquipment,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Approved Equipment",
      value: stats.approvedEquipment,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Pending Equipment",
      value: stats.pendingEquipment,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      title: "Rejected Equipment",
      value: stats.rejectedEquipment,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      title: "Total Rentals",
      value: stats.totalRentals,
      icon: ClipboardList,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  // ==========================================
  // QUICK ACTIONS
  // ==========================================

  const quickActions = [
    {
      title: "Add Equipment",
      description: "List new equipment for rental.",
      href: "/dashboard/owner/add-equipment",
      icon: PlusCircle,
    },
    {
      title: "My Equipment",
      description: "Manage your equipment listings.",
      href: "/dashboard/owner/my-equipment",
      icon: Package,
    },
    {
      title: "My Equipment Rentals",
      description: "View bookings for your equipment.",
      href: "/dashboard/owner/rental-requests",
      icon: ClipboardList,
    },
  ];

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen space-y-8 bg-orange-50/30 p-4 sm:p-6 lg:p-8">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-orange-600">
            <LayoutDashboard size={17} />
            Owner Panel
          </div>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Owner Dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Manage your equipment and monitor rental activities.
          </p>
        </div>

        <button
          onClick={() => void fetchDashboardData()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-orange-200 bg-white px-4 py-2.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Statistics */}

      <section>
        <h2 className="mb-4 text-lg font-bold text-gray-900">
          Overview
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {card.title}
                    </p>

                    <p className="mt-3 text-3xl font-bold text-gray-900">
                      {loading ? "..." : card.value}
                    </p>
                  </div>

                  <div className={`rounded-xl p-3 ${card.bg}`}>
                    <Icon size={25} className={card.color} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Equipment Approval Information */}

      <section className="rounded-2xl border border-orange-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">
          Equipment Approval Status
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          Newly added equipment must be reviewed by an administrator.
          Only approved equipment will be available for customers to rent.
        </p>

        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-green-100 px-3 py-1 font-medium text-green-700">
            Approved
          </span>

          <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-700">
            Pending
          </span>

          <span className="rounded-full bg-red-100 px-3 py-1 font-medium text-red-700">
            Rejected
          </span>
        </div>
      </section>

      {/* Quick Actions */}

      <section>
        <h2 className="mb-4 text-lg font-bold text-gray-900">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group flex items-center justify-between rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition hover:border-orange-300 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-orange-100 p-3 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">
                    <Icon size={24} />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">
                      {action.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {action.description}
                    </p>
                  </div>
                </div>

                <ArrowRight
                  size={20}
                  className="shrink-0 text-gray-400 transition group-hover:translate-x-1 group-hover:text-orange-600"
                />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

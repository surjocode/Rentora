
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Users,
  Package,
  ClipboardList,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
  TrendingUp,
  RefreshCw,
  Loader2,
  AlertCircle,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";

import {
  getAllUsers,
  getAllAdminEquipment,
  getAllAdminRentals,
  type AdminRental,
} from "@/services/admin.service";

import type { Equipment } from "@/services/equipment.service";
import type { User } from "@/services/user.service";

export default function AdminDashboardPage() {
  const { loading: authLoading, isAuthenticated, isAdmin } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [rentals, setRentals] = useState<AdminRental[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [userResponse, equipmentResponse, rentalResponse] =
        await Promise.all([
          getAllUsers(),
          getAllAdminEquipment(),
          getAllAdminRentals(),
        ]);

      if (!userResponse.success) {
        throw new Error(userResponse.message || "Failed to load users.");
      }

      if (!equipmentResponse.success) {
        throw new Error(
          equipmentResponse.message || "Failed to load equipment.",
        );
      }

      if (!rentalResponse.success) {
        throw new Error(rentalResponse.message || "Failed to load rentals.");
      }

      setUsers(
        Array.isArray(userResponse.data) ? userResponse.data : [],
      );

      setEquipment(
        Array.isArray(equipmentResponse.data)
          ? equipmentResponse.data
          : [],
      );

      setRentals(
        Array.isArray(rentalResponse.data) ? rentalResponse.data : [],
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated && isAdmin) {
      void fetchDashboardData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [authLoading, isAuthenticated, isAdmin, fetchDashboardData]);

  const stats = useMemo(() => {
    const totalUsers = users.length;

    const totalOwners = users.filter(
      (user) => user.role === "owner",
    ).length;

    const totalRenters = users.filter(
      (user) => user.role === "renter",
    ).length;

    const totalEquipment = equipment.length;

    const approvedEquipment = equipment.filter(
      (item) => item.status === "approved",
    ).length;

    const pendingEquipment = equipment.filter(
      (item) => item.status === "pending",
    ).length;

    const rejectedEquipment = equipment.filter(
      (item) => item.status === "rejected",
    ).length;

    const totalRentals = rentals.length;

    const confirmedRentals = rentals.filter(
      (rental) => rental.bookingStatus === "confirmed",
    ).length;

    const completedRentals = rentals.filter(
      (rental) => rental.bookingStatus === "completed",
    ).length;

    const pendingPayments = rentals.filter(
      (rental) => rental.paymentStatus === "pending",
    ).length;

    const paidRentals = rentals.filter(
      (rental) => rental.paymentStatus === "paid",
    ).length;

    const paidRevenue = rentals
      .filter((rental) => rental.paymentStatus === "paid")
      .reduce((total, rental) => total + rental.totalAmount, 0);

    return {
      totalUsers,
      totalOwners,
      totalRenters,
      totalEquipment,
      approvedEquipment,
      pendingEquipment,
      rejectedEquipment,
      totalRentals,
      confirmedRentals,
      completedRentals,
      pendingPayments,
      paidRentals,
      paidRevenue,
    };
  }, [users, equipment, rentals]);

  const recentRentals = useMemo(() => {
    return [...rentals]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
  }, [rentals]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-9 w-9 animate-spin text-orange-600" />
          <p className="mt-3 text-sm text-gray-500">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <ShieldCheck className="mx-auto h-10 w-10 text-red-500" />

        <h2 className="mt-3 text-lg font-bold text-gray-900">
          Access Denied
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Only administrators can access this dashboard.
        </p>

        <Link
          href="/login"
          className="mt-5 inline-flex rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: `${stats.totalOwners} owners · ${stats.totalRenters} renters`,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Equipment",
      value: stats.totalEquipment,
      description: "All equipment listings",
      icon: Package,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Pending Approvals",
      value: stats.pendingEquipment,
      description: "Waiting for admin review",
      icon: Clock,
      color: "bg-amber-100 text-amber-600",
    },
    {
      title: "Total Rentals",
      value: stats.totalRentals,
      description: "All customer bookings",
      icon: ClipboardList,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      title: "Confirmed Rentals",
      value: stats.confirmedRentals,
      description: "Confirmed bookings",
      icon: CheckCircle,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Completed Rentals",
      value: stats.completedRentals,
      description: "Completed bookings",
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Paid Rentals",
      value: stats.paidRentals,
      description: "Payments marked as paid",
      icon: CreditCard,
      color: "bg-teal-100 text-teal-600",
    },
    {
      title: "Pending Payments",
      value: stats.pendingPayments,
      description: "Awaiting payment",
      icon: Clock,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const equipmentStatus = [
    {
      label: "Approved",
      value: stats.approvedEquipment,
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
    },
    {
      label: "Pending",
      value: stats.pendingEquipment,
      color: "bg-amber-500",
      textColor: "text-amber-600",
    },
    {
      label: "Rejected",
      value: stats.rejectedEquipment,
      color: "bg-red-500",
      textColor: "text-red-600",
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-orange-600">
            Rentora Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Monitor users, equipment, rentals and platform performance.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void fetchDashboardData()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh Data
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Revenue */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-gradient-to-br from-orange-600 to-orange-700 p-6 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-100">Paid Revenue</p>

              <h2 className="mt-3 text-3xl font-bold">
                ৳{stats.paidRevenue.toLocaleString("en-BD")}
              </h2>

              <p className="mt-2 text-xs text-orange-100">
                Revenue from paid bookings only
              </p>
            </div>

            <div className="rounded-xl bg-white/15 p-3">
              <TrendingUp className="h-7 w-7" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Platform Equipment</p>

              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                {stats.totalEquipment.toLocaleString()}
              </h2>

              <p className="mt-2 text-xs text-gray-500">
                {stats.approvedEquipment} approved listings
              </p>
            </div>

            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <Package className="h-7 w-7" />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Platform Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Key statistics from your platform.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>

                    <h3 className="mt-3 text-3xl font-bold text-gray-900">
                      {stat.value.toLocaleString()}
                    </h3>
                  </div>

                  <div className={`rounded-xl p-3 ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-3 text-xs text-gray-500">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Equipment Status */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">
          Equipment Moderation
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Overview of equipment approval statuses.
        </p>

        <div className="mt-6 space-y-5">
          {equipmentStatus.map((item) => {
            const percentage = stats.totalEquipment
              ? (item.value / stats.totalEquipment) * 100
              : 0;

            return (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between">
                  <span className={`text-sm font-semibold ${item.textColor}`}>
                    {item.label}
                  </span>

                  <span className="text-sm font-bold text-gray-700">
                    {item.value} ({percentage.toFixed(1)}%)
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <Link
          href="/dashboard/admin/equipment"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
        >
          Manage Equipment
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Recent Rentals */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Recent Rentals
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest customer booking activity.
            </p>
          </div>

          <Link
            href="/dashboard/admin/rentals"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {recentRentals.length === 0 ? (
          <div className="p-10 text-center">
            <ClipboardList className="mx-auto h-9 w-9 text-gray-300" />

            <p className="mt-3 text-sm font-medium text-gray-600">
              No rentals found yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Equipment</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Booking</th>
                  <th className="px-6 py-4 font-semibold">Payment</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {recentRentals.map((rental) => (
                  <tr key={rental._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {rental.equipmentName}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {rental._id}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {rental.customerEmail}
                    </td>

                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ৳{rental.totalAmount.toLocaleString("en-BD")}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                        {rental.bookingStatus.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          rental.paymentStatus === "paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : rental.paymentStatus === "failed"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {rental.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
        <h2 className="text-lg font-bold text-gray-900">
          Quick Actions
        </h2>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/dashboard/admin/users"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100"
          >
            <Users className="h-4 w-4" />
            Manage Users
          </Link>

          <Link
            href="/dashboard/admin/equipment"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100"
          >
            <Package className="h-4 w-4" />
            Manage Equipment
          </Link>

          <Link
            href="/dashboard/admin/rentals"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
          >
            <ClipboardList className="h-4 w-4" />
            Manage Rentals
          </Link>
        </div>
      </section>
    </div>
  );
}

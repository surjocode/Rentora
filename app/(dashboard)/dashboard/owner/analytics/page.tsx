
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle,
  Clock,
  CreditCard,
  Loader2,
  Package,
  RefreshCw,
  TrendingUp,
  XCircle,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import {
  getMyEquipment,
  type Equipment,
} from "@/services/equipment.service";
import {
  getOwnerBookings,
  type Rental,
} from "@/services/rental.service";

export default function OwnerAnalyticsPage() {
  const { user, loading: authLoading, isAuthenticated, isOwner } = useAuth();

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [equipmentResponse, rentalResponse] = await Promise.all([
        getMyEquipment(),
        getOwnerBookings(),
      ]);

      if (equipmentResponse.success && Array.isArray(equipmentResponse.data)) {
        setEquipment(equipmentResponse.data);
      } else {
        setEquipment([]);
      }

      if (rentalResponse.success && Array.isArray(rentalResponse.data)) {
        setRentals(rentalResponse.data);
      } else {
        setRentals([]);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load analytics data.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated && isOwner) {
      void fetchAnalytics();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [authLoading, isAuthenticated, isOwner, fetchAnalytics]);

  const stats = useMemo(() => {
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

    const pendingPayment = rentals.filter(
      (rental) => rental.paymentStatus === "pending",
    ).length;

    const paidRentals = rentals.filter(
      (rental) => rental.paymentStatus === "paid",
    ).length;

    const totalBookingValue = rentals.reduce(
      (total, rental) => total + rental.totalAmount,
      0,
    );

    const paidRevenue = rentals
      .filter((rental) => rental.paymentStatus === "paid")
      .reduce((total, rental) => total + rental.totalAmount, 0);

    return {
      totalEquipment,
      approvedEquipment,
      pendingEquipment,
      rejectedEquipment,
      totalRentals,
      confirmedRentals,
      completedRentals,
      pendingPayment,
      paidRentals,
      totalBookingValue,
      paidRevenue,
    };
  }, [equipment, rentals]);

  const monthlyStats = useMemo(() => {
    const months: {
      label: string;
      bookings: number;
      revenue: number;
    }[] = [];

    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

      months.push({
        label: date.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        }),
        bookings: 0,
        revenue: 0,
      });
    }

    rentals.forEach((rental) => {
      const rentalDate = new Date(rental.createdAt);

      const monthIndex = months.findIndex((_, index) => {
        const targetDate = new Date(
          now.getFullYear(),
          now.getMonth() - (5 - index),
          1,
        );

        return (
          rentalDate.getMonth() === targetDate.getMonth() &&
          rentalDate.getFullYear() === targetDate.getFullYear()
        );
      });

      if (monthIndex !== -1) {
        months[monthIndex].bookings += 1;

        if (rental.paymentStatus === "paid") {
          months[monthIndex].revenue += rental.totalAmount;
        }
      }
    });

    return months;
  }, [rentals]);

  const maxBookings = Math.max(
    ...monthlyStats.map((month) => month.bookings),
    1,
  );

  const maxRevenue = Math.max(
    ...monthlyStats.map((month) => month.revenue),
    1,
  );

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-9 w-9 animate-spin text-emerald-600" />
          <p className="mt-3 text-sm text-gray-500">
            Loading your analytics...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isOwner) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
        <h2 className="mt-3 text-lg font-bold text-gray-900">
          Access Denied
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Only equipment owners can access this page.
        </p>
        <Link
          href="/login"
          className="mt-5 inline-flex rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Equipment",
      value: stats.totalEquipment,
      icon: Package,
      color: "bg-blue-100 text-blue-600",
      description: "All your listings",
    },
    {
      title: "Approved Equipment",
      value: stats.approvedEquipment,
      icon: CheckCircle,
      color: "bg-emerald-100 text-emerald-600",
      description: "Available for customers",
    },
    {
      title: "Pending Equipment",
      value: stats.pendingEquipment,
      icon: Clock,
      color: "bg-amber-100 text-amber-600",
      description: "Waiting for approval",
    },
    {
      title: "Rejected Equipment",
      value: stats.rejectedEquipment,
      icon: XCircle,
      color: "bg-red-100 text-red-600",
      description: "Needs your attention",
    },
    {
      title: "Total Rentals",
      value: stats.totalRentals,
      icon: CalendarDays,
      color: "bg-purple-100 text-purple-600",
      description: "All customer bookings",
    },
    {
      title: "Confirmed Rentals",
      value: stats.confirmedRentals,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
      description: "Confirmed bookings",
    },
    {
      title: "Completed Rentals",
      value: stats.completedRentals,
      icon: Activity,
      color: "bg-indigo-100 text-indigo-600",
      description: "Successfully completed",
    },
    {
      title: "Paid Rentals",
      value: stats.paidRentals,
      icon: CreditCard,
      color: "bg-teal-100 text-teal-600",
      description: "Payments marked as paid",
    },
  ];

  return (
    <div className="space-y-7 pb-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-emerald-600">
            Owner Dashboard
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            Platform Analytics
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Monitor your equipment performance, bookings and earnings.
          </p>
        </div>

        <button
          onClick={() => void fetchAnalytics()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Revenue Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 p-6 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-100">Paid Revenue</p>
              <h2 className="mt-3 text-3xl font-bold">
                ৳{stats.paidRevenue.toLocaleString("en-BD")}
              </h2>
              <p className="mt-2 text-xs text-emerald-100">
                From paid bookings only
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
              <p className="text-sm text-gray-500">Total Booking Value</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                ৳{stats.totalBookingValue.toLocaleString("en-BD")}
              </h2>
              <p className="mt-2 text-xs text-gray-500">
                Includes all booking statuses
              </p>
            </div>
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <CreditCard className="h-7 w-7" />
            </div>
          </div>
        </div>
      </div>

      {/* Equipment and Rental Statistics */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Performance Overview
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Your equipment and rental statistics.
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

      {/* Payment Overview */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">
          Payment Overview
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Current payment status of your bookings.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Paid Payments
              </span>
              <span className="text-sm font-bold text-emerald-600">
                {stats.paidRentals}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{
                  width: `${
                    stats.totalRentals
                      ? (stats.paidRentals / stats.totalRentals) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Pending Payments
              </span>
              <span className="text-sm font-bold text-amber-600">
                {stats.pendingPayment}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-amber-500"
                style={{
                  width: `${
                    stats.totalRentals
                      ? (stats.pendingPayment / stats.totalRentals) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Monthly Booking Chart */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900">
            Monthly Booking Statistics
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Booking activity over the last six months.
          </p>
        </div>

        <div className="flex h-56 items-end justify-between gap-3 border-b border-gray-100 pb-2">
          {monthlyStats.map((month) => (
            <div
              key={month.label}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <span className="text-xs font-semibold text-gray-600">
                {month.bookings}
              </span>

              <div className="flex h-40 w-full items-end justify-center">
                <div
                  className="w-full max-w-12 rounded-t-lg bg-emerald-500 transition-all"
                  style={{
                    height: `${
                      month.bookings
                        ? Math.max(
                            (month.bookings / maxBookings) * 100,
                            5,
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>

              <span className="text-xs text-gray-500">{month.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Monthly Revenue */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">
          Monthly Paid Revenue
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Revenue from paid bookings during the last six months.
        </p>

        <div className="mt-6 space-y-5">
          {monthlyStats.map((month) => (
            <div key={month.label}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-gray-600">
                  {month.label}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  ৳{month.revenue.toLocaleString("en-BD")}
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{
                    width: `${
                      month.revenue
                        ? (month.revenue / maxRevenue) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
        <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/dashboard/owner/my-equipment"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100"
          >
            <Package className="h-4 w-4" />
            Manage Equipment
          </Link>

          <Link
            href="/dashboard/owner/rental-requests"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100"
          >
            <CalendarDays className="h-4 w-4" />
            View Rentals
          </Link>

          <Link
            href="/dashboard/owner/add-equipment"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <ArrowUpRight className="h-4 w-4" />
            Add Equipment
          </Link>
        </div>
      </section>
    </div>
  );
}

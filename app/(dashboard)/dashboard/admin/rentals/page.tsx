
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ClipboardList,
  Search,
  CalendarDays,
  Filter,
  UserRound,
  Package,
  Eye,
  ShieldCheck,
  X,
  RefreshCw,
  Loader2,
  AlertCircle,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  MapPin,
  Phone,
  Hash,
  Wallet,
} from "lucide-react";

import {
  getAllAdminRentals,
  type AdminRental,
  type AdminBookingStatus,
  type AdminPaymentStatus,
} from "@/services/admin.service";

type DateFilter = "All" | "Upcoming" | "Past";

export default function ManageRentalsPage() {
  const [rentals, setRentals] = useState<AdminRental[]>([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("All");
  const [selectedRental, setSelectedRental] =
    useState<AdminRental | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH RENTALS
  // ==========================================

  const fetchRentals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllAdminRentals();

      if (!response.success) {
        throw new Error(
          response.message || "Failed to fetch rental records."
        );
      }

      setRentals(response.data);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while fetching rentals."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRentals();
  }, [fetchRentals]);

  // ==========================================
  // FORMATTERS
  // ==========================================

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    return parsedDate.toLocaleDateString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (amount: number) => {
    return `৳${Number(amount || 0).toLocaleString("en-BD")}`;
  };

  const getBookingStatusLabel = (
    status: AdminBookingStatus
  ) => {
    const labels: Record<AdminBookingStatus, string> = {
      pending_payment: "Awaiting Payment",
      confirmed: "Confirmed",
      completed: "Completed",
      cancelled: "Cancelled",
    };

    return labels[status] ?? status;
  };

  const getBookingStatusClass = (
    status: AdminBookingStatus
  ) => {
    const classes: Record<AdminBookingStatus, string> = {
      pending_payment: "bg-amber-50 text-amber-700 ring-amber-200",
      confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      completed: "bg-blue-50 text-blue-700 ring-blue-200",
      cancelled: "bg-red-50 text-red-700 ring-red-200",
    };

    return classes[status] ?? "bg-gray-100 text-gray-700 ring-gray-200";
  };

  const getPaymentStatusLabel = (
    status: AdminPaymentStatus
  ) => {
    const labels: Record<AdminPaymentStatus, string> = {
      pending: "Pending",
      paid: "Paid",
      failed: "Failed",
      refunded: "Refunded",
    };

    return labels[status] ?? status;
  };

  const getPaymentStatusClass = (
    status: AdminPaymentStatus
  ) => {
    const classes: Record<AdminPaymentStatus, string> = {
      pending: "bg-amber-50 text-amber-700 ring-amber-200",
      paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      failed: "bg-red-50 text-red-700 ring-red-200",
      refunded: "bg-purple-50 text-purple-700 ring-purple-200",
    };

    return classes[status] ?? "bg-gray-100 text-gray-700 ring-gray-200";
  };

  // ==========================================
  // SUMMARY CALCULATIONS
  // ==========================================

  const totalBookingValue = useMemo(
    () =>
      rentals.reduce(
        (total, rental) => total + rental.totalAmount,
        0
      ),
    [rentals]
  );

  const paidRevenue = useMemo(
    () =>
      rentals
        .filter((rental) => rental.paymentStatus === "paid")
        .reduce(
          (total, rental) => total + rental.totalAmount,
          0
        ),
    [rentals]
  );

  const totalQuantity = useMemo(
    () =>
      rentals.reduce(
        (total, rental) => total + rental.quantity,
        0
      ),
    [rentals]
  );

  const upcomingRentals = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return rentals.filter((rental) => {
      const endDate = new Date(rental.endDate);

      return (
        rental.bookingStatus !== "cancelled" &&
        !Number.isNaN(endDate.getTime()) &&
        endDate >= today
      );
    }).length;
  }, [rentals]);

  const confirmedRentals = rentals.filter(
    (rental) => rental.bookingStatus === "confirmed"
  ).length;

  const pendingPayments = rentals.filter(
    (rental) => rental.paymentStatus === "pending"
  ).length;

  const paidPayments = rentals.filter(
    (rental) => rental.paymentStatus === "paid"
  ).length;

  // ==========================================
  // SEARCH AND FILTER
  // ==========================================

  const filteredRentals = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return rentals.filter((rental) => {
      const matchesSearch =
        rental.customerEmail.toLowerCase().includes(searchValue) ||
        rental.ownerEmail.toLowerCase().includes(searchValue) ||
        rental.equipmentName.toLowerCase().includes(searchValue) ||
        rental._id.toLowerCase().includes(searchValue);

      const endDate = new Date(rental.endDate);

      let matchesDate = true;

      if (dateFilter === "Upcoming") {
        matchesDate =
          !Number.isNaN(endDate.getTime()) &&
          endDate >= today &&
          rental.bookingStatus !== "cancelled";
      }

      if (dateFilter === "Past") {
        matchesDate =
          !Number.isNaN(endDate.getTime()) &&
          endDate < today;
      }

      return matchesSearch && matchesDate;
    });
  }, [rentals, search, dateFilter]);

  // ==========================================
  // SUMMARY CARDS
  // ==========================================

  const summaryCards = [
    {
      title: "Total Rentals",
      value: rentals.length,
      description: "All booking records",
      icon: ClipboardList,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      accent: "bg-blue-500",
    },
    {
      title: "Booking Value",
      value: formatPrice(totalBookingValue),
      description: "Total rental amount",
      icon: Wallet,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      accent: "bg-orange-500",
    },
    {
      title: "Paid Revenue",
      value: formatPrice(paidRevenue),
      description: `${paidPayments} paid booking(s)`,
      icon: TrendingUp,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      accent: "bg-emerald-500",
    },
    {
      title: "Upcoming Rentals",
      value: upcomingRentals,
      description: "Active and future rentals",
      icon: CalendarDays,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      accent: "bg-purple-500",
    },
  ];

  // ==========================================
  // STATUS BADGE
  // ==========================================

  const BookingBadge = ({
    status,
  }: {
    status: AdminBookingStatus;
  }) => (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${getBookingStatusClass(status)}`}
    >
      {status === "confirmed" ? (
        <CheckCircle size={13} />
      ) : status === "cancelled" ? (
        <XCircle size={13} />
      ) : (
        <Clock size={13} />
      )}

      {getBookingStatusLabel(status)}
    </span>
  );

  const PaymentBadge = ({
    status,
  }: {
    status: AdminPaymentStatus;
  }) => (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${getPaymentStatusClass(status)}`}
    >
      {status === "paid" ? (
        <CheckCircle size={13} />
      ) : status === "failed" ? (
        <XCircle size={13} />
      ) : (
        <Clock size={13} />
      )}

      {getPaymentStatusLabel(status)}
    </span>
  );

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-10">

      {/* PAGE HEADER */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#442719] via-[#603b27] to-[#8b4a26] p-6 text-white shadow-lg shadow-orange-950/10 sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-28 right-32 h-72 w-72 rounded-full bg-orange-300/10" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-orange-200">
              <ShieldCheck size={17} />
              ADMINISTRATION
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Manage Rentals
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-orange-100/80">
              Monitor customer bookings, equipment rental activity,
              and payment records from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void fetchRentals()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60 sm:self-center"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh Data
          </button>
        </div>

        <div className="relative mt-7 flex flex-wrap gap-3">
          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-xs text-orange-100/70">
              Confirmed Bookings
            </p>
            <p className="mt-1 text-xl font-bold">
              {confirmedRentals}
            </p>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-xs text-orange-100/70">
              Pending Payments
            </p>
            <p className="mt-1 text-xl font-bold">
              {pendingPayments}
            </p>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-xs text-orange-100/70">
              Equipment Units Booked
            </p>
            <p className="mt-1 text-xl font-bold">
              {totalQuantity}
            </p>
          </div>
        </div>
      </section>

      {/* SUMMARY CARDS */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-2xl border border-[#eee4da] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`absolute left-0 top-0 h-full w-1 ${item.accent}`}
              />

              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-[#9b8a7e]">
                  {item.title}
                </p>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}
                >
                  <Icon size={22} />
                </div>
              </div>

              <h2 className="mt-5 break-words text-2xl font-bold text-[#442719] sm:text-3xl">
                {item.value}
              </h2>

              <p className="mt-2 text-xs text-[#a18d7e]">
                {item.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* EQUIPMENT UNITS */}

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-[#eee4da] bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <Package size={23} />
          </div>

          <div>
            <p className="text-xs text-[#9b8a7e]">
              Total Units Booked
            </p>
            <h3 className="mt-1 text-xl font-bold text-[#442719]">
              {totalQuantity}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-[#eee4da] bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle size={23} />
          </div>

          <div>
            <p className="text-xs text-[#9b8a7e]">
              Confirmed Bookings
            </p>
            <h3 className="mt-1 text-xl font-bold text-[#442719]">
              {confirmedRentals}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-[#eee4da] bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <CreditCard size={23} />
          </div>

          <div>
            <p className="text-xs text-[#9b8a7e]">
              Successful Payments
            </p>
            <h3 className="mt-1 text-xl font-bold text-[#442719]">
              {paidPayments}
            </h3>
          </div>
        </div>
      </section>

      {/* SEARCH AND FILTER */}

      <section className="rounded-2xl border border-[#eee4da] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#442719]">
              All Rental Records
            </h2>

            <p className="mt-1 text-sm text-[#9b8a7e]">
              Search, filter and review all customer bookings.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-2 rounded-xl border border-[#eee4da] bg-[#faf7f2] px-3.5 py-3 transition focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100">
              <Search
                size={18}
                className="shrink-0 text-[#9b8a7e]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search email, equipment, ID..."
                aria-label="Search rentals"
                className="w-full min-w-0 bg-transparent text-sm text-[#442719] outline-none placeholder:text-[#b3a69c] sm:w-64"
              />
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-[#eee4da] bg-[#faf7f2] px-3.5">
              <Filter
                size={17}
                className="shrink-0 text-[#9b8a7e]"
              />

              <select
                value={dateFilter}
                onChange={(event) =>
                  setDateFilter(event.target.value as DateFilter)
                }
                aria-label="Filter rentals by date"
                className="w-full bg-transparent py-3 text-sm text-[#6b5a50] outline-none"
              >
                <option value="All">All Rentals</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Past">Past</option>
              </select>
            </div>
          </div>
        </div>

        {(search || dateFilter !== "All") && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#9b8a7e]">
              Active filters:
            </span>

            {search && (
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                Search: {search}
              </span>
            )}

            {dateFilter !== "All" && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {dateFilter}
              </span>
            )}

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDateFilter("All");
              }}
              className="text-xs font-semibold text-red-600 transition hover:text-red-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* ERROR STATE */}

      {error && (
        <section className="flex flex-col gap-4 rounded-2xl border border-red-100 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={22}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div>
              <h3 className="font-semibold text-red-800">
                Failed to Load Rentals
              </h3>

              <p className="mt-1 break-words text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void fetchRentals()}
            disabled={loading}
            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            Try Again
          </button>
        </section>
      )}

      {/* RENTALS TABLE */}

      <section className="overflow-hidden rounded-2xl border border-[#eee4da] bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-[#eee4da] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-bold text-[#442719]">
              Rental Overview
            </h3>

            <p className="mt-1 text-xs text-[#9b8a7e]">
              Booking information and payment records
            </p>
          </div>

          <span className="w-fit rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">
            {filteredRentals.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="bg-[#faf7f2] text-[11px] uppercase tracking-wider text-[#9b8a7e]">
              <tr>
                <th className="px-5 py-4 font-semibold">
                  Equipment
                </th>

                <th className="px-5 py-4 font-semibold">
                  Customer
                </th>

                <th className="px-5 py-4 font-semibold">
                  Owner
                </th>

                <th className="px-5 py-4 font-semibold">
                  Rental Period
                </th>

                <th className="px-5 py-4 font-semibold">
                  Amount
                </th>

                <th className="px-5 py-4 font-semibold">
                  Payment
                </th>

                <th className="px-5 py-4 font-semibold">
                  Booking
                </th>

                <th className="px-5 py-4 text-right font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-20 text-center">
                    <Loader2
                      size={34}
                      className="mx-auto animate-spin text-[#ea580c]"
                    />

                    <p className="mt-4 text-sm font-medium text-[#9b8a7e]">
                      Loading rental records...
                    </p>
                  </td>
                </tr>
              ) : filteredRentals.length > 0 ? (
                filteredRentals.map((rental) => (
                  <tr
                    key={rental._id}
                    className="border-t border-[#f1eae3] transition hover:bg-[#fdfaf7]"
                  >
                    {/* EQUIPMENT */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                          <Package size={21} />
                        </div>

                        <div className="max-w-[190px]">
                          <p className="truncate text-sm font-semibold text-[#442719]">
                            {rental.equipmentName}
                          </p>

                          <p className="mt-1 truncate text-[11px] text-[#9b8a7e]">
                            ID: {rental.equipmentId}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* CUSTOMER */}

                    <td className="px-5 py-4">
                      <div className="flex max-w-[180px] items-center gap-2">
                        <UserRound
                          size={15}
                          className="shrink-0 text-[#a18d7e]"
                        />

                        <span className="truncate text-xs text-[#6b5a50]">
                          {rental.customerEmail}
                        </span>
                      </div>
                    </td>

                    {/* OWNER */}

                    <td className="px-5 py-4">
                      <p className="max-w-[180px] truncate text-xs text-[#6b5a50]">
                        {rental.ownerEmail}
                      </p>
                    </td>

                    {/* RENTAL PERIOD */}

                    <td className="px-5 py-4">
                      <div className="space-y-1.5 text-xs text-[#6b5a50]">
                        <p className="flex items-center gap-1.5">
                          <CalendarDays
                            size={13}
                            className="text-[#a18d7e]"
                          />
                          {formatDate(rental.startDate)}
                        </p>

                        <p className="flex items-center gap-1.5">
                          <CalendarDays
                            size={13}
                            className="text-[#a18d7e]"
                          />
                          {formatDate(rental.endDate)}
                        </p>

                        <p className="flex items-center gap-1.5 font-medium text-[#9b8a7e]">
                          <Package size={13} />
                          {rental.quantity} Unit(s) · {rental.rentalDays} Days
                        </p>
                      </div>
                    </td>

                    {/* AMOUNT */}

                    <td className="px-5 py-4">
                      <p className="whitespace-nowrap text-sm font-bold text-[#442719]">
                        {formatPrice(rental.totalAmount)}
                      </p>

                      <p className="mt-1 text-[11px] text-[#9b8a7e]">
                        {rental.rentalType} rental
                      </p>
                    </td>

                    {/* PAYMENT */}

                    <td className="px-5 py-4">
                      <PaymentBadge status={rental.paymentStatus} />
                    </td>

                    {/* BOOKING */}

                    <td className="px-5 py-4">
                      <BookingBadge status={rental.bookingStatus} />
                    </td>

                    {/* ACTION */}

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedRental(rental)}
                        aria-label="View rental details"
                        title="View details"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 transition hover:border-blue-200 hover:bg-blue-100"
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-5 py-20 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#faf7f2] text-[#a18d7e]">
                      <ClipboardList size={32} />
                    </div>

                    <h3 className="mt-4 font-bold text-[#442719]">
                      No Rentals Found
                    </h3>

                    <p className="mt-2 text-sm text-[#9b8a7e]">
                      {error
                        ? "Please try loading the rental records again."
                        : "No rental records match your current search or filter."}
                    </p>

                    {(search || dateFilter !== "All") && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          setDateFilter("All");
                        }}
                        className="mt-4 text-sm font-semibold text-orange-600 hover:text-orange-700"
                      >
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 border-t border-[#eee4da] bg-[#fdfbf9] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#9b8a7e]">
            Showing{" "}
            <span className="font-semibold text-[#442719]">
              {filteredRentals.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#442719]">
              {rentals.length}
            </span>{" "}
            rental records
          </p>

          <p className="text-xs text-[#9b8a7e]">
            Admin read-only monitoring
          </p>
        </div>
      </section>

      {/* ADMIN NOTICE */}

      <section className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <ShieldCheck
          size={23}
          className="mt-0.5 shrink-0 text-blue-600"
        />

        <div>
          <h3 className="font-bold text-blue-900">
            Secure Rental Management
          </h3>

          <p className="mt-1 text-sm leading-6 text-blue-800/80">
            Administrators can monitor all customer bookings and
            payment records. Booking confirmation and payment
            verification are handled by the backend. Admins cannot
            manually change booking or payment statuses.
          </p>
        </div>
      </section>

      {/* RENTAL DETAILS MODAL */}

      {selectedRental && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#21140f]/60 p-3 backdrop-blur-sm sm:p-5"
          onClick={() => setSelectedRental(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="rental-details-title"
            className="my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eee4da] bg-white px-5 py-5 sm:px-7">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600">
                  <ClipboardList size={15} />
                  Booking Information
                </div>

                <h2
                  id="rental-details-title"
                  className="mt-2 text-xl font-bold text-[#442719] sm:text-2xl"
                >
                  Rental Details
                </h2>

                <p className="mt-1 max-w-[230px] truncate text-xs text-[#9b8a7e] sm:max-w-md">
                  Booking ID: {selectedRental._id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRental(null)}
                aria-label="Close modal"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#faf7f2] text-[#9b8a7e] transition hover:bg-red-50 hover:text-red-600"
              >
                <X size={21} />
              </button>
            </div>

            <div className="space-y-6 p-5 sm:p-7">

              {/* EQUIPMENT */}

              <div className="flex items-center gap-4 rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50 to-white p-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm">
                  <Package size={27} />
                </div>

                <div className="min-w-0">
                  <h3 className="break-words font-bold text-[#442719]">
                    {selectedRental.equipmentName}
                  </h3>

                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[#9b8a7e]">
                    <Hash size={13} />
                    {selectedRental.equipmentId}
                  </p>
                </div>
              </div>

              {/* CUSTOMER AND OWNER */}

              <div>
                <h3 className="mb-3 text-sm font-bold text-[#442719]">
                  People Involved
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#eee4da] p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#9b8a7e]">
                      <UserRound size={15} />
                      CUSTOMER
                    </div>

                    <p className="mt-3 break-all text-sm font-medium text-[#442719]">
                      {selectedRental.customerEmail}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#eee4da] p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#9b8a7e]">
                      <UserRound size={15} />
                      EQUIPMENT OWNER
                    </div>

                    <p className="mt-3 break-all text-sm font-medium text-[#442719]">
                      {selectedRental.ownerEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* RENTAL PERIOD */}

              <div>
                <h3 className="mb-3 text-sm font-bold text-[#442719]">
                  Rental Information
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-[#faf7f2] p-4">
                    <p className="text-xs text-[#9b8a7e]">
                      Start Date
                    </p>

                    <p className="mt-2 text-sm font-semibold text-[#442719]">
                      {formatDate(selectedRental.startDate)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#faf7f2] p-4">
                    <p className="text-xs text-[#9b8a7e]">
                      End Date
                    </p>

                    <p className="mt-2 text-sm font-semibold text-[#442719]">
                      {formatDate(selectedRental.endDate)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#faf7f2] p-4">
                    <p className="text-xs text-[#9b8a7e]">
                      Quantity
                    </p>

                    <p className="mt-2 text-sm font-semibold text-[#442719]">
                      {selectedRental.quantity} Unit(s)
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#faf7f2] p-4">
                    <p className="text-xs text-[#9b8a7e]">
                      Rental Duration
                    </p>

                    <p className="mt-2 text-sm font-semibold text-[#442719]">
                      {selectedRental.rentalDays} Days
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#faf7f2] p-4">
                    <p className="text-xs text-[#9b8a7e]">
                      Rental Type
                    </p>

                    <p className="mt-2 text-sm font-semibold capitalize text-[#442719]">
                      {selectedRental.rentalType}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#faf7f2] p-4">
                    <p className="text-xs text-[#9b8a7e]">
                      Rental Period Count
                    </p>

                    <p className="mt-2 text-sm font-semibold text-[#442719]">
                      {selectedRental.periodCount}
                    </p>
                  </div>
                </div>
              </div>

              {/* CONTACT DETAILS */}

              <div>
                <h3 className="mb-3 text-sm font-bold text-[#442719]">
                  Delivery Information
                </h3>

                <div className="space-y-3 rounded-xl border border-[#eee4da] p-4">
                  <div className="flex items-start gap-3">
                    <Phone
                      size={17}
                      className="mt-0.5 shrink-0 text-[#a18d7e]"
                    />

                    <div>
                      <p className="text-xs text-[#9b8a7e]">
                        Contact Phone
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#442719]">
                        {selectedRental.phone || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin
                      size={17}
                      className="mt-0.5 shrink-0 text-[#a18d7e]"
                    />

                    <div>
                      <p className="text-xs text-[#9b8a7e]">
                        Delivery Address
                      </p>

                      <p className="mt-1 break-words text-sm font-medium text-[#442719]">
                        {selectedRental.address || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* NOTES */}

              {selectedRental.notes && (
                <div>
                  <h3 className="mb-3 text-sm font-bold text-[#442719]">
                    Additional Notes
                  </h3>

                  <div className="rounded-xl border border-[#eee4da] bg-[#faf7f2] p-4">
                    <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[#6b5a50]">
                      {selectedRental.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* STATUS */}

              <div>
                <h3 className="mb-3 text-sm font-bold text-[#442719]">
                  Booking & Payment Status
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#eee4da] p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#9b8a7e]">
                      Booking Status
                    </p>

                    <BookingBadge status={selectedRental.bookingStatus} />
                  </div>

                  <div className="rounded-xl border border-[#eee4da] p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#9b8a7e]">
                      Payment Status
                    </p>

                    <PaymentBadge status={selectedRental.paymentStatus} />
                  </div>
                </div>
              </div>

              {/* PRICE DETAILS */}

              <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-[#fffaf5] p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-orange-800">
                    Unit Price
                  </p>

                  <p className="font-semibold text-orange-950">
                    {formatPrice(selectedRental.unitPrice)}
                  </p>
                </div>

                <div className="my-4 border-t border-orange-200/70" />

                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-orange-900">
                    Total Amount
                  </p>

                  <p className="text-2xl font-bold text-orange-950">
                    {formatPrice(selectedRental.totalAmount)}
                  </p>
                </div>
              </div>

              {/* CREATED DATE */}

              <div className="flex items-center justify-between gap-3 rounded-xl bg-[#faf7f2] p-4">
                <div>
                  <p className="text-xs text-[#9b8a7e]">
                    Booking Created
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#442719]">
                    {formatDate(selectedRental.createdAt)}
                  </p>
                </div>

                <CalendarDays
                  size={20}
                  className="shrink-0 text-[#a18d7e]"
                />
              </div>

              {/* READ ONLY NOTICE */}

              <div className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <p className="text-xs leading-5 text-blue-800">
                  This is a read-only admin view. Booking and payment
                  statuses are managed by the backend.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRental(null)}
                className="w-full rounded-xl bg-[#442719] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5b3623]"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

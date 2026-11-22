
"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  Search,
  CalendarDays,
  CheckCircle,
  Filter,
  UserRound,
  Package,
  MapPin,
  Eye,
  ShieldCheck,
  X,
  RefreshCw,
  CreditCard,
  Banknote,
  Loader2,
  AlertCircle,
  FlaskConical,
} from "lucide-react";

import {
  getAllAdminRentals,
  type AdminRental,
} from "@/services/admin.service";

export default function ManageRentalsPage() {
  const [rentals, setRentals] = useState<AdminRental[]>([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("All");
  const [selectedRental, setSelectedRental] =
    useState<AdminRental | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH ALL PAID RENTALS

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
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while fetching rentals.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // INITIAL DATA FETCHING

  useEffect(() => {
    let isActive = true;

    Promise.resolve().then(() => {
      if (isActive) {
        void fetchRentals();
      }
    });

    return () => {
      isActive = false;
    };
  }, [fetchRentals]);

  // DATE FORMATTER

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

  // PAYMENT METHOD

  const getPaymentMethod = (rental: AdminRental) => {
    return rental.paymentMethod === "demo"
      ? "Demo / Test Payment"
      : "Stripe Payment";
  };

  // SUMMARY CALCULATIONS

  const totalRevenue = useMemo(
    () =>
      rentals.reduce(
        (total, rental) => total + rental.totalPrice,
        0
      ),
    [rentals]
  );

  const totalQuantity = useMemo(
    () =>
      rentals.reduce(
        (total, rental) => total + (rental.quantity || 1),
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
        !Number.isNaN(endDate.getTime()) &&
        endDate >= today
      );
    }).length;
  }, [rentals]);

  // SEARCH AND DATE FILTER

  const filteredRentals = useMemo(() => {
    const searchValue = search.trim().toLowerCase();
    const now = new Date();

    return rentals.filter((rental) => {
      const matchesSearch =
        rental.renterEmail.toLowerCase().includes(searchValue) ||
        rental.ownerEmail.toLowerCase().includes(searchValue) ||
        (rental.equipment?.name || "")
          .toLowerCase()
          .includes(searchValue) ||
        rental._id.toLowerCase().includes(searchValue);

      const endDate = new Date(rental.endDate);

      let matchesDate = true;

      if (dateFilter === "Upcoming") {
        matchesDate =
          !Number.isNaN(endDate.getTime()) && endDate >= now;
      } else if (dateFilter === "Past") {
        matchesDate =
          !Number.isNaN(endDate.getTime()) && endDate < now;
      }

      return matchesSearch && matchesDate;
    });
  }, [rentals, search, dateFilter]);

  // SUMMARY CARDS

  const summaryCards = [
    {
      title: "Total Rentals",
      value: rentals.length,
      icon: ClipboardList,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Revenue",
      value: `৳${totalRevenue.toLocaleString("en-BD")}`,
      icon: Banknote,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Total Equipment Units",
      value: totalQuantity,
      icon: Package,
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "Upcoming Rentals",
      value: upcomingRentals,
      icon: CalendarDays,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  // RENDER

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page Heading */}

      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#ea580c]">
            Admin Dashboard
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#442719] sm:text-3xl">
            Manage Rentals
          </h1>

          <p className="mt-2 text-sm text-[#9b8a7e]">
            Monitor all successful equipment rental bookings.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void fetchRentals()}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#eee4da] bg-white px-4 py-2.5 text-sm font-semibold text-[#442719] transition hover:bg-[#faf7f2] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </section>

      {/* Summary Cards */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-[#eee4da] bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#9b8a7e]">
                  {item.title}
                </p>

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}
                >
                  <Icon size={21} />
                </div>
              </div>

              <h2 className="mt-4 text-2xl font-bold text-[#442719] sm:text-3xl">
                {item.value}
              </h2>
            </div>
          );
        })}
      </section>

      {/* Search and Filter */}

      <section className="flex flex-col gap-4 rounded-2xl border border-[#eee4da] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold text-[#442719]">
            All Paid Rentals
          </h2>

          <p className="mt-1 text-sm text-[#9b8a7e]">
            Search and review successful rental bookings.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex items-center gap-2 rounded-xl border border-[#eee4da] px-3 py-2.5">
            <Search size={18} className="text-[#9b8a7e]" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search rentals..."
              aria-label="Search rentals"
              className="w-full bg-transparent text-sm outline-none sm:w-48"
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#eee4da] px-3">
            <Filter size={17} className="text-[#9b8a7e]" />

            <select
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              aria-label="Filter rentals by date"
              className="bg-transparent py-2.5 text-sm text-[#6b5a50] outline-none"
            >
              <option value="All">All Rentals</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Past">Past</option>
            </select>
          </div>
        </div>
      </section>

      {/* Error State */}

      {error && (
        <section className="flex flex-col gap-3 rounded-2xl border border-red-100 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={22}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div>
              <h3 className="font-semibold text-red-800">
                Failed to Load Rentals
              </h3>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void fetchRentals()}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </section>
      )}

      {/* Rentals Table */}

      <section className="overflow-hidden rounded-2xl border border-[#eee4da] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead className="bg-[#faf7f2] text-xs uppercase tracking-wider text-[#9b8a7e]">
              <tr>
                <th className="px-5 py-4">Equipment</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Owner</th>
                <th className="px-5 py-4">Rental Period</th>
                <th className="px-5 py-4">Total Price</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <Loader2
                      size={32}
                      className="mx-auto animate-spin text-[#ea580c]"
                    />

                    <p className="mt-4 text-sm text-[#9b8a7e]">
                      Loading rental records...
                    </p>
                  </td>
                </tr>
              ) : filteredRentals.length > 0 ? (
                filteredRentals.map((rental) => (
                  <tr
                    key={rental._id}
                    className="border-t border-[#eee4da] transition hover:bg-[#faf7f2]"
                  >
                    {/* Equipment */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#fff0e5] text-[#ea580c]">
                          {rental.equipment?.image ? (
                            <Image
                              src={rental.equipment.image}
                              alt={rental.equipment.name || "Equipment"}
                              width={44}
                              height={44}
                              unoptimized
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package size={21} />
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-[#442719]">
                            {rental.equipment?.name || "Equipment unavailable"}
                          </p>

                          <p className="mt-1 text-xs text-[#9b8a7e]">
                            ID: {rental._id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Customer */}

                    <td className="px-5 py-4 text-sm text-[#6b5a50]">
                      <div className="flex items-center gap-2">
                        <UserRound size={16} />
                        <span>{rental.renterEmail}</span>
                      </div>
                    </td>

                    {/* Owner */}

                    <td className="px-5 py-4 text-sm text-[#6b5a50]">
                      {rental.ownerEmail}
                    </td>

                    {/* Rental Period */}

                    <td className="px-5 py-4">
                      <div className="space-y-1 text-xs text-[#6b5a50]">
                        <p className="flex items-center gap-1.5">
                          <CalendarDays size={14} />
                          {formatDate(rental.startDate)}
                        </p>

                        <p className="flex items-center gap-1.5">
                          <CalendarDays size={14} />
                          {formatDate(rental.endDate)}
                        </p>

                        <p className="flex items-center gap-1.5">
                          <Package size={14} />
                          {rental.quantity || 1} Unit(s) · {rental.totalDays} Days
                        </p>
                      </div>
                    </td>

                    {/* Total Price */}

                    <td className="px-5 py-4 text-sm font-bold text-[#442719]">
                      ৳{rental.totalPrice.toLocaleString("en-BD")}
                    </td>

                    {/* Payment */}

                    <td className="px-5 py-4">
                      <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                          <CheckCircle size={14} />
                          Paid
                        </span>

                        <p className="flex items-center gap-1.5 text-xs font-medium text-[#806b5e]">
                          {rental.paymentMethod === "demo" ? (
                            <FlaskConical
                              size={14}
                              className="text-orange-600"
                            />
                          ) : (
                            <CreditCard
                              size={14}
                              className="text-blue-600"
                            />
                          )}

                          {getPaymentMethod(rental)}
                        </p>
                      </div>
                    </td>

                    {/* Action */}

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedRental(rental)}
                        aria-label="View rental details"
                        className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#faf7f2] text-[#a18d7e]">
                      <ClipboardList size={32} />
                    </div>

                    <h3 className="mt-4 font-bold text-[#442719]">
                      No Rentals Found
                    </h3>

                    <p className="mt-2 text-sm text-[#9b8a7e]">
                      {error
                        ? "Please try loading the rental records again."
                        : "Paid rental records will appear here after successful bookings."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[#eee4da] px-5 py-4">
          <p className="text-sm text-[#9b8a7e]">
            Showing {filteredRentals.length} of {rentals.length} paid rental records
          </p>
        </div>
      </section>

      {/* Admin Notice */}

      <section className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <ShieldCheck
          size={22}
          className="mt-0.5 shrink-0 text-blue-600"
        />

        <div>
          <h3 className="font-semibold text-blue-900">
            Rental Management
          </h3>

          <p className="mt-1 text-sm leading-6 text-blue-800/80">
            Administrators can monitor successful rental bookings and
            review booking records. Payment verification and rental
            creation are handled securely by the backend. Admins
            cannot manually change payment status.
          </p>
        </div>
      </section>

      {/* Rental Details Modal */}

      {selectedRental && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onClick={() => setSelectedRental(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="rental-details-title"
            className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#eee4da] pb-4">
              <div>
                <h2
                  id="rental-details-title"
                  className="text-xl font-bold text-[#442719]"
                >
                  Rental Details
                </h2>

                <p className="mt-1 text-xs text-[#9b8a7e]">
                  Booking ID: {selectedRental._id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRental(null)}
                aria-label="Close modal"
                className="rounded-lg p-2 text-[#9b8a7e] transition hover:bg-[#faf7f2] hover:text-[#442719]"
              >
                <X size={21} />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              {/* Equipment Information */}

              <div className="flex items-center gap-4 rounded-xl bg-[#faf7f2] p-4">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#fff0e5] text-[#ea580c]">
                  {selectedRental.equipment?.image ? (
                    <Image
                      src={selectedRental.equipment.image}
                      alt={selectedRental.equipment.name || "Equipment"}
                      width={56}
                      height={56}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package size={25} />
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-[#442719]">
                    {selectedRental.equipment?.name || "Equipment unavailable"}
                  </h3>

                  <p className="mt-1 text-sm text-[#9b8a7e]">
                    {selectedRental.equipment?.category || "N/A"}
                  </p>
                </div>
              </div>

              {/* Customer and Owner */}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase text-[#9b8a7e]">
                    Customer
                  </p>

                  <p className="mt-2 break-all text-sm font-medium text-[#442719]">
                    {selectedRental.renterEmail}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-[#9b8a7e]">
                    Owner
                  </p>

                  <p className="mt-2 break-all text-sm font-medium text-[#442719]">
                    {selectedRental.ownerEmail}
                  </p>
                </div>
              </div>

              {/* Rental Dates */}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase text-[#9b8a7e]">
                    Start Date
                  </p>

                  <p className="mt-2 text-sm font-medium text-[#442719]">
                    {formatDate(selectedRental.startDate)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-[#9b8a7e]">
                    End Date
                  </p>

                  <p className="mt-2 text-sm font-medium text-[#442719]">
                    {formatDate(selectedRental.endDate)}
                  </p>
                </div>
              </div>

              {/* Quantity and Duration */}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase text-[#9b8a7e]">
                    Quantity
                  </p>

                  <p className="mt-2 text-sm font-medium text-[#442719]">
                    {selectedRental.quantity || 1} Unit(s)
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-[#9b8a7e]">
                    Rental Duration
                  </p>

                  <p className="mt-2 text-sm font-medium text-[#442719]">
                    {selectedRental.totalDays} Days
                  </p>
                </div>
              </div>

              {/* Location */}

              <div>
                <p className="text-xs font-semibold uppercase text-[#9b8a7e]">
                  Equipment Location
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm font-medium text-[#442719]">
                  <MapPin size={16} className="text-[#ea580c]" />
                  {selectedRental.equipment?.location || "N/A"}
                </p>
              </div>

              {/* Payment Information */}

              <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase text-green-700">
                      Payment Status
                    </p>

                    <p className="mt-2 flex items-center gap-2 font-semibold text-green-700">
                      <CheckCircle size={17} />
                      Successfully Paid
                    </p>
                  </div>

                  <CheckCircle
                    size={25}
                    className="text-green-600"
                  />
                </div>

                <div className="mt-4 border-t border-green-200 pt-3">
                  <p className="text-xs text-green-700">
                    Total Amount
                  </p>

                  <p className="mt-1 text-2xl font-bold text-green-800">
                    ৳{selectedRental.totalPrice.toLocaleString("en-BD")}
                  </p>
                </div>
              </div>

              {/* Payment Method */}

              <div>
                <p className="text-xs font-semibold uppercase text-[#9b8a7e]">
                  Payment Method
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#442719]">
                  {selectedRental.paymentMethod === "demo" ? (
                    <>
                      <FlaskConical size={17} className="text-orange-600" />
                      Demo / Test Payment
                    </>
                  ) : (
                    <>
                      <CreditCard size={17} className="text-blue-600" />
                      Stripe Payment
                    </>
                  )}
                </p>
              </div>

              {/* Transaction Reference */}

              {selectedRental.paymentMethod === "demo" ? (
                selectedRental.demoTransactionId && (
                  <div>
                    <p className="text-xs font-semibold uppercase text-[#9b8a7e]">
                      Demo Transaction ID
                    </p>

                    <p className="mt-2 break-all text-xs text-[#6b5a50]">
                      {selectedRental.demoTransactionId}
                    </p>
                  </div>
                )
              ) : selectedRental.stripePaymentIntentId ? (
                <div>
                  <p className="text-xs font-semibold uppercase text-[#9b8a7e]">
                    Stripe Payment Intent
                  </p>

                  <p className="mt-2 break-all text-xs text-[#6b5a50]">
                    {selectedRental.stripePaymentIntentId}
                  </p>
                </div>
              ) : null}

              {/* Booking Date */}

              <div>
                <p className="text-xs font-semibold uppercase text-[#9b8a7e]">
                  Booking Created
                </p>

                <p className="mt-2 text-sm text-[#6b5a50]">
                  {formatDate(selectedRental.createdAt)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedRental(null)}
              className="mt-6 w-full rounded-xl bg-[#442719] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5b3623]"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

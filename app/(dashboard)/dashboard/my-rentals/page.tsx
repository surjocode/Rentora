
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Search,
  MapPin,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Loader2,
  RotateCcw,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import {
  getMyRentals,
  cancelRental,
  createCheckoutSession,
  type Rental,
} from "@/services/rental.service";

interface RentalEquipment {
  _id: string;
  name: string;
  image: string;
  category: string;
  location: string;
  pricePerDay: number;
}

interface RentalWithEquipment extends Rental {
  equipment?: RentalEquipment;
}

type RentalFilter =
  | "all"
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-BD").format(price);
};

export default function MyRentalsPage() {
  const { user, loading: authLoading, isAuthenticated, isRenter } =
    useAuth();

  const [rentals, setRentals] = useState<RentalWithEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<RentalFilter>("all");

  const [cancellingId, setCancellingId] = useState<string | null>(
    null
  );

  const [payingId, setPayingId] = useState<string | null>(null);

  // Fetch Customer Rentals
  const fetchRentals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getMyRentals();

      if (!result.success) {
        throw new Error(result.message);
      }

      setRentals(result.data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load your rentals"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !isRenter) {
      setLoading(false);
      return;
    }

    void fetchRentals();
  }, [authLoading, isAuthenticated, isRenter, fetchRentals]);

  // Search and Filter
  const filteredRentals = useMemo(() => {
    return rentals.filter((rental) => {
      const equipmentName = rental.equipment?.name ?? "";
      const category = rental.equipment?.category ?? "";
      const location = rental.equipment?.location ?? "";

      const searchMatch = [
        equipmentName,
        category,
        location,
      ].some((value) =>
        value.toLowerCase().includes(search.toLowerCase().trim())
      );

      const statusMatch =
        statusFilter === "all" || rental.status === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [rentals, search, statusFilter]);

  // Rental Summary
  const totalBookings = rentals.length;

  const approvedBookings = rentals.filter(
    (rental) => rental.status === "approved"
  ).length;

  const pendingBookings = rentals.filter(
    (rental) => rental.status === "pending"
  ).length;

  // Cancel Rental
  const handleCancelRental = async (rentalId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this rental request?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(rentalId);
      setError(null);

      const result = await cancelRental(rentalId);

      if (!result.success) {
        throw new Error(result.message);
      }

      setRentals((previousRentals) =>
        previousRentals.map((rental) =>
          rental._id === rentalId
            ? { ...rental, status: "cancelled" }
            : rental
        )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to cancel rental"
      );
    } finally {
      setCancellingId(null);
    }
  };

  // Handle Stripe Payment
  const handlePayNow = async (rentalId: string) => {
    try {
      setPayingId(rentalId);
      setError(null);

      const result = await createCheckoutSession(rentalId);

      if (!result.success || !result.url) {
        throw new Error(
          result.message || "Failed to create checkout session."
        );
      }

      // Redirect customer to Stripe Checkout
      window.location.assign(result.url);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to initialize payment."
      );

      setPayingId(null);
    }
  };

  // Rental Status Style
  const getStatusStyle = (status: Rental["status"]) => {
    switch (status) {
      case "approved":
        return "bg-blue-50 text-blue-600";

      case "pending":
        return "bg-orange-50 text-orange-600";

      case "rejected":
        return "bg-red-50 text-red-600";

      case "cancelled":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Rental Status Icon
  const getStatusIcon = (status: Rental["status"]) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={15} />;

      case "pending":
        return <Clock size={15} />;

      case "rejected":
      case "cancelled":
        return <XCircle size={15} />;
    }
  };

  // Loading State
  if (authLoading || loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2
            className="mx-auto animate-spin text-[#ea580c]"
            size={36}
          />

          <p className="mt-3 text-sm text-[#9b8a7e]">
            Loading your rentals...
          </p>
        </div>
      </div>
    );
  }

  // Authentication Check
  if (!isAuthenticated || !isRenter) {
    return (
      <div className="rounded-2xl border border-[#eee4da] bg-white px-5 py-16 text-center">
        <Package className="mx-auto text-[#ea580c]" size={42} />

        <h2 className="mt-4 text-xl font-bold text-[#442719]">
          Renter Access Required
        </h2>

        <p className="mt-2 text-sm text-[#9b8a7e]">
          Please sign in with a renter account to view your rentals.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-flex rounded-xl bg-[#ea580c] px-6 py-3 text-sm font-semibold text-white hover:bg-orange-700"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page Heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#ea580c]">
            Customer Dashboard
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#442719] sm:text-3xl">
            My Rentals
          </h1>

          <p className="mt-2 text-sm text-[#9b8a7e]">
            Welcome, {user?.name}. View and manage your equipment bookings.
          </p>
        </div>

        <Link
          href="/all-equipment"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ea580c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          <Package size={18} />
          Browse Equipment
        </Link>
      </section>

      {/* Rental Summary */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#eee4da] bg-white p-5">
          <p className="text-sm text-[#9b8a7e]">Total Bookings</p>

          <h2 className="mt-2 text-3xl font-bold text-[#442719]">
            {totalBookings}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#eee4da] bg-white p-5">
          <p className="text-sm text-[#9b8a7e]">Approved Bookings</p>

          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {approvedBookings}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#eee4da] bg-white p-5">
          <p className="text-sm text-[#9b8a7e]">Pending Bookings</p>

          <h2 className="mt-2 text-3xl font-bold text-orange-600">
            {pendingBookings}
          </h2>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="flex flex-col gap-4 rounded-2xl border border-[#eee4da] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold text-[#442719]">
            Booking History
          </h2>

          <p className="mt-1 text-sm text-[#9b8a7e]">
            Keep track of your equipment bookings.
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
              className="w-full bg-transparent text-sm text-[#442719] outline-none placeholder:text-[#b3a69c] sm:w-48"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as RentalFilter)
            }
            aria-label="Filter rentals by status"
            className="rounded-xl border border-[#eee4da] bg-white px-3 py-2.5 text-sm text-[#6b5a50] outline-none focus:border-[#ea580c]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </section>

      {/* Error State */}
      {error && (
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center">
          <p className="text-sm text-red-600">{error}</p>

          <button
            onClick={() => void fetchRentals()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-600"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      )}

      {/* Rentals List */}
      {filteredRentals.length > 0 ? (
        <section className="space-y-4">
          {filteredRentals.map((rental) => (
            <article
              key={rental._id}
              className="overflow-hidden rounded-2xl border border-[#eee4da] bg-white p-4 sm:p-5"
            >
              <div className="flex flex-col gap-5 md:flex-row">
                {/* Equipment Image */}
                <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl bg-[#faf7f2] md:h-40 md:w-52">
                  {rental.equipment?.image ? (
                    <Image
                      src={rental.equipment.image}
                      alt={rental.equipment.name || "Rental equipment"}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 208px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#a18d7e]">
                      <Package size={42} />
                    </div>
                  )}
                </div>

                {/* Equipment Information */}
                <div className="flex flex-1 flex-col justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-full bg-[#faf0e8] px-3 py-1 text-xs font-semibold text-[#ea580c]">
                        {rental.equipment?.category || "Equipment"}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                          rental.status
                        )}`}
                      >
                        {getStatusIcon(rental.status)}
                        {rental.status}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-[#442719]">
                      {rental.equipment?.name ||
                        "Equipment no longer available"}
                    </h3>

                    <p className="mt-2 flex items-center gap-1.5 text-sm text-[#9b8a7e]">
                      <MapPin size={15} />
                      {rental.equipment?.location ||
                        "Location unavailable"}
                    </p>
                  </div>

                  {/* Rental Details */}
                  <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-xs text-[#9b8a7e]">
                        Rental Period
                      </p>

                      <p className="mt-1 font-medium text-[#442719]">
                        {formatDate(rental.startDate)} -{" "}
                        {formatDate(rental.endDate)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#9b8a7e]">
                        Total Days
                      </p>

                      <p className="mt-1 font-medium text-[#442719]">
                        {rental.totalDays} days
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#9b8a7e]">
                        Total Price
                      </p>

                      <p className="mt-1 font-bold text-[#ea580c]">
                        ৳{formatPrice(rental.totalPrice)}
                      </p>
                    </div>
                  </div>

                  {/* Booking Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f1e9e1] pt-4">
                    <p className="text-xs text-[#9b8a7e]">
                      Booked on {formatDate(rental.createdAt)}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Payment Status */}
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          rental.paymentStatus === "paid"
                            ? "bg-green-50 text-green-600"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        Payment: {rental.paymentStatus}
                      </span>

                      {/* Pay Now Button */}
                      {rental.status === "approved" &&
                        rental.paymentStatus === "unpaid" && (
                          <button
                            onClick={() =>
                              void handlePayNow(rental._id)
                            }
                            disabled={payingId === rental._id}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#ea580c] px-4 py-2 text-xs font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {payingId === rental._id ? (
                              <Loader2
                                size={14}
                                className="animate-spin"
                              />
                            ) : (
                              <span>৳</span>
                            )}

                            {payingId === rental._id
                              ? "Redirecting..."
                              : "Pay Now"}
                          </button>
                        )}

                      {/* Cancel Booking Button */}
                      {rental.status === "pending" && (
                        <button
                          onClick={() =>
                            void handleCancelRental(rental._id)
                          }
                          disabled={cancellingId === rental._id}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {cancellingId === rental._id ? (
                            <Loader2
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <XCircle size={14} />
                          )}

                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        /* Empty State */
        <section className="rounded-2xl border border-dashed border-[#e5d8ca] bg-white px-5 py-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#faf7f2] text-[#a18d7e]">
            <Package size={38} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#442719]">
            {rentals.length === 0
              ? "No Rentals Found"
              : "No Matching Rentals"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#9b8a7e]">
            {rentals.length === 0
              ? "You haven't booked any equipment yet. Explore our equipment collection and find what you need."
              : "No rentals match your current search or status filter."}
          </p>

          {rentals.length === 0 ? (
            <Link
              href="/all-equipment"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#ea580c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              Explore Equipment
              <ArrowRight size={18} />
            </Link>
          ) : (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#faf0e8] px-6 py-3 text-sm font-semibold text-[#ea580c]"
            >
              <RotateCcw size={16} />
              Clear Filters
            </button>
          )}
        </section>
      )}

      {/* Booking Status Guide */}
      <section className="rounded-2xl border border-[#eee4da] bg-white p-6">
        <h2 className="mb-5 font-bold text-[#442719]">
          Booking Status Guide
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3">
            <Clock className="text-orange-500" size={20} />
            <span className="text-sm text-[#6b5a50]">Pending</span>
          </div>

          <div className="flex items-center gap-3">
            <CheckCircle className="text-blue-500" size={20} />
            <span className="text-sm text-[#6b5a50]">Approved</span>
          </div>

          <div className="flex items-center gap-3">
            <XCircle className="text-red-500" size={20} />
            <span className="text-sm text-[#6b5a50]">Rejected</span>
          </div>

          <div className="flex items-center gap-3">
            <XCircle className="text-gray-500" size={20} />
            <span className="text-sm text-[#6b5a50]">Cancelled</span>
          </div>
        </div>
      </section>
    </div>
  );
}

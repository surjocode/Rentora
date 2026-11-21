
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ClipboardList,
  Search,
  CalendarDays,
  MapPin,
  UserRound,
  Loader2,
  RefreshCw,
  Package,
  CheckCircle,
  CreditCard,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import {
  getOwnerBookings,
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

interface RentalRequest extends Rental {
  equipment?: RentalEquipment;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-BD").format(price);

export default function RentalRequestsPage() {
  const { loading: authLoading, isAuthenticated, isOwner } = useAuth();

  const [bookings, setBookings] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  // Fetch owner's paid bookings
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getOwnerBookings();

      if (!result.success) {
        throw new Error(result.message);
      }

      setBookings(result.data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load customer bookings."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !isOwner) {
      setLoading(false);
      return;
    }

    void fetchBookings();
  }, [authLoading, isAuthenticated, isOwner, fetchBookings]);

  // Search bookings
  const filteredBookings = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const equipmentName = booking.equipment?.name ?? "";
      const customerEmail = booking.renterEmail ?? "";
      const location = booking.equipment?.location ?? "";

      return [
        equipmentName,
        customerEmail,
        location,
        booking._id,
      ].some((value) => value.toLowerCase().includes(searchTerm));
    });
  }, [bookings, search]);

  // Booking summary
  const totalBookings = bookings.length;

  const paidBookings = bookings.filter(
    (booking) => booking.paymentStatus === "paid"
  ).length;

  const totalRevenue = bookings
    .filter((booking) => booking.paymentStatus === "paid")
    .reduce((total, booking) => total + booking.totalPrice, 0);

  // Loading
  if (authLoading || loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2
            size={36}
            className="mx-auto animate-spin text-[#ea580c]"
          />

          <p className="mt-3 text-sm text-[#9b8a7e]">
            Loading customer bookings...
          </p>
        </div>
      </div>
    );
  }

  // Authentication check
  if (!isAuthenticated || !isOwner) {
    return (
      <div className="rounded-2xl border border-[#eee4da] bg-white px-5 py-16 text-center">
        <ClipboardList
          size={42}
          className="mx-auto text-[#ea580c]"
        />

        <h2 className="mt-4 text-xl font-bold text-[#442719]">
          Owner Access Required
        </h2>

        <p className="mt-2 text-sm text-[#9b8a7e]">
          Please sign in with an equipment owner account to view your bookings.
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
      <section>
        <p className="text-sm font-semibold tracking-wider text-[#ea580c] uppercase">
          Owner Dashboard
        </p>

        <h1 className="mt-2 text-2xl font-bold text-[#442719] sm:text-3xl">
          My Bookings
        </h1>

        <p className="mt-2 text-sm text-[#9b8a7e]">
          View customer bookings and successful payments for your equipment.
        </p>
      </section>

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#eee4da] bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#9b8a7e]">
              Total Bookings
            </p>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ClipboardList size={21} />
            </div>
          </div>

          <h2 className="mt-3 text-3xl font-bold text-[#442719]">
            {totalBookings}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#eee4da] bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#9b8a7e]">
              Successful Payments
            </p>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle size={21} />
            </div>
          </div>

          <h2 className="mt-3 text-3xl font-bold text-green-600">
            {paidBookings}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#eee4da] bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#9b8a7e]">
              Total Revenue
            </p>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#ea580c]">
              <CreditCard size={21} />
            </div>
          </div>

          <h2 className="mt-3 text-3xl font-bold text-[#442719]">
            ৳{formatPrice(totalRevenue)}
          </h2>
        </div>
      </section>

      {/* Search */}
      <section className="flex flex-col gap-4 rounded-2xl border border-[#eee4da] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold text-[#442719]">
            Customer Bookings
          </h2>

          <p className="mt-1 text-sm text-[#9b8a7e]">
            Only successfully paid bookings are displayed.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[#eee4da] px-3 py-2.5">
          <Search size={18} className="text-[#9b8a7e]" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search bookings..."
            className="w-full bg-transparent text-sm text-[#442719] outline-none placeholder:text-[#b3a69c] sm:w-56"
          />
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center">
          <p className="text-sm text-red-600">{error}</p>

          <button
            onClick={() => void fetchBookings()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-600"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      )}

      {/* Booking List */}
      {filteredBookings.length > 0 ? (
        <section className="grid gap-5 lg:grid-cols-2">
          {filteredBookings.map((booking) => (
            <article
              key={booking._id}
              className="rounded-2xl border border-[#eee4da] bg-white p-5 shadow-sm"
            >
              {/* Equipment Information */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#fff0e5]">
                    {booking.equipment?.image ? (
                      <Image
                        src={booking.equipment.image}
                        alt={booking.equipment.name || "Equipment"}
                        fill
                        unoptimized
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#ea580c]">
                        <Package size={25} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-[#442719]">
                      {booking.equipment?.name || "Equipment"}
                    </h3>

                    <p className="mt-1 text-xs text-[#9b8a7e]">
                      Booking ID: {booking._id}
                    </p>
                  </div>
                </div>

                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600">
                  <CheckCircle size={14} />
                  Paid
                </span>
              </div>

              {/* Customer Details */}
              <div className="mt-5 space-y-3 border-t border-[#eee4da] pt-4">
                <p className="flex items-center gap-2 text-sm break-all text-[#6b5a50]">
                  <UserRound size={17} className="shrink-0" />
                  {booking.renterEmail}
                </p>

                <p className="flex items-center gap-2 text-sm text-[#6b5a50]">
                  <MapPin size={17} className="shrink-0" />
                  {booking.equipment?.location || "Location unavailable"}
                </p>

                <p className="flex items-center gap-2 text-sm text-[#6b5a50]">
                  <CalendarDays size={17} className="shrink-0" />

                  {formatDate(booking.startDate)} –{" "}
                  {formatDate(booking.endDate)}
                </p>

                <p className="text-sm text-[#6b5a50]">
                  Rental Duration:{" "}
                  <span className="font-semibold">
                    {booking.totalDays} days
                  </span>
                </p>
              </div>

              {/* Payment Information */}
              <div className="mt-5 flex items-center justify-between border-t border-[#eee4da] pt-4">
                <div>
                  <p className="text-xs text-[#9b8a7e]">
                    Total Rental Price
                  </p>

                  <p className="mt-1 text-lg font-bold text-[#442719]">
                    ৳{formatPrice(booking.totalPrice)}
                  </p>
                </div>

                <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600">
                  Payment Successful
                </span>
              </div>

              <p className="mt-4 text-xs text-[#9b8a7e]">
                Booked on {formatDate(booking.createdAt)}
              </p>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-[#e5d8ca] bg-white px-5 py-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#faf7f2] text-[#a18d7e]">
            <ClipboardList size={38} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#442719]">
            {bookings.length === 0
              ? "No Paid Bookings Yet"
              : "No Matching Bookings"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#9b8a7e]">
            {bookings.length === 0
              ? "When customers successfully pay for your equipment, their bookings will appear here."
              : "No bookings match your current search."}
          </p>

          {bookings.length > 0 && (
            <button
              onClick={() => setSearch("")}
              className="mt-6 rounded-xl bg-[#faf0e8] px-6 py-3 text-sm font-semibold text-[#ea580c]"
            >
              Clear Search
            </button>
          )}
        </section>
      )}
    </div>
  );
}

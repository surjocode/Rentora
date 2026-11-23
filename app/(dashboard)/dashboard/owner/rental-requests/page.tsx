
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
  Phone,
  Hash,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { getOwnerBookings, type Rental } from "@/services/rental.service";

// ==========================================
// TYPES
// ==========================================

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

// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Format Date
const formatDate = (date: string) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Format Price
const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-BD").format(price);

// Booking Status Label
const getBookingStatusLabel = (
  status: Rental["bookingStatus"]
) => {
  switch (status) {
    case "pending_payment":
      return "Awaiting Payment";

    case "confirmed":
      return "Confirmed";

    case "completed":
      return "Completed";

    case "cancelled":
      return "Cancelled";

    default:
      return "Unknown";
  }
};

// Booking Status CSS
const getBookingStatusClass = (
  status: Rental["bookingStatus"]
) => {
  switch (status) {
    case "pending_payment":
      return "bg-amber-50 text-amber-700";

    case "confirmed":
      return "bg-green-50 text-green-700";

    case "completed":
      return "bg-blue-50 text-blue-700";

    case "cancelled":
      return "bg-red-50 text-red-700";

    default:
      return "bg-gray-50 text-gray-700";
  }
};

// Payment Status Label
const getPaymentStatusLabel = (
  status: Rental["paymentStatus"]
) => {
  switch (status) {
    case "pending":
      return "Pending";

    case "paid":
      return "Paid";

    case "failed":
      return "Failed";

    case "refunded":
      return "Refunded";

    default:
      return "Unknown";
  }
};

// Payment Status CSS
const getPaymentStatusClass = (
  status: Rental["paymentStatus"]
) => {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700";

    case "paid":
      return "bg-green-50 text-green-700";

    case "failed":
      return "bg-red-50 text-red-700";

    case "refunded":
      return "bg-purple-50 text-purple-700";

    default:
      return "bg-gray-50 text-gray-700";
  }
};

// Rental Type Label
const getRentalTypeLabel = (
  type: Rental["rentalType"]
) => {
  switch (type) {
    case "daily":
      return "Daily";

    case "weekly":
      return "Weekly";

    case "monthly":
      return "Monthly";

    default:
      return "Rental";
  }
};

// ==========================================
// OWNER RENTAL REQUESTS PAGE
// ==========================================

export default function RentalRequestsPage() {
  const {
    loading: authLoading,
    isAuthenticated,
    isOwner,
  } = useAuth();

  const [bookings, setBookings] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  // ==========================================
  // FETCH OWNER BOOKINGS
  // ==========================================

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getOwnerBookings();

      if (!result.success) {
        throw new Error(result.message);
      }

      setBookings(result.data);
    } catch (error: unknown) {
      console.error("Owner bookings error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load customer bookings."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // INITIAL DATA LOAD
  // ==========================================

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !isOwner) {
      setLoading(false);
      return;
    }

    void fetchBookings();
  }, [
    authLoading,
    isAuthenticated,
    isOwner,
    fetchBookings,
  ]);

  // ==========================================
  // SEARCH BOOKINGS
  // ==========================================

  const filteredBookings = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const equipmentName =
        booking.equipment?.name ??
        booking.equipmentName ??
        "";

      const customerEmail = booking.customerEmail ?? "";

      const location =
        booking.equipment?.location ?? "";

      const bookingId = booking._id ?? "";

      return [
        equipmentName,
        customerEmail,
        location,
        bookingId,
      ].some((value) =>
        value.toLowerCase().includes(searchTerm)
      );
    });
  }, [bookings, search]);

  // ==========================================
  // BOOKING SUMMARY
  // ==========================================

  const totalBookings = bookings.length;

  const totalBookingValue = bookings.reduce(
    (total, booking) =>
      total + booking.totalAmount,
    0
  );

  const confirmedBookings = bookings.filter(
    (booking) => booking.bookingStatus === "confirmed"
  ).length;

  const paidBookings = bookings.filter(
    (booking) => booking.paymentStatus === "paid"
  ).length;

  // ==========================================
  // LOADING
  // ==========================================

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

  // ==========================================
  // AUTHENTICATION CHECK
  // ==========================================

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
          Please sign in with an equipment owner account to
          view your bookings.
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

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* Page Heading */}

      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-wider text-[#ea580c] uppercase">
            Owner Dashboard
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#442719] sm:text-3xl">
            My Equipment Rentals
          </h1>

          <p className="mt-2 text-sm text-[#9b8a7e]">
            Monitor customer bookings and rental payments for
            your equipment.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void fetchBookings()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#eee4da] bg-white px-4 py-2.5 text-sm font-semibold text-[#ea580c] transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </section>

      {/* Error Message */}

      {error && (
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center">
          <p className="text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => void fetchBookings()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-600"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      )}

      {/* Summary Cards */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total Bookings */}

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

        {/* Total Booking Value */}

        <div className="rounded-2xl border border-[#eee4da] bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#9b8a7e]">
              Total Booking Value
            </p>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#ea580c]">
              <Package size={21} />
            </div>
          </div>

          <h2 className="mt-3 text-3xl font-bold text-[#442719]">
            ৳{formatPrice(totalBookingValue)}
          </h2>
        </div>

        {/* Confirmed Bookings */}

        <div className="rounded-2xl border border-[#eee4da] bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#9b8a7e]">
              Confirmed Bookings
            </p>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle size={21} />
            </div>
          </div>

          <h2 className="mt-3 text-3xl font-bold text-[#442719]">
            {confirmedBookings}
          </h2>
        </div>

        {/* Paid Bookings */}

        <div className="rounded-2xl border border-[#eee4da] bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#9b8a7e]">
              Paid Bookings
            </p>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <CreditCard size={21} />
            </div>
          </div>

          <h2 className="mt-3 text-3xl font-bold text-[#442719]">
            {paidBookings}
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
            Search and view all bookings for your equipment.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[#eee4da] px-3 py-2.5">
          <Search
            size={18}
            className="text-[#9b8a7e]"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search bookings..."
            className="w-full bg-transparent text-sm text-[#442719] outline-none placeholder:text-[#b3a69c] sm:w-56"
          />
        </div>
      </section>

      {/* Booking List */}

      {filteredBookings.length > 0 ? (
        <section className="grid gap-5 lg:grid-cols-2">

          {filteredBookings.map((booking) => (
            <article
              key={booking._id}
              className="rounded-2xl border border-[#eee4da] bg-white p-5 shadow-sm transition hover:shadow-md"
            >

              {/* Equipment Information */}

              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">

                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#fff0e5]">
                    {booking.equipment?.image ? (
                      <Image
                        src={booking.equipment.image}
                        alt={
                          booking.equipment.name ||
                          "Equipment"
                        }
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
                      {booking.equipment?.name ||
                        booking.equipmentName ||
                        "Equipment"}
                    </h3>

                    <p className="mt-1 flex items-center gap-1 text-xs text-[#9b8a7e]">
                      <Hash size={12} />
                      {booking._id}
                    </p>
                  </div>

                </div>

                <span
                  className={`inline-flex shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${getBookingStatusClass(
                    booking.bookingStatus
                  )}`}
                >
                  {getBookingStatusLabel(
                    booking.bookingStatus
                  )}
                </span>
              </div>

              {/* Customer Details */}

              <div className="mt-5 space-y-3 border-t border-[#eee4da] pt-4">

                <div className="flex items-start gap-2 text-sm text-[#6b5a50]">
                  <UserRound
                    size={17}
                    className="mt-0.5 shrink-0"
                  />

                  <span className="break-all">
                    {booking.customerEmail}
                  </span>
                </div>

                <div className="flex items-start gap-2 text-sm text-[#6b5a50]">
                  <MapPin
                    size={17}
                    className="mt-0.5 shrink-0"
                  />

                  <span>
                    {booking.equipment?.location ||
                      "Location unavailable"}
                  </span>
                </div>

                <div className="flex items-start gap-2 text-sm text-[#6b5a50]">
                  <CalendarDays
                    size={17}
                    className="mt-0.5 shrink-0"
                  />

                  <span>
                    {formatDate(booking.startDate)} –{" "}
                    {formatDate(booking.endDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm text-[#6b5a50]">
                  <span>Rental Duration</span>

                  <span className="font-semibold">
                    {booking.rentalDays} days
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm text-[#6b5a50]">
                  <span>Rental Type</span>

                  <span className="font-semibold">
                    {getRentalTypeLabel(
                      booking.rentalType
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm text-[#6b5a50]">
                  <span>Quantity</span>

                  <span className="font-semibold">
                    {booking.quantity} items
                  </span>
                </div>

                <div className="flex items-start gap-2 text-sm text-[#6b5a50]">
                  <Phone
                    size={16}
                    className="mt-0.5 shrink-0"
                  />

                  <span>
                    {booking.phone || "Not provided"}
                  </span>
                </div>

                <div className="text-sm text-[#6b5a50]">
                  <span className="font-medium">
                    Delivery Address:
                  </span>

                  <p className="mt-1 break-words">
                    {booking.address || "Not provided"}
                  </p>
                </div>

                {booking.notes && (
                  <div className="rounded-lg bg-[#faf7f2] p-3 text-sm text-[#6b5a50]">
                    <p className="font-semibold">
                      Customer Notes
                    </p>

                    <p className="mt-1 break-words">
                      {booking.notes}
                    </p>
                  </div>
                )}

              </div>

              {/* Payment and Booking Information */}

              <div className="mt-5 space-y-4 border-t border-[#eee4da] pt-4">

                {/* Total Amount */}

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-[#9b8a7e]">
                      Total Rental Amount
                    </p>

                    <p className="mt-1 text-xl font-bold text-[#442719]">
                      ৳{formatPrice(booking.totalAmount)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-[#9b8a7e]">
                      Unit Price
                    </p>

                    <p className="mt-1 font-semibold text-[#442719]">
                      ৳{formatPrice(booking.unitPrice)}
                    </p>
                  </div>
                </div>

                {/* Status Information */}

                <div className="grid grid-cols-2 gap-3">

                  <div className="rounded-xl bg-[#faf7f2] p-3">
                    <p className="text-xs text-[#9b8a7e]">
                      Booking Status
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getBookingStatusClass(
                        booking.bookingStatus
                      )}`}
                    >
                      {getBookingStatusLabel(
                        booking.bookingStatus
                      )}
                    </span>
                  </div>

                  <div className="rounded-xl bg-[#faf7f2] p-3">
                    <p className="text-xs text-[#9b8a7e]">
                      Payment Status
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getPaymentStatusClass(
                        booking.paymentStatus
                      )}`}
                    >
                      {getPaymentStatusLabel(
                        booking.paymentStatus
                      )}
                    </span>
                  </div>

                </div>

                {/* Booking Date */}

                <p className="text-xs text-[#9b8a7e]">
                  Booked on {formatDate(booking.createdAt)}
                </p>

              </div>

            </article>
          ))}

        </section>
      ) : (
        /* Empty State */

        <section className="rounded-2xl border border-dashed border-[#e5d8ca] bg-white px-5 py-16 text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#faf7f2] text-[#a18d7e]">
            <ClipboardList size={38} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#442719]">
            {bookings.length === 0
              ? "No Bookings Yet"
              : "No Matching Bookings"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#9b8a7e]">
            {bookings.length === 0
              ? "When customers book your equipment, their booking details will appear here."
              : "No bookings match your current search."}
          </p>

          {bookings.length > 0 && (
            <button
              type="button"
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

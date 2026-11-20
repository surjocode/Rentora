
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Package,
  ShieldCheck,
  User,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

import {
  getEquipmentById,
  type Equipment,
} from "@/services/equipment.service";

import { createRental } from "@/services/rental.service";
import { useAuth } from "@/hooks/use-auth";

export default function EquipmentDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const id = params.id;

  // Authentication
  const {
    isAuthenticated,
    loading: authLoading,
    isRenter,
  } = useAuth();

  // Equipment State
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking Date State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Booking State
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // Get today's date in YYYY-MM-DD format
  const today = new Date();

  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  // Calculate rental days
  const totalDays =
    startDate && endDate
      ? Math.round(
          (Date.parse(`${endDate}T00:00:00Z`) -
            Date.parse(`${startDate}T00:00:00Z`)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  // Calculate estimated rental price
  const totalPrice =
    equipment && totalDays > 0
      ? totalDays * equipment.pricePerDay
      : 0;

  // Fetch Equipment Details
  useEffect(() => {
    let isActive = true;

    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getEquipmentById(id);

        if (!result.success) {
          throw new Error(result.message);
        }

        if (isActive) {
          setEquipment(result.data);
        }
      } catch (error) {
        if (isActive) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load equipment details"
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    if (id) {
      void fetchEquipment();
    }

    return () => {
      isActive = false;
    };
  }, [id]);

  // Handle Booking Request
  const handleBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setBookingError(null);
    setBookingSuccess(null);

    // Check Authentication Loading
    if (authLoading) {
      setBookingError("Please wait while checking your account.");
      return;
    }

    // Check User Authentication
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Only Renters Can Book Equipment
    if (!isRenter) {
      setBookingError("Only renter accounts can book equipment.");
      return;
    }

    // Validate Rental Dates
    if (!startDate || !endDate) {
      setBookingError("Please select both rental dates.");
      return;
    }

    if (startDate < minDate) {
      setBookingError("Start date cannot be in the past.");
      return;
    }

    if (totalDays <= 0) {
      setBookingError("End date must be after the start date.");
      return;
    }

    try {
      setBookingLoading(true);

      const result = await createRental({
        equipmentId: id,
        startDate,
        endDate,
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      setBookingSuccess(
        "Your rental request has been submitted successfully!"
      );

      setStartDate("");
      setEndDate("");
    } catch (error) {
      setBookingError(
        error instanceof Error
          ? error.message
          : "Failed to submit booking request."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf7f2] px-5 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Back Button */}
        <Link
          href="/all-equipment"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#806b5e] transition hover:text-orange-600"
        >
          <ArrowLeft size={18} />
          Back to Equipment
        </Link>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-96 items-center justify-center">
            <div className="text-center">
              <RefreshCw
                size={36}
                className="mx-auto animate-spin text-orange-600"
              />

              <p className="mt-4 text-sm text-[#806b5e]">
                Loading equipment details...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-white px-5 py-16 text-center">
            <Package
              size={48}
              className="mx-auto text-red-400"
            />

            <h2 className="mt-5 text-xl font-bold text-[#442719]">
              Unable to Load Equipment
            </h2>

            <p className="mt-3 text-sm text-red-600">
              {error}
            </p>

            <Link
              href="/all-equipment"
              className="mt-6 inline-flex rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              Browse Equipment
            </Link>
          </div>
        )}

        {/* Equipment Details */}
        {!loading && !error && equipment && (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Equipment Image */}
            <div className="relative flex min-h-80 items-center justify-center overflow-hidden rounded-3xl border border-[#eee5dc] bg-white shadow-sm lg:min-h-[500px]">
              {equipment.image ? (
                <Image
                  src={equipment.image}
                  alt={equipment.name}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              ) : (
                <Package
                  size={80}
                  className="text-orange-500"
                />
              )}
            </div>

            {/* Equipment Information */}
            <div className="rounded-3xl border border-[#eee5dc] bg-white p-6 shadow-sm sm:p-8">
              <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold text-orange-700">
                {equipment.category}
              </span>

              <h1 className="mt-5 text-3xl font-bold text-[#442719] sm:text-4xl">
                {equipment.name}
              </h1>

              <p className="mt-4 text-sm leading-7 text-[#806b5e]">
                {equipment.description}
              </p>

              {/* Price */}
              <div className="mt-7 rounded-2xl bg-[#faf7f2] p-5">
                <p className="text-sm text-[#806b5e]">
                  Rental Price
                </p>

                <p className="mt-2 text-3xl font-bold text-orange-600">
                  ৳{equipment.pricePerDay}
                </p>

                <p className="mt-1 text-xs text-[#806b5e]">
                  Rental price per day
                </p>
              </div>

              {/* Additional Information */}
              <div className="mt-7 space-y-5">
                <div className="flex items-center gap-3">
                  <MapPin
                    className="shrink-0 text-orange-600"
                    size={20}
                  />

                  <span className="text-sm text-[#665348]">
                    {equipment.location}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <User
                    className="shrink-0 text-orange-600"
                    size={20}
                  />

                  <span className="break-all text-sm text-[#665348]">
                    Owner: {equipment.ownerEmail}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <CalendarDays
                    className="shrink-0 text-orange-600"
                    size={20}
                  />

                  <span className="text-sm text-[#665348]">
                    Listed on{" "}
                    {new Date(equipment.createdAt).toLocaleDateString(
                      "en-GB"
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <ShieldCheck
                    className="shrink-0 text-orange-600"
                    size={20}
                  />

                  <span className="text-sm text-[#665348]">
                    Approved equipment
                  </span>
                </div>
              </div>

              {/* Booking Form */}
              <div className="mt-8 border-t border-[#eee5dc] pt-7">
                <h2 className="text-xl font-bold text-[#442719]">
                  Book This Equipment
                </h2>

                <p className="mt-2 text-sm text-[#806b5e]">
                  Select your rental period to request a booking.
                </p>

                <form
                  onSubmit={handleBooking}
                  className="mt-6 space-y-5"
                >
                  {/* Start Date */}
                  <div>
                    <label
                      htmlFor="startDate"
                      className="mb-2 block text-sm font-semibold text-[#665348]"
                    >
                      Rental Start Date
                    </label>

                    <input
                      id="startDate"
                      type="date"
                      value={startDate}
                      min={minDate}
                      onChange={(event) => {
                        setStartDate(event.target.value);
                        setBookingError(null);
                        setBookingSuccess(null);

                        if (
                          endDate &&
                          event.target.value >= endDate
                        ) {
                          setEndDate("");
                        }
                      }}
                      required
                      className="w-full rounded-xl border border-[#eee5dc] px-4 py-3 text-sm outline-none transition focus:border-orange-500"
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label
                      htmlFor="endDate"
                      className="mb-2 block text-sm font-semibold text-[#665348]"
                    >
                      Rental End Date
                    </label>

                    <input
                      id="endDate"
                      type="date"
                      value={endDate}
                      min={startDate || minDate}
                      onChange={(event) => {
                        setEndDate(event.target.value);
                        setBookingError(null);
                        setBookingSuccess(null);
                      }}
                      required
                      className="w-full rounded-xl border border-[#eee5dc] px-4 py-3 text-sm outline-none transition focus:border-orange-500"
                    />
                  </div>

                  {/* Rental Summary */}
                  {totalDays > 0 && (
                    <div className="rounded-2xl bg-[#faf7f2] p-5">
                      <h3 className="font-semibold text-[#442719]">
                        Rental Summary
                      </h3>

                      <div className="mt-4 space-y-3 text-sm">
                        <div className="flex justify-between text-[#806b5e]">
                          <span>Price per day</span>
                          <span>৳{equipment.pricePerDay}</span>
                        </div>

                        <div className="flex justify-between text-[#806b5e]">
                          <span>Total rental days</span>
                          <span>{totalDays} days</span>
                        </div>

                        <div className="flex justify-between border-t border-[#dfd0c2] pt-3 font-bold text-[#442719]">
                          <span>Estimated Total</span>

                          <span className="text-lg text-orange-600">
                            ৳{totalPrice.toLocaleString("en-BD")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Booking Error */}
                  {bookingError && (
                    <p
                      role="alert"
                      className="rounded-xl bg-red-50 p-3 text-sm text-red-600"
                    >
                      {bookingError}
                    </p>
                  )}

                  {/* Booking Success */}
                  {bookingSuccess && (
                    <div
                      role="status"
                      className="flex items-start gap-3 rounded-xl bg-green-50 p-4 text-sm text-green-700"
                    >
                      <CheckCircle2
                        size={20}
                        className="shrink-0"
                      />

                      <span>{bookingSuccess}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={
                      bookingLoading ||
                      authLoading ||
                      (isAuthenticated && !isRenter)
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-4 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {authLoading ? (
                      "Checking Account..."
                    ) : bookingLoading ? (
                      <>
                        <RefreshCw
                          size={18}
                          className="animate-spin"
                        />
                        Submitting Request...
                      </>
                    ) : !isAuthenticated ? (
                      "Login to Request Booking"
                    ) : !isRenter ? (
                      "Renter Account Required"
                    ) : (
                      "Request Booking"
                    )}
                  </button>

                  {/* Authentication Information */}
                  <p className="text-center text-xs leading-6 text-[#806b5e]">
                    {!isAuthenticated
                      ? "Please login to your account before requesting a booking."
                      : !isRenter
                        ? "Only renter accounts are allowed to book equipment."
                        : "Your booking request will be sent to the equipment owner for approval."}
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

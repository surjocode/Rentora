
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  ClipboardList,
  Phone,
  MapPinned,
  CheckCircle2,
} from "lucide-react";

import {
  getEquipmentById,
  type Equipment,
} from "@/services/equipment.service";

import {
  createBooking,
  type CreateBookingData,
} from "@/services/rental.service";

import { createCheckoutSession } from "@/services/payment.service";

// ==========================================
// HELPER
// ==========================================

function getTodayDate(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// ==========================================
// COMPONENT
// ==========================================

export default function EquipmentDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [equipment, setEquipment] = useState<Equipment | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking form states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Booking and payment states
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);

  // ==========================================
  // FETCH EQUIPMENT DETAILS
  // ==========================================

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
      } catch (err: unknown) {
        if (isActive) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load equipment details."
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

  // ==========================================
  // HANDLE STRIPE PAYMENT
  // ==========================================

  const handlePayment = async (bookingId: string) => {
    try {
      setBookingLoading(true);
      setBookingError(null);

      const result = await createCheckoutSession(bookingId);

      if (!result.success || !result.data?.checkoutUrl) {
        throw new Error(
          result.message || "Failed to initialize payment."
        );
      }

      // Redirect customer to Stripe Hosted Checkout
      window.location.assign(result.data.checkoutUrl);
    } catch (err: unknown) {
      setBookingError(
        err instanceof Error
          ? err.message
          : "Unable to start payment. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // ==========================================
  // HANDLE BOOKING
  // ==========================================

  const handleBooking = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!equipment) return;

    setBookingError(null);
    setBookingSuccess(null);

    if (!startDate || !endDate) {
      setBookingError("Please select your rental dates.");
      return;
    }

    if (endDate <= startDate) {
      setBookingError("End date must be after start date.");
      return;
    }

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > equipment.availableQuantity
    ) {
      setBookingError("Please select a valid quantity.");
      return;
    }

    const bookingData: CreateBookingData = {
      equipmentId: equipment._id,
      startDate,
      endDate,
      quantity,
      phone: phone.trim(),
      address: address.trim(),
      notes: notes.trim(),
    };

    try {
      setBookingLoading(true);

      // Step 1: Create booking in MongoDB
      const result = await createBooking(bookingData);

      if (!result.success || !result.data?._id) {
        throw new Error(
          result.message || "Failed to create booking."
        );
      }

      // Step 2: Save booking ID for payment retry
      const bookingId = result.data._id;

      setPendingBookingId(bookingId);

      setBookingSuccess(
        "Your booking has been created successfully. Please complete your payment through Stripe to confirm your booking."
      );

      // Step 3: Create Stripe Checkout Session and redirect
      await handlePayment(bookingId);
    } catch (err: unknown) {
      setBookingError(
        err instanceof Error
          ? err.message
          : "Failed to create booking. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

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
                  ৳{equipment.pricePerDay.toLocaleString("en-BD")}
                </p>

                <p className="mt-1 text-xs capitalize text-[#806b5e]">
                  Per {equipment.rentalType} rental period
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
                    {new Date(
                      equipment.createdAt
                    ).toLocaleDateString("en-GB")}
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

                <div className="flex items-center gap-3">
                  <Package
                    className="shrink-0 text-orange-600"
                    size={20}
                  />

                  <span className="text-sm text-[#665348]">
                    {equipment.availableQuantity} items available
                  </span>
                </div>
              </div>

              {/* Availability Information */}
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-center gap-3">
                  <ShieldCheck
                    size={22}
                    className="shrink-0 text-emerald-600"
                  />

                  <div>
                    <h2 className="font-semibold text-emerald-800">
                      Equipment Available
                    </h2>

                    <p className="mt-1 text-sm text-emerald-700">
                      This equipment is approved and listed on Rentora.
                    </p>
                  </div>
                </div>
              </div>

              {/* ====================================== */}
              {/* BOOKING FORM */}
              {/* ====================================== */}

              <div className="mt-8 border-t border-[#eee5dc] pt-8">

                <div className="mb-6">
                  <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold text-orange-700">
                    <ClipboardList size={15} />
                    Rental Booking
                  </span>

                  <h2 className="mt-4 text-2xl font-bold text-[#442719]">
                    Book This Equipment
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#806b5e]">
                    Select your rental dates and provide delivery information.
                  </p>
                </div>

                {/* Booking Error */}
                {bookingError && (
                  <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {bookingError}
                  </div>
                )}

                {/* Booking Success */}
                {bookingSuccess && (
                  <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        size={21}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />

                      <div className="w-full">
                        <p className="text-sm font-semibold text-emerald-800">
                          Booking Created
                        </p>

                        <p className="mt-1 text-sm leading-6 text-emerald-700">
                          {bookingSuccess}
                        </p>

                        {pendingBookingId && bookingError && (
                          <button
                            type="button"
                            onClick={() => {
                              void handlePayment(pendingBookingId);
                            }}
                            disabled={bookingLoading}
                            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {bookingLoading ? (
                              <>
                                <RefreshCw
                                  size={16}
                                  className="animate-spin"
                                />
                                Processing...
                              </>
                            ) : (
                              <>
                                <RefreshCw size={16} />
                                Retry Payment
                              </>
                            )}
                          </button>
                        )}

                        <Link
                          href="/dashboard/my-rentals"
                          className="mt-3 block text-sm font-semibold text-emerald-800 underline"
                        >
                          View My Rentals
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                <form
                  onSubmit={handleBooking}
                  className="space-y-5"
                >

                  {/* Rental Dates */}
                  <div className="grid gap-5 sm:grid-cols-2">

                    <div>
                      <label
                        htmlFor="startDate"
                        className="mb-2 block text-sm font-semibold text-[#665348]"
                      >
                        Start Date
                      </label>

                      <input
                        id="startDate"
                        type="date"
                        min={getTodayDate()}
                        value={startDate}
                        onChange={(event) => {
                          setStartDate(event.target.value);
                          setBookingError(null);
                        }}
                        required
                        className="w-full rounded-xl border border-[#eee5dc] bg-[#faf7f2] px-4 py-3 text-sm text-[#442719] outline-none transition focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="endDate"
                        className="mb-2 block text-sm font-semibold text-[#665348]"
                      >
                        End Date
                      </label>

                      <input
                        id="endDate"
                        type="date"
                        min={startDate || getTodayDate()}
                        value={endDate}
                        onChange={(event) => {
                          setEndDate(event.target.value);
                          setBookingError(null);
                        }}
                        required
                        className="w-full rounded-xl border border-[#eee5dc] bg-[#faf7f2] px-4 py-3 text-sm text-[#442719] outline-none transition focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label
                      htmlFor="quantity"
                      className="mb-2 block text-sm font-semibold text-[#665348]"
                    >
                      Quantity
                    </label>

                    <input
                      id="quantity"
                      type="number"
                      min={1}
                      max={equipment.availableQuantity}
                      value={quantity}
                      onChange={(event) => {
                        setQuantity(Number(event.target.value));
                        setBookingError(null);
                      }}
                      required
                      className="w-full rounded-xl border border-[#eee5dc] bg-[#faf7f2] px-4 py-3 text-sm text-[#442719] outline-none transition focus:border-orange-500"
                    />

                    <p className="mt-2 text-xs text-[#806b5e]">
                      Maximum listed quantity: {equipment.availableQuantity}
                    </p>
                  </div>

                  {/* Contact Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#665348]"
                    >
                      <Phone size={16} className="text-orange-600" />
                      Contact Phone
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(event) => {
                        setPhone(event.target.value);
                        setBookingError(null);
                      }}
                      placeholder="Enter your contact number"
                      required
                      maxLength={30}
                      className="w-full rounded-xl border border-[#eee5dc] bg-[#faf7f2] px-4 py-3 text-sm text-[#442719] outline-none transition focus:border-orange-500"
                    />
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <label
                      htmlFor="address"
                      className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#665348]"
                    >
                      <MapPinned size={16} className="text-orange-600" />
                      Delivery Address
                    </label>

                    <textarea
                      id="address"
                      value={address}
                      onChange={(event) => {
                        setAddress(event.target.value);
                        setBookingError(null);
                      }}
                      placeholder="Enter your complete delivery address"
                      required
                      minLength={5}
                      maxLength={500}
                      rows={3}
                      className="w-full resize-y rounded-xl border border-[#eee5dc] bg-[#faf7f2] px-4 py-3 text-sm text-[#442719] outline-none transition focus:border-orange-500"
                    />
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label
                      htmlFor="notes"
                      className="mb-2 block text-sm font-semibold text-[#665348]"
                    >
                      Additional Notes
                      <span className="ml-2 font-normal text-[#a18f82]">
                        (Optional)
                      </span>
                    </label>

                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="Any special instructions or requirements..."
                      maxLength={1000}
                      rows={3}
                      className="w-full resize-y rounded-xl border border-[#eee5dc] bg-[#faf7f2] px-4 py-3 text-sm text-[#442719] outline-none transition focus:border-orange-500"
                    />
                  </div>

                  {/* Price Notice */}
                  <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                    <p className="text-sm font-semibold text-orange-800">
                      Rental Price: ৳
                      {equipment.pricePerDay.toLocaleString("en-BD")} /{" "}
                      {equipment.rentalType}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-orange-700">
                      Final rental amount will be calculated securely by the server based on rental duration and quantity.
                    </p>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={bookingLoading || !!pendingBookingId}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-4 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {bookingLoading ? (
                      <>
                        <RefreshCw
                          size={18}
                          className="animate-spin"
                        />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ClipboardList size={18} />
                        Book & Pay Now
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs leading-5 text-[#806b5e]">
                    You will be redirected to Stripe's secure Checkout page. Your booking will be confirmed only after successful payment verification.
                  </p>

                </form>
              </div>

              {/* Explore More Equipment */}
              <Link
                href="/all-equipment"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-[#eee5dc] bg-white px-6 py-4 font-semibold text-[#806b5e] transition hover:border-orange-300 hover:text-orange-600"
              >
                <ArrowLeft size={18} />
                Explore More Equipment
              </Link>

            </div>
          </div>
        )}
      </div>
    </main>
  );
}

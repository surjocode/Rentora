
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Package,
  Search,
  MapPin,
  ArrowRight,
  CheckCircle,
  RefreshCw,
  Loader2,
  RotateCcw,
  X,
  CreditCard,
  Clock,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import { loadStripe } from "@stripe/stripe-js";

import { useAuth } from "@/hooks/use-auth";

import {
  getMyRentals,
  createPaymentIntent,
  type Rental,
} from "@/services/rental.service";

// Stripe initialization
const publishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

const stripePromise = publishableKey
  ? loadStripe(publishableKey)
  : null;

// Equipment interface
interface RentalEquipment {
  _id: string;
  name: string;
  image: string;
  category: string;
  location: string;
  pricePerDay: number;
}

// Rental interface
interface RentalWithEquipment extends Rental {
  equipment?: RentalEquipment;
}

type PaymentFilter = "all" | "paid" | "unpaid";

// Date formatter
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Price formatter
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-BD").format(price);
};

// Stripe Payment Form
interface PaymentFormProps {
  onSuccess: () => Promise<void>;
  onClose: () => void;
}

function PaymentForm({
  onSuccess,
  onClose,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setPaymentError(
        "Payment system is not ready. Please try again."
      );
      return;
    }

    try {
      setProcessing(true);
      setPaymentError(null);

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        throw new Error(
          error.message || "Payment failed. Please try again."
        );
      }

      if (paymentIntent?.status === "succeeded") {
        await onSuccess();
      } else {
        setPaymentError(
          "Payment has not been completed. Please try again."
        );
      }
    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : "Something went wrong during payment."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Stripe Card Details */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-[#442719]">
          Payment Information
        </h3>

        <div className="rounded-xl border border-[#eee4da] p-4">
          <PaymentElement />
        </div>
      </div>

      {paymentError && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
        >
          {paymentError}
        </p>
      )}

      {/* Payment Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onClose}
          disabled={processing}
          className="flex-1 rounded-xl border border-[#eee4da] px-5 py-3 text-sm font-semibold text-[#6b5a50] transition hover:bg-[#faf7f2] disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={!stripe || !elements || processing}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#ea580c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {processing ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard size={17} />
              Pay Now
            </>
          )}
        </button>
      </div>

      <p className="text-center text-xs text-[#9b8a7e]">
        Your payment is securely processed by Stripe.
      </p>
    </form>
  );
}

// Payment Modal Props
interface PaymentModalProps {
  clientSecret: string;
  rental: RentalWithEquipment;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

// Payment Modal
function PaymentModal({
  clientSecret,
  rental,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  if (!stripePromise) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6">
          <p className="text-red-600">
            Stripe Publishable Key is missing. Please configure
            NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-5 rounded-xl bg-[#ea580c] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const equipmentName =
    rental.equipment?.name || "Equipment";

  const equipmentImage = rental.equipment?.image;

  const pricePerDay =
    rental.equipment?.pricePerDay ??
    (rental.totalDays > 0
      ? rental.totalPrice /
        rental.totalDays /
        Math.max(1, rental.quantity)
      : 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="my-auto w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Modal Heading */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#442719]">
              Complete Your Payment
            </h2>

            <p className="mt-1 text-sm text-[#9b8a7e]">
              Review your booking and enter payment details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#9b8a7e] transition hover:bg-[#faf7f2] hover:text-[#442719]"
            aria-label="Close payment modal"
          >
            <X size={21} />
          </button>
        </div>

        {/* Booking Summary */}
        <div className="mb-6 rounded-2xl border border-[#eee4da] bg-[#faf7f2] p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <Package size={19} className="text-[#ea580c]" />

            <h3 className="font-bold text-[#442719]">
              Booking Details
            </h3>
          </div>

          {/* Equipment */}
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-white">
              {equipmentImage ? (
                <Image
                  src={equipmentImage}
                  alt={equipmentName}
                  fill
                  unoptimized
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[#a18d7e]">
                  <Package size={30} />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="text-xs text-[#9b8a7e]">
                {rental.equipment?.category || "Equipment"}
              </p>

              <h4 className="mt-1 font-bold text-[#442719]">
                {equipmentName}
              </h4>

              <p className="mt-1 text-xs text-[#9b8a7e]">
                {rental.equipment?.location || "Location unavailable"}
              </p>
            </div>
          </div>

          <div className="my-4 border-t border-[#e7dcd1]" />

          {/* Rental Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="flex items-center gap-1.5 text-xs text-[#9b8a7e]">
                <CalendarDays size={14} />
                Start Date
              </p>

              <p className="mt-1 text-sm font-semibold text-[#442719]">
                {formatDate(rental.startDate)}
              </p>
            </div>

            <div>
              <p className="flex items-center gap-1.5 text-xs text-[#9b8a7e]">
                <CalendarDays size={14} />
                End Date
              </p>

              <p className="mt-1 text-sm font-semibold text-[#442719]">
                {formatDate(rental.endDate)}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#9b8a7e]">
                Rental Duration
              </p>

              <p className="mt-1 text-sm font-semibold text-[#442719]">
                {rental.totalDays} days
              </p>
            </div>

            <div>
              <p className="text-xs text-[#9b8a7e]">
                Quantity
              </p>

              <p className="mt-1 text-sm font-semibold text-[#442719]">
                {rental.quantity} items
              </p>
            </div>
          </div>

          <div className="my-4 border-t border-[#e7dcd1]" />

          {/* Price Breakdown */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-3 text-[#806b5e]">
              <span>Price per day</span>

              <span className="font-medium text-[#442719]">
                ৳{formatPrice(pricePerDay)}
              </span>
            </div>

            <div className="flex justify-between gap-3 text-[#806b5e]">
              <span>Duration</span>

              <span className="font-medium text-[#442719]">
                {rental.totalDays} days
              </span>
            </div>

            <div className="flex justify-between gap-3 text-[#806b5e]">
              <span>Quantity</span>

              <span className="font-medium text-[#442719]">
                {rental.quantity} items
              </span>
            </div>

            <div className="flex justify-between gap-3 border-t border-[#e7dcd1] pt-3">
              <span className="font-bold text-[#442719]">
                Total Amount
              </span>

              <span className="text-xl font-bold text-[#ea580c]">
                ৳{formatPrice(rental.totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="mb-5 flex items-start gap-2 rounded-xl bg-green-50 p-3">
          <ShieldCheck
            size={19}
            className="mt-0.5 shrink-0 text-green-600"
          />

          <p className="text-xs leading-5 text-green-700">
            Your payment information is securely handled by Stripe.
            Rentora does not store your card details.
          </p>
        </div>

        {/* Stripe Payment Element */}
        <Elements
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <PaymentForm
            onSuccess={onSuccess}
            onClose={onClose}
          />
        </Elements>
      </div>
    </div>
  );
}

// Main My Rentals Page
export default function MyRentalsPage() {
  const {
    user,
    loading: authLoading,
    isAuthenticated,
    isRenter,
  } = useAuth();

  const [rentals, setRentals] = useState<RentalWithEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [paymentFilter, setPaymentFilter] =
    useState<PaymentFilter>("all");

  const [payingId, setPayingId] = useState<string | null>(null);

  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const [selectedRental, setSelectedRental] =
    useState<RentalWithEquipment | null>(null);

  // Close payment modal
  const closePaymentModal = () => {
    setClientSecret(null);
    setSelectedRental(null);
  };

  // Fetch customer bookings
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
          : "Failed to load your bookings."
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

  // Search and payment filter
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

      const paymentMatch =
        paymentFilter === "all" ||
        rental.paymentStatus === paymentFilter;

      return searchMatch && paymentMatch;
    });
  }, [rentals, search, paymentFilter]);

  // Booking Summary
  const totalBookings = rentals.length;

  const paidBookings = rentals.filter(
    (rental) => rental.paymentStatus === "paid"
  ).length;

  const unpaidBookings = rentals.filter(
    (rental) => rental.paymentStatus === "unpaid"
  ).length;

  // Create PaymentIntent and open modal
  const handlePayNow = async (rental: RentalWithEquipment) => {
    try {
      setPayingId(rental._id);
      setError(null);

      const result = await createPaymentIntent(rental._id);

      if (!result.success || !result.clientSecret) {
        throw new Error(
          result.message || "Failed to initialize payment."
        );
      }

      setSelectedRental(rental);
      setClientSecret(result.clientSecret);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to initialize payment."
      );
    } finally {
      setPayingId(null);
    }
  };

  // Payment succeeded
  // Backend webhook remains the source of truth.
  const handlePaymentSuccess = async () => {
    closePaymentModal();
    await fetchRentals();
  };

  // Loading
  if (authLoading || loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2
            className="mx-auto animate-spin text-[#ea580c]"
            size={36}
          />

          <p className="mt-3 text-sm text-[#9b8a7e]">
            Loading your bookings...
          </p>
        </div>
      </div>
    );
  }

  // Authentication check
  if (!isAuthenticated || !isRenter) {
    return (
      <div className="rounded-2xl border border-[#eee4da] bg-white px-5 py-16 text-center">
        <Package
          className="mx-auto text-[#ea580c]"
          size={42}
        />

        <h2 className="mt-4 text-xl font-bold text-[#442719]">
          Renter Access Required
        </h2>

        <p className="mt-2 text-sm text-[#9b8a7e]">
          Please sign in with a renter account to view your bookings.
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
      {/* Payment Modal */}
      {clientSecret && selectedRental && (
        <PaymentModal
          clientSecret={clientSecret}
          rental={selectedRental}
          onClose={closePaymentModal}
          onSuccess={handlePaymentSuccess}
        />
      )}

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
            Welcome, {user?.name}. View your equipment bookings and payments.
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

      {/* Booking Summary */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#eee4da] bg-white p-5">
          <p className="text-sm text-[#9b8a7e]">
            Total Bookings
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#442719]">
            {totalBookings}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#eee4da] bg-white p-5">
          <p className="text-sm text-[#9b8a7e]">
            Paid Bookings
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {paidBookings}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#eee4da] bg-white p-5">
          <p className="text-sm text-[#9b8a7e]">
            Unpaid Bookings
          </p>

          <h2 className="mt-2 text-3xl font-bold text-orange-600">
            {unpaidBookings}
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
            Keep track of your equipment bookings and payments.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex items-center gap-2 rounded-xl border border-[#eee4da] px-3 py-2.5">
            <Search size={18} className="text-[#9b8a7e]" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search bookings..."
              className="w-full bg-transparent text-sm text-[#442719] outline-none placeholder:text-[#b3a69c] sm:w-48"
            />
          </div>

          <select
            value={paymentFilter}
            onChange={(event) =>
              setPaymentFilter(event.target.value as PaymentFilter)
            }
            aria-label="Filter bookings by payment status"
            className="rounded-xl border border-[#eee4da] bg-white px-3 py-2.5 text-sm text-[#6b5a50] outline-none focus:border-[#ea580c]"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center">
          <p className="text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={() => void fetchRentals()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-600"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      )}

      {/* Bookings List */}
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
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                          rental.paymentStatus === "paid"
                            ? "bg-green-50 text-green-600"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {rental.paymentStatus === "paid" ? (
                          <CheckCircle size={15} />
                        ) : (
                          <Clock size={15} />
                        )}

                        {rental.paymentStatus === "paid"
                          ? "Paid"
                          : "Unpaid"}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-[#442719]">
                      {rental.equipment?.name ||
                        "Equipment no longer available"}
                    </h3>

                    <p className="mt-2 flex items-center gap-1.5 text-sm text-[#9b8a7e]">
                      <MapPin size={15} />
                      {rental.equipment?.location || "Location unavailable"}
                    </p>
                  </div>

                  {/* Booking Details */}
                  <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
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
                        Quantity
                      </p>

                      <p className="mt-1 font-medium text-[#442719]">
                        {rental.quantity} items
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
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          rental.paymentStatus === "paid"
                            ? "bg-green-50 text-green-600"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        Payment: {rental.paymentStatus}
                      </span>

                      {rental.paymentStatus === "unpaid" && (
                        <button
                          type="button"
                          onClick={() => void handlePayNow(rental)}
                          disabled={payingId === rental._id}
                          className="inline-flex items-center gap-2 rounded-lg bg-[#ea580c] px-4 py-2 text-xs font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {payingId === rental._id ? (
                            <Loader2
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <CreditCard size={14} />
                          )}

                          {payingId === rental._id
                            ? "Preparing Payment..."
                            : "Pay Now"}
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
        <section className="rounded-2xl border border-dashed border-[#e5d8ca] bg-white px-5 py-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#faf7f2] text-[#a18d7e]">
            <Package size={38} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#442719]">
            {rentals.length === 0
              ? "No Bookings Found"
              : "No Matching Bookings"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#9b8a7e]">
            {rentals.length === 0
              ? "You haven't booked any equipment yet. Explore our equipment collection and find what you need."
              : "No bookings match your current search or payment filter."}
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
              type="button"
              onClick={() => {
                setSearch("");
                setPaymentFilter("all");
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#faf0e8] px-6 py-3 text-sm font-semibold text-[#ea580c]"
            >
              <RotateCcw size={16} />
              Clear Filters
            </button>
          )}
        </section>
      )}

      {/* Payment Status Guide */}
      <section className="rounded-2xl border border-[#eee4da] bg-white p-6">
        <h2 className="mb-5 font-bold text-[#442719]">
          Payment Status Guide
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-500" size={20} />

            <span className="text-sm text-[#6b5a50]">
              Paid - Payment successfully completed
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="text-orange-500" size={20} />

            <span className="text-sm text-[#6b5a50]">
              Unpaid - Payment is still required
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}


"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import {
  XCircle,
  RefreshCw,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";

import { createCheckoutSession } from "@/services/payment.service";

// ==========================================
// PAYMENT CANCEL CONTENT
// ==========================================

function PaymentCancelContent() {
  const searchParams = useSearchParams();

  const bookingId = searchParams.get("booking_id");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ==========================================
  // RETRY PAYMENT
  // ==========================================

  const handleRetryPayment = async () => {
    if (!bookingId) {
      setError("Booking ID not found. Please check My Rentals.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await createCheckoutSession(bookingId);

      if (!result.success || !result.data?.checkoutUrl) {
        throw new Error(
          result.message || "Failed to initialize payment."
        );
      }

      // Redirect to Stripe Hosted Checkout
      window.location.assign(result.data.checkoutUrl);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to retry payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-5 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-[#eee5dc] bg-white p-8 text-center shadow-sm sm:p-10">

        {/* Cancel Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <XCircle
            size={42}
            className="text-red-600"
          />
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-3xl font-bold text-[#442719]">
          Payment Cancelled
        </h1>

        <p className="mt-4 text-sm leading-7 text-[#806b5e]">
          Your payment was not completed. Don't worry, your booking information
          is still saved. You can retry the payment whenever you're ready.
        </p>

        {/* Booking Information */}
        <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-left">
          <h2 className="font-semibold text-amber-800">
            Booking Status: Pending Payment
          </h2>

          <p className="mt-2 text-sm leading-6 text-amber-700">
            Your booking will not be confirmed until payment is successfully
            completed and verified by Rentora.
          </p>

          {bookingId && (
            <div className="mt-4 border-t border-amber-200 pt-3">
              <p className="text-xs font-semibold text-amber-800">
                Booking ID
              </p>

              <p className="mt-2 break-all font-mono text-xs text-amber-700">
                {bookingId}
              </p>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-left text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Retry Payment */}
        {bookingId && (
          <button
            type="button"
            onClick={() => void handleRetryPayment()}
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-4 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <RefreshCw
                  size={18}
                  className="animate-spin"
                />
                Processing...
              </>
            ) : (
              <>
                <RefreshCw size={18} />
                Retry Payment
              </>
            )}
          </button>
        )}

        {/* My Rentals */}
        <Link
          href="/dashboard/my-rentals"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#eee5dc] bg-white px-6 py-4 font-semibold text-[#806b5e] transition hover:border-orange-300 hover:text-orange-600"
        >
          <ShoppingBag size={18} />
          View My Rentals
        </Link>

        {/* Back to Equipment */}
        <Link
          href="/all-equipment"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#806b5e] transition hover:text-orange-600"
        >
          <ArrowLeft size={16} />
          Continue Exploring Equipment
        </Link>

      </div>
    </main>
  );
}

// ==========================================
// PAYMENT CANCEL PAGE
// ==========================================

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#faf7f2]">
          <p className="text-sm text-[#806b5e]">
            Loading payment information...
          </p>
        </main>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}

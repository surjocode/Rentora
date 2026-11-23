
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import {
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";

// ==========================================
// PAYMENT SUCCESS CONTENT
// ==========================================

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-5 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-[#eee5dc] bg-white p-8 text-center shadow-sm sm:p-10">

        {/* Success Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2
            size={42}
            className="text-emerald-600"
          />
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-3xl font-bold text-[#442719]">
          Payment Submitted!
        </h1>

        <p className="mt-4 text-sm leading-7 text-[#806b5e]">
          Thank you for your payment. Stripe has redirected you back to Rentora.
          Your payment is being verified securely.
        </p>

        {/* Confirmation Pending */}
        <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-left">
          <div className="flex items-start gap-3">
            <Clock
              size={22}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <div>
              <h2 className="font-semibold text-amber-800">
                Confirmation Pending
              </h2>

              <p className="mt-2 text-sm leading-6 text-amber-700">
                Your booking will be confirmed after our backend verifies the
                payment through Stripe webhook. Please check My Rentals shortly.
              </p>
            </div>
          </div>
        </div>

        {/* Stripe Session ID */}
        {sessionId && (
          <div className="mt-5 rounded-xl bg-[#faf7f2] p-4 text-left">
            <p className="text-xs font-semibold text-[#806b5e]">
              Stripe Checkout Session ID
            </p>

            <p className="mt-2 break-all font-mono text-xs text-[#442719]">
              {sessionId}
            </p>
          </div>
        )}

        {/* My Rentals */}
        <Link
          href="/dashboard/my-rentals"
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-4 font-semibold text-white transition hover:bg-orange-700"
        >
          View My Rentals
          <ArrowRight size={18} />
        </Link>

        {/* Explore Equipment */}
        <Link
          href="/all-equipment"
          className="mt-4 inline-block text-sm font-semibold text-[#806b5e] transition hover:text-orange-600"
        >
          Continue Exploring Equipment
        </Link>

      </div>
    </main>
  );
}

// ==========================================
// PAYMENT SUCCESS PAGE
// ==========================================

export default function PaymentSuccessPage() {
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
      <PaymentSuccessContent />
    </Suspense>
  );
}

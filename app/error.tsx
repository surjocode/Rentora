"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Rentora Application Error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-5 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-[#eee5dc] bg-white p-8 text-center shadow-lg sm:p-12">
        {/* Error Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-orange-600">
          <AlertTriangle size={42} />
        </div>

        {/* Heading */}
        <h1 className="mt-7 text-3xl font-bold text-[#442719] sm:text-4xl">
          Something Went Wrong!
        </h1>

        <p className="mt-4 text-sm leading-7 text-[#806b5e] sm:text-base">
          We are sorry! Something unexpected happened while loading this page.
          Please try again.
        </p>

        {/* Error Actions */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
          >
            <RefreshCcw size={18} />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e8ded4] px-6 py-3 font-semibold text-[#442719] transition hover:bg-[#faf7f2]"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>

        {/* Brand */}
        <div className="mt-10 border-t border-[#eee5dc] pt-6">
          <p className="text-lg font-bold text-[#442719]">Rentora</p>
          <p className="mt-1 text-xs text-[#806b5e]">
            Rent Smarter. Do More.
          </p>
        </div>
      </div>
    </main>
  );
}
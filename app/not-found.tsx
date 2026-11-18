import Link from "next/link";
import { Home, Search, Wrench } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-5 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-[#eee5dc] bg-white p-8 text-center shadow-lg sm:p-12">
        {/* Brand Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#442719] text-white shadow-md">
          <Wrench size={38} />
        </div>

        {/* 404 */}
        <h1 className="mt-7 text-7xl font-extrabold tracking-tight text-orange-600 sm:text-8xl">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold text-[#442719] sm:text-3xl">
          Page Not Found!
        </h2>

        <p className="mt-4 text-sm leading-7 text-[#806b5e] sm:text-base">
          Oops! The page you are looking for does not exist or may have been
          moved. Let's get you back on track.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <Link
            href="/all-equipment"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e8ded4] px-6 py-3 font-semibold text-[#442719] transition hover:bg-[#faf7f2]"
          >
            <Search size={18} />
            Explore Equipment
          </Link>
        </div>

        {/* Brand Footer */}
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

import Link from "next/link";
import {
  ArrowRight,
  Search,
  ShieldCheck,
  Clock3,
  Truck,
  Wrench,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-teal-100/50 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:py-28 lg:px-8">
        {/* Left Content */}
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Your Modern Rental Marketplace
          </div>

          <h1 className="max-w-xl text-4xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Rent Smarter.
            <span className="mt-2 block text-emerald-600">
              Do More.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-gray-600 sm:text-lg">
            From everyday essentials to professional equipment,
            find what you need, when you need it. Rent easily,
            save more, and make every project happen with Rentora.
          </p>

          {/* Search Bar */}
          <form
            action="/all-equipment"
            method="GET"
            className="mt-8 flex max-w-xl flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-lg sm:flex-row"
          >
            <div className="flex flex-1 items-center gap-3 px-3">
              <Search className="shrink-0 text-emerald-600" size={22} />

              <input
                type="search"
                name="search"
                placeholder="What equipment do you need?"
                className="w-full bg-transparent py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Search
              <ArrowRight size={18} />
            </button>
          </form>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/all-equipment"
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 font-semibold text-white transition hover:bg-gray-800"
            >
              Explore Equipment
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-600 px-6 py-3.5 font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              Become an Owner
            </Link>
          </div>

          {/* Trust Features */}
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-4 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600" />
              Secure Rental
            </span>

            <span className="flex items-center gap-2">
              <Clock3 size={18} className="text-emerald-600" />
              Flexible Booking
            </span>

            <span className="flex items-center gap-2">
              <Truck size={18} className="text-emerald-600" />
              Easy Pickup
            </span>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="relative mx-auto w-full max-w-lg">
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-600 to-teal-800 shadow-2xl">
            <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full border border-white/20" />
            <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full border border-white/20" />

            <div className="relative z-10 text-center text-white">
              <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 shadow-xl backdrop-blur-sm sm:h-52 sm:w-52">
                <Wrench
                  size={110}
                  strokeWidth={1.2}
                  className="rotate-[-25deg] text-white sm:h-36 sm:w-36"
                />
              </div>

              <h2 className="mt-8 text-3xl font-bold sm:text-4xl">
                Rentora
              </h2>

              <p className="mt-2 text-sm text-emerald-50 sm:text-base">
                Everything you need. Just rent it.
              </p>
            </div>

            {/* Floating Equipment Card */}
            <div className="absolute left-4 top-8 rounded-2xl border border-white/40 bg-white p-3 shadow-xl sm:left-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
                  <Wrench className="text-emerald-700" size={23} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    Power Tools
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Ready to rent
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Trust Card */}
            <div className="absolute right-4 bottom-8 rounded-2xl border border-white/40 bg-white p-3 shadow-xl sm:right-8">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-emerald-600" size={25} />
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    Safe & Secure
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Rent with confidence
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs font-medium tracking-wide text-gray-500">
         
          </p>
        </div>
      </div>
    </section>
  );
}

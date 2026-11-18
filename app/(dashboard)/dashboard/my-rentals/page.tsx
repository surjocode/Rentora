
import Link from "next/link";
import {
  Package,
  Search,
  CalendarDays,
  MapPin,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function MyRentalsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
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
            View and manage all your equipment rental bookings.
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

      {/* Rental Summary */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#eee4da] bg-white p-5">
          <p className="text-sm text-[#9b8a7e]">Total Bookings</p>
          <h2 className="mt-2 text-3xl font-bold text-[#442719]">0</h2>
        </div>

        <div className="rounded-2xl border border-[#eee4da] bg-white p-5">
          <p className="text-sm text-[#9b8a7e]">Active Rentals</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">0</h2>
        </div>

        <div className="rounded-2xl border border-[#eee4da] bg-white p-5">
          <p className="text-sm text-[#9b8a7e]">Pending Bookings</p>
          <h2 className="mt-2 text-3xl font-bold text-orange-600">0</h2>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="flex flex-col gap-4 rounded-2xl border border-[#eee4da] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold text-[#442719]">
            Booking History
          </h2>

          <p className="mt-1 text-sm text-[#9b8a7e]">
            Keep track of your equipment bookings.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex items-center gap-2 rounded-xl border border-[#eee4da] px-3 py-2.5">
            <Search size={18} className="text-[#9b8a7e]" />

            <input
              type="search"
              placeholder="Search rentals..."
              className="w-full bg-transparent text-sm text-[#442719] outline-none placeholder:text-[#b3a69c] sm:w-48"
            />
          </div>

          <select
            defaultValue="all"
            aria-label="Filter rentals by status"
            className="rounded-xl border border-[#eee4da] bg-white px-3 py-2.5 text-sm text-[#6b5a50] outline-none focus:border-[#ea580c]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </section>

      {/* Empty State */}
      <section className="rounded-2xl border border-dashed border-[#e5d8ca] bg-white px-5 py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#faf7f2] text-[#a18d7e]">
          <Package size={38} />
        </div>

        <h2 className="mt-5 text-xl font-bold text-[#442719]">
          No Rentals Found
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#9b8a7e]">
          You haven't booked any equipment yet. Explore our
          equipment collection and find what you need.
        </p>

        <Link
          href="/all-equipment"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#ea580c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          Explore Equipment
          <ArrowRight size={18} />
        </Link>
      </section>

      {/* Booking Status Information */}
      <section className="rounded-2xl border border-[#eee4da] bg-white p-6">
        <h2 className="mb-5 font-bold text-[#442719]">
          Booking Status Guide
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="flex items-center gap-3">
            <Clock className="text-orange-500" size={20} />
            <span className="text-sm text-[#6b5a50]">Pending</span>
          </div>

          <div className="flex items-center gap-3">
            <CheckCircle className="text-blue-500" size={20} />
            <span className="text-sm text-[#6b5a50]">Confirmed</span>
          </div>

          <div className="flex items-center gap-3">
            <CalendarDays className="text-green-500" size={20} />
            <span className="text-sm text-[#6b5a50]">Active</span>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="text-purple-500" size={20} />
            <span className="text-sm text-[#6b5a50]">Completed</span>
          </div>

          <div className="flex items-center gap-3">
            <XCircle className="text-red-500" size={20} />
            <span className="text-sm text-[#6b5a50]">Cancelled</span>
          </div>
        </div>
      </section>
    </div>
  );
}

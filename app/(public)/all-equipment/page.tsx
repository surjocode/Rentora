
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Package,
} from "lucide-react";

export const metadata = {
  title: "All Equipment | Rentora",
  description:
    "Explore and rent quality equipment from Rentora.",
};

export default function AllEquipmentPage() {
  return (
    <main className="min-h-screen bg-[#faf7f2] px-5 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Heading */}
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
            Explore Our Collection
          </span>

          <h1 className="mt-5 text-3xl font-bold text-[#442719] sm:text-4xl lg:text-5xl">
            Find the Right Equipment
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#806b5e] sm:text-base">
            Discover quality equipment for your projects, work, and everyday
            needs. Rent what you need, whenever you need it.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 rounded-2xl border border-[#eee5dc] bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="relative md:col-span-1">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a877a]"
              />

              <input
                type="search"
                placeholder="Search equipment..."
                className="w-full rounded-xl border border-[#eee5dc] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <SlidersHorizontal
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a877a]"
              />

              <select
                defaultValue=""
                className="w-full appearance-none rounded-xl border border-[#eee5dc] bg-white px-4 py-3 pl-11 text-sm text-[#665348] outline-none focus:border-orange-500"
              >
                <option value="">All Categories</option>
              </select>
            </div>

            {/* Sorting */}
            <div className="relative">
              <ArrowUpDown
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a877a]"
              />

              <select
                defaultValue="newest"
                className="w-full appearance-none rounded-xl border border-[#eee5dc] bg-white px-4 py-3 pl-11 text-sm text-[#665348] outline-none focus:border-orange-500"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Equipment Results */}
        <div className="rounded-2xl border border-dashed border-[#dfd0c2] bg-white px-5 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
            <Package size={32} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#442719]">
            No Equipment Available Yet
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#806b5e]">
            We are preparing our equipment collection. Please check back
            later to explore available rental equipment.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

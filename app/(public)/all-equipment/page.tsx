
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Package,
  MapPin,
  RefreshCw,
} from "lucide-react";

import { useEquipment } from "@/hooks/use-equipment";
import { useCategories } from "@/hooks/use-categories";
import type {
  Equipment,
  EquipmentFilters,
} from "@/services/equipment.service";

export default function AllEquipmentPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sort, setSort] =
    useState<EquipmentFilters["sort"]>("newest");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch equipment from backend
  const {
    equipment,
    loading: equipmentLoading,
    error: equipmentError,
    refetch,
  } = useEquipment({
    search: debouncedSearch,
    category: selectedCategory,
    sort,
  });

  // Fetch categories from backend
  const {
    categories,
    loading: categoriesLoading,
  } = useCategories();

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedCategory("");
    setSort("newest");
  };

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
            <div className="relative">
              <Search
                size={20}
                className="absolute top-1/2 left-4 -translate-y-1/2 text-[#9a877a]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search equipment..."
                className="w-full rounded-xl border border-[#eee5dc] py-3 pr-4 pl-11 text-sm transition outline-none focus:border-orange-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <SlidersHorizontal
                size={18}
                className="absolute top-1/2 left-4 -translate-y-1/2 text-[#9a877a]"
              />

              <select
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(event.target.value)
                }
                disabled={categoriesLoading}
                className="w-full appearance-none rounded-xl border border-[#eee5dc] bg-white px-4 py-3 pl-11 text-sm text-[#665348] outline-none focus:border-orange-500"
              >
                <option value="">All Categories</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting */}
            <div className="relative">
              <ArrowUpDown
                size={18}
                className="absolute top-1/2 left-4 -translate-y-1/2 text-[#9a877a]"
              />

              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target.value as EquipmentFilters["sort"]
                  )
                }
                className="w-full appearance-none rounded-xl border border-[#eee5dc] bg-white px-4 py-3 pl-11 text-sm text-[#665348] outline-none focus:border-orange-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Heading */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-[#442719]">
            Available Equipment
          </h2>

          <p className="text-sm text-[#806b5e]">
            {equipment.length} equipment found
          </p>
        </div>

        {/* Loading */}
        {equipmentLoading && (
          <div className="flex min-h-60 items-center justify-center">
            <div className="text-center">
              <RefreshCw
                size={32}
                className="mx-auto animate-spin text-orange-600"
              />

              <p className="mt-4 text-sm text-[#806b5e]">
                Loading equipment...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!equipmentLoading && equipmentError && (
          <div className="rounded-2xl border border-red-200 bg-white px-5 py-12 text-center">
            <p className="font-semibold text-red-600">
              {equipmentError}
            </p>

            <button
              onClick={() => void refetch()}
              className="mt-5 rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Equipment Grid */}
        {!equipmentLoading &&
          !equipmentError &&
          equipment.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {equipment.map((item) => (
                <EquipmentCard
                  key={item._id}
                  equipment={item}
                />
              ))}
            </div>
          )}

        {/* Empty State */}
        {!equipmentLoading &&
          !equipmentError &&
          equipment.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#dfd0c2] bg-white px-5 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                <Package size={32} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-[#442719]">
                No Equipment Found
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#806b5e]">
                We could not find any equipment matching your search.
                Try changing your search or category filter.
              </p>

              <button
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                Clear Filters
              </button>
            </div>
          )}
      </div>
    </main>
  );
}

// Equipment Card
function EquipmentCard({
  equipment,
}: {
  equipment: Equipment;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#eee5dc] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={`/equipment/${equipment._id}`}
        className="block"
      >
        <div className="relative h-56 overflow-hidden bg-[#f3eee8]">
          {equipment.image ? (
            <Image
              src={equipment.image}
              alt={equipment.name}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition duration-500 hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[#9a877a]">
              <Package size={48} />
            </div>
          )}
        </div>

        <div className="p-5">
          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
            {equipment.category}
          </span>

          <h3 className="mt-4 text-lg font-bold text-[#442719]">
            {equipment.name}
          </h3>

          <p className="mt-2 flex items-center gap-2 text-sm text-[#806b5e]">
            <MapPin size={15} />
            {equipment.location}
          </p>

          <div className="mt-5 flex items-center justify-between border-t border-[#eee5dc] pt-4">
            <p className="text-lg font-bold text-orange-600">
              ৳{equipment.pricePerDay}
              <span className="text-xs font-normal text-[#806b5e]">
                {" "}/ day
              </span>
            </p>

            <span className="rounded-lg bg-[#442719] px-4 py-2 text-xs font-semibold text-white">
              View Details
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

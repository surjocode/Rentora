
"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ArrowUpDown,
  Package,
  MapPin,
  RefreshCw,
  Heart,
  ArrowRight,
  Loader2,
  SlidersHorizontal,
  X,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import { useEquipment } from "@/hooks/use-equipment";
import { useCategories } from "@/hooks/use-categories";
import { useFavorites } from "@/hooks/use-favorites";

import type {
  Equipment,
  EquipmentFilters,
} from "@/services/equipment.service";

const RENTAL_TYPES = ["daily", "weekly", "monthly"] as const;

const PAGE_SIZE = 9;
const MAX_CATEGORIES = 9;

export default function AllEquipmentPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");

  const [location, setLocation] = useState("");
  const [debouncedLocation, setDebouncedLocation] = useState("");

  const [rentalType, setRentalType] =
    useState<EquipmentFilters["rentalType"]>();

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [availableOnly, setAvailableOnly] = useState(false);

  const [sort, setSort] =
    useState<EquipmentFilters["sort"]>("newest");

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [updatingFavoriteId, setUpdatingFavoriteId] =
    useState<string | null>(null);

  const {
    favorites,
    loading: favoritesLoading,
    addToFavorites,
    removeFromFavorites,
  } = useFavorites();

  const favoriteIds = useMemo(
    () => new Set(favorites.map((item) => item._id)),
    [favorites],
  );

  const {
    categories,
    loading: categoriesLoading,
  } = useCategories();

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Debounced Location
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLocation(location.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [location]);

  // Unique database categories
  const uniqueCategories = useMemo(() => {
    const seen = new Set<string>();

    return categories
      .map((category) => category.trim())
      .filter((category) => {
        const normalized = category.toLowerCase();

        if (!category || seen.has(normalized)) {
          return false;
        }

        seen.add(normalized);
        return true;
      })
      .slice(0, MAX_CATEGORIES);
  }, [categories]);

  // Price validation
  const priceRangeInvalid =
    minPrice !== "" &&
    maxPrice !== "" &&
    Number(minPrice) > Number(maxPrice);

  const validMinPrice =
    minPrice.trim() !== "" &&
    Number.isFinite(Number(minPrice)) &&
    Number(minPrice) >= 0
      ? Number(minPrice)
      : undefined;

  const validMaxPrice =
    maxPrice.trim() !== "" &&
    Number.isFinite(Number(maxPrice)) &&
    Number(maxPrice) >= 0
      ? Number(maxPrice)
      : undefined;

  // Equipment query
  // Search and Location are sent separately.
  const {
    equipment,
    loading: equipmentLoading,
    error: equipmentError,
    refetch,
  } = useEquipment({
    search: debouncedSearch,
    location: debouncedLocation,
    category: selectedCategory,
    rentalType,
    minPrice: priceRangeInvalid ? undefined : validMinPrice,
    maxPrice: priceRangeInvalid ? undefined : validMaxPrice,
    available: availableOnly ? true : undefined,
    sort,
  });

  // Pagination
  const totalPages = Math.ceil(equipment.length / PAGE_SIZE);

  // Keep the displayed page valid when filtered results decrease.
  const safeCurrentPage = Math.min(
    currentPage,
    Math.max(totalPages, 1),
  );

  const paginatedEquipment = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;

    return equipment.slice(startIndex, startIndex + PAGE_SIZE);
  }, [equipment, safeCurrentPage]);

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  // Favorite Toggle
  const handleFavoriteToggle = async (equipmentId: string) => {
    if (favoritesLoading || updatingFavoriteId) return;

    try {
      setUpdatingFavoriteId(equipmentId);

      if (favoriteIds.has(equipmentId)) {
        await removeFromFavorites(equipmentId);
        toast.success("Removed from favorites");
      } else {
        await addToFavorites(equipmentId);
        toast.success("Added to favorites");
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update favorites",
      );
    } finally {
      setUpdatingFavoriteId(null);
    }
  };

  // Clear Filters
  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");

    setSelectedCategory("");

    setLocation("");
    setDebouncedLocation("");

    setRentalType(undefined);

    setMinPrice("");
    setMaxPrice("");

    setAvailableOnly(false);
    setSort("newest");

    setCurrentPage(1);
  };

  const activeFilterCount = [
    selectedCategory,
    location.trim(),
    rentalType,
    minPrice,
    maxPrice,
    availableOnly,
  ].filter(Boolean).length;

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Page Heading */}
        <div className="mb-8">
          <span className="inline-block rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-foreground">
            Explore Our Collection
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Find the Right Equipment
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Discover quality equipment for your projects, work, and everyday
            needs. Rent what you need, whenever you need it.
          </p>
        </div>

        {/* Search and Sort */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-md">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search equipment..."
              className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-foreground"
            />
          </div>

          <div className="relative w-full sm:w-48">
            <ArrowUpDown
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value as EquipmentFilters["sort"]);
                setCurrentPage(1);
              }}
              className="w-full appearance-none rounded-lg border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:border-foreground"
            >
              <option value="newest">Recently Added</option>
              <option value="oldest">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen((open) => !open)}
            className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground lg:hidden"
          >
            <SlidersHorizontal size={17} />
            Filters

            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Main Layout */}
        <div className="grid items-start gap-7 lg:grid-cols-[260px_minmax(0,1fr)]">

          {/* Filter Sidebar */}
          <aside
            className={`${
              mobileFiltersOpen ? "block" : "hidden"
            } rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-24 lg:block`}
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} />

                <h2 className="text-lg font-bold text-foreground">
                  Filters
                </h2>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
              >
                <RotateCcw size={13} />
                Clear All
              </button>
            </div>

            {/* Category */}
            <FilterSection title="Category">
              <label className="mb-3 flex cursor-pointer items-center gap-2 text-sm text-foreground">
                <input
                  type="radio"
                  name="category"
                  checked={!selectedCategory}
                  onChange={() => {
                    setSelectedCategory("");
                    setCurrentPage(1);
                  }}
                  className="h-4 w-4 accent-[var(--foreground)]"
                />
                All Categories
              </label>

              {categoriesLoading ? (
                <p className="py-3 text-xs text-muted-foreground">
                  Loading categories...
                </p>
              ) : uniqueCategories.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {uniqueCategories.map((category) => (
                    <label
                      key={category}
                      title={category}
                      className={`flex min-h-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border px-1.5 py-2 text-center transition ${
                        selectedCategory === category
                          ? "border-foreground bg-secondary text-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={() => {
                          setSelectedCategory(category);
                          setCurrentPage(1);
                        }}
                        className="h-3.5 w-3.5 accent-[var(--foreground)]"
                      />

                      <span className="line-clamp-2 text-[10px] font-medium leading-tight">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="py-3 text-xs text-muted-foreground">
                  No categories found.
                </p>
              )}
            </FilterSection>

            {/* Location */}
            <FilterSection title="Location">
              <div className="relative">
                <MapPin
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                  type="text"
                  value={location}
                  onChange={(event) => {
                    setLocation(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Enter location"
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:border-foreground"
                />
              </div>
            </FilterSection>

            {/* Rental Type */}
            <FilterSection title="Rental Type">
              {RENTAL_TYPES.map((type) => (
                <label
                  key={type}
                  className="mb-2 flex cursor-pointer items-center gap-2 text-sm capitalize text-muted-foreground transition hover:text-foreground"
                >
                  <input
                    type="radio"
                    name="rentalType"
                    checked={rentalType === type}
                    onChange={() => {
                      setRentalType(type);
                      setCurrentPage(1);
                    }}
                    className="h-4 w-4 accent-[var(--foreground)]"
                  />

                  {type}
                </label>
              ))}

              <button
                type="button"
                onClick={() => {
                  setRentalType(undefined);
                  setCurrentPage(1);
                }}
                className="mt-1 text-xs font-semibold text-muted-foreground underline hover:text-foreground"
              >
                Clear rental type
              </button>
            </FilterSection>

            {/* Price Range */}
            <FilterSection title="Price Range">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label
                    htmlFor="minPrice"
                    className="mb-1 block text-xs text-muted-foreground"
                  >
                    Minimum
                  </label>

                  <input
                    id="minPrice"
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(event) => {
                      setMinPrice(event.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="৳ Min"
                    className="w-full min-w-0 rounded-lg border border-border bg-background px-2 py-2.5 text-sm text-foreground outline-none focus:border-foreground"
                  />
                </div>

                <div>
                  <label
                    htmlFor="maxPrice"
                    className="mb-1 block text-xs text-muted-foreground"
                  >
                    Maximum
                  </label>

                  <input
                    id="maxPrice"
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(event) => {
                      setMaxPrice(event.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="৳ Max"
                    className="w-full min-w-0 rounded-lg border border-border bg-background px-2 py-2.5 text-sm text-foreground outline-none focus:border-foreground"
                  />
                </div>
              </div>

              {priceRangeInvalid && (
                <p className="mt-2 text-xs text-destructive">
                  Minimum price cannot exceed maximum price.
                </p>
              )}
            </FilterSection>

            {/* Availability */}
            <FilterSection title="Availability">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(event) => {
                    setAvailableOnly(event.target.checked);
                    setCurrentPage(1);
                  }}
                  className="h-4 w-4 rounded accent-[var(--foreground)]"
                />

                Available Only
              </label>
            </FilterSection>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-2 w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-foreground transition hover:opacity-80"
            >
              Clear All Filters
            </button>

            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground lg:hidden"
            >
              Show Results
              <X size={16} />
            </button>
          </aside>

          {/* Equipment Results */}
          <section className="min-w-0">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Available Equipment
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {equipment.length} equipment found
                </p>
              </div>
            </div>

            {/* Loading */}
            {equipmentLoading && (
              <div className="flex min-h-80 items-center justify-center rounded-2xl border border-border bg-card">
                <div className="text-center">
                  <RefreshCw
                    size={32}
                    className="mx-auto animate-spin text-foreground"
                  />

                  <p className="mt-4 text-sm text-muted-foreground">
                    Loading equipment...
                  </p>
                </div>
              </div>
            )}

            {/* Error */}
            {!equipmentLoading && equipmentError && (
              <div className="rounded-2xl border border-border bg-card px-5 py-12 text-center">
                <p className="font-semibold text-destructive">
                  {equipmentError}
                </p>

                <button
                  type="button"
                  onClick={() => void refetch()}
                  className="mt-5 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Equipment Grid */}
            {!equipmentLoading &&
              !equipmentError &&
              !priceRangeInvalid &&
              equipment.length > 0 && (
                <>
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {paginatedEquipment.map((item) => (
                      <EquipmentCard
                        key={item._id}
                        equipment={item}
                        isFavorite={favoriteIds.has(item._id)}
                        favoriteLoading={favoritesLoading}
                        updatingFavorite={updatingFavoriteId === item._id}
                        onFavoriteToggle={handleFavoriteToggle}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 0 && (
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentPage((page) => Math.max(1, page - 1))
                        }
                        disabled={safeCurrentPage === 1}
                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft size={16} />
                        Prev
                      </button>

                      {pageNumbers.map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          aria-label={`Go to page ${page}`}
                          aria-current={
                            safeCurrentPage === page ? "page" : undefined
                          }
                          className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition ${
                            safeCurrentPage === page
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card text-foreground hover:bg-secondary"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() =>
                          setCurrentPage((page) =>
                            Math.min(totalPages, page + 1),
                          )
                        }
                        disabled={safeCurrentPage === totalPages}
                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Next
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}

            {/* Invalid Price Range */}
            {!equipmentLoading &&
              !equipmentError &&
              priceRangeInvalid && (
                <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-12 text-center">
                  <p className="font-semibold text-destructive">
                    Please correct your price range.
                  </p>
                </div>
              )}

            {/* Empty */}
            {!equipmentLoading &&
              !equipmentError &&
              !priceRangeInvalid &&
              equipment.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-foreground">
                    <Package size={32} />
                  </div>

                  <h2 className="mt-5 text-xl font-bold text-foreground">
                    No Equipment Found
                  </h2>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                    We could not find any equipment matching your filters.
                    Try changing your search or clearing the filters.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
          </section>
        </div>
      </div>
    </main>
  );
}

/* Reusable Filter Section */
function FilterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-border py-5">
      <h3 className="mb-4 text-sm font-bold text-foreground">
        {title}
      </h3>

      {children}
    </div>
  );
}

/* Equipment Card */
interface EquipmentCardProps {
  equipment: Equipment;
  isFavorite: boolean;
  favoriteLoading: boolean;
  updatingFavorite: boolean;
  onFavoriteToggle: (equipmentId: string) => void;
}

function EquipmentCard({
  equipment,
  isFavorite,
  favoriteLoading,
  updatingFavorite,
  onFavoriteToggle,
}: EquipmentCardProps) {
  const imageUrl =
    equipment.image ||
    (equipment as Equipment & { imageUrl?: string }).imageUrl ||
    "";

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-secondary">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={equipment.name}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Package size={48} />
          </div>
        )}

        {/* Availability */}
        <div className="absolute left-4 top-4">
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              equipment.availableQuantity > 0
                ? "bg-background text-foreground"
                : "bg-destructive text-white"
            }`}
          >
            {equipment.availableQuantity > 0
              ? "Available"
              : "Unavailable"}
          </span>
        </div>

        {/* Favorite */}
        <button
          type="button"
          onClick={() => onFavoriteToggle(equipment._id)}
          disabled={favoriteLoading || updatingFavorite}
          aria-label={
            isFavorite ? "Remove from favorites" : "Add to favorites"
          }
          aria-pressed={isFavorite}
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-md transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {updatingFavorite ? (
            <Loader2
              size={20}
              className="animate-spin text-foreground"
            />
          ) : (
            <Heart
              size={21}
              className={
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "fill-transparent text-foreground"
              }
            />
          )}
        </button>
      </div>

      {/* Information */}
      <div className="p-5">
        <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
          {equipment.category}
        </span>

        <h3 className="mt-4 line-clamp-1 text-lg font-bold text-foreground">
          {equipment.name}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
          {equipment.description}
        </p>

        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={15} />
          <span className="line-clamp-1">
            {equipment.location}
          </span>
        </p>

        {/* Price */}
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
          <div>
            <p className="text-xs text-muted-foreground">
              Rental Price
            </p>

            <p className="mt-1 text-lg font-bold text-foreground">
              ৳{equipment.pricePerDay}

              <span className="ml-1 text-xs font-normal text-muted-foreground">
                / {equipment.rentalType || "daily"}
              </span>
            </p>
          </div>

          <Link
            href={`/equipment/${equipment._id}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            View Details
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

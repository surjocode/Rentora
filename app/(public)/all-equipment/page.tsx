
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Package,
  MapPin,
  RefreshCw,
  Heart,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { useEquipment } from "@/hooks/use-equipment";
import { useCategories } from "@/hooks/use-categories";
import { useFavorites } from "@/hooks/use-favorites";

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
    [favorites]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

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

  const {
    categories,
    loading: categoriesLoading,
  } = useCategories();

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
          : "Failed to update favorites"
      );
    } finally {
      setUpdatingFavoriteId(null);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedCategory("");
    setSort("newest");
  };

  return (
    <main className="min-h-screen bg-background px-5 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-foreground">
            Explore Our Collection
          </span>

          <h1 className="mt-5 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Find the Right Equipment
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Discover quality equipment for your projects, work, and everyday
            needs. Rent what you need, whenever you need it.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">

            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search equipment..."
                className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground outline-none focus:border-foreground"
              />
            </div>

            <div className="relative">
              <SlidersHorizontal
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <select
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(event.target.value)
                }
                disabled={categoriesLoading}
                className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-3 pl-11 text-sm text-foreground outline-none focus:border-foreground"
              >
                <option value="">All Categories</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <ArrowUpDown
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target.value as EquipmentFilters["sort"]
                  )
                }
                className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-3 pl-11 text-sm text-foreground outline-none focus:border-foreground"
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
          <h2 className="text-xl font-bold text-foreground">
            Available Equipment
          </h2>

          <p className="text-sm text-muted-foreground">
            {equipment.length} equipment found
          </p>
        </div>

        {/* Loading */}
        {equipmentLoading && (
          <div className="flex min-h-60 items-center justify-center">
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
              className="mt-5 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
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
                  isFavorite={favoriteIds.has(item._id)}
                  favoriteLoading={favoritesLoading}
                  updatingFavorite={updatingFavoriteId === item._id}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>
          )}

        {/* Empty */}
        {!equipmentLoading &&
          !equipmentError &&
          equipment.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-foreground">
                <Package size={32} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-foreground">
                No Equipment Found
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                We could not find any equipment matching your search.
                Try changing your search or category filter.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
              >
                Clear Filters
              </button>
            </div>
          )}
      </div>
    </main>
  );
}

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
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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

        {/* Favorite Button */}
        <button
          type="button"
          onClick={() => onFavoriteToggle(equipment._id)}
          disabled={favoriteLoading || updatingFavorite}
          aria-label={
            isFavorite ? "Remove from favorites" : "Add to favorites"
          }
          aria-pressed={isFavorite}
          title={
            isFavorite ? "Remove from Favorites" : "Add to Favorites"
          }
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

      {/* Equipment Information */}
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
          <span className="line-clamp-1">{equipment.location}</span>
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
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            View Details
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

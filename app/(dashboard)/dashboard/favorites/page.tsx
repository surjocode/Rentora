
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Search,
  Package,
  ArrowRight,
  ShoppingBag,
  MapPin,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { useFavorites } from "@/hooks/use-favorites";
import type { Equipment } from "@/services/equipment.service";

export default function FavoritesPage() {
  const {
    favorites,
    loading,
    error,
    removeFromFavorites,
    refetch,
  } = useFavorites();

  const [search, setSearch] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const filteredFavorites = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return favorites;

    return favorites.filter((item) =>
      [
        item.name,
        item.category,
        item.location,
        item.description,
      ].some((value) => value?.toLowerCase().includes(term))
    );
  }, [favorites, search]);

  const getImageUrl = (item: Equipment) => {
    const imageItem = item as Equipment & { imageUrl?: string };

    return imageItem.image || imageItem.imageUrl || "";
  };

  const handleRemove = async (equipmentId: string) => {
    try {
      setRemovingId(equipmentId);

      await removeFromFavorites(equipmentId);

      toast.success("Removed from favorites");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to remove favorite"
      );
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <main className="mx-auto max-w-7xl space-y-8">
      {/* Heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Customer Dashboard
          </p>

          <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            My Favorites
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Keep your favorite equipment in one place.
          </p>
        </div>

        <Link
          href="/all-equipment"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <ShoppingBag size={18} />
          Explore Equipment
        </Link>
      </section>

      {/* Summary */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-red-500">
            <Heart size={28} className="fill-red-500" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Saved Equipment
            </p>

            <h2 className="text-2xl font-bold text-foreground">
              {favorites.length} Items
            </h2>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold text-foreground">
            Saved Equipment
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Your personal equipment wishlist.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5">
          <Search size={18} className="text-muted-foreground" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search favorites..."
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground sm:w-52"
          />
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-20">
          <Loader2
            size={36}
            className="animate-spin text-muted-foreground"
          />

          <p className="mt-4 text-sm text-muted-foreground">
            Loading your favorites...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <AlertCircle
            size={36}
            className="mx-auto text-destructive"
          />

          <h2 className="mt-4 font-bold text-foreground">
            Failed to load favorites
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>

          <button
            type="button"
            onClick={() => void refetch().catch(() => undefined)}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && favorites.length === 0 && (
        <section className="rounded-2xl border border-dashed border-border bg-card px-5 py-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            <Heart size={38} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-foreground">
            No Favorites Yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            You haven&apos;t saved any equipment yet. Browse our collection
            and add equipment to your favorites.
          </p>

          <Link
            href="/all-equipment"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            <Package size={18} />
            Browse Equipment
            <ArrowRight size={18} />
          </Link>
        </section>
      )}

      {/* No Search Results */}
      {!loading &&
        !error &&
        favorites.length > 0 &&
        filteredFavorites.length === 0 && (
          <div className="rounded-2xl border border-border bg-card py-16 text-center">
            <Search
              size={36}
              className="mx-auto text-muted-foreground"
            />

            <h2 className="mt-4 font-bold text-foreground">
              No Equipment Found
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Try searching with another name or category.
            </p>
          </div>
        )}

      {/* Favorites Grid */}
      {!loading && !error && filteredFavorites.length > 0 && (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredFavorites.map((equipment) => {
            const imageUrl = getImageUrl(equipment);

            return (
              <article
                key={equipment._id}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Equipment Image */}
                <div className="relative h-56 w-full overflow-hidden bg-secondary">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={equipment.name}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Package size={42} />
                      <p className="text-sm">Image not available</p>
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-background px-3 py-1.5 text-xs font-semibold text-foreground">
                    {equipment.availableQuantity > 0
                      ? "Available"
                      : "Unavailable"}
                  </span>

                  {/* Remove Favorite */}
                  <button
                    type="button"
                    onClick={() => void handleRemove(equipment._id)}
                    disabled={removingId === equipment._id}
                    aria-label={`Remove ${equipment.name} from favorites`}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-background text-red-500 shadow-md transition hover:scale-110 disabled:opacity-50"
                  >
                    {removingId === equipment._id ? (
                      <Loader2 size={19} className="animate-spin" />
                    ) : (
                      <Heart
                        size={21}
                        className="fill-red-500 text-red-500"
                      />
                    )}
                  </button>
                </div>

                {/* Equipment Information */}
                <div className="space-y-4 p-5">
                  <div>
                    <h3 className="line-clamp-1 text-lg font-bold text-foreground">
                      {equipment.name}
                    </h3>

                    <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Package size={15} />
                      {equipment.category}
                    </p>
                  </div>

                  <p className="line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
                    {equipment.description}
                  </p>

                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={15} />
                    {equipment.location}
                  </p>

                  <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Rental Price
                      </p>

                      <p className="mt-1 font-bold text-foreground">
                        ৳{equipment.pricePerDay}
                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                          / {equipment.rentalType || "daily"}
                        </span>
                      </p>
                    </div>

                    <Link
                      href={`/equipment/${equipment._id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                    >
                      View Details
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

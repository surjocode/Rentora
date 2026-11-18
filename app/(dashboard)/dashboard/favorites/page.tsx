
import Link from "next/link";
import {
  Heart,
  Search,
  Package,
  ArrowRight,
  Trash2,
  ShoppingBag,
} from "lucide-react";

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page Heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#ea580c]">
            Customer Dashboard
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#442719] sm:text-3xl">
            My Favorites
          </h1>

          <p className="mt-2 text-sm text-[#9b8a7e]">
            Keep your favorite equipment in one place.
          </p>
        </div>

        <Link
          href="/all-equipment"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ea580c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          <ShoppingBag size={18} />
          Explore Equipment
        </Link>
      </section>

      {/* Favorites Summary */}
      <section className="rounded-2xl border border-[#eee4da] bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
            <Heart size={28} />
          </div>

          <div>
            <p className="text-sm text-[#9b8a7e]">
              Saved Equipment
            </p>

            <h2 className="text-2xl font-bold text-[#442719]">
              0 Items
            </h2>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="flex flex-col gap-4 rounded-2xl border border-[#eee4da] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold text-[#442719]">
            Saved Equipment
          </h2>

          <p className="mt-1 text-sm text-[#9b8a7e]">
            Your personal equipment wishlist.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[#eee4da] px-3 py-2.5">
          <Search size={18} className="text-[#9b8a7e]" />

          <input
            type="search"
            placeholder="Search favorites..."
            className="w-full bg-transparent text-sm text-[#442719] outline-none placeholder:text-[#b3a69c] sm:w-52"
          />
        </div>
      </section>

      {/* Empty State */}
      <section className="rounded-2xl border border-dashed border-[#e5d8ca] bg-white px-5 py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-pink-50 text-pink-500">
          <Heart size={38} />
        </div>

        <h2 className="mt-5 text-xl font-bold text-[#442719]">
          No Favorites Yet
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#9b8a7e]">
          You haven't saved any equipment yet. Browse our
          collection and add equipment to your favorites.
        </p>

        <Link
          href="/all-equipment"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#ea580c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          <Package size={18} />
          Browse Equipment
          <ArrowRight size={18} />
        </Link>
      </section>

      {/* Information */}
      <section className="flex items-start gap-3 rounded-2xl border border-orange-100 bg-orange-50 p-5">
        <div className="rounded-lg bg-white p-2 text-[#ea580c]">
          <Trash2 size={19} />
        </div>

        <div>
          <h3 className="font-semibold text-[#442719]">
            Manage Your Wishlist
          </h3>

          <p className="mt-1 text-sm leading-6 text-[#8b6b54]">
            You will be able to add and remove equipment from
            your favorites list whenever you want.
          </p>
        </div>
      </section>
    </div>
  );
}

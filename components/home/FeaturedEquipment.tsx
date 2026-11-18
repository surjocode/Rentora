
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Star, Package } from "lucide-react";

export interface Equipment {
  _id: string;
  name: string;
  image: string;
  pricePerDay: number;
  rating?: number;
  reviewCount?: number;
}

interface FeaturedEquipmentProps {
  equipment: Equipment[];
}

export default function FeaturedEquipment({
  equipment,
}: FeaturedEquipmentProps) {
  return (
    <section className="bg-[#faf7f2] px-5 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-8 bg-orange-500" />
            <h2 className="text-2xl font-extrabold text-[#442719] sm:text-3xl">
              Featured Equipment
            </h2>
            <span className="h-0.5 w-8 bg-orange-500" />
          </div>

          <Link
            href="/all-equipment"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 transition hover:text-orange-700"
          >
            View All Equipment
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* Equipment Grid */}
        {equipment.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {equipment.map((item) => (
              <article
                key={item._id}
                className="group overflow-hidden rounded-2xl border border-[#eee5dc] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-[#f2eee9]">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      <Package size={48} />
                    </div>
                  )}

                  {/* Favorite Button */}
                  <button
                    type="button"
                    aria-label={`Add ${item.name} to favorites`}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#442719] shadow-sm transition hover:text-red-500"
                  >
                    <Heart size={19} />
                  </button>
                </div>

                {/* Equipment Information */}
                <div className="p-4">
                  <h3 className="truncate text-base font-bold text-[#442719]">
                    {item.name}
                  </h3>

                  {/* Rating */}
                  <div className="mt-2 flex items-center gap-1.5">
                    <Star
                      size={16}
                      className="fill-amber-400 text-amber-400"
                    />

                    <span className="text-sm font-semibold text-gray-700">
                      {item.rating !== undefined
                        ? item.rating.toFixed(1)
                        : "Not rated"}
                    </span>

                    <span className="text-xs text-gray-400">
                      ({item.reviewCount ?? 0} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-lg font-extrabold text-green-700">
                      ৳ {item.pricePerDay.toLocaleString("en-BD")}
                      <span className="text-xs font-medium text-gray-500">
                        {" "}/ day
                      </span>
                    </p>

                    <Link
                      href={`/equipment/${item._id}`}
                      className="rounded-lg bg-[#442719] px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-700"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#d9cfc5] bg-white px-5 py-12 text-center">
            <Package className="mx-auto mb-3 text-orange-500" size={36} />

            <h3 className="font-bold text-[#442719]">
              No Featured Equipment Yet
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Featured equipment will appear here when available.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

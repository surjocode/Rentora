
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Star,
  Package,
  MapPin,
} from "lucide-react";

export interface Equipment {
  _id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  pricePerDay: number;
  location: string;
  ownerEmail: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
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
    <section
      id="featured-equipment"
      className="relative overflow-hidden bg-white px-5 py-20 transition-colors duration-300 dark:bg-[#17120f] sm:px-6 lg:px-8"
    >
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -right-32 top-10 h-72 w-72 rounded-full bg-orange-100/40 blur-3xl dark:bg-orange-500/10" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end"
        >
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-bold tracking-wider text-orange-700 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-400">
              <Package size={15} />
              TOP PICKS FOR YOU
            </span>

            <h2 className="text-3xl font-black tracking-tight text-[#442719] dark:text-[#f5e9dc] sm:text-4xl lg:text-5xl">
              Featured{" "}
              <span className="text-[#ea580c] dark:text-orange-400">
                Equipment
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#74675f] dark:text-gray-400 sm:text-base">
              Discover quality equipment at affordable prices.
              Find the right tools and make your next project easier.
            </p>
          </div>

          <Link
            href="/all-equipment"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-[#442719]/15 bg-white px-5 py-3 text-sm font-bold text-[#442719] shadow-sm transition-all duration-300 hover:border-orange-500 hover:bg-[#ea580c] hover:text-white dark:border-white/15 dark:bg-[#2b211a] dark:text-[#f5e9dc] dark:hover:bg-orange-600"
          >
            View All Equipment
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

        {/* Equipment Grid */}
        {equipment.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {equipment.map((item, index) => (
              <motion.article
                key={item._id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                className="group overflow-hidden rounded-3xl border border-[#eee5dc] bg-[#faf7f2] shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-900/10 dark:border-white/10 dark:bg-[#241c17] dark:hover:border-orange-500/40"
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden bg-[#eee8e1] dark:bg-[#342820]">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#a18d7b] dark:text-gray-500">
                      <Package size={55} strokeWidth={1.3} />
                    </div>
                  )}

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-60" />

                  {/* Category Badge */}
                  <span className="absolute bottom-4 left-4 rounded-full border border-white/30 bg-white/95 px-3.5 py-1.5 text-xs font-bold text-[#442719] shadow-md backdrop-blur-md">
                    {item.category}
                  </span>
                </div>

                {/* Equipment Information */}
                <div className="p-5">
                  {/* Equipment Name */}
                  <h3 className="truncate text-lg font-extrabold text-[#442719] transition-colors duration-300 group-hover:text-[#ea580c] dark:text-[#f5e9dc] dark:group-hover:text-orange-400">
                    {item.name}
                  </h3>

                  {/* Location */}
                  <div className="mt-3 flex items-center gap-2 text-sm text-[#81746a] dark:text-gray-400">
                    <MapPin
                      size={16}
                      className="shrink-0 text-[#ea580c] dark:text-orange-400"
                    />
                    <span className="truncate">{item.location}</span>
                  </div>

                  {/* Rating */}
                  <div className="mt-3 flex items-center gap-2">
                    <Star
                      size={16}
                      className="fill-amber-400 text-amber-400"
                    />

                    <span className="text-sm font-bold text-[#442719] dark:text-[#f5e9dc]">
                      {item.rating !== undefined
                        ? item.rating.toFixed(1)
                        : "Not rated"}
                    </span>

                    <span className="text-xs text-[#9b8c80] dark:text-gray-500">
                      ({item.reviewCount ?? 0} reviews)
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="my-4 border-t border-[#e9dfd4] dark:border-white/10" />

                  {/* Price and Details */}
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-[#918276] dark:text-gray-400">
                        Rental Price
                      </p>

                      <p className="mt-1 text-xl font-black text-[#087443] dark:text-emerald-400">
                        ৳{item.pricePerDay.toLocaleString("en-BD")}
                        <span className="ml-1 text-xs font-semibold text-[#918276] dark:text-gray-400">
                          / day
                        </span>
                      </p>
                    </div>

                    <Link
                      href={`/equipment/${item._id}`}
                      className="group/button inline-flex shrink-0 items-center gap-2 rounded-full bg-[#442719] px-4 py-3 text-xs font-bold text-white shadow-sm transition-all duration-300 hover:bg-[#ea580c] dark:bg-orange-600 dark:hover:bg-orange-500"
                    >
                      Details
                      <ArrowRight
                        size={15}
                        className="transition-transform duration-300 group-hover/button:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-3xl border border-dashed border-[#d9cfc5] bg-[#faf7f2] px-5 py-16 text-center dark:border-white/15 dark:bg-[#241c17]">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-[#ea580c] dark:bg-orange-500/10 dark:text-orange-400">
              <Package size={34} />
            </div>

            <h3 className="text-xl font-bold text-[#442719] dark:text-[#f5e9dc]">
              No Featured Equipment Yet
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#74675f] dark:text-gray-400">
              There is no featured equipment available right now.
              Please explore all equipment to discover more options.
            </p>

            <Link
              href="/all-equipment"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#ea580c] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#c2410c]"
            >
              Explore Equipment
              <ArrowRight size={17} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}


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

import { useAuth } from "@/hooks/use-auth";

// ==========================================
// TYPES
// ==========================================

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

// ==========================================
// FEATURED EQUIPMENT
// ==========================================

export default function FeaturedEquipment({
  equipment,
}: FeaturedEquipmentProps) {
  const { isAuthenticated } = useAuth();

  return (
    <section
      id="featured-equipment"
      className="relative overflow-hidden bg-background px-5 py-20 transition-colors duration-300 sm:px-6 lg:px-8"
    >
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -right-32 top-10 h-72 w-72 rounded-full bg-secondary/60 blur-3xl" />

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
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-xs font-bold tracking-wider text-foreground">
              <Package size={15} />
              TOP PICKS FOR YOU
            </span>

            <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Featured{" "}
              <span className="text-muted-foreground">
                Equipment
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Discover quality equipment at affordable prices.
              Find the right tools and make your next project easier.
            </p>
          </div>

          <Link
            href="/all-equipment"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-bold text-foreground shadow-sm transition-all duration-300 hover:border-ring hover:bg-secondary"
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {equipment.slice(0, 6).map((item, index) => (
              <motion.article
                key={item._id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-ring hover:shadow-xl"
              >
                {/* Equipment Image */}
                <div className="relative h-56 overflow-hidden bg-secondary">

                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <Package size={55} strokeWidth={1.3} />
                    </div>
                  )}

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-60" />

                  {/* Category Badge */}
                  <span className="absolute bottom-4 left-4 rounded-full border border-white/30 bg-white/95 px-3.5 py-1.5 text-xs font-bold text-[#212121] shadow-md backdrop-blur-md">
                    {item.category}
                  </span>

                  {/* Availability Badge */}
                  <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-green-700 shadow-md">
                    Available
                  </span>
                </div>

                {/* Equipment Information */}
                <div className="p-5">

                  {/* Equipment Name */}
                  <h3 className="truncate text-lg font-extrabold text-foreground transition-colors duration-300 group-hover:text-primary">
                    {item.name}
                  </h3>

                  {/* Location */}
                  <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin
                      size={16}
                      className="shrink-0"
                    />
                    <span className="truncate">
                      {item.location}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="mt-3 flex items-center gap-2">
                    <Star
                      size={16}
                      className="text-amber-500"
                    />

                    <span className="text-sm font-bold text-foreground">
                      {item.rating !== undefined
                        ? item.rating.toFixed(1)
                        : "Not rated"}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      ({item.reviewCount ?? 0} reviews)
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="my-4 border-t border-border" />

                  {/* Price and Details */}
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Rental Price
                      </p>

                      <p className="mt-1 text-xl font-black text-foreground">
                        ৳{item.pricePerDay.toLocaleString("en-BD")}
                        <span className="ml-1 text-xs font-semibold text-muted-foreground">
                          / day
                        </span>
                      </p>
                    </div>

                    {/* Login / Equipment Details */}
                    <Link
                      href={
                        isAuthenticated
                          ? `/equipment/${item._id}`
                          : "/login"
                      }
                      className="group/button inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-3 text-xs font-bold text-primary-foreground shadow-sm transition-all duration-300 hover:opacity-85"
                    >
                      View Details

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
          <div className="rounded-3xl border border-dashed border-border bg-card px-5 py-16 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-foreground">
              <Package size={34} />
            </div>

            <h3 className="text-xl font-bold text-foreground">
              No Featured Equipment Yet
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              There is no featured equipment available right now.
              Please explore all equipment to discover more options.
            </p>

            <Link
              href="/all-equipment"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-85"
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

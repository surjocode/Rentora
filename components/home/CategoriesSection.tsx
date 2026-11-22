
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shapes,
  Camera,
  HardHat,
  Wrench,
  Drill,
  Tent,
  Truck,
  Tractor,
  Speaker,
  Laptop,
  Package,
} from "lucide-react";

interface CategoriesSectionProps {
  categories: string[];
}

const getCategoryIcon = (category: string) => {
  const name = category.toLowerCase();

  if (name.includes("construction") || name.includes("building")) {
    return HardHat;
  }

  if (name.includes("camera") || name.includes("photography")) {
    return Camera;
  }

  if (name.includes("tool") || name.includes("repair")) {
    return Wrench;
  }

  if (name.includes("drill") || name.includes("machine")) {
    return Drill;
  }

  if (name.includes("event") || name.includes("party")) {
    return Tent;
  }

  if (name.includes("vehicle") || name.includes("transport")) {
    return Truck;
  }

  if (name.includes("farm") || name.includes("agriculture")) {
    return Tractor;
  }

  if (name.includes("audio") || name.includes("sound")) {
    return Speaker;
  }

  if (name.includes("computer") || name.includes("electronic")) {
    return Laptop;
  }

  return Package;
};

export default function CategoriesSection({
  categories,
}: CategoriesSectionProps) {
  return (
    <section
      id="categories"
      className="relative overflow-hidden bg-background px-5 py-20 transition-colors duration-300 sm:px-6 lg:px-8"
    >
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-secondary/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-xs font-bold tracking-wider text-foreground">
            <Shapes size={15} />
            EXPLORE OUR COLLECTION
          </span>

          <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Browse by{" "}
            <span className="text-muted-foreground">
              Categories
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Discover the right equipment for every project.
            Explore different categories and find exactly what you need.
          </p>

          <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-foreground" />
        </motion.div>

        {/* Category Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
            {categories.map((category, index) => {
              const Icon = getCategoryIcon(category);

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.07,
                  }}
                >
                  <Link
                    href={`/all-equipment?category=${encodeURIComponent(category)}`}
                    className="group relative flex min-h-[170px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-card p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-ring hover:shadow-xl sm:min-h-[185px]"
                  >
                    {/* Hover Background */}
                    <div className="absolute inset-0 bg-secondary/0 transition-all duration-300 group-hover:bg-secondary/70" />

                    {/* Icon */}
                    <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-foreground transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon size={30} strokeWidth={1.8} />
                    </div>

                    {/* Category Name */}
                    <h3 className="relative line-clamp-2 text-sm font-bold text-foreground transition-colors duration-300 group-hover:text-muted-foreground sm:text-base">
                      {category}
                    </h3>

                    {/* Explore Indicator */}
                    <div className="relative mt-3 flex items-center gap-1 text-xs font-semibold text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      Explore
                      <ArrowRight size={13} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border bg-card px-5 py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-foreground">
              <Shapes size={32} />
            </div>

            <h3 className="text-lg font-bold text-foreground">
              No Categories Available
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Categories will appear here once they are loaded from the database.
              Please check back soon.
            </p>
          </div>
        )}

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            href="/all-equipment"
            className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-bold text-primary-foreground shadow-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-85 hover:shadow-xl"
          >
            Explore All Equipment

            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

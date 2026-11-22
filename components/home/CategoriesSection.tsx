
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
      className="relative overflow-hidden bg-[#faf7f2] px-5 py-20 transition-colors duration-300 dark:bg-[#17120f] sm:px-6 lg:px-8"
    >
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-orange-200/20 blur-3xl dark:bg-orange-500/10" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-bold tracking-wider text-orange-700 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-400">
            <Shapes size={15} />
            EXPLORE OUR COLLECTION
          </span>

          <h2 className="text-3xl font-black tracking-tight text-[#442719] dark:text-[#f5e9dc] sm:text-4xl lg:text-5xl">
            Browse by{" "}
            <span className="text-[#ea580c] dark:text-orange-400">
              Categories
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#74675f] dark:text-gray-400 sm:text-base">
            Discover the right equipment for every project.
            Explore different categories and find exactly what you need.
          </p>

          <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-[#ea580c]" />
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
                    className="group relative flex min-h-[170px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#e9dfd4] bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-900/10 dark:border-white/10 dark:bg-[#241c17] dark:hover:border-orange-500/50 sm:min-h-[185px]"
                  >
                    {/* Hover Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-orange-100/0 transition-all duration-300 group-hover:from-orange-50 group-hover:to-orange-100/60 dark:group-hover:from-orange-950/30 dark:group-hover:to-orange-900/10" />

                    {/* Icon */}
                    <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#faf0e6] text-[#ea580c] transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-[#ea580c] group-hover:text-white dark:bg-orange-500/10 dark:text-orange-400 dark:group-hover:bg-orange-600 dark:group-hover:text-white">
                      <Icon size={30} strokeWidth={1.8} />
                    </div>

                    {/* Category Name */}
                    <h3 className="relative line-clamp-2 text-sm font-bold text-[#442719] transition-colors duration-300 group-hover:text-[#ea580c] dark:text-[#f5e9dc] dark:group-hover:text-orange-400 sm:text-base">
                      {category}
                    </h3>

                    {/* Explore Indicator */}
                    <div className="relative mt-3 flex items-center gap-1 text-xs font-semibold text-[#9b8270] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 dark:text-gray-400">
                      Explore
                      <ArrowRight size={13} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#d9cfc5] bg-white px-5 py-16 text-center dark:border-white/15 dark:bg-[#241c17]">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
              <Shapes size={32} />
            </div>

            <h3 className="text-lg font-bold text-[#442719] dark:text-[#f5e9dc]">
              No Categories Available
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#74675f] dark:text-gray-400">
              Categories will appear here once they are loaded from the database.
              Please check back soon.
            </p>
          </div>
        )}

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            href="/all-equipment"
            className="group inline-flex items-center gap-3 rounded-full bg-[#442719] px-7 py-4 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#ea580c] hover:shadow-xl dark:bg-orange-600 dark:hover:bg-orange-500"
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

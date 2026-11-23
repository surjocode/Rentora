
"use client";

import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedEquipment from "@/components/home/FeaturedEquipment";
import HowItWorks from "@/components/home/HowItWorks";
import BenefitsSection from "@/components/home/BenefitsSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import OwnerCTA from "@/components/home/OwnerCTA";

import { useCategories } from "@/hooks/use-categories";
import {
  useEquipment,
  useFeaturedEquipment,
} from "@/hooks/use-equipment";

export default function HomePage() {
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  // All equipment hook remains available for other requirements.
  // Categories and Featured Equipment use separate data fetching.
  const {
    equipment: featuredEquipment,
    loading: equipmentLoading,
    error: equipmentError,
  } = useFeaturedEquipment();

  return (
    <>
      <HeroSection />

      {/* Categories Section */}
      {categoriesLoading ? (
        <section className="bg-[#faf7f2] px-5 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-extrabold text-[#442719] sm:text-3xl">
                Popular Categories
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: 5 }, (_, index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-2xl bg-gray-200"
                />
              ))}
            </div>
          </div>
        </section>
      ) : categoriesError ? (
        <section className="bg-[#faf7f2] px-5 py-10 text-center">
          <p className="text-sm text-red-600">
            Failed to load categories: {categoriesError}
          </p>
        </section>
      ) : (
        <CategoriesSection categories={categories} />
      )}

      {/* Featured Equipment Section */}
      {equipmentLoading ? (
        <section className="bg-[#faf7f2] px-5 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-2xl font-extrabold text-[#442719] sm:text-3xl">
              Featured Equipment
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="h-80 animate-pulse rounded-2xl bg-gray-200"
                />
              ))}
            </div>
          </div>
        </section>
      ) : equipmentError ? (
        <section className="bg-[#faf7f2] px-5 py-10 text-center">
          <p className="text-sm text-red-600">
            Failed to load equipment: {equipmentError}
          </p>
        </section>
      ) : (
        <FeaturedEquipment equipment={featuredEquipment} />
      )}

      <HowItWorks />

      <BenefitsSection />

      {/* Reviews - API will be connected later */}
      <ReviewsSection reviews={[]} />

      <OwnerCTA />
    </>
  );
}

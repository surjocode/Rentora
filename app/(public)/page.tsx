import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedEquipment from "@/components/home/FeaturedEquipment";
import HowItWorks from "@/components/home/HowItWorks";
import BenefitsSection from "@/components/home/BenefitsSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import OwnerCTA from "@/components/home/OwnerCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection categories={[]} />
      <FeaturedEquipment equipment={[]} />
      <HowItWorks />
      <BenefitsSection />
      <ReviewsSection reviews={[]} />
      <OwnerCTA />
    </>
  );
}
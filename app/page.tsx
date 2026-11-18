
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

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
      {/* Navbar */}
      <Navbar />

      <main>
        {/* Hero Banner */}
        <HeroSection />

        {/* Equipment Categories */}
        <CategoriesSection categories={[]} />

        {/* Featured Equipment */}
        <FeaturedEquipment equipment={[]} />

        {/* How Rentora Works */}
        <HowItWorks />

        {/* Why Choose Rentora */}
        <BenefitsSection />

        {/* Customer Reviews */}
        <ReviewsSection reviews={[]} />

        {/* Become an Equipment Owner */}
        <OwnerCTA />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}

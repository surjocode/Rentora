
import {
  ShieldCheck,
  Wallet,
  Clock,
  BadgeCheck,
  Headphones,
  RefreshCw,
} from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Secure & Safe Rental",
    description:
      "Enjoy a secure rental experience with protected bookings and reliable transactions.",
  },
  {
    icon: Wallet,
    title: "Affordable Pricing",
    description:
      "Rent the equipment you need without spending money on expensive purchases.",
  },
  {
    icon: Clock,
    title: "Flexible Rental Period",
    description:
      "Choose rental dates that fit your schedule and project requirements.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Equipment Owners",
    description:
      "Connect with trusted equipment owners and rent with greater confidence.",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description:
      "Get assistance whenever you need help with your rental experience.",
  },
  {
    icon: RefreshCw,
    title: "Easy Booking Process",
    description:
      "Find equipment, book your dates, and manage rentals through one simple platform.",
  },
];

export default function BenefitsSection() {
  return (
    <section id="about" className="bg-[#faf7f2] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
            Why Choose Rentora?
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#442719] sm:text-4xl">
            Everything You Need,
            <span className="block text-orange-600">
              All in One Place
            </span>
          </h2>

          <p className="mt-4 text-base leading-7 text-gray-500">
            We make equipment rental simple, affordable, and convenient.
            Discover the benefits of choosing Rentora for your next project.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="group rounded-2xl border border-[#eee5dc] bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
              >
                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition duration-300 group-hover:bg-[#442719] group-hover:text-orange-400">
                  <Icon size={27} strokeWidth={1.8} />
                </div>

                {/* Content */}
                <h3 className="mt-5 text-lg font-bold text-[#442719]">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  {benefit.description}
                </p>

                {/* Decorative Number */}
                <div className="mt-5 text-xs font-bold tracking-widest text-orange-500">
                  BENEFIT 0{index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

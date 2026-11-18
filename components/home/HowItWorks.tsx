
import Link from "next/link";
import {
  Search,
  CalendarCheck,
  CreditCard,
  Truck,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Find Equipment",
    description:
      "Browse our equipment collection and find the right tools for your project.",
    icon: Search,
  },
  {
    number: "02",
    title: "Choose Your Dates",
    description:
      "Select your preferred rental dates and check equipment availability.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "Book & Pay",
    description:
      "Confirm your booking and complete your payment securely online.",
    icon: CreditCard,
  },
  {
    number: "04",
    title: "Get Your Equipment",
    description:
      "Pick up your equipment and start working on your project with confidence.",
    icon: Truck,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-white px-5 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-block rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
            Simple & Convenient
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#442719] sm:text-4xl">
            How Does <span className="text-orange-600">Rentora</span> Work?
          </h2>

          <p className="mt-4 text-base leading-7 text-gray-500">
            Renting equipment has never been easier. Follow these four
            simple steps and get everything you need for your next project.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="relative text-center">

                {/* Step Card */}
                <div className="group flex h-full flex-col items-center rounded-2xl border border-[#eee5dc] bg-[#faf7f2] px-6 py-8 transition duration-300 hover:-translate-y-2 hover:border-orange-300 hover:shadow-lg">

                  {/* Icon */}
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-[#442719] text-orange-400 transition duration-300 group-hover:bg-orange-600 group-hover:text-white">
                    <Icon size={34} strokeWidth={1.8} />

                    <span className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-orange-500 text-xs font-bold text-white">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="mt-6 text-lg font-bold text-[#442719]">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-500">
                    {step.description}
                  </p>
                </div>

                {/* Arrow */}
                {index !== steps.length - 1 && (
                  <div className="absolute -right-5 top-1/2 z-10 hidden -translate-y-1/2 text-orange-400 lg:block">
                    <ArrowRight size={24} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/all-equipment"
            className="inline-flex items-center gap-2 rounded-xl bg-[#442719] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-700"
          >
            Start Renting Now
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}

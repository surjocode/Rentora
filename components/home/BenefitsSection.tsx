
"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Wallet,
  Clock,
  BadgeCheck,
  Headphones,
  RefreshCw,
  ArrowUpRight,
  Sparkles,
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
      "Get the equipment you need without the high cost of purchasing expensive tools.",
  },
  {
    icon: Clock,
    title: "Flexible Rental Period",
    description:
      "Choose rental dates that fit your schedule and meet your project requirements.",
  },
  {
    icon: BadgeCheck,
    title: "Trusted Equipment Owners",
    description:
      "Explore equipment listings and make informed rental decisions with confidence.",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description:
      "Get assistance whenever you need help throughout your rental experience.",
  },
  {
    icon: RefreshCw,
    title: "Easy Booking Process",
    description:
      "Find equipment, select your dates, and manage your rentals in one convenient place.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut" as const,
    },
  },
};

export default function BenefitsSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#faf7f2] px-5 py-20 transition-colors duration-300 dark:bg-[#17120f] sm:px-6 lg:px-8 lg:py-24"
    >
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-orange-100/60 blur-3xl dark:bg-orange-500/10" />

      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-amber-100/50 blur-3xl dark:bg-amber-500/10" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-400">
            <Sparkles size={16} />
            Why Choose Rentora?
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#442719] dark:text-[#f5e9dc] sm:text-4xl lg:text-5xl">
            Everything You Need,
            <span className="mt-2 block text-orange-600 dark:text-orange-400">
              All in One Place
            </span>
          </h2>

          <p className="mt-5 text-base leading-8 text-gray-600 dark:text-gray-400 sm:text-lg">
            We make equipment rental simple, affordable, and convenient.
            Discover how Rentora helps you get more done with less effort.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.title}
                variants={itemVariants}
                className="group relative"
              >
                <div className="relative flex h-full min-h-[270px] flex-col overflow-hidden rounded-3xl border border-[#eee5dc] bg-white p-7 transition-all duration-300 hover:-translate-y-2 hover:border-orange-300 hover:shadow-xl dark:border-white/10 dark:bg-[#241c17] dark:hover:border-orange-500/40 sm:p-8">
                  {/* Decorative Number */}
                  <span className="absolute -right-2 -top-5 text-8xl font-black text-[#442719]/[0.04] transition-colors duration-300 group-hover:text-orange-500/10 dark:text-white/[0.04] dark:group-hover:text-orange-400/10">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Icon */}
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#442719] text-orange-400 shadow-md shadow-[#442719]/10 transition-all duration-300 group-hover:rotate-3 group-hover:bg-orange-600 group-hover:text-white dark:bg-[#3a2a20]">
                    <Icon size={29} strokeWidth={1.8} />
                  </div>

                  {/* Content */}
                  <h3 className="relative mt-7 text-xl font-bold text-[#442719] transition-colors duration-300 group-hover:text-orange-600 dark:text-[#f5e9dc] dark:group-hover:text-orange-400">
                    {benefit.title}
                  </h3>

                  <p className="relative mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                    {benefit.description}
                  </p>

                  {/* Bottom Label */}
                  <div className="mt-auto flex items-center justify-between pt-7">
                    <span className="text-xs font-bold tracking-widest text-orange-500 dark:text-orange-400">
                      BENEFIT {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#faf7f2] text-[#442719] transition-all duration-300 group-hover:bg-orange-600 group-hover:text-white dark:bg-[#342820] dark:text-[#f5e9dc] dark:group-hover:bg-orange-500">
                      <ArrowUpRight size={17} />
                    </span>
                  </div>

                  {/* Bottom Accent */}
                  <div className="absolute bottom-0 left-0 h-1 w-0 rounded-full bg-orange-500 transition-all duration-500 group-hover:w-full" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 text-center"
        >
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Rent smarter. Save more. Make every project count.
          </p>

          <p className="mt-2 text-lg font-extrabold text-[#442719] dark:text-[#f5e9dc]">
            That&apos;s the Rentora experience.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

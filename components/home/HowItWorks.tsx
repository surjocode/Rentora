
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  CalendarCheck,
  CreditCard,
  Truck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Find Equipment",
    description:
      "Explore our wide collection and discover the right equipment for your project.",
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
      "Confirm your rental booking and complete your payment securely.",
    icon: CreditCard,
  },
  {
    number: "04",
    title: "Get Your Equipment",
    description:
      "Receive your equipment and get started with your project confidently.",
    icon: Truck,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-[#faf7f2] px-5 py-20 transition-colors duration-300 dark:bg-[#17120f] sm:px-6 lg:px-8 lg:py-24"
    >
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-orange-200/20 blur-3xl dark:bg-orange-500/10" />

      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-amber-200/20 blur-3xl dark:bg-amber-500/5" />

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
            <CheckCircle2 size={16} />
            Simple & Convenient
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#442719] dark:text-[#f5e9dc] sm:text-4xl lg:text-5xl">
            How Does{" "}
            <span className="text-orange-600 dark:text-orange-400">
              Rentora
            </span>{" "}
            Work?
          </h2>

          <p className="mt-5 text-base leading-8 text-gray-600 dark:text-gray-400 sm:text-lg">
            Getting the right equipment is easier than ever. Follow these
            four simple steps and focus on what matters most — your project.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                variants={cardVariants}
                className="group relative"
              >
                {/* Step Card */}
                <div className="relative flex h-full min-h-[290px] flex-col items-center overflow-hidden rounded-3xl border border-[#eadfd3] bg-white px-6 py-9 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-900/10 dark:border-white/10 dark:bg-[#241c17] dark:hover:border-orange-500/40">
                  {/* Decorative Number */}
                  <span className="absolute -right-2 -top-5 text-7xl font-black text-[#442719]/[0.04] transition-colors duration-300 group-hover:text-orange-500/10 dark:text-white/[0.04] dark:group-hover:text-orange-400/10">
                    {step.number}
                  </span>

                  {/* Icon */}
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-[#442719] text-orange-400 shadow-lg shadow-[#442719]/10 transition-all duration-300 group-hover:rotate-3 group-hover:bg-orange-600 group-hover:text-white dark:bg-[#3a291f] dark:text-orange-400 dark:group-hover:bg-orange-600 dark:group-hover:text-white">
                    <Icon size={34} strokeWidth={1.8} />

                    <span className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white bg-orange-500 text-xs font-bold text-white shadow-md dark:border-[#241c17]">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="mt-7 text-lg font-bold text-[#442719] transition-colors duration-300 group-hover:text-orange-600 dark:text-[#f5e9dc] dark:group-hover:text-orange-400">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
                    {step.description}
                  </p>

                  {/* Bottom Accent */}
                  <div className="mt-auto flex w-full justify-center pt-6">
                    <span className="h-1 w-10 rounded-full bg-orange-200 transition-all duration-300 group-hover:w-20 group-hover:bg-orange-500 dark:bg-orange-500/30 dark:group-hover:bg-orange-400" />
                  </div>
                </div>

                {/* Connecting Arrow */}
                {index !== steps.length - 1 && (
                  <div className="absolute -right-5 top-1/2 z-10 hidden -translate-y-1/2 lg:flex">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-200 bg-[#faf7f2] text-orange-500 shadow-sm dark:border-orange-400/20 dark:bg-[#2b211a] dark:text-orange-400">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 text-center"
        >
          <p className="mb-5 text-sm font-medium text-gray-600 dark:text-gray-400">
            Ready to find the right equipment for your next project?
          </p>

          <Link
            href="/all-equipment"
            className="group inline-flex items-center gap-2 rounded-xl bg-[#442719] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-[#442719]/15 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-600 hover:shadow-orange-600/20 dark:bg-orange-600 dark:hover:bg-orange-500"
          >
            Start Renting Now
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

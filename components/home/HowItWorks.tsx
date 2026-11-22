
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
      className="relative overflow-hidden bg-background px-5 py-20 transition-colors duration-300 sm:px-6 lg:px-8 lg:py-24"
    >
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-secondary/60 blur-3xl" />

      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-secondary/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-semibold text-foreground">
            <CheckCircle2 size={16} />
            Simple & Convenient
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            How Does{" "}
            <span className="text-foreground">Rentora</span>{" "}
            Work?
          </h2>

          <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">
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
                <div className="relative flex h-full min-h-[290px] flex-col items-center overflow-hidden rounded-3xl border border-border bg-card px-6 py-9 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-ring hover:shadow-xl hover:shadow-foreground/5">
                  {/* Decorative Number */}
                  <span className="absolute -right-2 -top-5 text-7xl font-black text-foreground/[0.04] transition-colors duration-300 group-hover:text-foreground/10">
                    {step.number}
                  </span>

                  {/* Icon */}
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-foreground/10 transition-all duration-300 group-hover:rotate-3 group-hover:bg-secondary group-hover:text-foreground">
                    <Icon size={34} strokeWidth={1.8} />

                    <span className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-card bg-secondary text-xs font-bold text-foreground shadow-md">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="mt-7 text-lg font-bold text-foreground transition-colors duration-300">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {step.description}
                  </p>

                  {/* Bottom Accent */}
                  <div className="mt-auto flex w-full justify-center pt-6">
                    <span className="h-1 w-10 rounded-full bg-border transition-all duration-300 group-hover:w-20 group-hover:bg-foreground" />
                  </div>
                </div>

                {/* Connecting Arrow */}
                {index !== steps.length - 1 && (
                  <div className="absolute -right-5 top-1/2 z-10 hidden -translate-y-1/2 lg:flex">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm">
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
          <p className="mb-5 text-sm font-medium text-muted-foreground">
            Ready to find the right equipment for your next project?
          </p>

          <Link
            href="/all-equipment"
            className="group inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-foreground/10 transition-all duration-300 hover:-translate-y-1 hover:bg-secondary hover:text-foreground"
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

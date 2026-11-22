
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Wrench,
  Wallet,
  Users,
  TrendingUp,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const benefits = [
  "List your equipment easily",
  "Reach more potential customers",
  "Manage rental requests in one place",
  "Earn from equipment you already own",
];

const features = [
  {
    icon: Wallet,
    title: "Extra Income",
    description:
      "Turn your unused equipment into a potential source of extra income.",
  },
  {
    icon: Users,
    title: "More Customers",
    description:
      "Connect with people who are looking for equipment to rent.",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description:
      "Expand your rental opportunities through the Rentora platform.",
  },
  {
    icon: Wrench,
    title: "Easy Management",
    description:
      "Manage your equipment listings and rental activities conveniently.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.13,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 25,
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

export default function OwnerCTA() {
  return (
    <section className="bg-background px-5 py-20 transition-colors duration-300 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[2rem] border border-border bg-primary px-6 py-14 shadow-2xl shadow-foreground/10 transition-all duration-300 sm:px-10 lg:px-14 lg:py-16"
        >
          {/* Background Decorations */}
          <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-primary-foreground/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-primary-foreground/5 blur-3xl" />

          <div className="pointer-events-none absolute right-1/3 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-primary-foreground/5 blur-3xl" />

          <div className="relative grid items-center gap-14 lg:grid-cols-2">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
            >
              {/* Badge */}
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-sm font-semibold text-primary-foreground">
                <Sparkles size={16} />
                Become an Equipment Owner
              </span>

              {/* Heading */}
              <h2 className="mt-7 text-3xl leading-tight font-extrabold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
                Turn Your Equipment
                <span className="mt-2 block text-primary-foreground/80">
                  Into Extra Income
                </span>
              </h2>

              {/* Description */}
              <p className="mt-6 max-w-xl text-base leading-8 text-primary-foreground/75">
                Have equipment sitting unused? List it on Rentora,
                connect with people who need it, and explore new
                opportunities to earn from the equipment you own.
              </p>

              {/* Benefits */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-8 grid gap-4 sm:grid-cols-2"
              >
                {benefits.map((benefit) => (
                  <motion.div
                    key={benefit}
                    variants={itemVariants}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0 text-primary-foreground"
                    />

                    <span className="text-sm leading-6 text-primary-foreground/90">
                      {benefit}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <div className="mt-10">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-3 rounded-xl bg-primary-foreground px-7 py-4 text-sm font-bold text-primary shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:bg-secondary hover:text-foreground"
                >
                  Start Listing Equipment

                  <ArrowRight
                    size={19}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                <p className="mt-5 text-xs leading-6 text-primary-foreground/65">
                  Join Rentora and explore new rental opportunities.
                </p>
              </div>
            </motion.div>

            {/* Right Feature Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.title}
                    variants={itemVariants}
                    className={`group relative overflow-hidden rounded-2xl border border-primary-foreground/15 bg-primary-foreground/[0.07] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary-foreground/30 hover:bg-primary-foreground/[0.12] ${
                      index % 2 === 1 ? "sm:translate-y-8" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-foreground/10 text-primary-foreground transition-transform duration-300 group-hover:scale-110">
                      <Icon size={27} strokeWidth={1.8} />
                    </div>

                    {/* Content */}
                    <h3 className="mt-6 text-lg font-bold text-primary-foreground">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-primary-foreground/75">
                      {feature.description}
                    </p>

                    {/* Decorative Accent */}
                    <div className="mt-6 h-1 w-9 rounded-full bg-primary-foreground/40 transition-all duration-300 group-hover:w-16 group-hover:bg-primary-foreground/80" />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Bottom Decoration */}
          <div className="pointer-events-none absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-primary-foreground/40 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

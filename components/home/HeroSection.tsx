
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  ShieldCheck,
  BadgeCheck,
  Headset,
  Wallet,
  Zap,
  PackageCheck,
} from "lucide-react";

const trustFeatures = [
  {
    icon: ShieldCheck,
    title: "Secure",
    subtitle: "Payments",
  },
  {
    icon: BadgeCheck,
    title: "Verified",
    subtitle: "Owners",
  },
  {
    icon: Headset,
    title: "24/7",
    subtitle: "Support",
  },
  {
    icon: Wallet,
    title: "Affordable",
    subtitle: "Prices",
  },
];

export default function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[720px] items-center overflow-hidden bg-[#faf7f2] transition-colors duration-500 dark:bg-[#101d19] lg:min-h-[calc(100vh-82px)]">

      {/* Background Image */}
      <div
        className="absolute inset-0 -z-30 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-equipment.jpg.png')",
        }}
      />

      {/* Light Mode Overlay */}
      <div
        className="absolute inset-0 -z-20 dark:hidden"
        style={{
          background:
            "linear-gradient(90deg, rgba(250,247,242,0.99) 0%, rgba(250,247,242,0.96) 30%, rgba(250,247,242,0.82) 48%, rgba(250,247,242,0.28) 70%, rgba(250,247,242,0.05) 100%)",
        }}
      />

      {/* Dark Mode Overlay */}
      <div
        className="absolute inset-0 -z-20 hidden dark:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(16,29,25,0.99) 0%, rgba(16,29,25,0.96) 30%, rgba(16,29,25,0.85) 48%, rgba(16,29,25,0.48) 72%, rgba(16,29,25,0.20) 100%)",
        }}
      />

      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-24 top-0 -z-10 h-full w-64 bg-emerald-900/20 dark:bg-emerald-950/50 [clip-path:polygon(100%_0,100%_100%,0_100%)]" />

      <div className="mx-auto w-full max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-[700px]"
        >
          {/* Badge */}
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[#ea580c]/20 bg-[#ea580c]/10 px-5 py-3 text-sm font-bold text-[#442719] shadow-sm backdrop-blur-md dark:border-orange-400/20 dark:bg-orange-400/10 dark:text-orange-300">
            <Zap
              size={19}
              className="fill-[#ea580c] text-[#ea580c] dark:fill-orange-400 dark:text-orange-400"
            />
            Smart & Reliable Equipment Rentals
          </div>

          {/* Heading */}
          <h1 className="text-5xl leading-[1.08] font-black tracking-[-0.045em] text-[#442719] sm:text-6xl lg:text-[76px] dark:text-white">
            Rent the Right
            <br />
            Equipment,
            <br />
            <span className="text-[#ea580c]">
              Do More.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-7 max-w-[550px] text-base leading-8 font-medium text-[#5d514a] sm:text-lg dark:text-slate-300">
            Find and rent high-quality equipment for construction,
            photography, events and more. Save money, work smarter,
            and get things done with Rentora.
          </p>

          {/* CTA Buttons */}
          <div className="mt-9 flex flex-wrap items-center gap-4">

            {/* Primary CTA */}
            <Link
              href="/all-equipment"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#ea580c] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-orange-900/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#c2410c] hover:shadow-xl"
            >
              <Search size={19} />
              Browse Equipment
              <ArrowRight
                size={19}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            {/* Secondary CTA */}
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full border-2 border-[#442719]/25 bg-white/75 px-7 py-4 text-sm font-bold text-[#442719] shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#ea580c] hover:bg-[#442719] hover:text-white dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:border-orange-500 dark:hover:bg-[#ea580c]"
            >
              <PackageCheck size={19} />
              Become an Owner
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

          </div>

          {/* Trust Features */}
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-4 sm:gap-x-4">

            {trustFeatures.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + index * 0.12,
                  }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#442719]/10 text-[#442719] transition-colors duration-300 dark:bg-white/10 dark:text-orange-400">
                    <Icon size={23} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#442719] dark:text-white">
                      {feature.title}
                    </p>
                    <p className="text-xs font-medium text-[#74675f] dark:text-slate-400">
                      {feature.subtitle}
                    </p>
                  </div>
                </motion.div>
              );
            })}

          </div>
        </motion.div>
      </div>

      {/* Bottom Decorative Curve */}
      <div className="pointer-events-none absolute -bottom-20 -left-10 -z-10 h-32 w-[110%] -rotate-3 rounded-[50%] bg-[#442719]/10 dark:bg-[#031e17]" />

    </section>
  );
}

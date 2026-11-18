
import Link from "next/link";
import {
  ArrowRight,
  Wrench,
  Wallet,
  Users,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

const benefits = [
  "List your equipment easily",
  "Reach more potential customers",
  "Manage rental requests in one place",
  "Earn from equipment you already own",
];

export default function OwnerCTA() {
  return (
    <section className="bg-white px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">

        <div className="relative overflow-hidden rounded-[2rem] bg-[#442719] px-6 py-12 sm:px-10 lg:px-14 lg:py-16">

          {/* Decorative Background */}
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />

          <div className="relative grid items-center gap-12 lg:grid-cols-2">

            {/* Left Content */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-sm font-semibold text-orange-300">
                <Wrench size={16} />
                Become an Equipment Owner
              </span>

              <h2 className="mt-6 text-3xl leading-tight font-extrabold text-white sm:text-4xl lg:text-5xl">
                Turn Your Equipment
                <span className="block text-orange-400">
                  Into Extra Income
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-base leading-8 text-[#d7c9bf]">
                Have equipment sitting unused? List it on Rentora,
                connect with people who need it, and earn extra income
                while helping others complete their projects.
              </p>

              {/* Benefits */}
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0 text-green-400"
                    />

                    <span className="text-sm text-[#f2e8df]">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Link
                href="/register"
                className="mt-9 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-orange-700"
              >
                Start Listing Equipment
                <ArrowRight size={18} />
              </Link>

              <p className="mt-4 text-xs text-[#c8b9ac]">
                Join Rentora and grow your rental business.
              </p>
            </div>

            {/* Right Content */}
            <div className="grid grid-cols-2 gap-4">

              <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20 text-orange-300">
                  <Wallet size={26} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-white">
                  Extra Income
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#d7c9bf]">
                  Make your unused equipment a source of income.
                </p>
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20 text-green-300">
                  <Users size={26} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-white">
                  More Customers
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#d7c9bf]">
                  Connect with people looking for equipment.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
                  <TrendingUp size={26} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-white">
                  Grow Your Business
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#d7c9bf]">
                  Expand your rental opportunities with Rentora.
                </p>
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
                  <Wrench size={26} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-white">
                  Easy Management
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#d7c9bf]">
                  Manage your listed equipment and rental requests.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

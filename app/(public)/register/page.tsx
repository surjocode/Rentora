
import Link from "next/link";
import {
  ArrowRight,
  Mail,
  LockKeyhole,
  User,
  Wrench,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "Register | Rentora",
  description: "Create your Rentora account and start renting equipment.",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#faf7f2] px-5 py-12 sm:px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#eee5dc] bg-white shadow-xl md:grid-cols-2">

        {/* Left Side */}
        <div className="hidden flex-col justify-center bg-[#442719] p-10 text-white md:flex lg:p-14">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-600">
            <Wrench size={30} />
          </div>

          <h1 className="mt-8 text-4xl font-bold leading-tight">
            Join the Rentora Community!
          </h1>

          <p className="mt-5 text-sm leading-7 text-[#e8d9ce]">
            Create your account and discover a smarter way to rent and manage
            equipment.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-orange-400" size={22} />
              <span className="text-sm">Secure Account Registration</span>
            </div>

            <div className="flex items-center gap-3">
              <Wrench className="text-orange-400" size={22} />
              <span className="text-sm">Rent or List Equipment</span>
            </div>
          </div>

          <p className="mt-16 text-xs text-[#d7c2b3]">
            Rent Smarter. Do More.
          </p>
        </div>

        {/* Right Side */}
        <div className="p-7 sm:p-10 lg:p-12">
          <div className="mb-7 md:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#442719] text-white">
              <Wrench size={26} />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-[#442719]">
            Create Account
          </h2>

          <p className="mt-3 text-sm text-[#806b5e]">
            Fill in your information to join Rentora.
          </p>

          <form className="mt-8 space-y-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-[#442719]"
              >
                Full Name
              </label>

              <div className="relative">
                <User
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a877a]"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  autoComplete="name"
                  className="w-full rounded-xl border border-[#eee5dc] py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#442719]"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a877a]"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-[#eee5dc] py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#442719]"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a877a]"
                />

                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-[#eee5dc] py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <p className="mt-2 text-xs text-[#806b5e]">
                Password must contain at least 8 characters.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-[#442719]"
              >
                Confirm Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a877a]"
                />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-[#eee5dc] py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            {/* Account Type */}
            <div>
              <label
                htmlFor="role"
                className="mb-2 block text-sm font-semibold text-[#442719]"
              >
                Account Type
              </label>

              <select
                id="role"
                name="role"
                defaultValue="customer"
                className="w-full rounded-xl border border-[#eee5dc] bg-white px-4 py-3.5 text-sm text-[#665348] outline-none transition focus:border-orange-500"
              >
                <option value="customer">Customer - Rent Equipment</option>
                <option value="owner">Equipment Owner - List Equipment</option>
              </select>

              <p className="mt-2 text-xs text-[#806b5e]">
                Admin accounts are created and managed separately.
              </p>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 text-sm text-[#665348]">
              <input
                type="checkbox"
                name="terms"
                required
                className="mt-1 accent-orange-600"
              />

              <span>
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="font-semibold text-orange-600 hover:underline"
                >
                  Terms and Conditions
                </Link>
                .
              </span>
            </label>

            {/* Register Button */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 font-semibold text-white transition hover:bg-orange-700"
            >
              Create My Account
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-7 text-center text-sm text-[#806b5e]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-orange-600 hover:text-orange-700"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

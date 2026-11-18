
import Link from "next/link";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Wrench,
} from "lucide-react";

export const metadata = {
  title: "Login | Rentora",
  description: "Login to your Rentora account.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#faf7f2] px-5 py-12 sm:px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#eee5dc] bg-white shadow-xl md:grid-cols-2">

        {/* Left Side */}
        <div className="hidden flex-col justify-center bg-[#442719] p-10 text-white md:flex lg:p-14">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-600">
            <Wrench size={30} />
          </div>

          <h1 className="mt-8 text-4xl font-bold leading-tight">
            Welcome Back to Rentora!
          </h1>

          <p className="mt-5 text-sm leading-7 text-[#e8d9ce]">
            Login to explore equipment, manage your rentals, and make your
            next project easier.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-orange-400" size={22} />
              <span className="text-sm">Secure Account Access</span>
            </div>

            <div className="flex items-center gap-3">
              <LockKeyhole className="text-orange-400" size={22} />
              <span className="text-sm">Protected Authentication</span>
            </div>
          </div>

          <p className="mt-16 text-xs text-[#d7c2b3]">
            Rent Smarter. Do More.
          </p>
        </div>

        {/* Right Side */}
        <div className="p-7 sm:p-10 lg:p-14">
          <div className="mb-8 md:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#442719] text-white">
              <Wrench size={26} />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-[#442719]">
            Login
          </h2>

          <p className="mt-3 text-sm text-[#806b5e]">
            Enter your account details to continue.
          </p>

          <form className="mt-8 space-y-6">
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
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-[#eee5dc] py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="flex items-center gap-2 text-[#665348]">
                <input
                  type="checkbox"
                  name="remember"
                  className="accent-orange-600"
                />
                Remember me
              </label>

              <Link
                href="/forgot-password"
                className="font-semibold text-orange-600 hover:text-orange-700"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 font-semibold text-white transition hover:bg-orange-700"
            >
              Login to Account
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-8 text-center text-sm text-[#806b5e]">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-orange-600 hover:text-orange-700"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

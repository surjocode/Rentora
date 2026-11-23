
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirectTo, setRedirectTo] = useState("/dashboard");

  // Get redirect path from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");

    if (
      redirect &&
      redirect.startsWith("/") &&
      !redirect.startsWith("//")
    ) {
      setRedirectTo(redirect);
    }
  }, []);

  // Email and Password Login
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const result = await authClient.signIn.email({
        email,
        password,
        rememberMe,
        callbackURL: redirectTo,
      });

      if (result.error) {
        setError(result.error.message || "Login failed. Please try again.");
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectTo,
      });

      if (result.error) {
        setError(
          result.error.message || "Google login failed. Please try again."
        );
        setGoogleLoading(false);
      }
    } catch {
      setError("Unable to login with Google.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#faf7f2] px-5 py-12 sm:px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#eee5dc] bg-white shadow-xl md:grid-cols-2">

        {/* Left Side */}
        <div className="hidden flex-col justify-center bg-[#442719] p-10 text-white md:flex lg:p-14">
          <div className="flex h-20 w-56 items-center justify-center rounded-xl bg-white px-4">
            <Image
              src="/images/equipment-logo.png"
              alt="Rentora Logo"
              width={200}
              height={75}
              className="h-auto max-h-16 w-auto object-contain"
              priority
            />
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
          <div className="mb-8 flex justify-center md:hidden">
            <Image
              src="/images/equipment-logo.png"
              alt="Rentora Logo"
              width={180}
              height={65}
              className="h-auto max-h-16 w-auto object-contain"
              priority
            />
          </div>

          <h2 className="text-3xl font-bold text-[#442719]">
            Login
          </h2>

          <p className="mt-3 text-sm text-[#806b5e]">
            Enter your account details to continue.
          </p>

          {/* Error Message */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="mt-8 space-y-6">

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-[#eee5dc] py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="flex items-center gap-2 text-[#665348]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
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
              disabled={loading || googleLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login to Account"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#eee5dc]" />
            <span className="text-xs text-[#9a877a]">OR</span>
            <div className="h-px flex-1 bg-[#eee5dc]" />
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#eee5dc] px-6 py-3.5 text-sm font-semibold text-[#442719] transition hover:bg-[#faf7f2] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="text-lg font-bold text-blue-600">G</span>
            {googleLoading ? "Connecting to Google..." : "Continue with Google"}
          </button>

          {/* Register Link */}
          <p className="mt-8 text-center text-sm text-[#806b5e]">
            Don&apos;t have an account?{" "}
            <Link
              href={
                redirectTo === "/dashboard"
                  ? "/register"
                  : `/register?redirect=${encodeURIComponent(redirectTo)}`
              }
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

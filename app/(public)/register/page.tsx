
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Mail,
  LockKeyhole,
  User,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirectTo, setRedirectTo] = useState("/dashboard");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");

    if (redirect?.startsWith("/") && !redirect.startsWith("//")) {
      setRedirectTo(redirect);
    }
  }, []);

  // Email Registration
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        callbackURL: redirectTo,
      });

      if (result.error) {
        setError(result.error.message || "Registration failed.");
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

  // Google Registration
  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    setError("");

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectTo,
      });

      if (result.error) {
        setError(result.error.message || "Google registration failed.");
        setGoogleLoading(false);
      }
    } catch {
      setError("Unable to register with Google.");
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
          <div className="mb-7 flex justify-center md:hidden">
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
            Create Account
          </h2>

          <p className="mt-3 text-sm text-[#806b5e]">
            Fill in your information to join Rentora.
          </p>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="mt-8 space-y-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold text-[#442719]">
                Full Name
              </label>

              <div className="relative">
                <User size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a877a]" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className="w-full rounded-xl border border-[#eee5dc] py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#442719]">
                Email Address
              </label>

              <div className="relative">
                <Mail size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a877a]" />
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

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#442719]">
                Password
              </label>

              <div className="relative">
                <LockKeyhole size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a877a]" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-[#442719]">
                Confirm Password
              </label>

              <div className="relative">
                <LockKeyhole size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a877a]" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-[#eee5dc] py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            <div className="rounded-xl border border-[#eee5dc] bg-[#faf7f2] p-4">
              <p className="text-sm font-semibold text-[#442719]">
                Default Account Type: Customer
              </p>
              <p className="mt-1 text-xs leading-5 text-[#806b5e]">
                New accounts start with customer access. You can request
                equipment owner access later.
              </p>
            </div>

            <label className="flex items-start gap-2 text-sm text-[#665348]">
              <input type="checkbox" name="terms" required className="mt-1 accent-orange-600" />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="font-semibold text-orange-600 hover:underline">
                  Terms and Conditions
                </Link>.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create My Account"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#eee5dc]" />
            <span className="text-xs text-[#9a877a]">OR</span>
            <div className="h-px flex-1 bg-[#eee5dc]" />
          </div>

          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={loading || googleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#eee5dc] px-6 py-3.5 text-sm font-semibold text-[#442719] transition hover:bg-[#faf7f2] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="text-lg font-bold text-blue-600">G</span>
            {googleLoading ? "Connecting to Google..." : "Continue with Google"}
          </button>

          <p className="mt-7 text-center text-sm text-[#806b5e]">
            Already have an account?{" "}
            <Link
              href={
                redirectTo === "/dashboard"
                  ? "/login"
                  : `/login?redirect=${encodeURIComponent(redirectTo)}`
              }
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

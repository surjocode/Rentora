
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  UserRound,
  Mail,
  ShieldCheck,
  Camera,
  Save,
  RotateCcw,
  Loader2,
  ArrowLeft,
  CalendarDays,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";

// ==========================================
// TYPES
// ==========================================

interface OwnerProfile {
  name: string;
  email: string;
  image: string;
}

// ==========================================
// OWNER PROFILE PAGE
// ==========================================

export default function OwnerProfilePage() {
  const { user, loading: authLoading, isAuthenticated, isOwner } = useAuth();

  const [profile, setProfile] = useState<OwnerProfile>({
    name: "",
    email: "",
    image: "",
  });

  const [formData, setFormData] = useState<OwnerProfile>({
    name: "",
    email: "",
    image: "",
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // LOAD USER PROFILE
  // ==========================================

  useEffect(() => {
    if (!user) return;

    const userProfile: OwnerProfile = {
      name: user.name || "",
      email: user.email || "",
      image: user.image || "",
    };

    setProfile(userProfile);
    setFormData(userProfile);
  }, [user]);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (
    field: "name" | "image",
    value: string
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSuccess("");
    setError("");
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const handleReset = () => {
    setFormData(profile);
    setSuccess("");
    setError("");
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (formData.image.trim()) {
      try {
        new URL(formData.image);
      } catch {
        setError("Please enter a valid profile image URL.");
        return;
      }
    }

    // Better Auth profile update integration
    // will be connected after confirming the auth client API.

    setSaving(true);

    try {
      setError(
        "Profile update is not connected yet. Your profile information is displayed from your authenticated account."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (authLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2
          size={36}
          className="animate-spin text-orange-600"
        />
      </div>
    );
  }

  // ==========================================
  // ACCESS CHECK
  // ==========================================

  if (!isAuthenticated || !isOwner) {
    return (
      <div className="rounded-2xl border border-orange-100 bg-white px-5 py-16 text-center shadow-sm">
        <ShieldCheck
          size={44}
          className="mx-auto text-orange-600"
        />

        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Owner Access Required
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Please sign in with an equipment owner account to
          access this page.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-flex rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          Login
        </Link>
      </div>
    );
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="mx-auto max-w-5xl space-y-8">

      {/* HEADER */}

      <section>
        <Link
          href="/dashboard/owner"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-orange-600 transition hover:text-orange-700"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
          Owner Dashboard
        </p>

        <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          View your account information and manage your profile.
        </p>
      </section>

      {/* ALERTS */}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle size={18} />
          {success}
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* PROFILE OVERVIEW */}

      <section className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">

        <div className="h-32 bg-gradient-to-r from-orange-500 to-amber-400" />

        <div className="px-5 pb-6 sm:px-8">

          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">

            {/* PROFILE IMAGE */}

            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-orange-100 shadow-sm">
              {formData.image ? (
                <Image
                  src={formData.image}
                  alt={formData.name || "Owner"}
                  fill
                  unoptimized
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <UserRound
                  size={42}
                  className="text-orange-600"
                />
              )}
            </div>

            <div className="pb-1">
              <h2 className="text-xl font-bold text-gray-900">
                {profile.name || "Owner"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {profile.email}
              </p>
            </div>

            <div className="sm:ml-auto sm:pb-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                <ShieldCheck size={16} />
                Equipment Owner
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* PROFILE INFORMATION */}

      <section className="grid gap-6 lg:grid-cols-3">

        {/* ACCOUNT INFORMATION */}

        <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">

          <h2 className="text-lg font-bold text-gray-900">
            Account Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your registered account details.
          </p>

          <div className="mt-6 space-y-5">

            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                <UserRound size={19} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-gray-400">
                  Full Name
                </p>

                <p className="mt-1 break-words text-sm font-semibold text-gray-800">
                  {profile.name || "Not available"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                <Mail size={19} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-gray-400">
                  Email Address
                </p>

                <p className="mt-1 break-all text-sm font-semibold text-gray-800">
                  {profile.email || "Not available"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                <ShieldCheck size={19} />
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Account Role
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-800">
                  Owner
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                <CalendarDays size={19} />
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Account Status
                </p>

                <p className="mt-1 text-sm font-semibold text-green-600">
                  Active Session
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* EDIT PROFILE */}

        <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm lg:col-span-2">

          <h2 className="text-lg font-bold text-gray-900">
            Profile Details
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Update your profile information.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >

            {/* NAME */}

            <div>
              <label
                htmlFor="owner-name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Full Name
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="owner-name"
                  type="text"
                  value={formData.name}
                  onChange={(event) =>
                    handleChange("name", event.target.value)
                  }
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  required
                />
              </div>
            </div>

            {/* EMAIL */}

            <div>
              <label
                htmlFor="owner-email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="owner-email"
                  type="email"
                  value={formData.email}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-500 outline-none"
                />
              </div>

              <p className="mt-1 text-xs text-gray-400">
                Your registered email address cannot be changed here.
              </p>
            </div>

            {/* PROFILE IMAGE URL */}

            <div>
              <label
                htmlFor="owner-image"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
              >
                <Camera size={17} />
                Profile Image URL
              </label>

              <input
                id="owner-image"
                type="url"
                value={formData.image}
                onChange={(event) =>
                  handleChange("image", event.target.value)
                }
                placeholder="https://example.com/profile.jpg"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              <p className="mt-1 text-xs text-gray-400">
                Paste a publicly accessible image URL.
              </p>
            </div>

            {/* BUTTONS */}

            <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row">

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={17} />
                )}

                Save Changes
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-60"
              >
                <RotateCcw size={17} />
                Reset
              </button>

            </div>

          </form>
        </div>

      </section>

    </div>
  );
}

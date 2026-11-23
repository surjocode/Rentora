
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Mail,
  UserRound,
  Camera,
  Save,

  AlertCircle,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";

export default function AdminProfilePage() {
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [imageUrl, setImageUrl] = useState(user?.image || "");
  const [message, setMessage] = useState("");


  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950">
        <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-500" />
        <h2 className="text-lg font-semibold">Access Denied</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You do not have permission to access this page.
        </p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage(
      "Profile update is not connected yet. Your changes have not been saved."
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Admin Profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and manage your administrator account information.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="h-32 bg-gradient-to-r from-primary/80 to-primary" />

        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-background bg-muted">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Admin profile"
                  fill
                  sizes="96px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <UserRound className="h-12 w-12 text-muted-foreground" />
              )}
            </div>

            <div className="pb-1">
              <h2 className="text-xl font-bold">
                {user?.name || "Admin"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {user?.email || "No email available"}
              </p>
            </div>

            <div className="sm:ml-auto sm:pb-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <ShieldCheck className="h-4 w-4" />
                Administrator
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6">
          <h2 className="mb-5 text-lg font-semibold">
            Account Information
          </h2>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-primary/10 p-3">
                <UserRound className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="font-medium">{user?.name || "Not available"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-primary/10 p-3">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email Address</p>
                <p className="break-all font-medium">
                  {user?.email || "Not available"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-primary/10 p-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Account Role</p>
                <p className="font-medium">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <h2 className="mb-5 text-lg font-semibold">
            Edit Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Profile Image URL
              </label>
              <div className="relative">
                <Camera className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-lg border bg-background py-3 pl-10 pr-4 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            {message && (
              <p className="rounded-lg bg-amber-500/10 p-3 text-sm text-amber-600">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground transition hover:opacity-90"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

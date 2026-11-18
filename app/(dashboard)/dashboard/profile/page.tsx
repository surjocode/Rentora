
"use client";

import { useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  ShieldCheck,
  CalendarDays,
  Pencil,
} from "lucide-react";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // Profile update API will be connected later.
    alert("Profile update functionality will be available soon.");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Page Heading */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-wider text-[#ea580c]">
          Account Settings
        </p>

        <h1 className="mt-2 text-2xl font-bold text-[#442719] sm:text-3xl">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-[#9b8a7e]">
          Manage your personal information and account details.
        </p>
      </section>

      {/* Profile Header */}
      <section className="overflow-hidden rounded-2xl border border-[#eee4da] bg-white">
        <div className="h-32 bg-gradient-to-r from-[#442719] to-[#8b4a27]" />

        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-[#fff0e5] text-[#ea580c] shadow-md">
                <UserRound size={42} />

                <button
                  type="button"
                  aria-label="Change profile photo"
                  className="absolute -bottom-2 -right-2 rounded-full bg-[#ea580c] p-2 text-white shadow-md hover:bg-orange-700"
                >
                  <Camera size={15} />
                </button>
              </div>

              <div className="pb-1">
                <h2 className="text-xl font-bold text-[#442719]">
                  My Account
                </h2>

                <p className="text-sm text-[#9b8a7e]">
                  Rentora Customer
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 self-start rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-700 sm:self-auto">
              <ShieldCheck size={16} />
              Account Profile
            </div>
          </div>
        </div>
      </section>

      {/* Profile Information Form */}
      <section className="rounded-2xl border border-[#eee4da] bg-white p-6 sm:p-8">
        <div className="mb-7 flex items-center gap-3">
          <div className="rounded-xl bg-[#fff0e5] p-3 text-[#ea580c]">
            <UserRound size={22} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#442719]">
              Personal Information
            </h2>

            <p className="text-sm text-[#9b8a7e]">
              Update your personal details.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-[#442719]"
              >
                Full Name
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-[#eee4da] px-4 py-3 focus-within:border-[#ea580c]">
                <UserRound size={18} className="text-[#a18d7e]" />

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full bg-transparent text-sm text-[#442719] outline-none"
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

              <div className="flex items-center gap-3 rounded-xl border border-[#eee4da] px-4 py-3 focus-within:border-[#ea580c]">
                <Mail size={18} className="text-[#a18d7e]" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full bg-transparent text-sm text-[#442719] outline-none"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold text-[#442719]"
              >
                Phone Number
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-[#eee4da] px-4 py-3 focus-within:border-[#ea580c]">
                <Phone size={18} className="text-[#a18d7e]" />

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full bg-transparent text-sm text-[#442719] outline-none"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="mb-2 block text-sm font-semibold text-[#442719]"
              >
                Address
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-[#eee4da] px-4 py-3 focus-within:border-[#ea580c]">
                <MapPin size={18} className="text-[#a18d7e]" />

                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className="w-full bg-transparent text-sm text-[#442719] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="border-t border-[#eee4da] pt-6">
            <h3 className="mb-4 font-bold text-[#442719]">
              Account Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-[#faf7f2] p-4">
                <CalendarDays
                  size={20}
                  className="text-[#ea580c]"
                />

                <div>
                  <p className="text-xs text-[#9b8a7e]">
                    Member Since
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#442719]">
                    Account information unavailable
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-[#faf7f2] p-4">
                <ShieldCheck
                  size={20}
                  className="text-green-600"
                />

                <div>
                  <p className="text-xs text-[#9b8a7e]">
                    Account Type
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#442719]">
                    Customer
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end border-t border-[#eee4da] pt-6">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#ea580c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </form>
      </section>

      {/* Security Information */}
      <section className="flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 p-5">
        <ShieldCheck
          size={22}
          className="mt-0.5 shrink-0 text-green-600"
        />

        <div>
          <h3 className="font-semibold text-[#315b3b]">
            Your Account Security
          </h3>

          <p className="mt-1 text-sm leading-6 text-green-800/80">
            Keep your account information up to date. Never
            share your password with anyone.
          </p>
        </div>
      </section>
    </div>
  );
}

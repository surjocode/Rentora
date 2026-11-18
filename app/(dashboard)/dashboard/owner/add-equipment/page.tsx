
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PackagePlus,
  Upload,
  ImagePlus,
  ArrowLeft,
  Save,
  Info,
} from "lucide-react";

export default function AddEquipmentPage() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    pricePerDay: "",
    location: "",
    description: "",
    condition: "Good",
    availability: "Available",
  });

  const [imageName, setImageName] = useState("");

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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

    // Equipment creation API will be connected later.
    alert("Equipment submission functionality will be available soon.");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Page Heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#ea580c]">
            Owner Dashboard
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#442719] sm:text-3xl">
            Add New Equipment
          </h1>

          <p className="mt-2 text-sm text-[#9b8a7e]">
            List your equipment and start earning through Rentora.
          </p>
        </div>

        <Link
          href="/dashboard/owner/my-equipment"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#eee4da] bg-white px-5 py-3 text-sm font-semibold text-[#442719] transition hover:bg-[#faf7f2]"
        >
          <ArrowLeft size={18} />
          My Equipment
        </Link>
      </section>

      {/* Information Notice */}
      <section className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <Info size={21} className="mt-0.5 shrink-0 text-blue-600" />

        <div>
          <h3 className="font-semibold text-blue-900">
            Before Listing Your Equipment
          </h3>

          <p className="mt-1 text-sm leading-6 text-blue-800/80">
            Provide accurate equipment details, clear images,
            and a fair rental price. Your listing may require
            admin approval before becoming publicly available.
          </p>
        </div>
      </section>

      {/* Equipment Form */}
      <section className="rounded-2xl border border-[#eee4da] bg-white p-6 sm:p-8">
        <div className="mb-7 flex items-center gap-3">
          <div className="rounded-xl bg-[#fff0e5] p-3 text-[#ea580c]">
            <PackagePlus size={23} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#442719]">
              Equipment Information
            </h2>

            <p className="text-sm text-[#9b8a7e]">
              Fill in the details below.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Equipment Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-[#442719]"
              >
                Equipment Name *
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Professional DSLR Camera"
                className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none transition focus:border-[#ea580c]"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-semibold text-[#442719]"
              >
                Category *
              </label>

              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#eee4da] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#ea580c]"
              >
                <option value="">Select Category</option>
                <option value="Construction">Construction</option>
                <option value="Photography">Photography</option>
                <option value="Electronics">Electronics</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Home Appliances">Home Appliances</option>
                <option value="Tools">Tools</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Brand */}
            <div>
              <label
                htmlFor="brand"
                className="mb-2 block text-sm font-semibold text-[#442719]"
              >
                Brand
              </label>

              <input
                id="brand"
                name="brand"
                type="text"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Enter equipment brand"
                className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none transition focus:border-[#ea580c]"
              />
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="pricePerDay"
                className="mb-2 block text-sm font-semibold text-[#442719]"
              >
                Rental Price Per Day (৳) *
              </label>

              <input
                id="pricePerDay"
                name="pricePerDay"
                type="number"
                min="1"
                required
                value={formData.pricePerDay}
                onChange={handleChange}
                placeholder="e.g. 1500"
                className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none transition focus:border-[#ea580c]"
              />
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-semibold text-[#442719]"
              >
                Location *
              </label>

              <input
                id="location"
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="City or area"
                className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none transition focus:border-[#ea580c]"
              />
            </div>

            {/* Condition */}
            <div>
              <label
                htmlFor="condition"
                className="mb-2 block text-sm font-semibold text-[#442719]"
              >
                Equipment Condition
              </label>

              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#eee4da] bg-white px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            {/* Availability */}
            <div className="sm:col-span-2">
              <label
                htmlFor="availability"
                className="mb-2 block text-sm font-semibold text-[#442719]"
              >
                Availability
              </label>

              <select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#eee4da] bg-white px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-[#442719]"
              >
                Equipment Description *
              </label>

              <textarea
                id="description"
                name="description"
                rows={5}
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your equipment, features, usage instructions, and rental conditions..."
                className="w-full resize-y rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none transition focus:border-[#ea580c]"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="border-t border-[#eee4da] pt-6">
            <h3 className="mb-2 font-bold text-[#442719]">
              Equipment Image *
            </h3>

            <p className="mb-4 text-sm text-[#9b8a7e]">
              Upload a clear image of your equipment.
            </p>

            <label
              htmlFor="equipmentImage"
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#e5d8ca] bg-[#faf7f2] px-5 py-10 text-center transition hover:border-[#ea580c] hover:bg-orange-50"
            >
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#ea580c] shadow-sm">
                <ImagePlus size={27} />
              </div>

              <span className="font-semibold text-[#442719]">
                Click to upload an image
              </span>

              <span className="mt-2 text-xs text-[#9b8a7e]">
                PNG, JPG or WEBP
              </span>

              {imageName && (
                <span className="mt-3 text-sm font-medium text-green-700">
                  Selected: {imageName}
                </span>
              )}

              <input
                id="equipmentImage"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                required
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  setImageName(file?.name ?? "");
                }}
              />
            </label>
          </div>

          {/* Submit */}
          <div className="flex flex-col-reverse justify-end gap-3 border-t border-[#eee4da] pt-6 sm:flex-row">
            <button
              type="reset"
              onClick={() => {
                setFormData({
                  name: "",
                  category: "",
                  brand: "",
                  pricePerDay: "",
                  location: "",
                  description: "",
                  condition: "Good",
                  availability: "Available",
                });
                setImageName("");
              }}
              className="rounded-xl border border-[#eee4da] px-6 py-3 text-sm font-semibold text-[#6b5a50] transition hover:bg-[#faf7f2]"
            >
              Reset Form
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ea580c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              <Save size={18} />
              Submit Equipment
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

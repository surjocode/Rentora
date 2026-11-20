"use client"

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  PackagePlus,
  ImagePlus,
  ArrowLeft,
  Save,
  Info,
  X,
  Loader2,
} from "lucide-react"
import {
  addEquipment,
  uploadEquipmentImage,
  type CreateEquipmentData,
} from "@/services/equipment.service"
import Image from "next/image"

export default function AddEquipmentPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    rentalType: "daily" as "daily" | "weekly" | "monthly",
    pricePerDay: "",
    availableQuantity: "1",
    condition: "Good",
    brand: "",
    model: "",
    location: "",
    description: "",
    termsAndConditions: "",
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Generate image preview
  useEffect(() => {
    if (!imageFile) {
      setImagePreview("")
      return
    }

    const previewUrl = URL.createObjectURL(imageFile)
    setImagePreview(previewUrl)

    return () => {
      URL.revokeObjectURL(previewUrl)
    }
  }, [imageFile])

  // Handle input changes
  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  // Handle image selection
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    setError("")
    setSuccess("")

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, WEBP or GIF image.")
      event.target.value = ""
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size cannot exceed 5 MB.")
      event.target.value = ""
      return
    }

    setImageFile(file)
  }

  // Reset form
  const handleReset = () => {
    setFormData({
      name: "",
      category: "",
      rentalType: "daily",
      pricePerDay: "",
      availableQuantity: "1",
      condition: "Good",
      brand: "",
      model: "",
      location: "",
      description: "",
      termsAndConditions: "",
    })

    setImageFile(null)
    setImagePreview("")
    setError("")
    setSuccess("")

    const fileInput = document.getElementById(
      "equipmentImage"
    ) as HTMLInputElement | null

    if (fileInput) {
      fileInput.value = ""
    }
  }

  // Submit equipment
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setError("")
    setSuccess("")

    if (!imageFile) {
      setError("Please select an equipment image.")
      return
    }

    const price = Number(formData.pricePerDay)
    const quantity = Number(formData.availableQuantity)

    if (!Number.isFinite(price) || price <= 0) {
      setError("Please enter a valid rental price.")
      return
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      setError("Available quantity must be at least 1.")
      return
    }

    try {
      setLoading(true)

      // Step 1: Upload image to ImgBB
      const imageUrl = await uploadEquipmentImage(imageFile)

      // Step 2: Prepare equipment data
      const equipmentData: CreateEquipmentData = {
        name: formData.name.trim(),
        category: formData.category,
        rentalType: formData.rentalType,
        pricePerDay: price,
        availableQuantity: quantity,
        condition: formData.condition,
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        location: formData.location.trim(),
        description: formData.description.trim(),
        termsAndConditions: formData.termsAndConditions.trim(),
        image: imageUrl,
      }

      // Step 3: Save equipment to MongoDB
      const response = await addEquipment(equipmentData)

      if (!response.success) {
        throw new Error(response.message || "Failed to add equipment.")
      }

      setSuccess(
        "Equipment submitted successfully! It is waiting for admin approval."
      )

      // Step 4: Redirect to My Equipment
      setTimeout(() => {
        router.push("/dashboard/owner/my-equipment")
        router.refresh()
      }, 1200)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Page Heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold tracking-wider text-[#ea580c] uppercase">
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
            Provide accurate equipment details, clear images, and a fair rental
            price. Your listing will remain pending until an administrator
            approves it.
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

            <p className="text-sm text-[#9b8a7e]">Fill in the details below.</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {success}
          </div>
        )}

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
                minLength={2}
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Professional DSLR Camera"
                className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm transition outline-none focus:border-[#ea580c]"
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
                className="w-full rounded-xl border border-[#eee4da] bg-white px-4 py-3 text-sm transition outline-none focus:border-[#ea580c]"
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
                Brand *
              </label>

              <input
                id="brand"
                name="brand"
                type="text"
                required
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Canon, Bosch, Samsung"
                className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm transition outline-none focus:border-[#ea580c]"
              />
            </div>

            {/* Model */}
            <div>
              <label
                htmlFor="model"
                className="mb-2 block text-sm font-semibold text-[#442719]"
              >
                Model *
              </label>

              <input
                id="model"
                name="model"
                type="text"
                required
                value={formData.model}
                onChange={handleChange}
                placeholder="Enter equipment model"
                className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm transition outline-none focus:border-[#ea580c]"
              />
            </div>

            {/* Rental Type */}
            <div>
              <label
                htmlFor="rentalType"
                className="mb-2 block text-sm font-semibold text-[#442719]"
              >
                Rental Type *
              </label>

              <select
                id="rentalType"
                name="rentalType"
                required
                value={formData.rentalType}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#eee4da] bg-white px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
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
                className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
              />

              <p className="mt-1 text-xs text-[#9b8a7e]">
                Enter the daily base price. Rental calculation will use the
                selected rental type.
              </p>
            </div>

            {/* Available Quantity */}
            <div>
              <label
                htmlFor="availableQuantity"
                className="mb-2 block text-sm font-semibold text-[#442719]"
              >
                Available Quantity *
              </label>

              <input
                id="availableQuantity"
                name="availableQuantity"
                type="number"
                min="1"
                step="1"
                required
                value={formData.availableQuantity}
                onChange={handleChange}
                placeholder="e.g. 5"
                className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
              />
            </div>

            {/* Condition */}
            <div>
              <label
                htmlFor="condition"
                className="mb-2 block text-sm font-semibold text-[#442719]"
              >
                Equipment Condition *
              </label>

              <select
                id="condition"
                name="condition"
                required
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

            {/* Location */}
            <div className="sm:col-span-2">
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
                className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
              />
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
                minLength={10}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your equipment, features, usage instructions, and rental conditions..."
                className="w-full resize-y rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
              />
            </div>

            {/* Terms and Conditions */}
            <div className="sm:col-span-2">
              <label
                htmlFor="termsAndConditions"
                className="mb-2 block text-sm font-semibold text-[#442719]"
              >
                Terms and Conditions *
              </label>

              <textarea
                id="termsAndConditions"
                name="termsAndConditions"
                rows={4}
                required
                minLength={5}
                value={formData.termsAndConditions}
                onChange={handleChange}
                placeholder="Write rental rules, security deposit details, return policy, and other conditions..."
                className="w-full resize-y rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="border-t border-[#eee4da] pt-6">
            <h3 className="mb-2 font-bold text-[#442719]">Equipment Image *</h3>

            <p className="mb-4 text-sm text-[#9b8a7e]">
              Upload a clear image of your equipment. Maximum size: 5 MB.
            </p>

            <label
              htmlFor="equipmentImage"
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#e5d8ca] bg-[#faf7f2] px-5 py-10 text-center transition hover:border-[#ea580c] hover:bg-orange-50"
            >
              {imagePreview ? (
                <div className="relative mb-4">
                  <Image
                    src={request.equipment.image}
                    alt={request.equipment.name || "Equipment"}
                    fill
                    unoptimized
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#ea580c] shadow-sm">
                  <ImagePlus size={27} />
                </div>
              )}

              <span className="font-semibold text-[#442719]">
                {imageFile
                  ? "Change selected image"
                  : "Click to upload an image"}
              </span>

              <span className="mt-2 text-xs text-[#9b8a7e]">
                PNG, JPG, WEBP or GIF
              </span>

              {imageFile && (
                <span className="mt-3 text-sm font-medium text-green-700">
                  Selected: {imageFile.name}
                </span>
              )}

              <input
                id="equipmentImage"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                required={!imageFile}
                disabled={loading}
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            {imageFile && (
              <button
                type="button"
                onClick={() => {
                  setImageFile(null)

                  const input = document.getElementById(
                    "equipmentImage"
                  ) as HTMLInputElement | null

                  if (input) input.value = ""
                }}
                disabled={loading}
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                <X size={16} />
                Remove Image
              </button>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col-reverse justify-end gap-3 border-t border-[#eee4da] pt-6 sm:flex-row">
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="rounded-xl border border-[#eee4da] px-6 py-3 text-sm font-semibold text-[#6b5a50] transition hover:bg-[#faf7f2] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reset Form
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ea580c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Uploading & Submitting...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Submit Equipment
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

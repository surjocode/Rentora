"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Package,
  ShieldCheck,
  User,
  RefreshCw,
  CheckCircle2,
  Minus,
  Plus,
} from "lucide-react"

import { getEquipmentById, type Equipment } from "@/services/equipment.service"

import { createRental } from "@/services/rental.service"
import { useAuth } from "@/hooks/use-auth"

export default function EquipmentDetailsPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const id = params.id

  const { isAuthenticated, loading: authLoading, isRenter } = useAuth()

  // Equipment State
  const [equipment, setEquipment] = useState<Equipment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Booking Date State
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Booking Quantity
  const [quantity, setQuantity] = useState(1)

  // Booking State
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null)

  // Today's date in YYYY-MM-DD format
  const today = new Date()

  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-")

  // Available Quantity
  const availableQuantity = equipment?.availableQuantity ?? 0

  // Calculate Rental Days
  const totalDays =
    startDate && endDate
      ? Math.round(
          (Date.parse(`${endDate}T00:00:00Z`) -
            Date.parse(`${startDate}T00:00:00Z`)) /
            (1000 * 60 * 60 * 24)
        )
      : 0

  // Calculate Total Rental Price
  const totalPrice =
    equipment && totalDays > 0
      ? totalDays * equipment.pricePerDay * quantity
      : 0

  // Fetch Equipment Details
  useEffect(() => {
    let isActive = true

    const fetchEquipment = async () => {
      try {
        setLoading(true)
        setError(null)

        const result = await getEquipmentById(id)

        if (!result.success) {
          throw new Error(result.message)
        }

        if (isActive) {
          setEquipment(result.data)
          setQuantity(1)
        }
      } catch (error) {
        if (isActive) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load equipment details"
          )
        }
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    if (id) {
      void fetchEquipment()
    }

    return () => {
      isActive = false
    }
  }, [id])

  // Handle Booking
  const handleBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setBookingError(null)
    setBookingSuccess(null)

    if (authLoading) {
      setBookingError("Please wait while checking your account.")
      return
    }

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (!isRenter) {
      setBookingError("Only renter accounts can book equipment.")
      return
    }

    if (!startDate || !endDate) {
      setBookingError("Please select both rental dates.")
      return
    }

    if (startDate < minDate) {
      setBookingError("Start date cannot be in the past.")
      return
    }

    if (totalDays <= 0) {
      setBookingError("End date must be after the start date.")
      return
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      setBookingError("Please select a valid quantity.")
      return
    }

    if (quantity > availableQuantity) {
      setBookingError(
        `Only ${availableQuantity} items are currently available.`
      )
      return
    }

    try {
      setBookingLoading(true)

      const result = await createRental({
        equipmentId: id,
        startDate,
        endDate,
        quantity,
      })

      if (!result.success) {
        throw new Error(result.message)
      }

      setBookingSuccess(
        "Booking created successfully! Please visit My Rentals to complete your payment."
      )

      setStartDate("")
      setEndDate("")
      setQuantity(1)
    } catch (error) {
      setBookingError(
        error instanceof Error
          ? error.message
          : "Failed to create your booking."
      )
    } finally {
      setBookingLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] px-5 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Back Button */}
        <Link
          href="/all-equipment"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#806b5e] transition hover:text-orange-600"
        >
          <ArrowLeft size={18} />
          Back to Equipment
        </Link>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-96 items-center justify-center">
            <div className="text-center">
              <RefreshCw
                size={36}
                className="mx-auto animate-spin text-orange-600"
              />

              <p className="mt-4 text-sm text-[#806b5e]">
                Loading equipment details...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-white px-5 py-16 text-center">
            <Package size={48} className="mx-auto text-red-400" />

            <h2 className="mt-5 text-xl font-bold text-[#442719]">
              Unable to Load Equipment
            </h2>

            <p className="mt-3 text-sm text-red-600">{error}</p>

            <Link
              href="/all-equipment"
              className="mt-6 inline-flex rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              Browse Equipment
            </Link>
          </div>
        )}

        {/* Equipment Details */}
        {!loading && !error && equipment && (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Equipment Image */}
            <div className="relative flex min-h-80 items-center justify-center overflow-hidden rounded-3xl border border-[#eee5dc] bg-white shadow-sm lg:min-h-[500px]">
              {equipment.image ? (
                <Image
                  src={equipment.image}
                  alt={equipment.name}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              ) : (
                <Package size={80} className="text-orange-500" />
              )}
            </div>

            {/* Equipment Information */}
            <div className="rounded-3xl border border-[#eee5dc] bg-white p-6 shadow-sm sm:p-8">
              <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold text-orange-700">
                {equipment.category}
              </span>

              <h1 className="mt-5 text-3xl font-bold text-[#442719] sm:text-4xl">
                {equipment.name}
              </h1>

              <p className="mt-4 text-sm leading-7 text-[#806b5e]">
                {equipment.description}
              </p>

              {/* Price */}
              <div className="mt-7 rounded-2xl bg-[#faf7f2] p-5">
                <p className="text-sm text-[#806b5e]">Rental Price</p>

                <p className="mt-2 text-3xl font-bold text-orange-600">
                  ৳{equipment.pricePerDay.toLocaleString("en-BD")}
                </p>

                <p className="mt-1 text-xs text-[#806b5e]">
                  Rental price per day
                </p>
              </div>

              {/* Additional Information */}
              <div className="mt-7 space-y-5">
                <div className="flex items-center gap-3">
                  <MapPin className="shrink-0 text-orange-600" size={20} />

                  <span className="text-sm text-[#665348]">
                    {equipment.location}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <User className="shrink-0 text-orange-600" size={20} />

                  <span className="text-sm break-all text-[#665348]">
                    Owner: {equipment.ownerEmail}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <CalendarDays
                    className="shrink-0 text-orange-600"
                    size={20}
                  />

                  <span className="text-sm text-[#665348]">
                    Listed on{" "}
                    {new Date(equipment.createdAt).toLocaleDateString("en-GB")}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <ShieldCheck className="shrink-0 text-orange-600" size={20} />

                  <span className="text-sm text-[#665348]">
                    Approved equipment
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Package className="shrink-0 text-orange-600" size={20} />

                  <span className="text-sm text-[#665348]">
                    {availableQuantity} items available
                  </span>
                </div>
              </div>

              {/* Booking Form */}
              <div className="mt-8 border-t border-[#eee5dc] pt-7">
                <h2 className="text-xl font-bold text-[#442719]">
                  Book This Equipment
                </h2>

                <p className="mt-2 text-sm text-[#806b5e]">
                  Select your rental period and quantity.
                </p>

                <form onSubmit={handleBooking} className="mt-6 space-y-5">
                  {/* Start Date */}
                  <div>
                    <label
                      htmlFor="startDate"
                      className="mb-2 block text-sm font-semibold text-[#665348]"
                    >
                      Rental Start Date
                    </label>

                    <input
                      id="startDate"
                      type="date"
                      value={startDate}
                      min={minDate}
                      onChange={(event) => {
                        setStartDate(event.target.value)
                        setBookingError(null)
                        setBookingSuccess(null)

                        if (endDate && event.target.value >= endDate) {
                          setEndDate("")
                        }
                      }}
                      required
                      className="w-full rounded-xl border border-[#eee5dc] px-4 py-3 text-sm transition outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label
                      htmlFor="endDate"
                      className="mb-2 block text-sm font-semibold text-[#665348]"
                    >
                      Rental End Date
                    </label>

                    <input
                      id="endDate"
                      type="date"
                      value={endDate}
                      min={startDate || minDate}
                      onChange={(event) => {
                        setEndDate(event.target.value)
                        setBookingError(null)
                        setBookingSuccess(null)
                      }}
                      required
                      className="w-full rounded-xl border border-[#eee5dc] px-4 py-3 text-sm transition outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Quantity Selector */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#665348]">
                      Select Quantity
                    </label>

                    <div className="flex items-center justify-between rounded-xl border border-[#eee5dc] px-4 py-3">
                      <span className="text-sm text-[#806b5e]">
                        Number of items
                      </span>

                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            setQuantity((previous) => Math.max(1, previous - 1))
                            setBookingError(null)
                          }}
                          disabled={quantity <= 1}
                          aria-label="Decrease quantity"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#eee5dc] text-[#442719] transition hover:bg-[#faf7f2] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="min-w-6 text-center font-bold text-[#442719]">
                          {quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            setQuantity((previous) =>
                              Math.min(availableQuantity, previous + 1)
                            )
                            setBookingError(null)
                          }}
                          disabled={quantity >= availableQuantity}
                          aria-label="Increase quantity"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#eee5dc] text-[#442719] transition hover:bg-[#faf7f2] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-[#806b5e]">
                      Maximum available quantity: {availableQuantity}
                    </p>
                  </div>

                  {/* Rental Summary */}
                  {totalDays > 0 && (
                    <div className="rounded-2xl bg-[#faf7f2] p-5">
                      <h3 className="font-semibold text-[#442719]">
                        Rental Summary
                      </h3>

                      <div className="mt-4 space-y-3 text-sm">
                        <div className="flex justify-between text-[#806b5e]">
                          <span>Price per day</span>
                          <span>
                            ৳{equipment.pricePerDay.toLocaleString("en-BD")}
                          </span>
                        </div>

                        <div className="flex justify-between text-[#806b5e]">
                          <span>Rental duration</span>
                          <span>{totalDays} days</span>
                        </div>

                        <div className="flex justify-between text-[#806b5e]">
                          <span>Quantity</span>
                          <span>{quantity} items</span>
                        </div>

                        <div className="flex justify-between text-[#806b5e]">
                          <span>Calculation</span>
                          <span>
                            {totalDays} × {quantity} × ৳
                            {equipment.pricePerDay.toLocaleString("en-BD")}
                          </span>
                        </div>

                        <div className="flex justify-between border-t border-[#dfd0c2] pt-3 font-bold text-[#442719]">
                          <span>Estimated Total</span>

                          <span className="text-lg text-orange-600">
                            ৳{totalPrice.toLocaleString("en-BD")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Booking Error */}
                  {bookingError && (
                    <p
                      role="alert"
                      className="rounded-xl bg-red-50 p-3 text-sm text-red-600"
                    >
                      {bookingError}
                    </p>
                  )}

                  {/* Booking Success */}
                  {bookingSuccess && (
                    <div
                      role="status"
                      className="flex items-start gap-3 rounded-xl bg-green-50 p-4 text-sm text-green-700"
                    >
                      <CheckCircle2 size={20} className="shrink-0" />

                      <div>
                        <p>{bookingSuccess}</p>

                        <Link
                          href="/dashboard/my-rentals"
                          className="mt-2 inline-block font-semibold underline"
                        >
                          Go to My Rentals
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={
                      bookingLoading ||
                      authLoading ||
                      availableQuantity < 1 ||
                      quantity > availableQuantity ||
                      (isAuthenticated && !isRenter)
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-4 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {authLoading ? (
                      "Checking Account..."
                    ) : bookingLoading ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        Creating Booking...
                      </>
                    ) : !isAuthenticated ? (
                      "Login to Book"
                    ) : !isRenter ? (
                      "Renter Account Required"
                    ) : availableQuantity < 1 ? (
                      "Currently Unavailable"
                    ) : (
                      "Book Now"
                    )}
                  </button>

                  {/* Information */}
                  <p className="text-center text-xs leading-6 text-[#806b5e]">
                    {!isAuthenticated
                      ? "Please login to your account before booking."
                      : !isRenter
                        ? "Only renter accounts are allowed to book equipment."
                        : "Your booking will be reserved temporarily. Complete your payment to confirm the booking."}
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

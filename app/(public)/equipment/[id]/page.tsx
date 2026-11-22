
"use client"

import { useEffect, useState } from "react"
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
  Minus,
  Plus,
  X,
  CheckCircle2,
  Mail,
  FlaskConical,
  LockKeyhole,
  ShieldCheck as SecureIcon,
} from "lucide-react"

import { getEquipmentById, type Equipment } from "@/services/equipment.service"
import { createDemoBooking } from "@/services/rental.service"
import { useAuth } from "@/hooks/use-auth"

interface DemoBookingModalProps {
  equipment: Equipment
  renterEmail: string
  startDate: string
  endDate: string
  totalDays: number
  quantity: number
  totalPrice: number
  loading: boolean
  error: string | null
  success: boolean
  onClose: () => void
  onConfirm: () => void
  onGoToRentals: () => void
}

function DemoBookingModal({
  equipment,
  renterEmail,
  startDate,
  endDate,
  totalDays,
  quantity,
  totalPrice,
  loading,
  error,
  success,
  onClose,
  onConfirm,
  onGoToRentals,
}: DemoBookingModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6">
      <div className="my-auto grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-[0.85fr_1.15fr]">

        {/* LEFT SIDE - BOOKING SUMMARY */}
        <div className="relative flex flex-col justify-between bg-[#14233d] p-6 text-white sm:p-9">

          <div>
            <button
              type="button"
              onClick={onClose}
              disabled={loading || success}
              className="mb-9 flex items-center gap-2 text-xs font-medium text-slate-300 transition hover:text-white disabled:opacity-50"
            >
              <ArrowLeft size={15} />
              Cancel & Return
            </button>

            <div className="mb-5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-bold tracking-[0.15em] text-emerald-400">
                RENTORA SECURE DEMO CHECKOUT
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight">
              Rentora Checkout
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {equipment.name}
            </p>

            <div className="my-7 border-t border-white/10" />

            {/* Equipment */}
            <div className="flex gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white/10">
                {equipment.image ? (
                  <Image
                    src={equipment.image}
                    alt={equipment.name}
                    fill
                    unoptimized
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <Package
                    size={30}
                    className="absolute inset-0 m-auto text-orange-400"
                  />
                )}
              </div>

              <div className="min-w-0">
                <span className="text-xs font-semibold text-orange-400">
                  {equipment.category}
                </span>

                <h3 className="mt-1 font-semibold">
                  {equipment.name}
                </h3>

                <p className="mt-2 text-xs text-slate-400">
                  ৳{equipment.pricePerDay.toLocaleString("en-BD")} / day
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-8 space-y-5 text-sm">

              <div className="flex justify-between gap-3">
                <span className="text-slate-400">Rental Start</span>
                <span className="font-medium">{startDate}</span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-slate-400">Rental End</span>
                <span className="font-medium">{endDate}</span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-slate-400">Duration</span>
                <span className="font-medium">{totalDays} days</span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-slate-400">Quantity</span>
                <span className="font-medium">{quantity} items</span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-slate-400">Rental Fee</span>
                <span className="font-medium">
                  ৳{(equipment.pricePerDay * totalDays * quantity).toLocaleString("en-BD")}
                </span>
              </div>

              <div className="border-t border-white/10 pt-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-bold">Total Due Now</span>

                  <span className="text-2xl font-bold text-emerald-400">
                    ৳{totalPrice.toLocaleString("en-BD")}
                  </span>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="mt-9 space-y-3 border-t border-white/10 pt-6">
              <p className="flex items-center gap-2 text-xs text-slate-400">
                <SecureIcon size={15} className="text-emerald-400" />
                Secure booking verification
              </p>

              <p className="flex items-center gap-2 text-xs text-slate-400">
                <LockKeyhole size={15} />
                No real money will be charged
              </p>
            </div>
          </div>

          <p className="mt-10 text-xs text-slate-500">
            Powered by <span className="font-bold text-white">Rentora</span>
          </p>
        </div>

        {/* RIGHT SIDE - DEMO PAYMENT */}
        <div className="flex flex-col justify-between bg-white p-6 sm:p-9">

          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Payment Details
                </h2>

                <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
                  Confirm your equipment booking securely using our demo checkout.
                </p>
              </div>

              {!success && (
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  aria-label="Close checkout"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-red-500 disabled:opacity-50"
                >
                  <X size={19} />
                </button>
              )}
            </div>

            {success ? (
              <div className="py-16 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                  <CheckCircle2 size={45} className="text-emerald-600" />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  Booking Successful!
                </h3>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-500">
                  Your demo booking has been confirmed successfully.
                  You can now view your booking in My Rentals.
                </p>

                <button
                  type="button"
                  onClick={onGoToRentals}
                  className="mt-8 w-full rounded-xl bg-[#5145e5] px-6 py-4 font-semibold text-white transition hover:bg-[#4338ca]"
                >
                  Go to My Rentals
                </button>
              </div>
            ) : (
              <>
                {/* Demo Mode */}
                <div className="mt-8 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
                  <div className="flex items-center gap-2">
                    <FlaskConical size={18} className="text-emerald-600" />

                    <span className="text-sm font-bold text-emerald-800">
                      Demo Mode Simulation
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-6 text-emerald-700">
                    This is a test booking. No real payment will be collected.
                    No card information is required.
                  </p>
                </div>

                {/* Customer Information */}
                <div className="mt-7">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Customer Email
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <Mail size={19} className="shrink-0 text-slate-500" />

                    <span className="break-all text-sm text-slate-700">
                      {renterEmail || "Email not available"}
                    </span>
                  </div>
                </div>

                {/* Booking Information */}
                <div className="mt-6">
                  <label className="mb-3 block text-sm font-semibold text-slate-700">
                    Booking Information
                  </label>

                  <div className="space-y-3 rounded-xl border border-slate-200 p-4">

                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-500">Equipment</span>
                      <span className="text-right font-medium text-slate-800">
                        {equipment.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-500">Rental Period</span>
                      <span className="text-right font-medium text-slate-800">
                        {totalDays} days
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-500">Quantity</span>
                      <span className="font-medium text-slate-800">
                        {quantity}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <span className="font-bold text-slate-900">
                        Total Amount
                      </span>

                      <span className="text-xl font-bold text-[#5145e5]">
                        ৳{totalPrice.toLocaleString("en-BD")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <p
                    role="alert"
                    className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600"
                  >
                    {error}
                  </p>
                )}

                {/* Confirm */}
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={loading || !renterEmail}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#5145e5] px-6 py-4 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-[#4338ca] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      Confirming Booking...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Confirm Booking · ৳{totalPrice.toLocaleString("en-BD")}
                    </>
                  )}
                </button>

                <p className="mt-4 text-center text-xs text-slate-400">
                  This is a simulated demo transaction. No card will be charged.
                </p>
              </>
            )}
          </div>

          {!success && (
            <p className="mt-8 text-center text-xs text-slate-400">
              Cancel and return to Rentora
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function EquipmentDetailsPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params.id

  const {
    user,
    isAuthenticated,
    loading: authLoading,
    isRenter,
  } = useAuth()

  const renterEmail = user?.email ?? ""

  const [equipment, setEquipment] = useState<Equipment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [quantity, setQuantity] = useState(1)

  const [bookingError, setBookingError] = useState<string | null>(null)

  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const [demoBookingLoading, setDemoBookingLoading] = useState(false)
  const [demoBookingError, setDemoBookingError] = useState<string | null>(null)
  const [demoBookingSuccess, setDemoBookingSuccess] = useState(false)

  const today = new Date()

  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-")

  const availableQuantity = equipment?.availableQuantity ?? 0

  const totalDays =
    startDate && endDate
      ? Math.round(
          (Date.parse(`${endDate}T00:00:00Z`) -
            Date.parse(`${startDate}T00:00:00Z`)) /
            (1000 * 60 * 60 * 24)
        )
      : 0

  const totalPrice =
    equipment && totalDays > 0
      ? totalDays * equipment.pricePerDay * quantity
      : 0

  // Fetch Equipment
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

  // Validate Booking
  const validateBooking = (): string | null => {
    if (authLoading) {
      return "Please wait while checking your account."
    }

    if (!isAuthenticated) {
      router.push("/login")
      return "Please login to continue."
    }

    if (!isRenter) {
      return "Only renter accounts can book equipment."
    }

    if (!startDate || !endDate) {
      return "Please select both rental dates."
    }

    if (startDate < minDate) {
      return "Start date cannot be in the past."
    }

    if (totalDays <= 0) {
      return "End date must be after the start date."
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return "Please select a valid quantity."
    }

    if (quantity > availableQuantity) {
      return `Only ${availableQuantity} items are currently available.`
    }

    return null
  }

  // Open Demo Checkout
  const handleOpenDemoCheckout = () => {
    setBookingError(null)
    setDemoBookingError(null)
    setDemoBookingSuccess(false)

    const validationError = validateBooking()

    if (validationError) {
      if (isAuthenticated) {
        setBookingError(validationError)
      }
      return
    }

    if (!renterEmail) {
      setBookingError("Unable to find your account email. Please login again.")
      return
    }

    setDemoModalOpen(true)
  }

  // Confirm Demo Booking
  const handleConfirmDemoBooking = async () => {
    if (!isAuthenticated || !isRenter) {
      setDemoBookingError("Please login with a renter account.")
      return
    }

    if (!renterEmail) {
      setDemoBookingError("Customer email is not available.")
      return
    }

    try {
      setDemoBookingLoading(true)
      setDemoBookingError(null)

      const result = await createDemoBooking({
        equipmentId: id,
        startDate,
        endDate,
        quantity,
      })

      if (!result.success) {
        throw new Error(result.message)
      }

      setDemoBookingSuccess(true)
    } catch (error) {
      setDemoBookingError(
        error instanceof Error
          ? error.message
          : "Failed to create demo booking."
      )
    } finally {
      setDemoBookingLoading(false)
    }
  }

  const handleCloseDemoModal = () => {
    if (demoBookingLoading || demoBookingSuccess) return

    setDemoModalOpen(false)
    setDemoBookingError(null)
  }

  const handleGoToRentals = () => {
    router.push("/dashboard/my-rentals")
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] px-5 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

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
                  <span className="break-all text-sm text-[#665348]">
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

                <div className="mt-6 space-y-5">

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

                        if (endDate && event.target.value >= endDate) {
                          setEndDate("")
                        }
                      }}
                      required
                      className="w-full rounded-xl border border-[#eee5dc] px-4 py-3 text-sm outline-none transition focus:border-orange-500"
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
                      }}
                      required
                      className="w-full rounded-xl border border-[#eee5dc] px-4 py-3 text-sm outline-none transition focus:border-orange-500"
                    />
                  </div>

                  {/* Quantity */}
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

                  {/* Customer Email */}
                  {isAuthenticated && (
                    <div className="rounded-xl border border-[#eee5dc] bg-[#faf7f2] p-4">
                      <div className="flex items-center gap-2">
                        <Mail size={18} className="text-orange-600" />

                        <span className="text-sm font-semibold text-[#442719]">
                          Booking Account
                        </span>
                      </div>

                      <p className="mt-2 break-all text-sm text-[#665348]">
                        {renterEmail || "Loading account email..."}
                      </p>
                    </div>
                  )}

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
                          <span>Total Amount</span>

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

                  {/* Demo Checkout Button */}
                  <button
                    type="button"
                    onClick={handleOpenDemoCheckout}
                    disabled={
                      authLoading ||
                      demoBookingLoading ||
                      availableQuantity < 1 ||
                      quantity > availableQuantity ||
                      (isAuthenticated && !isRenter)
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-4 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {authLoading ? (
                      "Checking Account..."
                    ) : !isAuthenticated ? (
                      "Login to Book"
                    ) : !isRenter ? (
                      "Renter Account Required"
                    ) : availableQuantity < 1 ? (
                      "Currently Unavailable"
                    ) : (
                      <>
                        <CheckCircle2 size={19} />
                        Continue to Checkout
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-[#806b5e]">
                    <FlaskConical size={15} className="text-orange-600" />
                    Demo Checkout · No Card Details Required
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Demo Checkout Modal */}
      {demoModalOpen && equipment && (
        <DemoBookingModal
          equipment={equipment}
          renterEmail={renterEmail}
          startDate={startDate}
          endDate={endDate}
          totalDays={totalDays}
          quantity={quantity}
          totalPrice={totalPrice}
          loading={demoBookingLoading}
          error={demoBookingError}
          success={demoBookingSuccess}
          onClose={handleCloseDemoModal}
          onConfirm={handleConfirmDemoBooking}
          onGoToRentals={handleGoToRentals}
        />
      )}
    </main>
  )
}

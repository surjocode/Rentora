
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
  Minus,
  Plus,
  X,
  CreditCard,
  CheckCircle2,
} from "lucide-react"

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"

import { loadStripe } from "@stripe/stripe-js"

import { getEquipmentById, type Equipment } from "@/services/equipment.service"
import { createPaymentIntent } from "@/services/rental.service"
import { useAuth } from "@/hooks/use-auth"

// Stripe configuration
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

interface PaymentFormProps {
  onSuccess: () => void
}

function PaymentForm({ onSuccess }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()

  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const handlePayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!stripe || !elements) {
      setPaymentError("Payment system is not ready. Please try again.")
      return
    }

    try {
      setPaymentLoading(true)
      setPaymentError(null)

      const result = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      })

      if (result.error) {
        throw new Error(
          result.error.message || "Payment could not be completed."
        )
      }

      if (result.paymentIntent?.status === "succeeded") {
        onSuccess()
        return
      }

      if (result.paymentIntent?.status === "processing") {
        setPaymentError(
          "Your payment is processing. Please check My Rentals shortly."
        )
        return
      }

      setPaymentError(
        "Payment has not been completed. Please try again."
      )
    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : "Something went wrong during payment."
      )
    } finally {
      setPaymentLoading(false)
    }
  }

  return (
    <form onSubmit={handlePayment} className="space-y-5">
      <div>
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-[#442719]">
          <CreditCard size={19} className="text-orange-600" />
          Payment Information
        </h3>

        <PaymentElement />
      </div>

      {paymentError && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-3 text-sm text-red-600"
        >
          {paymentError}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || paymentLoading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-4 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {paymentLoading ? (
          <>
            <RefreshCw size={18} className="animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard size={18} />
            Pay Now
          </>
        )}
      </button>

      <p className="text-center text-xs leading-6 text-[#806b5e]">
        Your booking will be created only after successful payment
        verification.
      </p>
    </form>
  )
}

interface PaymentModalProps {
  equipment: Equipment
  clientSecret: string
  startDate: string
  endDate: string
  totalDays: number
  quantity: number
  totalPrice: number
  onClose: () => void
  onGoToRentals: () => void
}

function PaymentModal({
  equipment,
  clientSecret,
  startDate,
  endDate,
  totalDays,
  quantity,
  totalPrice,
  onClose,
  onGoToRentals,
}: PaymentModalProps) {
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <div className="my-auto w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#eee5dc] p-5 sm:p-6">
          <div>
            <h2 className="text-xl font-bold text-[#442719]">
              Complete Your Payment
            </h2>

            <p className="mt-1 text-sm text-[#806b5e]">
              Review your rental details and pay securely.
            </p>
          </div>

          {!paymentSuccess && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close payment modal"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#806b5e] transition hover:bg-[#faf7f2] hover:text-red-600"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-5 sm:p-6">
          {paymentSuccess ? (
            <div className="py-8 text-center">
              <CheckCircle2
                size={64}
                className="mx-auto text-green-600"
              />

              <h3 className="mt-5 text-2xl font-bold text-[#442719]">
                Payment Successful!
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#806b5e]">
                Your payment was successful. Stripe is notifying our
                server to verify the payment and create your booking.
                You can check the booking status in My Rentals.
              </p>

              <button
                type="button"
                onClick={onGoToRentals}
                className="mt-7 w-full rounded-xl bg-orange-600 px-6 py-4 font-semibold text-white transition hover:bg-orange-700"
              >
                Go to My Rentals
              </button>
            </div>
          ) : (
            <>
              {/* Equipment Information */}
              <div className="flex gap-4 rounded-2xl bg-[#faf7f2] p-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white">
                  {equipment.image ? (
                    <Image
                      src={equipment.image}
                      alt={equipment.name}
                      fill
                      unoptimized
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <Package
                      size={35}
                      className="absolute inset-0 m-auto text-orange-500"
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <span className="text-xs font-semibold text-orange-600">
                    {equipment.category}
                  </span>

                  <h3 className="mt-1 font-bold text-[#442719]">
                    {equipment.name}
                  </h3>

                  <p className="mt-2 text-sm text-[#806b5e]">
                    ৳{equipment.pricePerDay.toLocaleString("en-BD")} / day
                  </p>
                </div>
              </div>

              {/* Rental Summary */}
              <div className="mt-5 rounded-2xl border border-[#eee5dc] p-4">
                <h3 className="font-semibold text-[#442719]">
                  Rental Summary
                </h3>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-[#806b5e]">
                      Start Date
                    </span>
                    <span className="font-medium text-[#442719]">
                      {startDate}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-[#806b5e]">
                      End Date
                    </span>
                    <span className="font-medium text-[#442719]">
                      {endDate}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-[#806b5e]">
                      Rental Duration
                    </span>
                    <span className="font-medium text-[#442719]">
                      {totalDays} days
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-[#806b5e]">
                      Quantity
                    </span>
                    <span className="font-medium text-[#442719]">
                      {quantity} items
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-[#806b5e]">
                      Price Per Day
                    </span>
                    <span className="font-medium text-[#442719]">
                      ৳{equipment.pricePerDay.toLocaleString("en-BD")}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 border-t border-[#eee5dc] pt-4">
                    <span className="font-bold text-[#442719]">
                      Total Amount
                    </span>

                    <span className="text-xl font-bold text-orange-600">
                      ৳{totalPrice.toLocaleString("en-BD")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stripe Payment Element */}
              <div className="mt-6">
                {stripePromise ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "stripe",
                        variables: {
                          colorPrimary: "#ea580c",
                          borderRadius: "10px",
                        },
                      },
                    }}
                  >
                    <PaymentForm
                      onSuccess={() => setPaymentSuccess(true)}
                    />
                  </Elements>
                ) : (
                  <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
                    Stripe publishable key is missing. Please check
                    your frontend environment configuration.
                  </p>
                )}
              </div>
            </>
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

  const { isAuthenticated, loading: authLoading, isRenter } = useAuth()

  const [equipment, setEquipment] = useState<Equipment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [quantity, setQuantity] = useState(1)

  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)

  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)

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

  // Create Payment Intent
  const handleBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setBookingError(null)

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

      const result = await createPaymentIntent({
        equipmentId: id,
        startDate,
        endDate,
        quantity,
      })

      if (!result.success) {
        throw new Error(result.message)
      }

      if (!result.clientSecret) {
        throw new Error("Unable to initialize the payment.")
      }

      // No rental is created here.
      // Rental will be created by the Stripe webhook after successful payment.
      setClientSecret(result.clientSecret)
      setPaymentModalOpen(true)
    } catch (error) {
      setBookingError(
        error instanceof Error
          ? error.message
          : "Failed to initialize payment."
      )
    } finally {
      setBookingLoading(false)
    }
  }

  const handleClosePaymentModal = () => {
    setPaymentModalOpen(false)
    setClientSecret(null)
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
                        Preparing Payment...
                      </>
                    ) : !isAuthenticated ? (
                      "Login to Book"
                    ) : !isRenter ? (
                      "Renter Account Required"
                    ) : availableQuantity < 1 ? (
                      "Currently Unavailable"
                    ) : (
                      <>
                        <CreditCard size={18} />
                        Book Now
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs leading-6 text-[#806b5e]">
                    Your booking will be created only after successful
                    payment verification.
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {paymentModalOpen && clientSecret && equipment && (
        <PaymentModal
          equipment={equipment}
          clientSecret={clientSecret}
          startDate={startDate}
          endDate={endDate}
          totalDays={totalDays}
          quantity={quantity}
          totalPrice={totalPrice}
          onClose={handleClosePaymentModal}
          onGoToRentals={handleGoToRentals}
        />
      )}
    </main>
  )
}

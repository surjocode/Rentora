
"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import Link from "next/link"
import Image from "next/image"

import {
  Package,
  Search,
  MapPin,
  ArrowRight,
  CheckCircle,
  RefreshCw,
  Loader2,
  RotateCcw,
} from "lucide-react"

import { useAuth } from "@/hooks/use-auth"

import { getMyRentals, type Rental } from "@/services/rental.service"

// Equipment interface
interface RentalEquipment {
  _id: string
  name: string
  image: string
  category: string
  location: string
  pricePerDay: number
}

// Rental interface
interface RentalWithEquipment extends Rental {
  equipment?: RentalEquipment
}

// Format Date
const formatDate = (date: string) => {
  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date"
  }

  return parsedDate.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

// Format Price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-BD").format(price)
}

export default function MyRentalsPage() {
  const { user, loading: authLoading, isAuthenticated, isRenter } = useAuth()

  const [rentals, setRentals] = useState<RentalWithEquipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")

  // ==========================================
  // FETCH CUSTOMER BOOKINGS
  // ==========================================

  const fetchRentals = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await getMyRentals()

      if (!result.success) {
        throw new Error(result.message)
      }

      setRentals(result.data)
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Failed to load your bookings."
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authLoading) return

    if (!isAuthenticated || !isRenter) {
      setLoading(false)
      return
    }

    void fetchRentals()
  }, [authLoading, isAuthenticated, isRenter, fetchRentals])

  // ==========================================
  // SEARCH BOOKINGS
  // ==========================================

  const filteredRentals = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return rentals.filter((rental) => {
      const equipmentName = rental.equipment?.name ?? ""
      const category = rental.equipment?.category ?? ""
      const location = rental.equipment?.location ?? ""

      return [equipmentName, category, location].some((value) =>
        value.toLowerCase().includes(searchValue)
      )
    })
  }, [rentals, search])

  // ==========================================
  // BOOKING SUMMARY
  // ==========================================

  const totalBookings = rentals.length

  const totalBookingValue = rentals.reduce(
    (total, rental) => total + rental.totalPrice,
    0
  )

  // ==========================================
  // LOADING
  // ==========================================

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-[#ea580c]" size={36} />

          <p className="mt-3 text-sm text-[#9b8a7e]">
            Loading your bookings...
          </p>
        </div>
      </div>
    )
  }

  // ==========================================
  // AUTHENTICATION CHECK
  // ==========================================

  if (!isAuthenticated || !isRenter) {
    return (
      <div className="rounded-2xl border border-[#eee4da] bg-white px-5 py-16 text-center">
        <Package className="mx-auto text-[#ea580c]" size={42} />

        <h2 className="mt-4 text-xl font-bold text-[#442719]">
          Renter Access Required
        </h2>

        <p className="mt-2 text-sm text-[#9b8a7e]">
          Please sign in with a renter account to view your bookings.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-flex rounded-xl bg-[#ea580c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          Login
        </Link>
      </div>
    )
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page Heading */}

      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold tracking-wider text-[#ea580c] uppercase">
            Customer Dashboard
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#442719] sm:text-3xl">
            My Rentals
          </h1>

          <p className="mt-2 text-sm text-[#9b8a7e]">
            Welcome, {user?.name}. View and manage your equipment bookings.
          </p>
        </div>

        <Link
          href="/all-equipment"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ea580c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          <Package size={18} />
          Browse Equipment
        </Link>
      </section>

      {/* Booking Summary */}

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#eee4da] bg-white p-5">
          <p className="text-sm text-[#9b8a7e]">Total Bookings</p>

          <h2 className="mt-2 text-3xl font-bold text-[#442719]">
            {totalBookings}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#eee4da] bg-white p-5">
          <p className="text-sm text-[#9b8a7e]">Total Booking Value</p>

          <h2 className="mt-2 text-3xl font-bold text-[#ea580c]">
            ৳{formatPrice(totalBookingValue)}
          </h2>
        </div>
      </section>

      {/* Search */}

      <section className="flex flex-col gap-4 rounded-2xl border border-[#eee4da] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold text-[#442719]">Booking History</h2>

          <p className="mt-1 text-sm text-[#9b8a7e]">
            View your equipment booking history.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[#eee4da] px-3 py-2.5">
          <Search size={18} className="text-[#9b8a7e]" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search bookings..."
            className="w-full bg-transparent text-sm text-[#442719] outline-none placeholder:text-[#b3a69c] sm:w-48"
          />
        </div>
      </section>

      {/* Error */}

      {error && (
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center">
          <p className="text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={() => void fetchRentals()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-600"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      )}

      {/* Bookings List */}

      {filteredRentals.length > 0 ? (
        <section className="space-y-4">
          {filteredRentals.map((rental) => (
            <article
              key={rental._id}
              className="overflow-hidden rounded-2xl border border-[#eee4da] bg-white p-4 sm:p-5"
            >
              <div className="flex flex-col gap-5 md:flex-row">
                {/* Equipment Image */}

                <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl bg-[#faf7f2] md:h-40 md:w-52">
                  {rental.equipment?.image ? (
                    <Image
                      src={rental.equipment.image}
                      alt={rental.equipment.name || "Rental equipment"}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 208px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#a18d7e]">
                      <Package size={42} />
                    </div>
                  )}
                </div>

                {/* Equipment Information */}

                <div className="flex flex-1 flex-col justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-full bg-[#faf0e8] px-3 py-1 text-xs font-semibold text-[#ea580c]">
                        {rental.equipment?.category || "Equipment"}
                      </span>

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                        <CheckCircle size={15} />
                        Booking Recorded
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-[#442719]">
                      {rental.equipment?.name ||
                        "Equipment no longer available"}
                    </h3>

                    <p className="mt-2 flex items-center gap-1.5 text-sm text-[#9b8a7e]">
                      <MapPin size={15} />
                      {rental.equipment?.location || "Location unavailable"}
                    </p>
                  </div>

                  {/* Booking Details */}

                  <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-xs text-[#9b8a7e]">Rental Period</p>

                      <p className="mt-1 font-medium text-[#442719]">
                        {formatDate(rental.startDate)} -{" "}
                        {formatDate(rental.endDate)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#9b8a7e]">Total Days</p>

                      <p className="mt-1 font-medium text-[#442719]">
                        {rental.totalDays} days
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#9b8a7e]">Quantity</p>

                      <p className="mt-1 font-medium text-[#442719]">
                        {rental.quantity} items
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#9b8a7e]">Total Price</p>

                      <p className="mt-1 font-bold text-[#ea580c]">
                        ৳{formatPrice(rental.totalPrice)}
                      </p>
                    </div>
                  </div>

                  {/* Booking Footer */}

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f1e9e1] pt-4">
                    <p className="text-xs text-[#9b8a7e]">
                      Booked on {formatDate(rental.createdAt)}
                    </p>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                      <CheckCircle size={14} />
                      Booking Recorded
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-[#e5d8ca] bg-white px-5 py-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#faf7f2] text-[#a18d7e]">
            <Package size={38} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#442719]">
            {rentals.length === 0
              ? "No Bookings Yet"
              : "No Matching Bookings"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#9b8a7e]">
            {rentals.length === 0
              ? "Your equipment bookings will appear here. Explore our equipment collection to get started."
              : "No bookings match your current search."}
          </p>

          {rentals.length === 0 ? (
            <Link
              href="/all-equipment"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#ea580c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              Explore Equipment
              <ArrowRight size={18} />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#faf0e8] px-6 py-3 text-sm font-semibold text-[#ea580c]"
            >
              <RotateCcw size={16} />
              Clear Search
            </button>
          )}
        </section>
      )}
    </div>
  )
}

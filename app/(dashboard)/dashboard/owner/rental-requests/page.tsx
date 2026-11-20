"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ClipboardList,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  CalendarDays,
  MapPin,
  UserRound,
  Filter,
  Loader2,
  RefreshCw,
  Package,
} from "lucide-react"

import { useAuth } from "@/hooks/use-auth"
import {
  getOwnerRentalRequests,
  updateRentalStatus,
  type Rental,
} from "@/services/rental.service"

interface RentalEquipment {
  _id: string
  name: string
  image: string
  category: string
  location: string
  pricePerDay: number
}

interface RentalRequest extends Rental {
  equipment?: RentalEquipment
}

type StatusFilter = "all" | "pending" | "approved" | "rejected"

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-BD").format(price)

export default function RentalRequestsPage() {
  const { loading: authLoading, isAuthenticated, isOwner } = useAuth()

  const [requests, setRequests] = useState<RentalRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await getOwnerRentalRequests()

      if (!result.success) {
        throw new Error(result.message)
      }

      setRequests(result.data)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load rental requests"
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authLoading) return

    if (!isAuthenticated || !isOwner) {
      setLoading(false)
      return
    }

    void fetchRequests()
  }, [authLoading, isAuthenticated, isOwner, fetchRequests])

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const equipmentName = request.equipment?.name ?? ""
      const customerEmail = request.renterEmail ?? ""
      const location = request.equipment?.location ?? ""

      const searchMatch = [equipmentName, customerEmail, location].some(
        (value) => value.toLowerCase().includes(search.trim().toLowerCase())
      )

      const statusMatch =
        statusFilter === "all" || request.status === statusFilter

      return searchMatch && statusMatch
    })
  }, [requests, search, statusFilter])

  const pendingCount = requests.filter(
    (request) => request.status === "pending"
  ).length

  const approvedCount = requests.filter(
    (request) => request.status === "approved"
  ).length

  const rejectedCount = requests.filter(
    (request) => request.status === "rejected"
  ).length

  const handleUpdateStatus = async (
    rentalId: string,
    status: "approved" | "rejected"
  ) => {
    const action = status === "approved" ? "approve" : "reject"

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this rental request?`
    )

    if (!confirmed) return

    try {
      setUpdatingId(rentalId)
      setError(null)

      const result = await updateRentalStatus(rentalId, status)

      if (!result.success) {
        throw new Error(result.message)
      }

      setRequests((previousRequests) =>
        previousRequests.map((request) =>
          request._id === rentalId ? { ...request, status } : request
        )
      )
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : `Failed to ${action} rental request`
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusStyle = (status: Rental["status"]) => {
    switch (status) {
      case "pending":
        return "bg-orange-50 text-orange-600"
      case "approved":
        return "bg-green-50 text-green-600"
      case "rejected":
        return "bg-red-50 text-red-600"
      case "cancelled":
        return "bg-gray-100 text-gray-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 size={36} className="mx-auto animate-spin text-[#ea580c]" />
          <p className="mt-3 text-sm text-[#9b8a7e]">
            Loading rental requests...
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isOwner) {
    return (
      <div className="rounded-2xl border border-[#eee4da] bg-white px-5 py-16 text-center">
        <ClipboardList size={42} className="mx-auto text-[#ea580c]" />

        <h2 className="mt-4 text-xl font-bold text-[#442719]">
          Owner Access Required
        </h2>

        <p className="mt-2 text-sm text-[#9b8a7e]">
          Please sign in with an equipment owner account to manage rental
          requests.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-flex rounded-xl bg-[#ea580c] px-6 py-3 text-sm font-semibold text-white hover:bg-orange-700"
        >
          Login
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page Heading */}
      <section>
        <p className="text-sm font-semibold tracking-wider text-[#ea580c] uppercase">
          Owner Dashboard
        </p>

        <h1 className="mt-2 text-2xl font-bold text-[#442719] sm:text-3xl">
          Rental Requests
        </h1>

        <p className="mt-2 text-sm text-[#9b8a7e]">
          Review and manage customer equipment booking requests.
        </p>
      </section>

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Total Requests",
            value: requests.length,
            icon: ClipboardList,
            color: "text-blue-600 bg-blue-50",
          },
          {
            title: "Pending Requests",
            value: pendingCount,
            icon: Clock,
            color: "text-orange-600 bg-orange-50",
          },
          {
            title: "Approved Requests",
            value: approvedCount,
            icon: CheckCircle,
            color: "text-green-600 bg-green-50",
          },
          {
            title: "Rejected Requests",
            value: rejectedCount,
            icon: XCircle,
            color: "text-red-600 bg-red-50",
          },
        ].map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-[#eee4da] bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#9b8a7e]">{item.title}</p>

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}
                >
                  <Icon size={21} />
                </div>
              </div>

              <h2 className="mt-3 text-3xl font-bold text-[#442719]">
                {item.value}
              </h2>
            </div>
          )
        })}
      </section>

      {/* Search and Filter */}
      <section className="flex flex-col gap-4 rounded-2xl border border-[#eee4da] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold text-[#442719]">All Booking Requests</h2>

          <p className="mt-1 text-sm text-[#9b8a7e]">
            Check customer requests and booking details.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex items-center gap-2 rounded-xl border border-[#eee4da] px-3 py-2.5">
            <Search size={18} className="text-[#9b8a7e]" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search requests..."
              className="w-full bg-transparent text-sm outline-none sm:w-48"
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#eee4da] px-3">
            <Filter size={17} className="text-[#9b8a7e]" />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              className="bg-transparent py-2.5 text-sm text-[#6b5a50] outline-none"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center">
          <p className="text-sm text-red-600">{error}</p>

          <button
            onClick={() => void fetchRequests()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-600"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      )}

      {/* Request List */}
      {filteredRequests.length > 0 ? (
        <section className="grid gap-5 lg:grid-cols-2">
          {filteredRequests.map((request) => (
            <article
              key={request._id}
              className="rounded-2xl border border-[#eee4da] bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#fff0e5]">
                    {request.equipment?.image ? (
                      <Image
                        src={request.equipment.image}
                        alt={request.equipment.name || "Equipment"}
                        fill
                        unoptimized
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#ea580c]">
                        <Package size={25} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-[#442719]">
                      {request.equipment?.name || "Equipment"}
                    </h3>

                    <p className="mt-1 text-xs text-[#9b8a7e]">
                      Request ID: {request._id}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                    request.status
                  )}`}
                >
                  {request.status}
                </span>
              </div>

              <div className="mt-5 space-y-3 border-t border-[#eee4da] pt-4">
                <p className="flex items-center gap-2 text-sm break-all text-[#6b5a50]">
                  <UserRound size={17} className="shrink-0" />
                  {request.renterEmail}
                </p>

                <p className="flex items-center gap-2 text-sm text-[#6b5a50]">
                  <MapPin size={17} className="shrink-0" />
                  {request.equipment?.location || "Location unavailable"}
                </p>

                <p className="flex items-center gap-2 text-sm text-[#6b5a50]">
                  <CalendarDays size={17} className="shrink-0" />
                  {formatDate(request.startDate)} –{" "}
                  {formatDate(request.endDate)}
                </p>

                <p className="text-sm text-[#6b5a50]">
                  Rental Duration:{" "}
                  <span className="font-semibold">
                    {request.totalDays} days
                  </span>
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#eee4da] pt-4">
                <div>
                  <p className="text-xs text-[#9b8a7e]">Total Rental Price</p>

                  <p className="mt-1 text-lg font-bold text-[#442719]">
                    ৳{formatPrice(request.totalPrice)}
                  </p>
                </div>

                <span className="rounded-full bg-[#faf7f2] px-3 py-1.5 text-xs font-medium text-[#6b5a50] capitalize">
                  Payment: {request.paymentStatus}
                </span>
              </div>

              {request.status === "pending" && (
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      void handleUpdateStatus(request._id, "approved")
                    }
                    disabled={updatingId === request._id}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updatingId === request._id ? (
                      <Loader2 size={17} className="animate-spin" />
                    ) : (
                      <CheckCircle size={17} />
                    )}
                    Accept
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      void handleUpdateStatus(request._id, "rejected")
                    }
                    disabled={updatingId === request._id}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updatingId === request._id ? (
                      <Loader2 size={17} className="animate-spin" />
                    ) : (
                      <XCircle size={17} />
                    )}
                    Reject
                  </button>
                </div>
              )}
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-[#e5d8ca] bg-white px-5 py-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#faf7f2] text-[#a18d7e]">
            <ClipboardList size={38} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#442719]">
            {requests.length === 0
              ? "No Rental Requests Yet"
              : "No Matching Requests"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#9b8a7e]">
            {requests.length === 0
              ? "Customer booking requests will appear here when someone requests to rent your equipment."
              : "No requests match your current search or status filter."}
          </p>

          {requests.length > 0 && (
            <button
              onClick={() => {
                setSearch("")
                setStatusFilter("all")
              }}
              className="mt-6 rounded-xl bg-[#faf0e8] px-6 py-3 text-sm font-semibold text-[#ea580c]"
            >
              Clear Filters
            </button>
          )}
        </section>
      )}
    </div>
  )
}

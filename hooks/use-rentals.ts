"use client"

import { useCallback, useEffect, useState } from "react"

import {
  getMyRentals,
  getOwnerBookings,
  createRental,
  type Rental,
} from "@/services/rental.service"

export function useRentals() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Customer: Fetch own bookings
  const fetchMyRentals = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await getMyRentals()

      if (!result.success) {
        throw new Error(result.message)
      }

      setRentals(result.data)
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch your bookings"
      )
    } finally {
      setLoading(false)
    }
  }, [])

  // Owner: Fetch paid bookings for own equipment
  const fetchOwnerBookings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await getOwnerBookings()

      if (!result.success) {
        throw new Error(result.message)
      }

      setRentals(result.data)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch customer bookings"
      )
    } finally {
      setLoading(false)
    }
  }, [])

  // Customer: Create a booking
  const requestRental = async (data: {
    equipmentId: string
    startDate: string
    endDate: string
    quantity: number
  }) => {
    try {
      setError(null)

      const result = await createRental(data)

      if (!result.success) {
        throw new Error(result.message)
      }

      await fetchMyRentals()

      return result
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create booking"

      setError(message)
      throw error
    }
  }

  useEffect(() => {
    void fetchMyRentals()
  }, [fetchMyRentals])

  return {
    rentals,
    loading,
    error,
    fetchMyRentals,
    fetchOwnerBookings,
    requestRental,
  }
}

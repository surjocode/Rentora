
"use client"

import { useCallback, useEffect, useState } from "react"

import {
  getMyRentals,
  getOwnerBookings,
  type Rental,
} from "@/services/rental.service"

export function useRentals() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRentals = useCallback(async () => {
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
        error instanceof Error
          ? error.message
          : "Failed to load your rentals."
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchRentals()
  }, [fetchRentals])

  return {
    rentals,
    setRentals,
    loading,
    error,
    refetchRentals: fetchRentals,
  }
}

export function useOwnerBookings() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = useCallback(async () => {
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
          : "Failed to load owner bookings."
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchBookings()
  }, [fetchBookings])

  return {
    rentals,
    setRentals,
    loading,
    error,
    refetchBookings: fetchBookings,
  }
}


"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getMyRentals,
  getOwnerBookings,
  type Rental,
} from "@/services/rental.service";

export function useRentals() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    Promise.resolve()
      .then(() => {
        if (!isActive) return undefined;

        setLoading(true);
        setError(null);

        return getMyRentals();
      })
      .then((result) => {
        if (!isActive || !result) return;

        if (!result.success) {
          throw new Error(result.message);
        }

        setRentals(result.data);
      })
      .catch((error: unknown) => {
        if (!isActive) return;

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load your rentals."
        );
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const fetchRentals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getMyRentals();

      if (!result.success) {
        throw new Error(result.message);
      }

      setRentals(result.data);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load your rentals."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    rentals,
    setRentals,
    loading,
    error,
    refetchRentals: fetchRentals,
  };
}

export function useOwnerBookings() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    Promise.resolve()
      .then(() => {
        if (!isActive) return undefined;

        setLoading(true);
        setError(null);

        return getOwnerBookings();
      })
      .then((result) => {
        if (!isActive || !result) return;

        if (!result.success) {
          throw new Error(result.message);
        }

        setRentals(result.data);
      })
      .catch((error: unknown) => {
        if (!isActive) return;

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load owner bookings."
        );
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getOwnerBookings();

      if (!result.success) {
        throw new Error(result.message);
      }

      setRentals(result.data);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load owner bookings."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    rentals,
    setRentals,
    loading,
    error,
    refetchBookings: fetchBookings,
  };
}

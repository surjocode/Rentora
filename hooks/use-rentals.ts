
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getMyRentals,
  getOwnerRentalRequests,
  createRental,
  updateRentalStatus,
  cancelRental,
  type Rental,
} from "@/services/rental.service";

export function useRentals() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyRentals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getMyRentals();

      if (!result.success) {
        throw new Error(result.message);
      }

      setRentals(result.data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch rentals"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOwnerRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getOwnerRentalRequests();

      if (!result.success) {
        throw new Error(result.message);
      }

      setRentals(result.data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch rental requests"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const requestRental = async (data: {
    equipmentId: string;
    startDate: string;
    endDate: string;
  }) => {
    try {
      setError(null);

      const result = await createRental(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      await fetchMyRentals();

      return result;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create rental request";

      setError(message);
      throw error;
    }
  };

  const changeRentalStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      setError(null);

      const result = await updateRentalStatus(id, status);

      if (!result.success) {
        throw new Error(result.message);
      }

      await fetchOwnerRequests();

      return result;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update rental status";

      setError(message);
      throw error;
    }
  };

  const cancelMyRental = async (id: string) => {
    try {
      setError(null);

      const result = await cancelRental(id);

      if (!result.success) {
        throw new Error(result.message);
      }

      await fetchMyRentals();

      return result;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to cancel rental";

      setError(message);
      throw error;
    }
  };

  useEffect(() => {
    void fetchMyRentals();
  }, [fetchMyRentals]);

  return {
    rentals,
    loading,
    error,
    fetchMyRentals,
    fetchOwnerRequests,
    requestRental,
    changeRentalStatus,
    cancelMyRental,
  };
}

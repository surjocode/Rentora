
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAllEquipment,
  type Equipment,
  type EquipmentFilters,
} from "@/services/equipment.service";

export function useEquipment(filters: EquipmentFilters = {}) {
  const search = filters.search ?? "";
  const category = filters.category ?? "";
  const location = filters.location ?? "";
  const rentalType = filters.rentalType;
  const minPrice = filters.minPrice;
  const maxPrice = filters.maxPrice;
  const available = filters.available;
  const sort = filters.sort ?? "newest";

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getAllEquipment({
        search,
        category,
        location,
        rentalType,
        minPrice,
        maxPrice,
        available,
        sort,
      });

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch equipment");
      }

      setEquipment(result.data);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch equipment",
      );
    } finally {
      setLoading(false);
    }
  }, [
    search,
    category,
    location,
    rentalType,
    minPrice,
    maxPrice,
    available,
    sort,
  ]);

  useEffect(() => {
    let isActive = true;

    Promise.resolve().then(async () => {
      if (!isActive) return;

      try {
        setLoading(true);
        setError(null);

        const result = await getAllEquipment({
          search,
          category,
          location,
          rentalType,
          minPrice,
          maxPrice,
          available,
          sort,
        });

        if (!isActive) return;

        if (!result.success) {
          throw new Error(result.message || "Failed to fetch equipment");
        }

        setEquipment(result.data);
      } catch (error: unknown) {
        if (!isActive) return;

        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch equipment",
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    });

    return () => {
      isActive = false;
    };
  }, [
    search,
    category,
    location,
    rentalType,
    minPrice,
    maxPrice,
    available,
    sort,
  ]);

  return {
    equipment,
    loading,
    error,
    refetch: fetchEquipment,
  };
}

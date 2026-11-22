
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
  const sort = filters.sort ?? "newest";

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    Promise.resolve()
      .then(() => {
        if (!isActive) return undefined;

        setLoading(true);
        setError(null);

        return getAllEquipment({
          search,
          category,
          sort,
        });
      })
      .then((result) => {
        if (!isActive || !result) return;

        if (!result.success) {
          throw new Error(result.message);
        }

        setEquipment(result.data);
      })
      .catch((error: unknown) => {
        if (!isActive) return;

        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch equipment"
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
  }, [search, category, sort]);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getAllEquipment({
        search,
        category,
        sort,
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      setEquipment(result.data);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch equipment"
      );
    } finally {
      setLoading(false);
    }
  }, [search, category, sort]);

  return {
    equipment,
    loading,
    error,
    refetch,
  };
}

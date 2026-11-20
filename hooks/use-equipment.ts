
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

  const fetchEquipment = useCallback(async () => {
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
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch equipment"
      );
    } finally {
      setLoading(false);
    }
  }, [search, category, sort]);

  useEffect(() => {
    void fetchEquipment();
  }, [fetchEquipment]);

  return {
    equipment,
    loading,
    error,
    refetch: fetchEquipment,
  };
}


"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAllEquipment,
  type Equipment,
} from "@/services/equipment.service";

export function useEquipment() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getAllEquipment();

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
  }, []);

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

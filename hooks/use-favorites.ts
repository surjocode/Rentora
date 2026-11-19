
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getMyFavorites,
  addFavorite,
  removeFavorite,
} from "@/services/favorite.service";
import type { Equipment } from "@/services/equipment.service";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getMyFavorites();

      if (!result.success) {
        throw new Error(result.message);
      }

      setFavorites(result.data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch favorites"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const addToFavorites = async (equipmentId: string) => {
    try {
      setError(null);

      const result = await addFavorite(equipmentId);

      if (!result.success) {
        throw new Error(result.message);
      }

      await fetchFavorites();

      return result;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to add favorite";

      setError(message);
      throw error;
    }
  };

  const removeFromFavorites = async (equipmentId: string) => {
    try {
      setError(null);

      const result = await removeFavorite(equipmentId);

      if (!result.success) {
        throw new Error(result.message);
      }

      await fetchFavorites();

      return result;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to remove favorite";

      setError(message);
      throw error;
    }
  };

  useEffect(() => {
    void fetchFavorites();
  }, [fetchFavorites]);

  return {
    favorites,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    refetch: fetchFavorites,
  };
}


"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/hooks/use-auth";

import {
  getMyFavorites,
  addFavorite,
  removeFavorite,
} from "@/services/favorite.service";

import type { Equipment } from "@/services/equipment.service";

export function useFavorites() {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [favorites, setFavorites] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ==========================================
  // FETCH FAVORITES
  // ==========================================

  const fetchFavorites = useCallback(async () => {
    // Wait until authentication check is complete
    if (authLoading) {
      setLoading(true);
      return;
    }

    // Do not call favorites API if user is logged out
    if (!isAuthenticated) {
      setFavorites([]);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await getMyFavorites();

      if (!result.success) {
        throw new Error(result.message || "Failed to load favorites");
      }

      setFavorites(result.data);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch favorites";

      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  // ==========================================
  // LOAD FAVORITES WHEN AUTHENTICATION CHANGES
  // ==========================================

  useEffect(() => {
    void fetchFavorites().catch(() => {
      // Error is already handled inside fetchFavorites
    });
  }, [fetchFavorites]);

  // ==========================================
  // ADD TO FAVORITES
  // ==========================================

  const addToFavorites = async (equipmentId: string) => {
    if (!isAuthenticated) {
      throw new Error("Please login to add equipment to favorites.");
    }

    try {
      setError(null);

      const result = await addFavorite(equipmentId);

      if (!result.success) {
        throw new Error(result.message || "Failed to add favorite");
      }

      await fetchFavorites();

      return result;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to add favorite";

      setError(message);
      throw error;
    }
  };

  // ==========================================
  // REMOVE FROM FAVORITES
  // ==========================================

  const removeFromFavorites = async (equipmentId: string) => {
    if (!isAuthenticated) {
      throw new Error("Please login to remove equipment from favorites.");
    }

    try {
      setError(null);

      const result = await removeFavorite(equipmentId);

      if (!result.success) {
        throw new Error(result.message || "Failed to remove favorite");
      }

      await fetchFavorites();

      return result;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to remove favorite";

      setError(message);
      throw error;
    }
  };

  return {
    favorites,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    refetch: fetchFavorites,
  };
}

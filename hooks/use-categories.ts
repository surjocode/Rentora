
"use client";

import { useCallback, useEffect, useState } from "react";
import { getAllCategories } from "@/services/category.service";

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    getAllCategories()
      .then((result) => {
        if (!isActive) return;

        if (!result.success) {
          throw new Error(result.message);
        }

        setCategories(result.data);
        setError(null);
      })
      .catch((error: unknown) => {
        if (!isActive) return;

        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch categories"
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

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getAllCategories();

      if (!result.success) {
        throw new Error(result.message);
      }

      setCategories(result.data);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch categories"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    categories,
    loading,
    error,
    refetch,
  };
}

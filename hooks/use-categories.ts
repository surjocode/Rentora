
"use client";

import { useCallback, useEffect, useState } from "react";
import { getAllCategories } from "@/services/category.service";

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getAllCategories();

      if (!result.success) {
        throw new Error(result.message);
      }

      setCategories(result.data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch categories"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}

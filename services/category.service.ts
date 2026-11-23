
import { apiRequest } from "@/lib/api";

// ==========================================
// TYPES
// ==========================================

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ==========================================
// GET ALL CATEGORIES
// ==========================================

export const getAllCategories = async (): Promise<
  ApiResponse<string[]>
> => {
  return apiRequest<ApiResponse<string[]>>("/api/categories");
};

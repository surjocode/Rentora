
import { apiRequest } from "@/lib/api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Get all available categories
export const getAllCategories = async (): Promise<
  ApiResponse<string[]>
> => {
  return apiRequest<ApiResponse<string[]>>("/api/categories");
};


import { apiRequest } from "@/lib/api";
import type { Equipment } from "@/services/equipment.service";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Get logged-in user's favorites
export const getMyFavorites = async (): Promise<
  ApiResponse<Equipment[]>
> => {
  return apiRequest<ApiResponse<Equipment[]>>("/api/favorites", {
    requiresAuth: true,
  });
};

// Add equipment to favorites
export const addFavorite = async (
  equipmentId: string
): Promise<ApiResponse<null>> => {
  return apiRequest<ApiResponse<null>>("/api/favorites", {
    method: "POST",
    requiresAuth: true,
    body: JSON.stringify({ equipmentId }),
  });
};

// Remove equipment from favorites
export const removeFavorite = async (
  equipmentId: string
): Promise<ApiResponse<null>> => {
  return apiRequest<ApiResponse<null>>(
    `/api/favorites/${equipmentId}`,
    {
      method: "DELETE",
      requiresAuth: true,
    }
  );
};


import { apiRequest } from "@/lib/api";
import type { Equipment } from "@/services/equipment.service";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface FavoriteApiItem {
  _id: string;
  ownerEmail: string;
  equipmentId: string;
  createdAt: string;
  equipment: Equipment & {
    imageUrl?: string;
  };
}

interface FavoriteListResponse {
  success: boolean;
  message: string;
  data: FavoriteApiItem[];
}

// Get logged-in user's favorites
export const getMyFavorites = async (): Promise<
  ApiResponse<Equipment[]>
> => {
  const response = await apiRequest<FavoriteListResponse>(
    "/api/favorites",
    {
      requiresAuth: true,
    }
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to load favorites");
  }

  const equipmentList: Equipment[] = response.data
    .filter((favorite) => favorite.equipment)
    .map((favorite) => {
      const equipment = favorite.equipment;

      return {
        ...equipment,
        image: equipment.image || equipment.imageUrl || "",
      };
    });

  return {
    success: true,
    message: response.message,
    data: equipmentList,
  };
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

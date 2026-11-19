
import { apiRequest } from "@/lib/api";

export interface User {
  _id?: string;
  name: string;
  email: string;
  image?: string;
  role: "renter" | "owner" | "admin";
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Get logged-in user's profile
export const getMyProfile = async (): Promise<
  ApiResponse<User>
> => {
  return apiRequest<ApiResponse<User>>("/api/users", {
    requiresAuth: true,
  });
};

// Update logged-in user's profile
export const updateMyProfile = async (
  updates: {
    name?: string;
    image?: string;
  }
): Promise<ApiResponse<User>> => {
  return apiRequest<ApiResponse<User>>("/api/users", {
    method: "PATCH",
    requiresAuth: true,
    body: JSON.stringify(updates),
  });
};

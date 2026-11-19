
import { apiRequest } from "@/lib/api";
import type { User } from "@/services/user.service";
import type { Equipment } from "@/services/equipment.service";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AdminStats {
  [key: string]: unknown;
}

// Get all users
export const getAllUsers = async (): Promise<
  ApiResponse<User[]>
> => {
  return apiRequest<ApiResponse<User[]>>("/api/admin/users", {
    requiresAuth: true,
  });
};

// Update user role
export const updateUserRole = async (
  id: string,
  role: "renter" | "owner" | "admin"
): Promise<ApiResponse<User>> => {
  return apiRequest<ApiResponse<User>>(
    `/api/admin/users/${id}/role`,
    {
      method: "PATCH",
      requiresAuth: true,
      body: JSON.stringify({ role }),
    }
  );
};

// Approve or reject equipment
export const updateEquipmentStatus = async (
  id: string,
  status: "approved" | "rejected"
): Promise<ApiResponse<Equipment>> => {
  return apiRequest<ApiResponse<Equipment>>(
    `/api/admin/equipment/${id}/status`,
    {
      method: "PATCH",
      requiresAuth: true,
      body: JSON.stringify({ status }),
    }
  );
};

// Get admin dashboard statistics
export const getAdminStats = async (): Promise<
  ApiResponse<AdminStats>
> => {
  return apiRequest<ApiResponse<AdminStats>>("/api/admin/stats", {
    requiresAuth: true,
  });
};

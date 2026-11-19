
import { apiRequest } from "@/lib/api";

export interface Equipment {
  _id: string;
  name: string;
  description: string;
  category: string;
  pricePerDay: number;
  location: string;
  image: string;
  ownerEmail: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Get all approved equipment
export const getAllEquipment = async (): Promise<
  ApiResponse<Equipment[]>
> => {
  return apiRequest<ApiResponse<Equipment[]>>("/api/equipment");
};

// Get single equipment by ID
export const getEquipmentById = async (
  id: string
): Promise<ApiResponse<Equipment>> => {
  return apiRequest<ApiResponse<Equipment>>(`/api/equipment/${id}`);
};

// Add new equipment
export const addEquipment = async (
  equipment: Omit<
    Equipment,
    "_id" | "ownerEmail" | "status" | "createdAt" | "updatedAt"
  >
): Promise<ApiResponse<Equipment>> => {
  return apiRequest<ApiResponse<Equipment>>("/api/equipment", {
    method: "POST",
    requiresAuth: true,
    body: JSON.stringify(equipment),
  });
};

// Update equipment
export const updateEquipment = async (
  id: string,
  updates: Partial<
    Pick<
      Equipment,
      | "name"
      | "description"
      | "category"
      | "pricePerDay"
      | "location"
      | "image"
    >
  >
): Promise<ApiResponse<Equipment>> => {
  return apiRequest<ApiResponse<Equipment>>(`/api/equipment/${id}`, {
    method: "PATCH",
    requiresAuth: true,
    body: JSON.stringify(updates),
  });
};

// Delete equipment
export const deleteEquipment = async (
  id: string
): Promise<ApiResponse<null>> => {
  return apiRequest<ApiResponse<null>>(`/api/equipment/${id}`, {
    method: "DELETE",
    requiresAuth: true,
  });
};

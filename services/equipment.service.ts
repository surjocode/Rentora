
import { apiRequest } from "@/lib/api";
import { getAuthToken } from "@/lib/getAuthToken";

// API Base URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Equipment Interface
export interface Equipment {
  _id: string;
  name: string;
  description: string;
  category: string;
  rentalType: "daily" | "weekly" | "monthly";
  pricePerDay: number;
  availableQuantity: number;
  condition: string;
  brand: string;
  model: string;
  location: string;
  image: string;
  termsAndConditions: string;
  ownerEmail: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

// Equipment Filters
export interface EquipmentFilters {
  search?: string;
  category?: string;
  rentalType?: "daily" | "weekly" | "monthly";
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  sort?: "newest" | "oldest" | "price-asc" | "price-desc";
}

// Create Equipment Data
export type CreateEquipmentData = Omit<
  Equipment,
  "_id" | "ownerEmail" | "status" | "createdAt" | "updatedAt"
>;

// Update Equipment Data
export type UpdateEquipmentData = Partial<
  Pick<
    Equipment,
    | "name"
    | "description"
    | "category"
    | "rentalType"
    | "pricePerDay"
    | "availableQuantity"
    | "condition"
    | "brand"
    | "model"
    | "location"
    | "image"
    | "termsAndConditions"
  >
>;

// API Response
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Image Upload Response
interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
  };
}

// Get All Approved Equipment
export const getAllEquipment = async (
  filters: EquipmentFilters = {}
): Promise<ApiResponse<Equipment[]>> => {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.category) {
    params.set("category", filters.category);
  }

  if (filters.rentalType) {
    params.set("rentalType", filters.rentalType);
  }

  if (filters.minPrice !== undefined) {
    params.set("minPrice", String(filters.minPrice));
  }

  if (filters.maxPrice !== undefined) {
    params.set("maxPrice", String(filters.maxPrice));
  }

  if (filters.available) {
    params.set("available", "true");
  }

  if (filters.sort) {
    params.set("sort", filters.sort);
  }

  const queryString = params.toString();

  const endpoint = queryString
    ? `/api/equipment?${queryString}`
    : "/api/equipment";

  return apiRequest<ApiResponse<Equipment[]>>(endpoint);
};

// Get Single Equipment
export const getEquipmentById = async (
  id: string
): Promise<ApiResponse<Equipment>> => {
  return apiRequest<ApiResponse<Equipment>>(
    `/api/equipment/${id}`
  );
};

// Get Owner's Equipment
export const getMyEquipment = async (): Promise<
  ApiResponse<Equipment[]>
> => {
  return apiRequest<ApiResponse<Equipment[]>>(
    "/api/equipment/my",
    {
      requiresAuth: true,
    }
  );
};

// Add New Equipment
export const addEquipment = async (
  equipment: CreateEquipmentData
): Promise<ApiResponse<Equipment>> => {
  return apiRequest<ApiResponse<Equipment>>(
    "/api/equipment",
    {
      method: "POST",
      requiresAuth: true,
      body: JSON.stringify(equipment),
    }
  );
};

// Update Equipment
export const updateEquipment = async (
  id: string,
  updates: UpdateEquipmentData
): Promise<ApiResponse<Equipment>> => {
  return apiRequest<ApiResponse<Equipment>>(
    `/api/equipment/${id}`,
    {
      method: "PATCH",
      requiresAuth: true,
      body: JSON.stringify(updates),
    }
  );
};

// Delete Equipment
export const deleteEquipment = async (
  id: string
): Promise<ApiResponse<null>> => {
  return apiRequest<ApiResponse<null>>(
    `/api/equipment/${id}`,
    {
      method: "DELETE",
      requiresAuth: true,
    }
  );
};

// Upload Equipment Image to ImgBB
export const uploadEquipmentImage = async (
  image: File
): Promise<string> => {
  const formData = new FormData();

  formData.append("image", image);

  const token = await getAuthToken();

  if (!token) {
    throw new Error("Please login before uploading an image");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const result = (await response.json()) as UploadResponse;

  if (!response.ok || !result.success || !result.data?.url) {
    throw new Error(
      result.message || "Image upload failed"
    );
  }

  return result.data.url;
};

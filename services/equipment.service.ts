
import { apiRequest } from "@/lib/api";

// ==========================================
// TYPES
// ==========================================

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

export interface EquipmentFilters {
  search?: string;
  category?: string;
  location?: string;
  rentalType?: "daily" | "weekly" | "monthly";
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  sort?: "newest" | "oldest" | "price-asc" | "price-desc";
}

export type CreateEquipmentData = Omit<
  Equipment,
  "_id" | "ownerEmail" | "status" | "createdAt" | "updatedAt"
>;

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

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
  };
}

// ==========================================
// GET ALL APPROVED EQUIPMENT
// ==========================================

export const getAllEquipment = async (
  filters: EquipmentFilters = {}
): Promise<ApiResponse<Equipment[]>> => {
  const params = new URLSearchParams();

  if (filters.search?.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters.category?.trim()) {
    params.set("category", filters.category.trim());
  }

  if (filters.location?.trim()) {
    params.set("location", filters.location.trim());
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

  if (filters.available !== undefined) {
    params.set("available", String(filters.available));
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

// ==========================================
// GET SINGLE EQUIPMENT
// ==========================================

export const getEquipmentById = async (
  id: string
): Promise<ApiResponse<Equipment>> => {
  return apiRequest<ApiResponse<Equipment>>(
    `/api/equipment/${encodeURIComponent(id)}`,
    {
      method: "GET",
      requiresAuth: true,
    }
  );
};

// ==========================================
// GET OWNER'S EQUIPMENT
// ==========================================

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

// ==========================================
// ADD NEW EQUIPMENT
// ==========================================

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

// ==========================================
// UPDATE EQUIPMENT
// ==========================================

export const updateEquipment = async (
  id: string,
  updates: UpdateEquipmentData
): Promise<ApiResponse<Equipment>> => {
  return apiRequest<ApiResponse<Equipment>>(
    `/api/equipment/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      requiresAuth: true,
      body: JSON.stringify(updates),
    }
  );
};

// ==========================================
// DELETE EQUIPMENT
// ==========================================

export const deleteEquipment = async (
  id: string
): Promise<ApiResponse<null>> => {
  return apiRequest<ApiResponse<null>>(
    `/api/equipment/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      requiresAuth: true,
    }
  );
};

// ==========================================
// UPLOAD EQUIPMENT IMAGE
// ==========================================

export const uploadEquipmentImage = async (
  image: File
): Promise<string> => {
  const formData = new FormData();

  formData.append("image", image);

  const result = await apiRequest<UploadResponse>(
    "/api/upload",
    {
      method: "POST",
      requiresAuth: true,
      body: formData,
    }
  );

  if (!result.success || !result.data?.url) {
    throw new Error(result.message || "Image upload failed.");
  }

  return result.data.url;
};

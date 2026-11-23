
import { apiRequest } from "@/lib/api";
import type { User } from "@/services/user.service";
import type { Equipment } from "@/services/equipment.service";

// ==========================================
// API RESPONSE
// ==========================================

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ==========================================
// ADMIN STATISTICS
// ==========================================

export interface AdminStats {
  [key: string]: unknown;
}

// ==========================================
// ADMIN RENTAL TYPES
// ==========================================

export type AdminRentalType = "daily" | "weekly" | "monthly";

export type AdminBookingStatus =
  | "pending_payment"
  | "confirmed"
  | "completed"
  | "cancelled";

export type AdminPaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export interface AdminRental {
  _id: string;
  equipmentId: string;
  equipmentName: string;

  customerEmail: string;
  ownerEmail: string;

  startDate: string;
  endDate: string;

  rentalType: AdminRentalType;
  rentalDays: number;
  periodCount: number;

  quantity: number;
  unitPrice: number;
  totalAmount: number;

  phone: string;
  address: string;
  notes: string;

  paymentStatus: AdminPaymentStatus;
  bookingStatus: AdminBookingStatus;

  createdAt: string;
  updatedAt: string;
}

// ==========================================
// GET ALL USERS
// ==========================================

export const getAllUsers = async (): Promise<ApiResponse<User[]>> => {
  return apiRequest<ApiResponse<User[]>>("/api/admin/users", {
    requiresAuth: true,
  });
};

// ==========================================
// UPDATE USER ROLE
// ==========================================

export const updateUserRole = async (
  id: string,
  role: "renter" | "owner" | "admin"
): Promise<ApiResponse<User>> => {
  return apiRequest<ApiResponse<User>>(`/api/admin/users/${id}/role`, {
    method: "PATCH",
    requiresAuth: true,
    body: JSON.stringify({ role }),
  });
};

// ==========================================
// GET ALL EQUIPMENT
// ==========================================

export const getAllAdminEquipment = async (): Promise<
  ApiResponse<Equipment[]>
> => {
  return apiRequest<ApiResponse<Equipment[]>>("/api/admin/equipment", {
    requiresAuth: true,
  });
};


// ==========================================
// UPDATE EQUIPMENT STATUS
// ==========================================

export const updateEquipmentStatus = async (
  id: string,
  status: "pending" | "approved" | "rejected"
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


// ==========================================
// UPDATE EQUIPMENT
// ==========================================

export const updateAdminEquipment = async (
  id: string,
  equipmentData: Partial<Equipment>
): Promise<ApiResponse<Equipment>> => {
  return apiRequest<ApiResponse<Equipment>>(
    `/api/admin/equipment/${id}`,
    {
      method: "PATCH",
      requiresAuth: true,
      body: JSON.stringify(equipmentData),
    }
  );
};

// ==========================================
// DELETE EQUIPMENT
// ==========================================

export const deleteAdminEquipment = async (
  id: string
): Promise<ApiResponse<null>> => {
  return apiRequest<ApiResponse<null>>(
    `/api/admin/equipment/${id}`,
    {
      method: "DELETE",
      requiresAuth: true,
    }
  );
};

// ==========================================
// GET ADMIN DASHBOARD STATISTICS
// ==========================================

export const getAdminStats = async (): Promise<
  ApiResponse<AdminStats>
> => {
  return apiRequest<ApiResponse<AdminStats>>("/api/admin/stats", {
    requiresAuth: true,
  });
};

// ==========================================
// GET ALL RENTALS (ADMIN ONLY)
// ==========================================

export const getAllAdminRentals = async (): Promise<
  ApiResponse<AdminRental[]>
> => {
  return apiRequest<ApiResponse<AdminRental[]>>(
    "/api/rentals/admin",
    {
      requiresAuth: true,
    }
  );
};

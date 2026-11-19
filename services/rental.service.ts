
import { apiRequest } from "@/lib/api";

export interface Rental {
  _id: string;
  equipmentId: string;
  renterEmail: string;
  ownerEmail: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
  status: "pending" | "approved" | "rejected" | "cancelled";
  paymentStatus: "unpaid" | "paid";
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Create rental request
export const createRental = async (
  rental: {
    equipmentId: string;
    startDate: string;
    endDate: string;
  }
): Promise<ApiResponse<Rental>> => {
  return apiRequest<ApiResponse<Rental>>("/api/rentals", {
    method: "POST",
    requiresAuth: true,
    body: JSON.stringify(rental),
  });
};

// Get logged-in renter's rentals
export const getMyRentals = async (): Promise<
  ApiResponse<Rental[]>
> => {
  return apiRequest<ApiResponse<Rental[]>>("/api/rentals/my", {
    requiresAuth: true,
  });
};

// Get rental requests for logged-in owner
export const getOwnerRentalRequests = async (): Promise<
  ApiResponse<Rental[]>
> => {
  return apiRequest<ApiResponse<Rental[]>>("/api/rentals/owner", {
    requiresAuth: true,
  });
};

// Approve or reject rental request
export const updateRentalStatus = async (
  id: string,
  status: "approved" | "rejected"
): Promise<ApiResponse<Rental>> => {
  return apiRequest<ApiResponse<Rental>>(
    `/api/rentals/${id}/status`,
    {
      method: "PATCH",
      requiresAuth: true,
      body: JSON.stringify({ status }),
    }
  );
};

// Cancel rental request
export const cancelRental = async (
  id: string
): Promise<ApiResponse<Rental>> => {
  return apiRequest<ApiResponse<Rental>>(
    `/api/rentals/${id}/cancel`,
    {
      method: "PATCH",
      requiresAuth: true,
    }
  );
};


import { apiRequest } from "@/lib/api";

// ==========================================
// TYPES
// ==========================================

export type RentalType = "daily" | "weekly" | "monthly";

export type BookingStatus =
  | "pending_payment"
  | "confirmed"
  | "completed"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

// ==========================================
// EQUIPMENT INTERFACE
// ==========================================

export interface RentalEquipment {
  _id: string;
  name: string;
  image: string;
  category: string;
  location: string;
  pricePerDay: number;
}

// ==========================================
// CREATE BOOKING DATA
// ==========================================

export interface CreateBookingData {
  equipmentId: string;
  startDate: string;
  endDate: string;
  quantity: number;
  phone: string;
  address: string;
  notes?: string;
}

// ==========================================
// RENTAL / BOOKING INTERFACE
// ==========================================

export interface Rental {
  _id: string;
  equipmentId: string;
  equipmentName: string;

  customerEmail: string;
  ownerEmail: string;

  startDate: string;
  endDate: string;

  rentalType: RentalType;
  rentalDays: number;
  periodCount: number;

  quantity: number;
  unitPrice: number;
  totalAmount: number;

  phone: string;
  address: string;
  notes: string;

  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;

  createdAt: string;
  updatedAt: string;

  equipment?: RentalEquipment;
}

// ==========================================
// API RESPONSE
// ==========================================

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ==========================================
// CREATE BOOKING
// ==========================================

export const createBooking = async (
  booking: CreateBookingData
): Promise<ApiResponse<Rental>> => {
  return apiRequest<ApiResponse<Rental>>("/api/rentals", {
    method: "POST",
    requiresAuth: true,
    body: JSON.stringify(booking),
  });
};

// ==========================================
// GET CUSTOMER BOOKINGS
// ==========================================

export const getMyRentals = async (): Promise<
  ApiResponse<Rental[]>
> => {
  return apiRequest<ApiResponse<Rental[]>>("/api/rentals/my", {
    requiresAuth: true,
  });
};

// ==========================================
// GET OWNER BOOKINGS
// ==========================================

export const getOwnerBookings = async (): Promise<
  ApiResponse<Rental[]>
> => {
  return apiRequest<ApiResponse<Rental[]>>("/api/rentals/owner", {
    requiresAuth: true,
  });
};

// ==========================================
// GET ADMIN BOOKINGS
// ==========================================

export const getAllRentals = async (): Promise<
  ApiResponse<Rental[]>
> => {
  return apiRequest<ApiResponse<Rental[]>>("/api/rentals/admin", {
    requiresAuth: true,
  });
};

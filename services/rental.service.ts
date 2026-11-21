
import { apiRequest } from "@/lib/api";

export interface RentalEquipment {
  _id: string;
  name: string;
  image: string;
  category: string;
  location: string;
  pricePerDay: number;
}

export interface Rental {
  _id: string;
  equipmentId: string;
  renterEmail: string;
  ownerEmail: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  quantity: number;
  totalPrice: number;
  paymentStatus: "paid";
  stripePaymentIntentId: string;
  createdAt: string;
  updatedAt: string;
  equipment?: RentalEquipment;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Get logged-in customer's paid rentals
export const getMyRentals = async (): Promise<
  ApiResponse<Rental[]>
> => {
  return apiRequest<ApiResponse<Rental[]>>("/api/rentals/my", {
    requiresAuth: true,
  });
};

// Get paid bookings for logged-in owner
export const getOwnerBookings = async (): Promise<
  ApiResponse<Rental[]>
> => {
  return apiRequest<ApiResponse<Rental[]>>("/api/rentals/owner", {
    requiresAuth: true,
  });
}

// Stripe PaymentIntent response
export interface PaymentIntentResponse {
  success: boolean;
  message: string;
  clientSecret?: string | null;
}

// Payment request information
export interface PaymentRequest {
  equipmentId: string;
  startDate: string;
  endDate: string;
  quantity: number;
}

// Create Stripe PaymentIntent before creating a booking
export const createPaymentIntent = async (
  booking: PaymentRequest
): Promise<PaymentIntentResponse> => {
  return apiRequest<PaymentIntentResponse>(
    "/api/payments/create-payment-intent",
    {
      method: "POST",
      requiresAuth: true,
      body: JSON.stringify(booking),
    }
  );
};

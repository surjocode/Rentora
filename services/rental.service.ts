
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
  paymentMethod: "stripe" | "demo";
  stripePaymentIntentId?: string;
  demoTransactionId?: string;
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
};

// Payment request information
export interface PaymentRequest {
  equipmentId: string;
  startDate: string;
  endDate: string;
  quantity: number;
}

// Stripe PaymentIntent response
export interface PaymentIntentResponse {
  success: boolean;
  message: string;
  clientSecret?: string | null;
}

// Create Stripe PaymentIntent
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

// Demo Booking response
export interface DemoBookingResponse {
  success: boolean;
  message: string;
  data?: Rental;
}

// Create a demo booking without card information
export const createDemoBooking = async (
  booking: PaymentRequest
): Promise<DemoBookingResponse> => {
  return apiRequest<DemoBookingResponse>(
    "/api/payments/create-demo-booking",
    {
      method: "POST",
      requiresAuth: true,
      body: JSON.stringify(booking),
    }
  );
};

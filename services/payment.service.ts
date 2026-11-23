
import { apiRequest } from "@/lib/api";

// ==========================================
// TYPES
// ==========================================

export interface CreateCheckoutSessionData {
  bookingId: string;
}

export interface CheckoutSessionResponse {
  checkoutUrl: string;
  sessionId: string;
  bookingId: string;
  bdtAmount: number;
  usdAmount: number;
  exchangeRate: number;
  currency: "USD";
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ==========================================
// CREATE STRIPE CHECKOUT SESSION
// ==========================================

export const createCheckoutSession = async (
  bookingId: string
): Promise<ApiResponse<CheckoutSessionResponse>> => {
  return apiRequest<ApiResponse<CheckoutSessionResponse>>(
    "/api/payments/create-checkout-session",
    {
      method: "POST",
      requiresAuth: true,
      body: JSON.stringify({ bookingId }),
    }
  );
};


export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Payment {
  _id: string;
  rentalId: string;
  equipmentId: string;
  renterEmail: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentData {
  rentalId: string;
}

export interface CheckoutSession {
  sessionId: string;
  checkoutUrl: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data: CheckoutSession;
}

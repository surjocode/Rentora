
export type RentalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";

export type PaymentStatus = "unpaid" | "paid";

export interface Booking {
  _id: string;
  equipmentId: string;
  renterEmail: string;
  ownerEmail: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
  status: RentalStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  equipmentId: string;
  startDate: string;
  endDate: string;
}

export interface UpdateBookingStatusData {
  status: "approved" | "rejected";
}

export interface BookingCardProps {
  booking: Booking;
}

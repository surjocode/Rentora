
import { apiRequest } from "@/lib/api"

// ==========================================
// EQUIPMENT INTERFACE
// ==========================================

export interface RentalEquipment {
  _id: string
  name: string
  image: string
  category: string
  location: string
  pricePerDay: number
}

// ==========================================
// RENTAL / BOOKING INTERFACE
// ==========================================

export interface Rental {
  _id: string
  equipmentId: string
  renterEmail: string
  ownerEmail: string
  startDate: string
  endDate: string
  totalDays: number
  quantity: number
  totalPrice: number
  createdAt: string
  updatedAt: string
  equipment?: RentalEquipment
}

// ==========================================
// API RESPONSE
// ==========================================

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// ==========================================
// GET CUSTOMER BOOKINGS
// ==========================================

export const getMyRentals = async (): Promise<
  ApiResponse<Rental[]>
> => {
  return apiRequest<ApiResponse<Rental[]>>("/api/rentals/my", {
    requiresAuth: true,
  })
}

// ==========================================
// GET OWNER BOOKINGS
// ==========================================

export const getOwnerBookings = async (): Promise<
  ApiResponse<Rental[]>
> => {
  return apiRequest<ApiResponse<Rental[]>>("/api/rentals/owner", {
    requiresAuth: true,
  })
}

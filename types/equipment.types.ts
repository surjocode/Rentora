
export type EquipmentStatus = "pending" | "approved" | "rejected";

export interface Equipment {
  _id: string;
  name: string;
  description: string;
  category: string;
  pricePerDay: number;
  location: string;
  image: string;
  ownerEmail: string;
  status: EquipmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEquipmentData {
  name: string;
  description: string;
  category: string;
  pricePerDay: number;
  location: string;
  image: string;
}

export type UpdateEquipmentData = Partial<CreateEquipmentData>;

export interface EquipmentFilters {
  search?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price-asc" | "price-desc" | "newest" | "oldest";
}

export interface EquipmentCardProps {
  equipment: Equipment;
}

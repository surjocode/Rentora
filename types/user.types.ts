
import type { UserRole } from "@/constants/roles";

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  image?: string;
  role: UserRole;
}

export interface UpdateProfileData {
  name?: string;
  image?: string;
}

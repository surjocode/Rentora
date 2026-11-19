
export const USER_ROLES = {
  RENTER: "renter",
  OWNER: "owner",
  ADMIN: "admin",
} as const;

export type UserRole =
  (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ROLE_LABELS: Record<UserRole, string> = {
  renter: "Renter",
  owner: "Equipment Owner",
  admin: "Administrator",
};

export const ROLE_HOME: Record<UserRole, string> = {
  renter: "/dashboard",
  owner: "/dashboard/owner/my-equipment",
  admin: "/dashboard/admin/analytics",
};

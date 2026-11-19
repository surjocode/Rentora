
export const ROUTES = {
  HOME: "/",
  ALL_EQUIPMENT: "/all-equipment",
  LOGIN: "/login",
  REGISTER: "/register",

  EQUIPMENT_DETAILS: (id: string) => `/equipment/${id}`,

  DASHBOARD: "/dashboard",
  MY_RENTALS: "/dashboard/my-rentals",
  FAVORITES: "/dashboard/favorites",
  PROFILE: "/dashboard/profile",

  OWNER: {
    ADD_EQUIPMENT: "/dashboard/owner/add-equipment",
    MY_EQUIPMENT: "/dashboard/owner/my-equipment",
    RENTAL_REQUESTS: "/dashboard/owner/rental-requests",
  },

  ADMIN: {
    USERS: "/dashboard/admin/users",
    EQUIPMENT: "/dashboard/admin/equipment",
    RENTALS: "/dashboard/admin/rentals",
    ANALYTICS: "/dashboard/admin/analytics",
  },
} as const;

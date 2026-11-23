
import { getAuthToken } from "@/lib/getAuthToken";

// ==========================================
// CONFIGURATION
// ==========================================

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is missing from .env.local");
}

// ==========================================
// TYPES
// ==========================================

interface ApiOptions extends RequestInit {
  requiresAuth?: boolean;
}

// ==========================================
// API REQUEST
// ==========================================

export async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const {
    requiresAuth = false,
    headers,
    ...fetchOptions
  } = options;

  const requestHeaders = new Headers(headers);

  const isFormData =
    typeof FormData !== "undefined" &&
    fetchOptions.body instanceof FormData;

  // Set JSON Content-Type when needed
  if (
    fetchOptions.body &&
    !isFormData &&
    !requestHeaders.has("Content-Type")
  ) {
    requestHeaders.set("Content-Type", "application/json");
  }

  // Attach JWT token for protected routes
  if (requiresAuth) {
    const token = await getAuthToken();

    if (!token) {
      throw new Error("Authentication required. Please login first.");
    }

    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers: requestHeaders,
    cache: fetchOptions.cache ?? "no-store",
  });

  // Handle empty responses
  if (response.status === 204) {
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return undefined as T;
  }

  // Parse response safely
  const contentType = response.headers.get("content-type");

  let result: unknown;

  if (
    contentType?.includes("application/json") ||
    contentType?.includes("+json")
  ) {
    result = await response.json();
  } else {
    result = await response.text();
  }

  // Handle API errors
  if (!response.ok) {
    const message =
      typeof result === "object" &&
      result !== null &&
      "message" in result &&
      typeof result.message === "string"
        ? result.message
        : typeof result === "string" && result.trim()
          ? result
          : `API request failed with status ${response.status}`;

    throw new Error(message);
  }

  return result as T;
}

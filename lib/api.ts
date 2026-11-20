
import { getAuthToken } from "@/lib/getAuthToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is missing from .env.local");
}

interface ApiOptions extends RequestInit {
  requiresAuth?: boolean;
}

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

  // Set JSON Content-Type when request body is not FormData
  if (
    fetchOptions.body &&
    !(fetchOptions.body instanceof FormData) &&
    !requestHeaders.has("Content-Type")
  ) {
    requestHeaders.set("Content-Type", "application/json");
  }

  // Attach JWT token for protected APIs
  if (requiresAuth) {
    const token = await getAuthToken();

    if (!token) {
      throw new Error(
        "Authentication required. Please login first."
      );
    }

    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers: requestHeaders,
    cache: "no-store",
  });

  // Handle empty or non-JSON responses safely
  const contentType = response.headers.get("content-type");

  let result: unknown;

  if (contentType?.includes("application/json")) {
    result = await response.json();
  } else {
    result = await response.text();
  }

  if (!response.ok) {
    const message =
      typeof result === "object" &&
      result !== null &&
      "message" in result &&
      typeof result.message === "string"
        ? result.message
        : typeof result === "string" && result
          ? result
          : `API request failed with status ${response.status}`;

    throw new Error(message);
  }

  return result as T;
}

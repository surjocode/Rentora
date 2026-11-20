
import { authClient } from "@/lib/auth-client";

export async function getAuthToken(): Promise<string> {
  try {
    const { data, error } = await authClient.token();

    if (error) {
      throw new Error(error.message || "Failed to get authentication token");
    }

    if (!data?.token) {
      throw new Error(
        "Authentication token not found. Please login again."
      );
    }

    return data.token;
  } catch (error) {
    console.error(
      "JWT token error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    throw error instanceof Error
      ? error
      : new Error("Failed to get authentication token");
  }
}

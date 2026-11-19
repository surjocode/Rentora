
import { authClient } from "@/lib/auth-client";

export async function getAuthToken(): Promise<string> {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error(
      error?.message || "Failed to get authentication token"
    );
  }

  return data.token;
}

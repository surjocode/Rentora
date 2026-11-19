
"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { data: session, isPending, error } = useSession();
  const router = useRouter();

  const user = session?.user;

  const logout = async () => {
    try {
      await signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  return {
    user,
    session,
    loading: isPending,
    error,
    isAuthenticated: Boolean(session?.user),
    logout,
  };
}

/**
 * Client-side auth hook
 * Provides utilities for checking auth state and accessing DEK
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/actions/auth/getCurrentUser";
import { logout } from "@/actions/auth/logout";
import { importKey } from "./crypto";

export interface AuthState {
  user: {
    id: string;
    email: string;
    userName: string;
  } | null;
  dek: CryptoKey | null;
  loading: boolean;
}

/**
 * Get the DEK from sessionStorage
 * Returns null if not available
 */
export async function getDEK(): Promise<CryptoKey | null> {
  if (typeof window === "undefined") return null;

  const dekString = sessionStorage.getItem("dek");
  if (!dekString) return null;

  try {
    return await importKey(dekString);
  } catch (error) {
    console.error("Error importing DEK:", error);
    return null;
  }
}

/**
 * Hook to get current auth state and DEK
 */
export function useAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    dek: null,
    loading: true,
  });

  useEffect(() => {
    async function loadAuth() {
      try {
        const user = await getCurrentUser();
        const dek = await getDEK();

        setAuthState({
          user,
          dek,
          loading: false,
        });
      } catch (error) {
        console.error("Error loading auth:", error);
        setAuthState({
          user: null,
          dek: null,
          loading: false,
        });
      }
    }

    loadAuth();
  }, []);

  const handleLogout = async () => {
    await logout();
    sessionStorage.removeItem("dek");
    sessionStorage.removeItem("dekSalt");
    router.push("/login");
    router.refresh();
  };

  return {
    ...authState,
    logout: handleLogout,
  };
}

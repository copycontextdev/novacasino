import { useQuery } from "@tanstack/react-query";
import { getWallet } from "@/lib/api-methods/core.api";
import { useAuthStore } from "@/store/auth-store";

export const WALLET_QUERY_KEY = ["wallet"] as const;

export function useWallet() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: WALLET_QUERY_KEY,
    queryFn: getWallet,
    enabled: isAuthenticated,
    staleTime: 30_000,
  });
}

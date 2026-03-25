import { useQuery } from "@tanstack/react-query";
import { getWallet } from "@/lib/api-methods/core.api";
import { useAuthStore } from "@/store/auth-store";

export const WALLET_QUERY_KEY = ["wallet"] as const;

interface UseWalletOptions {
  enabled?: boolean;
  refetchInterval?: number | false;
  refetchOnWindowFocus?: boolean;
  refetchIntervalInBackground?: boolean;
}

export function useWallet(options?: UseWalletOptions) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: WALLET_QUERY_KEY,
    queryFn: getWallet,
    enabled: options?.enabled ?? isAuthenticated,
    staleTime: 30_000,
    refetchInterval: options?.refetchInterval,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    refetchIntervalInBackground: options?.refetchIntervalInBackground ?? false,
  });
}

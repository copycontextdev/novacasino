import { useQuery } from "@tanstack/react-query";
import { getProviders } from "@/lib/api-methods/casino.api";

export const PROVIDERS_QUERY_KEY = ["providers"] as const;

export function useProviders() {
  return useQuery({
    queryKey: PROVIDERS_QUERY_KEY,
    queryFn: getProviders,
    staleTime: 10 * 60_000,
  });
}

import { useQuery } from "@tanstack/react-query";
import { getInit } from "@/lib/api-methods/core.api";

export const INIT_QUERY_KEY = ["init"] as const;

export function useInit() {
  return useQuery({
    queryKey: INIT_QUERY_KEY,
    queryFn: getInit,
    staleTime: Infinity,
    retry: 2,
  });
}

import { useQuery } from "@tanstack/react-query";
import { getLobby } from "@/lib/api-methods/casino.api";

export const LOBBY_QUERY_KEY = ["lobby"] as const;

export function useLobby() {
  return useQuery({
    queryKey: LOBBY_QUERY_KEY,
    queryFn: getLobby,
    staleTime: 5 * 60_000,
  });
}

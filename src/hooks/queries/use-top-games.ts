import { useQuery } from "@tanstack/react-query";
import { getTopGames } from "@/lib/api-methods/casino.api";

export const TOP_GAMES_QUERY_KEY = ["top-games"] as const;

export function useTopGames() {
  return useQuery({
    queryKey: TOP_GAMES_QUERY_KEY,
    queryFn: getTopGames,
    staleTime: 5 * 60_000,
  });
}

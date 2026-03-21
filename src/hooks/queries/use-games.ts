import { useQuery } from "@tanstack/react-query";
import { getGames } from "@/lib/api-methods/casino.api";
import type { SabiGamesQuery } from "@/types/api.types";

export const gamesQueryKey = (filters?: SabiGamesQuery) =>
  ["games", filters] as const;

export function useGames(filters?: SabiGamesQuery) {
  return useQuery({
    queryKey: gamesQueryKey(filters),
    queryFn: () => getGames(filters),
    staleTime: 2 * 60_000,
    enabled: !!(filters?.name || filters?.provider || filters?.category),
  });
}

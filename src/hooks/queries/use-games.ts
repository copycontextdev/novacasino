import { useQuery } from "@tanstack/react-query";
import { getGames, sanitizeGamesQuery } from "@/lib/api-methods/casino.api";
import type { NovaGamesQuery } from "@/types/api.types";

export const gamesQueryKey = (filters?: NovaGamesQuery) =>
  ["games", sanitizeGamesQuery(filters)] as const;

export function useGames(filters?: NovaGamesQuery, enabled = true) {
  const normalizedFilters = sanitizeGamesQuery(filters);

  return useQuery({
    queryKey: gamesQueryKey(normalizedFilters),
    queryFn: () => getGames(normalizedFilters),
    staleTime: 2 * 60_000,
    enabled,
    placeholderData: (previousData) => previousData,
  });
}

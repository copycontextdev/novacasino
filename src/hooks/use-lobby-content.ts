import { useMemo, useState } from "react";
import { filterActivePromotionBanners } from "@/components/PromotionBannerCarousel";
import { useInit } from "@/hooks/queries/use-init";
import { useLobby } from "@/hooks/queries/use-lobby";
import { useProviders } from "@/hooks/queries/use-providers";
import { useTopGames } from "@/hooks/queries/use-top-games";
import { useLobbyGamesFiltered } from "@/hooks/use-lobby-games-filtered";
import { flattenLobbyGames } from "@/lib/game-utils";
import { toArray } from "@/lib/payment-utils";
import type { SabiGame, SabiProvider } from "@/types/api.types";

const RECENT_GAMES_STORAGE_KEY = "nova_recent_game_ids";
const MAX_RECENT_GAMES = 12;

function loadRecentGameIds(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(RECENT_GAMES_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((value): value is string => typeof value === "string");
  } catch {
    return [];
  }
}

function persistRecentGameIds(ids: string[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    RECENT_GAMES_STORAGE_KEY,
    JSON.stringify(ids.slice(0, MAX_RECENT_GAMES)),
  );
}

export function useLobbyContent(activeTab: string) {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [recentGameIds, setRecentGameIds] = useState<string[]>(() => loadRecentGameIds());

  const initQuery = useInit();
  const lobbyQuery = useLobby();
  const topGamesQuery = useTopGames();
  const providersQuery = useProviders();

  const lobbyCategories = lobbyQuery.data ?? [];
  const providers = useMemo(
    () => toArray<SabiProvider>(providersQuery.data),
    [providersQuery.data],
  );
  const { trending: trendingGames, gridGames: lobbyGridGames } = useLobbyGamesFiltered(
    lobbyCategories,
    activeTab,
    categoryFilter,
  );

  const topFromApi = useMemo(
    () => topGamesQuery.data?.results ?? [],
    [topGamesQuery.data?.results],
  );
  const displayTrending = topFromApi.length ? topFromApi : trendingGames;
  const allLobbyGames = useMemo(() => flattenLobbyGames(lobbyCategories), [lobbyCategories]);

  const quickGames = useMemo(() => {
    const gameById = new Map(allLobbyGames.map((game) => [game.uuid, game] as const));
    const recentGames = recentGameIds
      .map((uuid) => gameById.get(uuid))
      .filter((game): game is SabiGame => Boolean(game));

    if (recentGames.length > 0) {
      return recentGames.slice(0, 10);
    }

    if (topFromApi.length > 0) {
      return topFromApi.slice(0, 10);
    }

    return displayTrending.slice(0, 10);
  }, [allLobbyGames, displayTrending, recentGameIds, topFromApi]);

  const categoryChips = useMemo(() => {
    const names = lobbyCategories.map((c) => c.name).filter(Boolean);
    return ["All", ...names.slice(0, 8)];
  }, [lobbyCategories]);

  const promotionBanners = useMemo(
    () => filterActivePromotionBanners(initQuery.data?.promotion_banners),
    [initQuery.data?.promotion_banners],
  );

  const rememberRecentGame = (gameUuid: string) => {
    const nextRecentGameIds = [gameUuid, ...recentGameIds.filter((uuid) => uuid !== gameUuid)]
      .slice(0, MAX_RECENT_GAMES);

    setRecentGameIds(nextRecentGameIds);
    persistRecentGameIds(nextRecentGameIds);
  };

  return {
    providers,
    displayTrending,
    promotionBanners,
    quickGames,
    quickGamesHeading: recentGameIds.length > 0 ? "Continue Playing" : "Quick Games",
    quickGamesDescription: recentGameIds.length > 0
      ? "Your recent picks, kept close for a fast return."
      : topFromApi.length > 0
        ? "Hand-picked fast starters from the latest top games feed."
        : "A fast-access strip built from trending picks while top games reload.",
    categoryChips,
    categoryFilter,
    setCategoryFilter,
    gridGames: lobbyGridGames,
    trendingGames: displayTrending,
    rememberRecentGame,
    lobbyQuery,
  };
}

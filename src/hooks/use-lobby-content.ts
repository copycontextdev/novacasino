import { useEffect, useMemo, useState } from "react";
import { filterActivePromotionBanners } from "@/components/PromotionBannerCarousel";
import { useInit } from "@/hooks/queries/use-init";
import { useLobby } from "@/hooks/queries/use-lobby";
import { useProviders } from "@/hooks/queries/use-providers";
import { useTopGames } from "@/hooks/queries/use-top-games";
import { useLobbyGamesFiltered } from "@/hooks/use-lobby-games-filtered";
import { flattenLobbyGames } from "@/lib/game-utils";
import { toArray } from "@/lib/payment-utils";
import type { NovaGame, NovaProvider } from "@/types/api.types";

const RECENT_GAMES_STORAGE_KEY = "nova_recent_game_ids";
const MAX_RECENT_GAMES = 12;
const MOBILE_BREAKPOINT_QUERY = "(max-width: 767px)";
const MOBILE_QUICK_EXPOSURE_COUNT = 3;
const MOBILE_TRENDING_EXPOSURE_COUNT = 3;

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

function getIsMobileViewport(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches;
}

function partitionGamesBySeen(games: NovaGame[], seenIds: Set<string>) {
  const fresh: NovaGame[] = [];
  const seen: NovaGame[] = [];

  for (const game of games) {
    if (seenIds.has(game.uuid)) {
      seen.push(game);
      continue;
    }

    fresh.push(game);
  }

  return { fresh, seen };
}

export function useLobbyContent(activeTab: string) {
  const [recentGameIds, setRecentGameIds] = useState<string[]>(() => loadRecentGameIds());
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() => getIsMobileViewport());

  const initQuery = useInit();
  const lobbyQuery = useLobby();
  const topGamesQuery = useTopGames();
  const providersQuery = useProviders();

  const lobbyCategories = lobbyQuery.data ?? [];
  const providers = useMemo(
    () => toArray<NovaProvider>(providersQuery.data),
    [providersQuery.data],
  );
  const { trending: trendingGames } = useLobbyGamesFiltered(lobbyCategories, activeTab, "All");

  const topFromApi = useMemo(
    () => topGamesQuery.data?.results ?? [],
    [topGamesQuery.data?.results],
  );
  const displayTrending = topFromApi.length ? topFromApi : trendingGames;
  const flatLobbyGames = useMemo(() => flattenLobbyGames(lobbyCategories), [lobbyCategories]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT_QUERY);
    const handleChange = (event: MediaQueryListEvent) => setIsMobileViewport(event.matches);

    setIsMobileViewport(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const quickGames = useMemo(() => {
    const gameById = new Map(flatLobbyGames.map((game) => [game.uuid, game] as const));
    const recentGames = recentGameIds
      .map((uuid) => gameById.get(uuid))
      .filter((game): game is NovaGame => Boolean(game));

    if (recentGames.length > 0) {
      return recentGames.slice(0, 10);
    }

    if (topFromApi.length > 0) {
      return topFromApi.slice(0, 10);
    }

    return displayTrending.slice(0, 10);
  }, [displayTrending, flatLobbyGames, recentGameIds, topFromApi]);

  const orderedLobbyContent = useMemo(() => {
    if (isMobileViewport) {
      const exposedQuickIds = new Set(
        quickGames.slice(0, MOBILE_QUICK_EXPOSURE_COUNT).map((game) => game.uuid),
      );
      const trendingPartition = partitionGamesBySeen(displayTrending, exposedQuickIds);
      const mobileTrending = [...trendingPartition.fresh, ...trendingPartition.seen];

      const exposedTrendingIds = new Set(
        mobileTrending.slice(0, MOBILE_TRENDING_EXPOSURE_COUNT).map((game) => game.uuid),
      );
      const exposedIds = new Set([...exposedQuickIds, ...exposedTrendingIds]);
      const allGamesPartition = partitionGamesBySeen(flatLobbyGames, exposedIds);

      return {
        trendingGames: mobileTrending,
        allLobbyGames: [...allGamesPartition.fresh, ...allGamesPartition.seen],
      };
    }

    const quickIds = new Set(quickGames.map((game) => game.uuid));
    const desktopTrending = displayTrending.filter((game) => !quickIds.has(game.uuid));
    const featuredIds = new Set([
      ...quickIds,
      ...desktopTrending.map((game) => game.uuid),
    ]);

    return {
      trendingGames: desktopTrending,
      allLobbyGames: flatLobbyGames.filter((game) => !featuredIds.has(game.uuid)),
    };
  }, [displayTrending, flatLobbyGames, isMobileViewport, quickGames]);

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
    lobbyCategories,
    allLobbyGames: orderedLobbyContent.allLobbyGames,
    trendingGames: orderedLobbyContent.trendingGames,
    rememberRecentGame,
    lobbyQuery,
  };
}

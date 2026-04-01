import { apiClient } from "@/lib/api/client";
import type {
  NovaLobbyResponse,
  NovaGamesListResponse,
  NovaProviderListResponse,
  NovaTopGamesResponse,
  NovaStartGameResponse,
  NovaGamesQuery,
  NovaStartGameQuery,
} from "@/types/api.types";
import {
  CASINO_LOBBY,
  CASINO_PROVIDERS,
  CASINO_GAMES,
  CASINO_TOP_GAMES,
  CASINO_GAME_START,
} from "@/lib/api/endpoints";

const DEFAULT_GAMES_PAGE_SIZE = 60;

export function sanitizeGamesQuery(query?: NovaGamesQuery): NovaGamesQuery {
  const sanitized: NovaGamesQuery = {
    page_size: query?.page_size ?? DEFAULT_GAMES_PAGE_SIZE,
  };

  if (query?.page) {
    sanitized.page = query.page;
  }

  const name = query?.name?.trim();
  if (name && name.length >= 2) {
    sanitized.name = name;
  }

  if (query?.provider !== undefined && query.provider !== null && String(query.provider).trim()) {
    sanitized.provider = typeof query.provider === "string"
      ? query.provider.trim()
      : query.provider;
  }

  if (query?.category !== undefined && query.category !== null && String(query.category).trim()) {
    sanitized.category = typeof query.category === "string"
      ? query.category.trim()
      : query.category;
  }

  return sanitized;
}

export async function getLobby(): Promise<NovaLobbyResponse> {
  const { data } = await apiClient.get<NovaLobbyResponse>(CASINO_LOBBY);
  return data;
}

export async function getProviders(): Promise<NovaProviderListResponse> {
  const { data } = await apiClient.get<NovaProviderListResponse>(CASINO_PROVIDERS);
  return data;
}

export async function getGames(
  query?: NovaGamesQuery,
): Promise<NovaGamesListResponse> {
  const params = sanitizeGamesQuery(query);
  const { data } = await apiClient.get<NovaGamesListResponse>(CASINO_GAMES, {
    params,
  });
  return data;
}

export async function getTopGames(): Promise<NovaTopGamesResponse> {
  const { data } = await apiClient.get<NovaTopGamesResponse>(CASINO_TOP_GAMES);
  return data;
}

export async function startGame(
  slug: string,
  query: NovaStartGameQuery,
): Promise<NovaStartGameResponse> {
  const { data } = await apiClient.get<NovaStartGameResponse>(
    CASINO_GAME_START(slug),
    { params: query },
  );
  return data;
}

import { apiClient } from "@/lib/api/client";
import type {
  SabiLobbyResponse,
  SabiGamesListResponse,
  SabiProviderListResponse,
  SabiTopGamesResponse,
  SabiStartGameResponse,
  SabiGamesQuery,
  SabiStartGameQuery,
} from "@/types/api.types";
import {
  CASINO_LOBBY,
  CASINO_PROVIDERS,
  CASINO_GAMES,
  CASINO_TOP_GAMES,
  CASINO_GAME_START,
} from "@/lib/api/endpoints";

export async function getLobby(): Promise<SabiLobbyResponse> {
  const { data } = await apiClient.get<SabiLobbyResponse>(CASINO_LOBBY);
  return data;
}

export async function getProviders(): Promise<SabiProviderListResponse> {
  const { data } = await apiClient.get<SabiProviderListResponse>(CASINO_PROVIDERS);
  return data;
}

export async function getGames(
  query?: SabiGamesQuery,
): Promise<SabiGamesListResponse> {
  const { data } = await apiClient.get<SabiGamesListResponse>(CASINO_GAMES, {
    params: query,
  });
  return data;
}

export async function getTopGames(): Promise<SabiTopGamesResponse> {
  const { data } = await apiClient.get<SabiTopGamesResponse>(CASINO_TOP_GAMES);
  return data;
}

export async function startGame(
  slug: string,
  query: SabiStartGameQuery,
): Promise<SabiStartGameResponse> {
  const { data } = await apiClient.get<SabiStartGameResponse>(
    CASINO_GAME_START(slug),
    { params: query },
  );
  return data;
}

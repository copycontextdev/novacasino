/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { NovaGame, NovaGameCategory, NovaProvider } from "@/types/api.types";

export function flattenLobbyGames(lobbyCategories: NovaGameCategory[]): NovaGame[] {
  const seen = new Set<string>();
  const flat: NovaGame[] = [];

  for (const category of lobbyCategories) {
    for (const game of category.games) {
      if (seen.has(game.uuid)) continue;
      seen.add(game.uuid);
      flat.push(game);
    }
  }

  return flat;
}

export function resolveProviderName(game: NovaGame, providers: NovaProvider[]): string {
  const key = String(game.provider);
  const p = providers.find(
    (item) =>
      item.uuid === key || String(item.id) === key || item.name.toLowerCase() === key.toLowerCase(),
  );
  if (p) return p.name;
  if (typeof game.provider === "string") return game.provider;
  return "Provider";
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from "react";
import type { SabiGame, SabiGameCategory } from "@/types/api.types";

export function useLobbyGamesFiltered(
  lobbyCategories: SabiGameCategory[],
  navTab: string,
  categoryFilter: string,
): { trending: SabiGame[]; gridGames: SabiGame[] } {
  return useMemo(() => {
    const flat: SabiGame[] = [];
    const seen = new Set<string>();
    for (const cat of lobbyCategories) {
      for (const g of cat.games) {
        if (!seen.has(g.uuid)) {
          seen.add(g.uuid);
          flat.push(g);
        }
      }
    }

    const byNav = (games: SabiGame[]) => {
      const n = navTab.toLowerCase();
      if (n === "slots")
        return games.filter(
          (g) =>
            g.name.toLowerCase().includes("slot") ||
            lobbyCategories.some(
              (c) =>
                (c.slug?.toLowerCase().includes("slot") || c.name.toLowerCase().includes("slot")) &&
                c.games.some((x) => x.uuid === g.uuid),
            ),
        );
      if (n === "live")
        return games.filter(
          (g) =>
            lobbyCategories.some(
              (c) =>
                (c.slug?.toLowerCase().includes("live") || c.name.toLowerCase().includes("live")) &&
                c.games.some((x) => x.uuid === g.uuid),
            ) || g.name.toLowerCase().includes("live"),
        );
      if (n === "sports")
        return games.filter(
          (g) =>
            lobbyCategories.some(
              (c) =>
                (c.slug?.toLowerCase().includes("sport") || c.name.toLowerCase().includes("sport")) &&
                c.games.some((x) => x.uuid === g.uuid),
            ) || g.name.toLowerCase().includes("sport"),
        );
      return games;
    };

    let base = byNav(flat);
    if (categoryFilter && categoryFilter !== "All") {
      const cat = lobbyCategories.find((c) => c.name === categoryFilter);
      base = cat ? cat.games : base;
    }

    const trending = flat.filter((g) => g.is_top_game).slice(0, 20);
    return {
      trending: trending.length ? trending : base.slice(0, 12),
      gridGames: base,
    };
  }, [lobbyCategories, navTab, categoryFilter]);
}

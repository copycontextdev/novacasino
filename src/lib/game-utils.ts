/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SabiGame, SabiProvider } from "@/types/api.types";

export function resolveProviderName(game: SabiGame, providers: SabiProvider[]): string {
  const key = String(game.provider);
  const p = providers.find(
    (item) =>
      item.uuid === key || String(item.id) === key || item.name.toLowerCase() === key.toLowerCase(),
  );
  if (p) return p.name;
  if (typeof game.provider === "string") return game.provider;
  return "Provider";
}

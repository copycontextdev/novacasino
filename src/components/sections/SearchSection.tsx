/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Search, Loader2 } from "lucide-react";
import GameCard from "@/components/game-components/GameCard";
import { resolveProviderName } from "@/lib/game-utils";
import type { SabiGame, SabiProvider } from "@/types/api.types";

interface SearchSectionProps {
  searchInput: string;
  onSearchInputChange: (v: string) => void;
  isFetching: boolean;
  searchGames: SabiGame[];
  providers: SabiProvider[];
  onGameClick: (game: SabiGame) => void;
}

const SearchSection = ({
  searchInput,
  onSearchInputChange,
  isFetching,
  searchGames,
  providers,
  onGameClick,
}: SearchSectionProps) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-headline font-extrabold">Search Games</h2>
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
      <input
        className="w-full bg-surface-container-high border-none rounded-2xl py-4 pl-12 pr-4 text-lg focus:ring-2 focus:ring-primary/20"
        placeholder="Type at least 2 characters…"
        value={searchInput}
        onChange={(e) => onSearchInputChange(e.target.value)}
      />
    </div>
    {isFetching ? (
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    ) : (
      <div className="grid grid-cols-2 gap-4">
        {searchGames.map((game) => (
          <GameCard
            key={game.uuid}
            game={game}
            providerName={resolveProviderName(game, providers)}
            onClick={() => onGameClick(game)}
          />
        ))}
      </div>
    )}
    {searchInput.trim().length >= 2 && !isFetching && searchGames.length === 0 ? (
      <p className="text-on-surface-variant text-center py-8">No games found</p>
    ) : null}
  </div>
);

export default SearchSection;

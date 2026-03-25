/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Search, Loader2 } from "lucide-react";
import GameCard from "@/components/game-components/GameCard";
import { resolveProviderName } from "@/lib/game-utils";
import type { SabiGame, SabiProvider } from "@/types/api.types";

interface SearchFilterOption {
  value: string;
  label: string;
}

interface SearchSectionProps {
  searchInput: string;
  onSearchInputChange: (v: string) => void;
  isFetching: boolean;
  searchGames: SabiGame[];
  providers: SabiProvider[];
  onGameClick: (game: SabiGame) => void;
  providerOptions: SearchFilterOption[];
  selectedProvider: string;
  onProviderChange: (value: string) => void;
  categoryOptions: SearchFilterOption[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  hasSearchFilters: boolean;
  hasSearchTerm: boolean;
}

const SearchSection = ({
  searchInput,
  onSearchInputChange,
  isFetching,
  searchGames,
  providers,
  onGameClick,
  providerOptions,
  selectedProvider,
  onProviderChange,
  categoryOptions,
  selectedCategory,
  onCategoryChange,
}: SearchSectionProps) => (
  <div className="space-y-6">
    <div className="space-y-4">
      <h2 className="text-2xl font-headline font-extrabold">Search Games</h2>
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_14rem]">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-on-surface-variant" />
          <input
            className="w-full rounded-2xl border border-white/10 bg-surface-container-high py-4 pl-12 pr-4 text-base focus:ring-2 focus:ring-primary/20"
            placeholder="Search games"
            value={searchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
          />
        </label>
        <select
          className="h-14 w-full rounded-2xl border border-white/10 bg-surface-container-high px-4 text-sm font-semibold text-on-surface outline-none"
          value={selectedProvider}
          onChange={(e) => onProviderChange(e.target.value)}
        >
          {providerOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-surface text-on-surface">
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide md:mx-0 md:px-0">
        {categoryOptions.map((option) => {
          const isActive = selectedCategory === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onCategoryChange(option.value)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                isActive
                  ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
                  : "border border-white/10 bg-surface-container-high text-on-surface-variant hover:border-primary/30 hover:text-on-surface"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>

    {searchGames.length > 0 ? (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {searchGames.map((game) => (
          <GameCard
            key={game.uuid}
            game={game}
            providerName={resolveProviderName(game, providers)}
            onClick={() => onGameClick(game)}
          />
        ))}
      </div>
    ) : (
      <div className="rounded-3xl border border-white/10 bg-surface-container-high p-8 text-center">
        <p className="text-lg font-headline font-bold text-on-surface">No games matched this search</p>
        <p className="mt-2 text-sm text-on-surface-variant">
          Try a different provider, switch categories, or use a shorter game title.
        </p>
      </div>
    )}
  </div>
);

export default SearchSection;

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useDeferredValue, useMemo, useState } from "react";
import { Search } from "lucide-react";
import GameCard from "@/components/game-components/GameCard";
import { useGames } from "@/hooks/queries/use-games";
import { useLobby } from "@/hooks/queries/use-lobby";
import { useProviders } from "@/hooks/queries/use-providers";
import { useTopGames } from "@/hooks/queries/use-top-games";
import { flattenLobbyGames, resolveProviderName } from "@/lib/game-utils";
import type { NovaGame, NovaGamesQuery, NovaProvider } from "@/types/api.types";
import { toArray } from "@/lib/payment-utils";

interface SearchFilterOption {
  value: string;
  label: string;
}

interface SearchSectionProps {
  onGameClick: (game: NovaGame) => void;
}

const SearchSection = ({ onGameClick }: SearchSectionProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const deferredSearchInput = useDeferredValue(searchInput);
  const lobbyQuery = useLobby();
  const providersQuery = useProviders();
  const topGamesQuery = useTopGames();

  const lobbyCategories = lobbyQuery.data ?? [];
  const providers = useMemo(
    () => toArray<NovaProvider>(providersQuery.data),
    [providersQuery.data],
  );
  const allLobbyGames = useMemo(() => flattenLobbyGames(lobbyCategories), [lobbyCategories]);

  const providerOptions = useMemo<SearchFilterOption[]>(
    () => [
      { value: "all", label: "All Providers" },
      ...providers.map((provider) => ({
        value: provider.uuid,
        label: provider.name,
      })),
    ],
    [providers],
  );

  const categoryOptions = useMemo<SearchFilterOption[]>(() => {
    const seen = new Set<string>();
    const options = [{ value: "all", label: "All Categories" }];

    for (const category of lobbyCategories) {
      const value = category.slug ?? category.name;
      if (!value || seen.has(value)) continue;
      seen.add(value);
      options.push({
        value,
        label: category.name,
      });
    }

    return options;
  }, [lobbyCategories]);

  const searchGamesQueryFilters = useMemo<NovaGamesQuery>(() => {
    const filters: NovaGamesQuery = { page_size: 60 };
    const normalizedSearchTerm = deferredSearchInput.trim();

    if (normalizedSearchTerm.length >= 2) {
      filters.name = normalizedSearchTerm;
    }

    if (selectedProvider !== "all") {
      filters.provider = selectedProvider;
    }

    if (selectedCategory !== "all") {
      filters.category = selectedCategory;
    }

    return filters;
  }, [deferredSearchInput, selectedCategory, selectedProvider]);

  const gamesSearchQuery = useGames(searchGamesQueryFilters);
  const searchGames = useMemo(
    () => gamesSearchQuery.data?.results ?? [],
    [gamesSearchQuery.data?.results],
  );
  const topGames = useMemo(
    () => topGamesQuery.data?.results ?? [],
    [topGamesQuery.data?.results],
  );

  const discoveryGames = useMemo(() => {
    const normalizedSearchTerm = deferredSearchInput.trim().toLowerCase();
    const provider = providers.find((item) => item.uuid === selectedProvider) ?? null;
    const category = lobbyCategories.find(
      (item) => (item.slug ?? item.name) === selectedCategory,
    ) ?? null;
    const categoryGameIds = category
      ? new Set(category.games.map((game) => game.uuid))
      : null;

    return allLobbyGames.filter((game) => {
      if (provider) {
        const providerKey = String(game.provider).toLowerCase();
        const matchesProvider =
          providerKey === provider.uuid.toLowerCase() ||
          providerKey === String(provider.id).toLowerCase() ||
          providerKey === provider.name.toLowerCase();

        if (!matchesProvider) {
          return false;
        }
      }

      if (categoryGameIds && !categoryGameIds.has(game.uuid)) {
        return false;
      }

      if (!normalizedSearchTerm) {
        return true;
      }

      return game.name.toLowerCase().includes(normalizedSearchTerm);
    });
  }, [
    allLobbyGames,
    deferredSearchInput,
    lobbyCategories,
    providers,
    selectedCategory,
    selectedProvider,
  ]);

  const hasSearchFilters = selectedProvider !== "all" || selectedCategory !== "all";
  const hasSearchTerm = deferredSearchInput.trim().length > 0;
  const searchDisplayGames = useMemo(() => {
    if (searchGames.length > 0) {
      return searchGames;
    }

    if (hasSearchTerm || hasSearchFilters) {
      return discoveryGames;
    }

    if (discoveryGames.length > 0) {
      return discoveryGames.slice(0, 36);
    }

    return topGames.slice(0, 24);
  }, [discoveryGames, hasSearchFilters, hasSearchTerm, searchGames, topGames]);

  return (
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
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </label>
          <select
            className="h-14 w-full rounded-2xl border border-white/10 bg-surface-container-high px-4 text-sm font-semibold text-on-surface outline-none"
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
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
                onClick={() => setSelectedCategory(option.value)}
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

      {searchDisplayGames.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {searchDisplayGames.map((game) => (
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
};

export default SearchSection;

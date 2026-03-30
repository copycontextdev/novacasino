/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { LayoutGrid, Loader2, Rows3, Search } from "lucide-react";
import { PromotionBannerCarousel } from "@/components/PromotionBannerCarousel";
import GameCard from "@/components/game-components/GameCard";
import { APP_NAME, APP_LOGO_SRC } from "@/lib/app_constants";
import { resolveProviderName } from "@/lib/game-utils";
import type { SabiGame, SabiGameCategory, SabiProvider } from "@/types/api.types";

interface LobbySectionProps {
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  promotionBanners: any[];
  quickGames: SabiGame[];
  quickGamesHeading: string;
  quickGamesDescription: string;
  displayTrending: SabiGame[];
  providers: SabiProvider[];
  onGameClick: (game: SabiGame) => void;
  onSearchOpen: () => void;
  lobbyCategories: SabiGameCategory[];
  allLobbyGames: SabiGame[];
}

const LobbySection = ({
  isLoading,
  isError,
  refetch,
  promotionBanners,
  quickGames,
  quickGamesHeading,
  quickGamesDescription,
  displayTrending,
  providers,
  onGameClick,
  onSearchOpen,
  lobbyCategories,
  allLobbyGames,
}: LobbySectionProps) => {
  const [showGrouped, setShowGrouped] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const visibleCategories = lobbyCategories.filter((category) => category.games.length > 0);
  const categoryChips = React.useMemo(
    () => ["All", ...visibleCategories.map((category) => category.name)],
    [visibleCategories],
  );
  const groupedCategories = selectedCategory === "All"
    ? visibleCategories
    : visibleCategories.filter((category) => category.name === selectedCategory);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-on-surface-variant text-sm font-bold">Loading lobby…</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="rounded-2xl border border-error/30 bg-error/10 p-6 text-center">
        <p className="text-error font-bold">Could not load games</p>
        <button
          type="button"
          onClick={refetch}
          className="mt-4 rounded-full bg-primary px-4 py-2 text-on-primary font-bold text-sm"
        >
          Retry
        </button>
      </div>
    );
  }
  return (
    <div className="space-y-4 md:space-y-8">
      <div className="-mx-4 md:-mx-8">
        {promotionBanners.length > 0 ? (
          <PromotionBannerCarousel banners={promotionBanners} />
        ) : (
          <section className="relative h-48 md:h-80 overflow-hidden bg-surface-container-high border-y border-white/5 flex items-center">
            <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent z-10" />
            <div className="relative z-20 flex items-center gap-6 p-6 md:p-12 max-w-2xl">
              <img
                src={APP_LOGO_SRC}
                alt=""
                className="h-12 w-auto max-w-[8.5rem] shrink-0 object-contain md:h-16 md:max-w-[11rem]"
                width={202}
                height={96}
              />
              <div>
                <h1 className="text-2xl md:text-5xl font-headline font-extrabold text-white tracking-tight mb-2">
                  Welcome to <span className="text-primary">{APP_NAME}</span>
                </h1>
                <p className="text-on-surface-variant text-sm md:text-base">
                  Real games, wallet, and secure payments — powered by Sabi.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
      {quickGames.length > 0 ? (
        <section className="-mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide md:gap-5">
            {quickGames.map((game) => (
              <div
                key={`quick-${game.uuid}`}
                className="w-[7.4rem] shrink-0 md:w-[8.8rem]"
              >
                <GameCard
                  game={game}
                  providerName={resolveProviderName(game, providers)}
                  onClick={() => onGameClick(game)}
                  variant="quick"
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}
      <section className="space-y-4 md:space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-2xl font-headline font-extrabold tracking-tight">Trending</h2>
        </div>
        <div className="-mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide md:gap-5">
          {displayTrending.map((game) => (
              <div
                key={`trending-${game.uuid}`}
                className="w-[10.25rem] shrink-0 md:w-[12.5rem] lg:w-[13.5rem]"
              >
                <GameCard
                  game={game}
                  providerName={resolveProviderName(game, providers)}
                  onClick={() => onGameClick(game)}
                />
              </div>
          ))}
          </div>
        </div>
      </section>
      <section className="space-y-4 md:space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-2xl font-headline font-extrabold tracking-tight">All Games</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSearchOpen}
              className="inline-flex shrink-0 items-center justify-center text-on-surface-variant transition-colors hover:text-on-surface"
              aria-label="Open search"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowGrouped((value) => !value)}
              className={`inline-flex shrink-0 items-center justify-center rounded-full border p-2 transition-all ${
                showGrouped
                  ? "border-primary/40 bg-primary text-on-primary shadow-lg shadow-primary/20"
                  : "border-white/10 bg-surface-container-high text-on-surface-variant hover:text-on-surface"
              }`}
              aria-label={showGrouped ? "Show flat games list" : "Group games by category"}
            >
              {showGrouped ? <Rows3 className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <nav className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide md:mx-0 md:px-0">
          {categoryChips.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setSelectedCategory(label)}
              className={`rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-all md:text-sm ${
                selectedCategory === label
                  ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
                  : "bg-surface-container-high text-on-surface hover:bg-surface-bright border border-white/5"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
        {showGrouped ? (
          <div className="space-y-5 md:space-y-6">
            {groupedCategories.map((category) => (
              <section key={category.slug ?? category.name} className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-headline font-extrabold tracking-tight text-on-surface md:text-lg">
                    {category.name}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant md:text-xs">
                    {category.games.length} games
                  </span>
                </div>
                <div className="-mx-4 px-4 md:mx-0 md:px-0">
                  <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide md:gap-5">
                    {category.games.map((game) => (
                      <div
                        key={`${category.slug ?? category.name}-${game.uuid}`}
                        className="w-[10.25rem] shrink-0 md:w-[12.5rem] lg:w-[13.5rem]"
                      >
                        <GameCard
                          game={game}
                          providerName={resolveProviderName(game, providers)}
                          onClick={() => onGameClick(game)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-6">
            {allLobbyGames.map((game) => (
              <GameCard
                key={game.uuid}
                game={game}
                providerName={resolveProviderName(game, providers)}
                onClick={() => onGameClick(game)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LobbySection;

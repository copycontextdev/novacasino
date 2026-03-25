/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Loader2 } from "lucide-react";
import { PromotionBannerCarousel } from "@/components/PromotionBannerCarousel";
import GameCard from "@/components/game-components/GameCard";
import { APP_NAME, APP_LOGO_SRC } from "@/lib/app_constants";
import { resolveProviderName } from "@/lib/game-utils";
import type { SabiGame, SabiProvider, SabiGameCategory } from "@/types/api.types";

interface LobbySectionProps {
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  promotionBanners: any[];
  displayTrending: SabiGame[];
  providers: SabiProvider[];
  onGameClick: (game: SabiGame) => void;
  categoryChips: string[];
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  gridGames: SabiGame[];
}

const LobbySection = ({
  isLoading,
  isError,
  refetch,
  promotionBanners,
  displayTrending,
  providers,
  onGameClick,
  categoryChips,
  categoryFilter,
  onCategoryFilterChange,
  gridGames,
}: LobbySectionProps) => {
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
    <div className="space-y-8">
      {promotionBanners.length > 0 ? (
        <PromotionBannerCarousel banners={promotionBanners} />
      ) : (
        <section className="relative h-48 md:h-80 rounded-2xl overflow-hidden bg-surface-container-high border border-white/5 flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent z-10" />
          <div className="relative z-20 flex items-center gap-6 p-6 md:p-12 max-w-2xl">
            <img
              src={APP_LOGO_SRC}
              alt=""
              className="h-16 w-16 md:h-24 md:w-24 object-contain rounded-2xl border border-white/10 bg-surface-container-low p-2 shrink-0"
              width={96}
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
      <section className="space-y-4 md:space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-2xl font-headline font-extrabold tracking-tight">Trending</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
          {displayTrending.map((game) => (
            <GameCard
              key={game.uuid}
              game={game}
              providerName={resolveProviderName(game, providers)}
              onClick={() => onGameClick(game)}
            />
          ))}
        </div>
      </section>
      <section className="space-y-4 md:space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-2xl font-headline font-extrabold tracking-tight">All Games</h2>
        </div>
        <nav className="flex items-center gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {categoryChips.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => onCategoryFilterChange(label)}
              className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
                categoryFilter === label
                  ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
                  : "bg-surface-container-high text-on-surface hover:bg-surface-bright border border-white/5"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-6">
          {gridGames.map((game) => (
            <GameCard
              key={game.uuid}
              game={game}
              providerName={resolveProviderName(game, providers)}
              onClick={() => onGameClick(game)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default LobbySection;

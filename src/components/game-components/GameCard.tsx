/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import type { SabiGame } from "@/types/api.types";
import { cn } from "@/lib/utils";

type GameCardVariant = "default" | "quick";

interface GameCardProps {
  game: SabiGame;
  providerName: string;
  onClick: () => void;
  variant?: GameCardVariant;
}

const GameCard = ({
  game,
  providerName,
  onClick,
  variant = "default",
}: GameCardProps) => (
  <motion.button
    type="button"
    whileHover={{ scale: variant === "quick" ? 1.03 : 1.05 }}
    whileTap={{ scale: variant === "quick" ? 0.98 : 0.95 }}
    onClick={onClick}
    className="group block w-full text-left"
  >
    <div
      className={cn(
        "relative overflow-hidden bg-surface-container-highest border border-white/5",
        variant === "quick" && "quick-game-card neon-glow-ember",
        variant === "quick"
          ? "aspect-1 rounded-lg"
          : "aspect-[3/4] rounded-xl",
      )}
    >
      <img
        alt={game.name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        src={game.default_logo || undefined}
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      {game.label ? (
        <div
          className={cn(
            "absolute left-2 top-2 flex gap-2",
            variant === "quick" && "left-1.5 top-1.5",
          )}
        >
          <span
            className={cn(
              "glass-panel rounded font-bold text-tertiary border border-tertiary/20",
              variant === "quick"
                ? "px-1 py-0.5 text-[7px]"
                : "px-1.5 py-0.5 text-[8px]",
            )}
          >
            {game.label}
          </span>
        </div>
      ) : null}
      <div
        className={cn(
          "absolute text-white",
          variant === "quick"
            ? "bottom-2 left-2 right-2"
            : "bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4",
        )}
      >
        <p
          className={cn(
            "font-headline font-extrabold truncate",
            variant === "quick"
              ? "mb-0.5 text-[9px]"
              : "mb-0.5 md:mb-1 text-[10px] md:text-sm",
          )}
        >
          {game.name}
        </p>
        <p
          className={cn(
            "text-on-surface-variant font-bold uppercase tracking-widest truncate",
            variant === "quick"
              ? "text-[7px]"
              : "text-[8px] md:text-[10px]",
          )}
        >
          {providerName}
        </p>
      </div>
    </div>
  </motion.button>
);

export default GameCard;

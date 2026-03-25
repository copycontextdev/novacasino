/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import type { SabiGame } from "@/types/api.types";

interface GameCardProps {
  game: SabiGame;
  providerName: string;
  onClick: () => void;
}

const GameCard = ({ game, providerName, onClick }: GameCardProps) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-surface-container-highest cursor-pointer border border-white/5"
  >
    <img
      alt={game.name}
      className="w-full h-full object-cover transition-transform duration-500"
      src={game.default_logo || undefined}
      referrerPolicy="no-referrer"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
    {game.label ? (
      <div className="absolute top-2 left-2 flex gap-2">
        <span className="glass-panel px-1.5 py-0.5 rounded text-[8px] font-bold text-tertiary border border-tertiary/20">
          {game.label}
        </span>
      </div>
    ) : null}
    <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4">
      <p className="font-headline font-extrabold text-[10px] md:text-sm text-white mb-0.5 md:mb-1 truncate">
        {game.name}
      </p>
      <p className="text-[8px] md:text-[10px] text-on-surface-variant font-bold uppercase tracking-widest truncate">
        {providerName}
      </p>
    </div>
  </motion.div>
);

export default GameCard;

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Play } from "lucide-react";
import type { SabiGame, SabiProvider } from "@/types/api.types";
import { resolveProviderName } from "@/lib/game-utils";

interface GameModalProps {
  game: SabiGame | null;
  onClose: () => void;
  onPlayReal: () => void;
  onPlayDemo: () => void;
  similarGames: SabiGame[];
  providers: SabiProvider[];
}

const GameModal = ({
  game,
  onClose,
  onPlayReal,
  onPlayDemo,
  similarGames,
  providers,
}: GameModalProps) => {
  if (!game) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm px-0 md:px-4"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="relative w-full max-w-lg bg-surface-container rounded-t-3xl md:rounded-3xl overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.6)] flex flex-col max-h-[90vh]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-[110] w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest/60 backdrop-blur-md text-on-surface hover:bg-surface-bright"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="relative w-full aspect-[4/3] bg-surface-container-lowest flex items-center justify-center overflow-hidden">
          <img
            alt={game.name}
            className="w-full h-full object-cover"
            src={game.default_logo || undefined}
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-6 left-6 z-20 flex items-center gap-4">
            <div>
              <h1 className="font-headline text-2xl font-extrabold text-white tracking-tight">{game.name}</h1>
              <p className="text-primary text-sm font-semibold">{resolveProviderName(game, providers)}</p>
            </div>
          </div>
        </div>
        <div className="px-6 pb-8 pt-2 flex flex-col gap-6 overflow-y-auto">
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={onPlayReal}
              className="w-full py-5 bg-gradient-to-r from-primary to-primary-dim rounded-full text-on-primary font-headline font-extrabold text-lg shadow-[0_10px_30px_rgba(99,102,241,0.4)] active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <Play className="w-6 h-6 fill-on-primary" />
              Play Now
            </button>
            {game.demo_support ? (
              <button
                type="button"
                onClick={onPlayDemo}
                className="w-full py-4 bg-transparent border-2 border-primary/20 rounded-full text-primary font-headline font-bold text-md hover:bg-primary/5 active:scale-95 transition-all"
              >
                Play Demo
              </button>
            ) : null}
          </div>
          {similarGames.length > 0 ? (
            <div className="flex flex-col gap-4">
              <h3 className="font-headline font-bold text-on-surface px-2">Similar Games</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {similarGames.map((sg) => (
                  <div key={sg.uuid} className="flex-none w-32">
                    <div className="aspect-square rounded-3xl overflow-hidden bg-surface-container-highest mb-2">
                      <img
                        alt={sg.name}
                        className="w-full h-full object-cover"
                        src={sg.default_logo || undefined}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <p className="text-xs font-bold text-on-surface text-center truncate px-1">{sg.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameModal;

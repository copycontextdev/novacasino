import React from "react";
import { Play } from "lucide-react";
import type { NovaGame, NovaProvider } from "@/types/api.types";
import { resolveProviderName } from "@/lib/game-utils";
import AppModal from "@/components/ui/AppModal";

interface GameModalProps {
  game: NovaGame | null;
  onClose: () => void;
  onPlayReal: () => void;
  onPlayDemo: () => void;
  similarGames: NovaGame[];
  providers: NovaProvider[];
}

const GameModal = ({
  game,
  onClose,
  onPlayReal,
  onPlayDemo,
  similarGames,
  providers,
}: GameModalProps) => {
  return (
    <AppModal
      open={!!game}
      onClose={onClose}
      sheet
      size="lg"
      className="!p-0 max-h-[90vh] flex flex-col"
    >
      {game && (
        <>
          {/* Game image header */}
          <div className="relative w-full aspect-[4/3] bg-surface-container-lowest flex items-center justify-center overflow-hidden shrink-0">
            <img
              alt={game.name}
              className="w-full h-full object-cover"
              src={game.default_logo || undefined}
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-6 left-6 z-20 flex items-center gap-4">
              <div>
                <h1 className="font-headline text-2xl font-extrabold text-white tracking-tight">
                  {game.name}
                </h1>
                <p className="text-primary text-sm font-semibold">
                  {resolveProviderName(game, providers)}
                </p>
              </div>
            </div>
          </div>

          {/* Actions + similar games */}
          <div className="px-6 pb-8 pt-4 flex flex-col gap-6 overflow-y-auto">
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={onPlayReal}
                className="w-full py-5 bg-gradient-to-r from-primary to-primary-dim rounded-full text-on-primary font-headline font-extrabold text-lg shadow-[0_10px_30px_rgba(99,102,241,0.4)] active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <Play className="w-6 h-6 fill-on-primary" />
                Play Now
              </button>
              {game.demo_support && (
                <button
                  type="button"
                  onClick={onPlayDemo}
                  className="w-full py-4 bg-transparent border-2 border-primary/20 rounded-full text-primary font-headline font-bold text-md hover:bg-primary/5 active:scale-95 transition-all"
                >
                  Play Demo
                </button>
              )}
            </div>

            {similarGames.length > 0 && (
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
                      <p className="text-xs font-bold text-on-surface text-center truncate px-1">
                        {sg.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </AppModal>
  );
};

export default GameModal;

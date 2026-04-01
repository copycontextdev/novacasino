import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import AppButton from "@/components/ui/AppButton";
import { formatBalance } from "@/lib/format";
import type { NovaSpinExecuteResponse } from "@/types/api.types";

interface SpinResultModalProps {
  isOpen: boolean;
  result: NovaSpinExecuteResponse | null;
  currency: string;
  hasMoreSpins: boolean;
  onClose: () => void;
  onTryAgain: () => void;
}

function getRewardAmount(result: NovaSpinExecuteResponse | null): number | null {
  if (!result) return null;

  const value = result.reward_value ?? result.value;
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

export function SpinResultModal({
  isOpen,
  result,
  currency,
  hasMoreSpins,
  onClose,
  onTryAgain,
}: SpinResultModalProps) {
  if (!isOpen || !result) {
    return null;
  }

  const rewardAmount = getRewardAmount(result);
  const isWin = (rewardAmount ?? 0) > 0 && result.reward_type !== "No Reward";

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-surface-container p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] md:p-8">
          <div className="rounded-[1.5rem] border border-white/8 bg-gradient-to-br from-primary/12 via-surface to-surface p-6 text-center md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/80">
              {isWin ? "Spin reward unlocked" : "Spin result"}
            </p>
            <DialogTitle className="mt-4 text-3xl font-headline font-extrabold text-on-surface md:text-4xl">
              {isWin ? result.name : "Try Again"}
            </DialogTitle>

            <p className="mt-3 text-sm leading-6 text-on-surface-variant md:text-base">
              {isWin
                ? `${currency} ${formatBalance(rewardAmount)} added as ${result.reward_type.toLowerCase()}.`
                : "This spin did not unlock a reward."}
            </p>

            <div className="mt-6 rounded-2xl border border-white/8 bg-surface/80 px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                Reward type
              </p>
              <p className="mt-2 text-lg font-bold text-on-surface">{result.reward_type}</p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              {!isWin && hasMoreSpins ? (
                <AppButton onClick={onTryAgain} className="sm:min-w-40">
                  Try again
                </AppButton>
              ) : null}

              <AppButton
                variant={!isWin && hasMoreSpins ? "outline" : "primary"}
                onClick={onClose}
                className="sm:min-w-40"
              >
                Continue
              </AppButton>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

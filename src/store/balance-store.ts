import { create } from "zustand";
import type {
  NovaAmount,
  NovaBalanceUpdatePayload,
  NovaWalletResponse,
} from "@/types/api.types";

interface BalanceState {
  currency: string | null;
  balance: NovaAmount | null;
  withdrawableBalance: NovaAmount | null;
  nonWithdrawableBalance: NovaAmount | null;
  hasLoadedInitialBalance: boolean;
}

interface BalanceActions {
  syncFromWallet: (wallet: NovaWalletResponse) => void;
  applyBalanceUpdate: (payload: NovaBalanceUpdatePayload) => void;
  reset: () => void;
}

function normalizeAmount(value: number | NovaAmount | null | undefined): NovaAmount | null {
  if (value === null || value === undefined) {
    return null;
  }

  return String(value);
}

export const useBalanceStore = create<BalanceState & BalanceActions>((set) => ({
  currency: null,
  balance: null,
  withdrawableBalance: null,
  nonWithdrawableBalance: null,
  hasLoadedInitialBalance: false,

  syncFromWallet: (wallet) =>
    set({
      currency: wallet.currency ?? null,
      balance: normalizeAmount(wallet.balance),
      withdrawableBalance: normalizeAmount(wallet.withdrawable_balance),
      nonWithdrawableBalance: normalizeAmount(wallet.non_withdrawable_balance),
      hasLoadedInitialBalance: true,
    }),

  applyBalanceUpdate: (payload) =>
    set((state) => ({
      balance:
        payload.balance !== undefined
          ? normalizeAmount(payload.balance)
          : state.balance,
      withdrawableBalance:
        payload.withdrawable !== undefined
          ? normalizeAmount(payload.withdrawable)
          : state.withdrawableBalance,
      nonWithdrawableBalance:
        payload.non_withdrawable !== undefined
          ? normalizeAmount(payload.non_withdrawable)
          : state.nonWithdrawableBalance,
    })),

  reset: () =>
    set({
      currency: null,
      balance: null,
      withdrawableBalance: null,
      nonWithdrawableBalance: null,
      hasLoadedInitialBalance: false,
    }),
}));

import { create } from "zustand";

export type WalletModalKind = "deposit" | "withdraw" | null;

interface UiState {
  authModalOpen: boolean;
  walletModal: WalletModalKind;
}

interface UiActions {
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openWalletModal: (kind: Exclude<WalletModalKind, null>) => void;
  closeWalletModal: () => void;
}

export const useUiStore = create<UiState & UiActions>((set) => ({
  authModalOpen: false,
  walletModal: null,

  openAuthModal: () => set({ authModalOpen: true }),
  closeAuthModal: () => set({ authModalOpen: false }),
  openWalletModal: (kind) => set({ walletModal: kind }),
  closeWalletModal: () => set({ walletModal: null }),
}));

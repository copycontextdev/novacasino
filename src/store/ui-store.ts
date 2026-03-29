import { create } from "zustand";

export type WalletModalKind = "deposit" | "withdraw" | null;

interface UiState {
  authModalOpen: boolean;
  walletModal: WalletModalKind;
  pendingPostAuthPath: string | null;
}

interface UiActions {
  openAuthModal: (pendingPath?: string) => void;
  closeAuthModal: () => void;
  openWalletModal: (kind: Exclude<WalletModalKind, null>) => void;
  closeWalletModal: () => void;
  clearPendingPostAuthPath: () => void;
}

export const useUiStore = create<UiState & UiActions>((set) => ({
  authModalOpen: false,
  walletModal: null,
  pendingPostAuthPath: null,

  openAuthModal: (pendingPath) =>
    set((state) => ({
      authModalOpen: true,
      pendingPostAuthPath: pendingPath ?? state.pendingPostAuthPath,
    })),
  closeAuthModal: () => set({ authModalOpen: false }),
  openWalletModal: (kind) => set({ walletModal: kind }),
  closeWalletModal: () => set({ walletModal: null }),
  clearPendingPostAuthPath: () => set({ pendingPostAuthPath: null }),
}));

import { create } from "zustand";

interface UiState {
  authModalOpen: boolean;
}

interface UiActions {
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

export const useUiStore = create<UiState & UiActions>((set) => ({
  authModalOpen: false,

  openAuthModal: () => set({ authModalOpen: true }),
  closeAuthModal: () => set({ authModalOpen: false }),
}));

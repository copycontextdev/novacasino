import { create } from "zustand";
import type { NovaMemberProfile } from "@/types/api.types";

interface AuthState {
  hydrated: boolean;
  isAuthenticated: boolean;
  member: NovaMemberProfile | null;
  /**
   * True while a Telegram Mini App auto-auth attempt is in progress.
   * Set at store creation so AppShell can block the first paint until
   * useTelegramAutoAuth resolves — prevents an unauthenticated flash.
   */
  telegramAuthPending: boolean;
}

interface AuthActions {
  hydrate: () => void;
  login: (member: NovaMemberProfile) => void;
  logout: () => void;
  setTelegramAuthPending: (v: boolean) => void;
}

/**
 * Pending only if we're inside a Telegram Mini App AND there is no
 * already-stored token (a valid stored token short-circuits the auto-auth).
 */
function getInitialTelegramAuthPending(): boolean {
  if (typeof window === "undefined") return false;
  if (!window.Telegram?.WebApp?.initData) return false;
  if (localStorage.getItem("nova_access_token")) return false;
  return true;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  hydrated: false,
  isAuthenticated: false,
  member: null,
  telegramAuthPending: getInitialTelegramAuthPending(),

  hydrate: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("nova_access_token");
    set({ hydrated: true, isAuthenticated: !!token });
  },

  login: (member) => {
    set({ isAuthenticated: true, member, hydrated: true });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("nova_access_token");
      localStorage.removeItem("nova_refresh_token");
    }
    set({ isAuthenticated: false, member: null });
  },

  setTelegramAuthPending: (v) => set({ telegramAuthPending: v }),
}));

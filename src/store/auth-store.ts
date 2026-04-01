import { create } from "zustand";
import type { NovaMemberProfile } from "@/types/api.types";

interface AuthState {
  hydrated: boolean;
  isAuthenticated: boolean;
  member: NovaMemberProfile | null;
}

interface AuthActions {
  hydrate: () => void;
  login: (member: NovaMemberProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  hydrated: false,
  isAuthenticated: false,
  member: null,

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
}));

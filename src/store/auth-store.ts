import { create } from "zustand";
import type { SabiMemberProfile } from "@/types/api.types";

interface AuthState {
  hydrated: boolean;
  isAuthenticated: boolean;
  member: SabiMemberProfile | null;
}

interface AuthActions {
  hydrate: () => void;
  login: (member: SabiMemberProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  hydrated: false,
  isAuthenticated: false,
  member: null,

  hydrate: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("sabi_access_token");
    set({ hydrated: true, isAuthenticated: !!token });
  },

  login: (member) => {
    set({ isAuthenticated: true, member, hydrated: true });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("sabi_access_token");
      localStorage.removeItem("sabi_refresh_token");
    }
    set({ isAuthenticated: false, member: null });
  },
}));

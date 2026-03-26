import { create } from "zustand";
import type { SabiWsMessage } from "@/types/api.types";

export type WsStatus =
  | "idle"
  | "disabled"
  | "connecting"
  | "connected"
  | "error"
  | "disconnected";

interface WsState {
  wsStatus: WsStatus;
  lastJackpotEvent: SabiWsMessage | null;
  lastMessageType: string | null;
  lastMessageAt: number | null;
}

interface WsActions {
  setStatus: (status: WsStatus) => void;
  setLastJackpotEvent: (event: SabiWsMessage) => void;
  setLastMessage: (type: string | null) => void;
  reset: () => void;
}

export const useWsStore = create<WsState & WsActions>((set) => ({
  wsStatus: "idle",
  lastJackpotEvent: null,
  lastMessageType: null,
  lastMessageAt: null,

  setStatus: (wsStatus) => set({ wsStatus }),
  setLastJackpotEvent: (lastJackpotEvent) => set({ lastJackpotEvent }),
  setLastMessage: (lastMessageType) =>
    set({
      lastMessageType,
      lastMessageAt: lastMessageType ? Date.now() : null,
    }),
  reset: () =>
    set({
      wsStatus: "idle",
      lastJackpotEvent: null,
      lastMessageType: null,
      lastMessageAt: null,
    }),
}));

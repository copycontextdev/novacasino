import { create } from "zustand";
import type { NovaWsMessage } from "@/types/api.types";

export type WsStatus =
  | "idle"
  | "disabled"
  | "connecting"
  | "connected"
  | "error"
  | "disconnected";

interface WsState {
  wsStatus: WsStatus;
  lastJackpotEvent: NovaWsMessage | null;
  lastMessageType: string | null;
  lastMessageAt: number | null;
  reconnectionCount: number;
  errorCount: number;
  messageCount: number;
}

interface WsActions {
  setStatus: (status: WsStatus) => void;
  setLastJackpotEvent: (event: NovaWsMessage) => void;
  setLastMessage: (type: string | null) => void;
  incrementReconnection: () => void;
  reset: () => void;
}

export const useWsStore = create<WsState & WsActions>((set) => ({
  wsStatus: "idle",
  lastJackpotEvent: null,
  lastMessageType: null,
  lastMessageAt: null,
  reconnectionCount: 0,
  errorCount: 0,
  messageCount: 0,

  setStatus: (wsStatus) =>
    set((state) => ({
      wsStatus,
      errorCount: wsStatus === "error" ? state.errorCount + 1 : state.errorCount,
    })),
  setLastJackpotEvent: (lastJackpotEvent) => set({ lastJackpotEvent }),
  setLastMessage: (lastMessageType) =>
    set((state) => ({
      lastMessageType,
      lastMessageAt: lastMessageType ? Date.now() : null,
      messageCount: lastMessageType ? state.messageCount + 1 : state.messageCount,
    })),
  incrementReconnection: () => set((state) => ({ reconnectionCount: state.reconnectionCount + 1 })),
  reset: () =>
    set({
      wsStatus: "idle",
      lastJackpotEvent: null,
      lastMessageType: null,
      lastMessageAt: null,
      reconnectionCount: 0,
      errorCount: 0,
      messageCount: 0,
    }),
}));

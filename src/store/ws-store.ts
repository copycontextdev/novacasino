import { create } from "zustand";
import type { SabiWsMessage } from "@/types/api.types";

export type WsStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "error"
  | "disconnected";

interface WsState {
  wsStatus: WsStatus;
  lastJackpotEvent: SabiWsMessage | null;
}

interface WsActions {
  setStatus: (status: WsStatus) => void;
  setLastJackpotEvent: (event: SabiWsMessage) => void;
}

export const useWsStore = create<WsState & WsActions>((set) => ({
  wsStatus: "idle",
  lastJackpotEvent: null,

  setStatus: (wsStatus) => set({ wsStatus }),
  setLastJackpotEvent: (lastJackpotEvent) => set({ lastJackpotEvent }),
}));

import { useMemo } from "react";
import { getApiBaseUrl } from "@/lib/api/config";
import { useAuthStore } from "@/store/auth-store";
import { useBalanceStore } from "@/store/balance-store";
import { useWsStore, type WsStatus } from "@/store/ws-store";

function isLocalDebugEnvironment(): boolean {
  return false;
  if (import.meta.env.DEV) {
    return true;
  }

  if (typeof window === "undefined") {
    return false;
  }

  const localHosts = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);
  return localHosts.has(window.location.hostname) || window.location.hostname.endsWith(".local");
}

function getStatusTone(status: WsStatus): string {
  switch (status) {
    case "connected":
      return "text-emerald-300";
    case "connecting":
      return "text-amber-300";
    case "error":
      return "text-red-300";
    case "disconnected":
      return "text-slate-300";
    default:
      return "text-slate-400";
  }
}

export function WsDebugPanel() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hydrated = useAuthStore((s) => s.hydrated);
  const wsStatus = useWsStore((s) => s.wsStatus);
  const lastMessageType = useWsStore((s) => s.lastMessageType);
  const lastMessageAt = useWsStore((s) => s.lastMessageAt);
  const balance = useBalanceStore((s) => s.balance);
  const withdrawableBalance = useBalanceStore((s) => s.withdrawableBalance);
  const currency = useBalanceStore((s) => s.currency);
  const hasLoadedInitialBalance = useBalanceStore((s) => s.hasLoadedInitialBalance);

  const shouldRender = isLocalDebugEnvironment();

  const wsEndpoint = useMemo(() => {
    const base = getApiBaseUrl()
      .replace(/^https/, "wss")
      .replace(/^http/, "ws");

    return `${base}/ws/init/`;
  }, []);

  const lastSeenLabel = useMemo(() => {
    if (!lastMessageAt) {
      return "never";
    }

    return new Date(lastMessageAt).toLocaleTimeString();
  }, [lastMessageAt]);

  if (!shouldRender) {
    return null;
  }

  return (
    <aside className="fixed bottom-4 right-4 z-[120] w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-cyan-400/30 bg-slate-950/92 p-4 text-[11px] text-slate-100 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-300">
          WS Debug
        </p>
        <span className={`font-mono text-[10px] font-semibold uppercase ${getStatusTone(wsStatus)}`}>
          {wsStatus}
        </span>
      </div>

      <div className="mt-3 space-y-2 font-mono">
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">auth</span>
          <span>{hydrated ? (isAuthenticated ? "authenticated" : "guest") : "hydrating"}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">initial balance</span>
          <span>{hasLoadedInitialBalance ? "loaded" : "pending"}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">last message</span>
          <span>{lastMessageType ?? "none"}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">last seen</span>
          <span>{lastSeenLabel}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">balance</span>
          <span>{balance != null ? `${currency ?? "ETB"} ${balance}` : "n/a"}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">withdrawable</span>
          <span>{withdrawableBalance ?? "n/a"}</span>
        </div>
      </div>

      <p className="mt-3 break-all font-mono text-[10px] leading-4 text-slate-500">{wsEndpoint}</p>
    </aside>
  );
}

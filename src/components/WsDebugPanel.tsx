import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, ChevronUp, Activity } from "lucide-react";
import { getApiBaseUrl, isWebSocketEnabled } from "@/lib/api/config";
import { useAuthStore } from "@/store/auth-store";
import { useBalanceStore } from "@/store/balance-store";
import { useWsStore, type WsStatus } from "@/store/ws-store";

function getStatusTone(status: WsStatus): string {
  switch (status) {
    case "disabled":
      return "text-slate-500";
    case "connected":
      return "text-emerald-400";
    case "connecting":
      return "text-amber-400";
    case "error":
      return "text-red-400";
    case "disconnected":
      return "text-slate-400";
    default:
      return "text-slate-500";
  }
}

export function WsDebugPanel() {
  const [searchParams] = useSearchParams();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hydrated = useAuthStore((s) => s.hydrated);
  const member = useAuthStore((s) => s.member);
  const wsStatus = useWsStore((s) => s.wsStatus);
  const lastMessageType = useWsStore((s) => s.lastMessageType);
  const lastMessageAt = useWsStore((s) => s.lastMessageAt);
  const messageCount = useWsStore((s) => s.messageCount);
  const reconnectionCount = useWsStore((s) => s.reconnectionCount);
  const errorCount = useWsStore((s) => s.errorCount);
  const lastJackpotEvent = useWsStore((s) => s.lastJackpotEvent);
  
  const balance = useBalanceStore((s) => s.balance);
  const withdrawableBalance = useBalanceStore((s) => s.withdrawableBalance);
  const currency = useBalanceStore((s) => s.currency);

  const wsEnabled = isWebSocketEnabled();
  const showDebug = searchParams.has("debug");
  const shouldRender = wsEnabled && showDebug;

  const wsEndpoint = useMemo(() => {
    const base = getApiBaseUrl()
      .replace(/^https/, "wss")
      .replace(/^http/, "ws");
    return `${base}/ws/init/`;
  }, []);

  const lastSeenLabel = useMemo(() => {
    if (!lastMessageAt) return "never";
    return new Date(lastMessageAt).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }, [lastMessageAt]);

  const hasToken = useMemo(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("sabi_access_token");
  }, []);

  if (!shouldRender) return null;

  return (
    <aside 
      className={`fixed bottom-4 right-4 z-[120] rounded-2xl border border-cyan-400/30 bg-slate-950/95 text-[11px] text-slate-100 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl ring-1 ring-white/10 transition-all duration-300 ${
        isCollapsed ? "w-48" : "w-[min(24rem,calc(100vw-2rem))]"
      }`}
    >
      {/* Header - Always Visible */}
      <div 
        className={`flex items-center justify-between gap-3 p-3 cursor-pointer select-none ${!isCollapsed && "border-b border-cyan-400/20 mb-1"}`}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <Activity className={`w-3.5 h-3.5 ${wsStatus === 'connected' ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
          <div className="flex flex-col">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-cyan-300">
              Debug Monitor
            </p>
            {isCollapsed && (
              <span className={`font-mono text-[9px] font-bold uppercase ${getStatusTone(wsStatus)}`}>
                {wsStatus}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isCollapsed && (
            <span className={`font-mono text-[10px] font-semibold uppercase ${getStatusTone(wsStatus)}`}>
              {wsStatus}
            </span>
          )}
          <button className="text-slate-500 hover:text-white transition-colors">
            {isCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Expandable Content */}
      {!isCollapsed && (
        <div className="p-4 pt-2 space-y-2 font-mono">
          <div className="grid grid-cols-2 gap-x-4">
            <span className="text-slate-400">auth status</span>
            <span className="text-right truncate">{hydrated ? (isAuthenticated ? "authenticated" : "guest") : "hydrating"}</span>
          </div>
          
          {member && (
            <div className="grid grid-cols-2 gap-x-4">
              <span className="text-slate-400">user</span>
              <span className="text-right truncate text-cyan-200">{member.username}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-4">
            <span className="text-slate-400">token present</span>
            <span className="text-right">{hasToken ? "yes" : "no"}</span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 border-t border-white/5 pt-2">
            <span className="text-slate-400">reconnections</span>
            <span className="text-right text-amber-300">{reconnectionCount}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-x-4">
            <span className="text-slate-400">ws errors</span>
            <span className="text-right text-red-400">{errorCount}</span>
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <span className="text-slate-400">messages</span>
            <span className="text-right text-emerald-300">{messageCount}</span>
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <span className="text-slate-400">last type</span>
            <span className="text-right text-cyan-300 truncate">{lastMessageType ?? "none"}</span>
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <span className="text-slate-400">last seen</span>
            <span className="text-right">{lastSeenLabel}</span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 border-t border-white/5 pt-2">
            <span className="text-slate-400">balance</span>
            <span className="text-right font-bold text-emerald-400">
              {balance != null ? `${currency ?? "ETB"} ${balance}` : "n/a"}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-x-4">
            <span className="text-slate-400">withdrawable</span>
            <span className="text-right">
              {withdrawableBalance != null ? `${currency ?? "ETB"} ${withdrawableBalance}` : "n/a"}
            </span>
          </div>

          {lastJackpotEvent && (
            <div className="mt-2 border-t border-dashed border-cyan-400/20 pt-2 text-[9px]">
              <p className="text-cyan-300/80 mb-1 uppercase tracking-tighter">Last Event:</p>
              <pre className="text-slate-400 whitespace-pre-wrap leading-tight max-h-24 overflow-y-auto bg-black/40 p-1.5 rounded border border-white/5">
                {JSON.stringify(lastJackpotEvent, null, 1)}
              </pre>
            </div>
          )}

          <div className="mt-3 pt-2 border-t border-white/5">
            <p className="break-all font-mono text-[9px] leading-3 text-slate-500 opacity-40 hover:opacity-100 transition-opacity">
              {wsEndpoint}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}

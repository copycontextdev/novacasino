import { getApiBaseUrl } from "@/lib/api/config";
import type { NovaWsMessage, NovaWsClientAction } from "@/types/api.types";

const BACKOFF_DELAYS = [1000, 2000, 4000, 8000, 16000, 30000];
const MAX_RETRIES = 6;
const TOKEN_EXPIRY_SKEW_SECONDS = 20;

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const [, payloadPart] = token.split(".");
    if (!payloadPart) return null;
    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = atob(padded);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  const exp = payload?.exp;
  if (typeof exp !== "number") return false;
  const nowSeconds = Math.floor(Date.now() / 1000);
  return exp <= nowSeconds + TOKEN_EXPIRY_SKEW_SECONDS;
}

class NovaWsClient {
  private socket: WebSocket | null = null;
  private retryCount = 0;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private explicitlyClosed = false;
  private currentToken: string | null = null;
  private authenticatedOnce = false;

  onMessage?: (msg: NovaWsMessage) => void;
  onAuthError?: () => void;
  onStatusChange?: (status: "connecting" | "connected" | "error" | "disconnected") => void;

  connect(token: string): void {
    const currentState = this.socket?.readyState;
    if (
      currentState === WebSocket.OPEN ||
      currentState === WebSocket.CONNECTING
    ) {
      return;
    }

    if (isTokenExpired(token)) {
      this.onStatusChange?.("error");
      this.onAuthError?.();
      return;
    }

    this.explicitlyClosed = false;
    this.currentToken = token;
    this.authenticatedOnce = false;
    this._clearRetry();
    this._open(token);
  }

  disconnect(): void {
    this.explicitlyClosed = true;
    this._clearRetry();
    this.socket?.close();
    this.socket = null;
    this.retryCount = 0;
    this.authenticatedOnce = false;
    this.onStatusChange?.("disconnected");
  }

  send(action: NovaWsClientAction): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(action));
    }
  }

  private _open(token: string): void {
    const base = getApiBaseUrl()
      .replace(/^https/, "wss")
      .replace(/^http/, "ws");
    const url = `${base}/ws/init/?token=${encodeURIComponent(token)}`;

    this.onStatusChange?.("connecting");
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      // authenticated message will confirm connection
    };

    this.socket.onmessage = (event) => {
      try {
        const msg: NovaWsMessage = JSON.parse(event.data as string);

        if ((msg as { type?: string }).type === "authenticated") {
          this.retryCount = 0;
          this.authenticatedOnce = true;
          this.onStatusChange?.("connected");
        }

        if ((msg as { type?: string }).type === "authentication_error") {
          this.explicitlyClosed = true;
          this._clearRetry();
          this.socket?.close();
          this.onStatusChange?.("error");
          this.onAuthError?.();
          return;
        }

        this.onMessage?.(msg);
      } catch {
        // Ignore malformed messages
      }
    };

    this.socket.onerror = () => {
      this.onStatusChange?.("error");
    };

    this.socket.onclose = (event) => {
      this.socket = null;

      if (this.explicitlyClosed) return;
      if (event.code === 1008) {
        this.onStatusChange?.("error");
        this.onAuthError?.();
        return;
      }
      this._scheduleRetry();
    };
  }

  private _scheduleRetry(): void {
    if (this.retryCount >= MAX_RETRIES || !this.currentToken) {
      this.onStatusChange?.("disconnected");
      return;
    }

    if (isTokenExpired(this.currentToken)) {
      this.onStatusChange?.("error");
      this.onAuthError?.();
      return;
    }

    const delay = BACKOFF_DELAYS[Math.min(this.retryCount, BACKOFF_DELAYS.length - 1)];
    this.retryCount++;
    this.retryTimer = setTimeout(() => {
      if (!this.explicitlyClosed && this.currentToken) {
        this._open(this.currentToken);
      }
    }, delay);
  }

  private _clearRetry(): void {
    if (this.retryTimer !== null) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
  }
}

/** Singleton WS client — import this everywhere */
export const novaWsClient = new NovaWsClient();

const DEFAULT_API_BASE_URL = "https://api.novacasino.games";

export function getApiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_API_URL;
  if (fromEnv && String(fromEnv).trim()) {
    return String(fromEnv).replace(/\/$/, "");
  }

  return DEFAULT_API_BASE_URL;
}

export function isWebSocketEnabled(): boolean {
  const raw = import.meta.env.VITE_WS_ENABLED?.trim().toLowerCase();

  if (!raw) {
    return false;
  }

  return raw === "1" || raw === "true" || raw === "yes" || raw === "on";
}

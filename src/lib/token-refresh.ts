import axios from "axios";
import { getApiBaseUrl } from "@/lib/api/config";
import { AUTH_REFRESH } from "@/lib/api/endpoints";
import { clearTokens, getRefreshToken, setAccessToken } from "@/lib/session";
import type { SabiTokenRefreshResponse } from "@/types/api.types";

let refreshPromise: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  const refresh = getRefreshToken();
  if (!refresh) {
    return null;
  }

  refreshPromise = axios
    .post<SabiTokenRefreshResponse>(
      `${getApiBaseUrl()}${AUTH_REFRESH}`,
      { refresh },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 15_000,
      },
    )
    .then((response) => {
      const access = response.data?.access;
      if (!access) {
        clearTokens();
        return null;
      }

      setAccessToken(access);
      return access;
    })
    .catch(() => {
      clearTokens();
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

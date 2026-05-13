import axios from "axios";
import { getApiBaseUrl } from "./config";
import { getAccessToken } from "@/lib/session";
import { AUTH_REFRESH, AUTH_TELEGRAM } from "@/lib/api/endpoints";
import { refreshAccessToken } from "@/lib/token-refresh";
import { attemptTelegramReauth } from "@/lib/telegram-reauth";

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as
      | (typeof error.config & { _retry?: boolean })
      | undefined;

    const requestUrl = String(originalRequest?.url ?? "");
    const isAuthEndpoint =
      requestUrl.includes(AUTH_REFRESH) || requestUrl.includes(AUTH_TELEGRAM);

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;
      const refreshedAccessToken = await refreshAccessToken();

      if (refreshedAccessToken) {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${refreshedAccessToken}`;
        return apiClient(originalRequest);
      }

      // Refresh failed. If we're inside Telegram, try minting a fresh session
      // from initData before giving up and showing the login modal.
      const telegramToken = await attemptTelegramReauth();
      if (telegramToken) {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${telegramToken}`;
        return apiClient(originalRequest);
      }
    }

    if (error.response?.status === 401) {
      const { useAuthStore } = await import("@/store/auth-store");
      const { useUiStore } = await import("@/store/ui-store");
      useAuthStore.getState().logout();
      useUiStore.getState().openAuthModal();
    }
    return Promise.reject(error);
  },
);

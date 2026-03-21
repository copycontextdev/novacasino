import axios from "axios";
import { getApiBaseUrl } from "./config";
import { getAccessToken } from "@/lib/session";

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
    if (error.response?.status === 401) {
      const { useAuthStore } = await import("@/store/auth-store");
      const { useUiStore } = await import("@/store/ui-store");
      useAuthStore.getState().logout();
      useUiStore.getState().openAuthModal();
    }
    return Promise.reject(error);
  },
);

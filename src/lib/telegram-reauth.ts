import { isTelegramMiniApp, getTelegramInitData } from "@/lib/telegram";

/**
 * 401 fallback for Telegram Mini App sessions.
 *
 * When the access token AND refresh token have both failed, but the app is
 * running inside Telegram with a valid `initData`, we can re-mint a JWT pair
 * by calling /auth/telegram/ again — silently, without dropping the user to
 * the login modal.
 *
 * The promise is deduped across concurrent 401 retries (same pattern as
 * refreshAccessToken). Returns the new access token on success, or null if
 * not in Telegram / re-auth failed / link_required.
 *
 * Dynamic imports are used to avoid a circular dependency with apiClient.
 */
let reauthPromise: Promise<string | null> | null = null;

export async function attemptTelegramReauth(): Promise<string | null> {
  if (!isTelegramMiniApp()) return null;
  if (reauthPromise) return reauthPromise;

  reauthPromise = (async () => {
    try {
      const { telegramLogin } = await import("@/lib/api-methods/auth.api");
      const { getMe } = await import("@/lib/api-methods/core.api");
      const { useAuthStore } = await import("@/store/auth-store");
      const { getAccessToken } = await import("@/lib/session");

      const res = await telegramLogin({ init_data: getTelegramInitData() });
      if (res.status !== "authenticated") return null;

      const token = getAccessToken();
      if (!token) return null;

      try {
        const member = await getMe();
        useAuthStore.getState().login(member);
      } catch {
        // Profile fetch failed but tokens are valid — caller can still use the token.
      }
      return token;
    } catch (err) {
      console.error("[telegram-reauth] failed", err);
      return null;
    } finally {
      reauthPromise = null;
    }
  })();

  return reauthPromise;
}

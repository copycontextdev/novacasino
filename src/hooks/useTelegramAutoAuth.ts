import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth-store";
import { getMe } from "@/lib/api-methods/core.api";
import { telegramLogin } from "@/lib/api-methods/auth.api";
import {
  isTelegramMiniApp,
  getTelegramInitData,
  initTelegramWebApp,
} from "@/lib/telegram";

/**
 * Telegram Mini App auto-authentication.
 *
 * Fires once after auth hydration when:
 *   - the app is running inside Telegram (initData present), and
 *   - there is no stored token from a previous session.
 *
 * On `authenticated` response: stores tokens, fetches member profile, marks the
 * Zustand auth store as logged in — which triggers the existing wallet sync and
 * WebSocket effects in useNovaBootstrap.
 *
 * On `link_required` or error: falls through silently. The user lands in
 * unauthenticated state and the standard auth modal will appear on demand.
 *
 * The `telegramAuthPending` flag in auth-store is flipped to `false` on every
 * exit path so AppShell can lift its loading screen.
 */
export function useTelegramAutoAuth() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useAuthStore((s) => s.login);
  const setTelegramAuthPending = useAuthStore((s) => s.setTelegramAuthPending);
  const attempted = useRef(false);

  useEffect(() => {
    if (!hydrated) return;

    // Already authenticated (stored token, or normal login completed) — nothing to do.
    if (isAuthenticated) {
      setTelegramAuthPending(false);
      return;
    }

    if (attempted.current) return;

    // Not in a Telegram Mini App — clear any initial pending flag and bail.
    if (!isTelegramMiniApp()) {
      setTelegramAuthPending(false);
      return;
    }

    attempted.current = true;
    initTelegramWebApp();

    void telegramLogin({ init_data: getTelegramInitData() })
      .then(async (res) => {
        if (res.status === "authenticated") {
          const member = await getMe();
          login(member);
        }
      })
      .catch((err) => {
        console.error("[telegram-auth] auto-login failed", err);
      })
      .finally(() => {
        setTelegramAuthPending(false);
      });
  }, [hydrated, isAuthenticated, login, setTelegramAuthPending]);
}

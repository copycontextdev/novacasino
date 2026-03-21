import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useWsStore } from "@/store/ws-store";
import { sabiWsClient } from "@/lib/ws/ws-client";
import { getAccessToken } from "@/lib/session";
import { queryClient } from "@/lib/query-client";
import { WALLET_QUERY_KEY } from "@/hooks/queries/use-wallet";
import { getMe } from "@/lib/api-methods/core.api";
import type { SabiWalletResponse, SabiBalanceUpdatePayload } from "@/types/api.types";

export function useSabiBootstrap() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const logout = useAuthStore((s) => s.logout);
  const login = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hydrated = useAuthStore((s) => s.hydrated);
  const setWsStatus = useWsStore((s) => s.setStatus);
  const setLastJackpotEvent = useWsStore((s) => s.setLastJackpotEvent);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated || !isAuthenticated) return;
    if (useAuthStore.getState().member) return;
    void getMe()
      .then((m) => login(m))
      .catch(() => {});
  }, [hydrated, isAuthenticated, login]);

  useEffect(() => {
    if (!hydrated) return;

    if (!isAuthenticated) {
      sabiWsClient.disconnect();
      return;
    }

    const token = getAccessToken();
    if (!token) return;

    sabiWsClient.onMessage = (msg) => {
      const type = (msg as { type?: string }).type;

      if (type === "balance.update") {
        const payload = (msg as { payload?: SabiBalanceUpdatePayload }).payload ?? {};
        queryClient.setQueryData(
          WALLET_QUERY_KEY,
          (old: SabiWalletResponse | undefined) => {
            if (!old) return old;
            return {
              ...old,
              ...(payload.balance !== undefined && {
                balance: String(payload.balance),
              }),
              ...(payload.withdrawable !== undefined && {
                withdrawable_balance: String(payload.withdrawable),
              }),
              ...(payload.non_withdrawable !== undefined && {
                non_withdrawable_balance: String(payload.non_withdrawable),
              }),
            };
          },
        );
        return;
      }

      if (
        type === "jackpot_contribution" ||
        type === "personal_crash_jackpot_win" ||
        type === "crash_jackpot_win"
      ) {
        setLastJackpotEvent(msg);
      }
    };

    sabiWsClient.onAuthError = () => {
      logout();
    };

    sabiWsClient.onStatusChange = (status) => {
      setWsStatus(status);
    };

    sabiWsClient.connect(token);

    return () => {
      sabiWsClient.disconnect();
    };
  }, [hydrated, isAuthenticated, logout, setWsStatus, setLastJackpotEvent]);
}

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useBalanceStore } from "@/store/balance-store";
import { useWsStore } from "@/store/ws-store";
import { sabiWsClient } from "@/lib/ws/ws-client";
import { isWebSocketEnabled } from "@/lib/api/config";
import { getAccessToken } from "@/lib/session";
import { queryClient } from "@/lib/query-client";
import { useWallet, WALLET_QUERY_KEY } from "@/hooks/queries/use-wallet";
import { getMe } from "@/lib/api-methods/core.api";
import type { SabiWalletResponse, SabiBalanceUpdatePayload } from "@/types/api.types";

export function useSabiBootstrap() {
  const walletQuery = useWallet();
  const hydrate = useAuthStore((s) => s.hydrate);
  const logout = useAuthStore((s) => s.logout);
  const login = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hydrated = useAuthStore((s) => s.hydrated);
  const syncFromWallet = useBalanceStore((s) => s.syncFromWallet);
  const applyBalanceUpdate = useBalanceStore((s) => s.applyBalanceUpdate);
  const resetBalance = useBalanceStore((s) => s.reset);
  const setWsStatus = useWsStore((s) => s.setStatus);
  const setLastJackpotEvent = useWsStore((s) => s.setLastJackpotEvent);
  const setLastMessage = useWsStore((s) => s.setLastMessage);
  const resetWsState = useWsStore((s) => s.reset);
  const wsStatus = useWsStore((s) => s.wsStatus);

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
    if (!hydrated || !isAuthenticated || !walletQuery.data) {
      return;
    }

    syncFromWallet(walletQuery.data);
  }, [hydrated, isAuthenticated, syncFromWallet, walletQuery.data]);

  useEffect(() => {
    if (!hydrated) return;

    if (!isAuthenticated) {
      resetBalance();
      resetWsState();
      sabiWsClient.disconnect();
      return;
    }

    if (!isWebSocketEnabled()) {
      setWsStatus("disabled");
      sabiWsClient.disconnect();
      return;
    }

    const token = getAccessToken();
    if (!token) return;

    sabiWsClient.onMessage = (msg) => {
      const type = (msg as { type?: string }).type;
      setLastMessage(type ?? "unknown");

      if (type === "balance.update") {
        const payload = (msg as { payload?: SabiBalanceUpdatePayload }).payload ?? {};
        applyBalanceUpdate(payload);
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
  }, [
    applyBalanceUpdate,
    hydrated,
    isAuthenticated,
    logout,
    resetBalance,
    resetWsState,
    setLastMessage,
    setWsStatus,
    setLastJackpotEvent,
  ]);

  useEffect(() => {
    if (!hydrated || !isAuthenticated) {
      return;
    }

    const refetchWallet = () => {
      void walletQuery.refetch();
    };

    const handleVisibilityChange = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        refetchWallet();
      }
    };

    const handleWindowFocus = () => {
      refetchWallet();
    };

    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const fallbackPollMs =
      wsStatus === "connected" ? 45_000 : 15_000;
    const intervalId = window.setInterval(refetchWallet, fallbackPollMs);

    return () => {
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.clearInterval(intervalId);
    };
  }, [hydrated, isAuthenticated, walletQuery, wsStatus]);
}

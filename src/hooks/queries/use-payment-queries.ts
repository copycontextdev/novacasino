import { useQuery } from "@tanstack/react-query";
import {
  getMyDepositOrders,
  getMyWithdrawalOrders,
  getMyTransactions,
  getUserBankInfo,
} from "@/lib/api-methods/payment.api";
import { useAuthStore } from "@/store/auth-store";
import type { SabiPaginationQuery } from "@/types/api.types";

export function useMyDepositOrders(query?: SabiPaginationQuery) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["deposit-orders", query],
    queryFn: () => getMyDepositOrders(query ?? { page_size: 50 }),
    enabled: isAuthenticated,
    staleTime: 15_000,
  });
}

export function useMyWithdrawalOrders(query?: SabiPaginationQuery) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["withdrawal-orders", query],
    queryFn: () => getMyWithdrawalOrders(query ?? { page_size: 50 }),
    enabled: isAuthenticated,
    staleTime: 15_000,
  });
}

export function useMyTransactions(query?: SabiPaginationQuery) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["my-transactions", query],
    queryFn: () => getMyTransactions(query ?? { page_size: 50 }),
    enabled: isAuthenticated,
    staleTime: 15_000,
  });
}

export function useUserBankInfoList() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["user-bank-info"],
    queryFn: () => getUserBankInfo(),
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getActiveBonusStatus,
  getMemberDepositBonuses,
  getMemberSpinAwards,
  getMemberSpinConditions,
  getSpinAwardRewards,
  getMemberSpinResults,
  getSpinTracker,
  spinAward,
} from "@/lib/api-methods/bonus.api";
import { useAuthStore } from "@/store/auth-store";
import { WALLET_QUERY_KEY } from "@/hooks/queries/use-wallet";
import type { NovaSpinExecuteResponse } from "@/types/api.types";

export function useActiveBonusStatus(enabled = true) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["bonus", "active-status"],
    queryFn: getActiveBonusStatus,
    enabled: isAuthenticated && enabled,
    staleTime: 30_000,
  });
}

export function useMemberSpinAwards(enabled = true) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["bonus", "spin-awards", { is_active: true }],
    queryFn: () => getMemberSpinAwards({ is_active: true, page_size: 50 }),
    enabled: isAuthenticated && enabled,
    staleTime: 30_000,
  });
}

export function useMemberSpinConditions(enabled = true) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["bonus", "spin-conditions"],
    queryFn: () => getMemberSpinConditions({ page_size: 50 }),
    enabled: isAuthenticated && enabled,
    staleTime: 30_000,
  });
}

export function useMemberSpinResults(enabled = true) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["bonus", "spin-results"],
    queryFn: () => getMemberSpinResults({ page: 1, page_size: 50 }),
    enabled: isAuthenticated && enabled,
    staleTime: 30_000,
  });
}

export function useSpinAwardRewards(
  awardId: number | null | undefined,
  enabled = true,
) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["bonus", "spin-award-rewards", awardId],
    queryFn: () => getSpinAwardRewards(awardId as number),
    enabled: isAuthenticated && enabled && awardId != null,
    staleTime: 30_000,
  });
}

export function useSpinTracker(conditionId: number | null | undefined, enabled = true) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["bonus", "spin-tracker", conditionId],
    queryFn: () => getSpinTracker(conditionId as number),
    enabled: isAuthenticated && enabled && conditionId != null,
    staleTime: 15_000,
  });
}

export function useSpinAwardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (awardId: number) => spinAward(awardId),
    onSuccess: async (_data: NovaSpinExecuteResponse) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["bonus", "spin-awards", { is_active: true }],
        }),
        queryClient.invalidateQueries({ queryKey: ["bonus", "spin-results"] }),
        queryClient.invalidateQueries({ queryKey: ["bonus", "active-status"] }),
        queryClient.invalidateQueries({ queryKey: ["bonus", "spin-conditions"] }),
        queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEY }),
      ]);
    },
  });
}

export function useMemberDepositBonuses(enabled = true) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["bonus", "deposit-bonuses"],
    queryFn: () => getMemberDepositBonuses({ page: 1, page_size: 50 }),
    enabled: isAuthenticated && enabled,
    staleTime: 30_000,
  });
}

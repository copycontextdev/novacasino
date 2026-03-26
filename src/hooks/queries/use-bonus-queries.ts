import { useQuery } from "@tanstack/react-query";
import {
  getActiveBonusStatus,
  getMemberDepositBonuses,
  getMemberSpinAwards,
  getMemberSpinConditions,
  getMemberSpinResults,
  getSpinTracker,
} from "@/lib/api-methods/bonus.api";
import { useAuthStore } from "@/store/auth-store";

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

export function useSpinTracker(conditionId: number | null | undefined, enabled = true) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["bonus", "spin-tracker", conditionId],
    queryFn: () => getSpinTracker(conditionId as number),
    enabled: isAuthenticated && enabled && conditionId != null,
    staleTime: 15_000,
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

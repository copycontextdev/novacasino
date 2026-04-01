import { apiClient } from "@/lib/api/client";
import type {
  NovaActiveBonusStatus,
  NovaDepositBonusListResponse,
  NovaPaginationQuery,
  NovaSpinAwardListResponse,
  NovaSpinConditionListResponse,
  NovaSpinExecuteResponse,
  NovaSpinRewardListResponse,
  NovaSpinResultListResponse,
  NovaSpinTrackerResponse,
} from "@/types/api.types";
import {
  BONUS_ACTIVE_STATUS,
  BONUS_MEMBER_DEPOSIT_BONUSES,
  BONUS_MEMBER_SPIN_AWARDS,
  BONUS_MEMBER_SPIN_CONDITIONS,
  BONUS_MEMBER_SPIN_RESULTS,
  BONUS_SPIN_AWARD_REWARDS,
  BONUS_SPIN_AWARD_SPIN,
  BONUS_SPIN_TRACKER,
} from "@/lib/api/endpoints";

export async function getActiveBonusStatus(): Promise<NovaActiveBonusStatus> {
  const { data } = await apiClient.get<NovaActiveBonusStatus>(BONUS_ACTIVE_STATUS);
  return data;
}

export async function getMemberSpinAwards(
  query?: NovaPaginationQuery & { is_active?: boolean },
): Promise<NovaSpinAwardListResponse> {
  const { data } = await apiClient.get<NovaSpinAwardListResponse>(
    BONUS_MEMBER_SPIN_AWARDS,
    { params: query },
  );
  return data;
}

export async function getMemberSpinConditions(
  query?: NovaPaginationQuery,
): Promise<NovaSpinConditionListResponse> {
  const { data } = await apiClient.get<NovaSpinConditionListResponse>(
    BONUS_MEMBER_SPIN_CONDITIONS,
    { params: query },
  );
  return data;
}

export async function getMemberSpinResults(
  query?: NovaPaginationQuery,
): Promise<NovaSpinResultListResponse> {
  const { data } = await apiClient.get<NovaSpinResultListResponse>(
    BONUS_MEMBER_SPIN_RESULTS,
    { params: query },
  );
  return data;
}

export async function getSpinAwardRewards(
  awardId: number,
): Promise<NovaSpinRewardListResponse> {
  const { data } = await apiClient.get<NovaSpinRewardListResponse>(
    BONUS_SPIN_AWARD_REWARDS(awardId),
  );
  return data;
}

export async function spinAward(awardId: number): Promise<NovaSpinExecuteResponse> {
  const { data } = await apiClient.post<NovaSpinExecuteResponse>(
    BONUS_SPIN_AWARD_SPIN(awardId),
    {},
  );
  return data;
}

export async function getSpinTracker(
  conditionId: number,
): Promise<NovaSpinTrackerResponse> {
  const { data } = await apiClient.get<NovaSpinTrackerResponse>(BONUS_SPIN_TRACKER, {
    params: { condition_id: conditionId },
  });
  return data;
}

export async function getMemberDepositBonuses(
  query?: NovaPaginationQuery,
): Promise<NovaDepositBonusListResponse> {
  const { data } = await apiClient.get<NovaDepositBonusListResponse>(
    BONUS_MEMBER_DEPOSIT_BONUSES,
    { params: query },
  );
  return data;
}

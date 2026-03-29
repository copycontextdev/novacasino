import { apiClient } from "@/lib/api/client";
import type {
  SabiActiveBonusStatus,
  SabiDepositBonusListResponse,
  SabiPaginationQuery,
  SabiSpinAwardListResponse,
  SabiSpinConditionListResponse,
  SabiSpinExecuteResponse,
  SabiSpinRewardListResponse,
  SabiSpinResultListResponse,
  SabiSpinTrackerResponse,
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

export async function getActiveBonusStatus(): Promise<SabiActiveBonusStatus> {
  const { data } = await apiClient.get<SabiActiveBonusStatus>(BONUS_ACTIVE_STATUS);
  return data;
}

export async function getMemberSpinAwards(
  query?: SabiPaginationQuery & { is_active?: boolean },
): Promise<SabiSpinAwardListResponse> {
  const { data } = await apiClient.get<SabiSpinAwardListResponse>(
    BONUS_MEMBER_SPIN_AWARDS,
    { params: query },
  );
  return data;
}

export async function getMemberSpinConditions(
  query?: SabiPaginationQuery,
): Promise<SabiSpinConditionListResponse> {
  const { data } = await apiClient.get<SabiSpinConditionListResponse>(
    BONUS_MEMBER_SPIN_CONDITIONS,
    { params: query },
  );
  return data;
}

export async function getMemberSpinResults(
  query?: SabiPaginationQuery,
): Promise<SabiSpinResultListResponse> {
  const { data } = await apiClient.get<SabiSpinResultListResponse>(
    BONUS_MEMBER_SPIN_RESULTS,
    { params: query },
  );
  return data;
}

export async function getSpinAwardRewards(
  awardId: number,
): Promise<SabiSpinRewardListResponse> {
  const { data } = await apiClient.get<SabiSpinRewardListResponse>(
    BONUS_SPIN_AWARD_REWARDS(awardId),
  );
  return data;
}

export async function spinAward(awardId: number): Promise<SabiSpinExecuteResponse> {
  const { data } = await apiClient.post<SabiSpinExecuteResponse>(
    BONUS_SPIN_AWARD_SPIN(awardId),
    {},
  );
  return data;
}

export async function getSpinTracker(
  conditionId: number,
): Promise<SabiSpinTrackerResponse> {
  const { data } = await apiClient.get<SabiSpinTrackerResponse>(BONUS_SPIN_TRACKER, {
    params: { condition_id: conditionId },
  });
  return data;
}

export async function getMemberDepositBonuses(
  query?: SabiPaginationQuery,
): Promise<SabiDepositBonusListResponse> {
  const { data } = await apiClient.get<SabiDepositBonusListResponse>(
    BONUS_MEMBER_DEPOSIT_BONUSES,
    { params: query },
  );
  return data;
}

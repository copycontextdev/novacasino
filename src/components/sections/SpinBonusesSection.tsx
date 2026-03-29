import { useMemo } from "react";
import { useInit } from "@/hooks/queries/use-init";
import {
  useMemberSpinAwards,
  useMemberSpinConditions,
  useMemberSpinResults,
} from "@/hooks/queries/use-bonus-queries";
import { toArray } from "@/lib/payment-utils";
import { SpinBonusPanel } from "@/components/promotions/SpinBonusPanel";

export default function SpinBonusesSection() {
  const initQuery = useInit();
  const frontendConfiguration = initQuery.data?.frontend_configuration;
  const currency = initQuery.data?.company_info?.currency ?? "ETB";
  const spinEnabled = frontendConfiguration?.spin_bonus_enabled ?? false;

  const memberSpinAwardsQuery = useMemberSpinAwards(spinEnabled);
  const memberSpinConditionsQuery = useMemberSpinConditions(spinEnabled);
  const memberSpinResultsQuery = useMemberSpinResults(spinEnabled);

  const spinAwards = useMemo(() => toArray(memberSpinAwardsQuery.data), [
    memberSpinAwardsQuery.data,
  ]);
  const spinConditions = useMemo(
    () => toArray(memberSpinConditionsQuery.data).filter((item) => item.is_active !== false),
    [memberSpinConditionsQuery.data],
  );
  const spinResults = useMemo(() => toArray(memberSpinResultsQuery.data), [
    memberSpinResultsQuery.data,
  ]);

  return (
    <SpinBonusPanel
      currency={currency}
      spinAwards={spinAwards}
      spinConditions={spinConditions}
      spinResults={spinResults}
      isSpinConditionsLoading={memberSpinConditionsQuery.isLoading}
      isSpinResultsLoading={memberSpinResultsQuery.isLoading}
    />
  );
}

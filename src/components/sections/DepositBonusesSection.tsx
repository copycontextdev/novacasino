import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DepositBonusPanel } from "@/components/promotions/DepositBonusPanel";
import { useInit } from "@/hooks/queries/use-init";
import { useMemberDepositBonuses } from "@/hooks/queries/use-bonus-queries";
import { toArray } from "@/lib/payment-utils";
import { useUiStore } from "@/store/ui-store";

export default function DepositBonusesSection() {
  const navigate = useNavigate();
  const openWalletModal = useUiStore((s) => s.openWalletModal);
  const initQuery = useInit();
  const frontendConfiguration = initQuery.data?.frontend_configuration;
  const currency = initQuery.data?.company_info?.currency ?? "ETB";
  const depositEnabled = frontendConfiguration?.deposit_bonus_enabled ?? false;
  const memberDepositBonusesQuery = useMemberDepositBonuses(depositEnabled);

  const depositBonuses = useMemo(() => toArray(memberDepositBonusesQuery.data), [
    memberDepositBonusesQuery.data,
  ]);

  return (
    <DepositBonusPanel
      currency={currency}
      items={depositBonuses}
      isLoading={memberDepositBonusesQuery.isLoading}
      onDeposit={() => {
        navigate("/wallet");
        openWalletModal("deposit");
      }}
    />
  );
}

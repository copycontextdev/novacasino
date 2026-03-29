/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from "react";
import { CircleDollarSign, LoaderCircle, LogIn, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DepositBonusPanel } from "@/components/promotions/DepositBonusPanel";
import { SpinBonusPanel } from "@/components/promotions/SpinBonusPanel";
import { useInit } from "@/hooks/queries/use-init";
import {
  useActiveBonusStatus,
  useMemberDepositBonuses,
  useMemberSpinAwards,
  useMemberSpinConditions,
  useMemberSpinResults,
} from "@/hooks/queries/use-bonus-queries";
import { toArray } from "@/lib/payment-utils";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useUiStore } from "@/store/ui-store";
import type { SabiFrontendConfig } from "@/types/api.types";

type PromotionKey = "deposit_bonus" | "spin_bonus";

function isPromotionEnabled(
  frontendConfiguration: SabiFrontendConfig | undefined,
  key: PromotionKey,
): boolean {
  if (!frontendConfiguration) {
    return false;
  }

  return key === "deposit_bonus"
    ? frontendConfiguration.deposit_bonus_enabled
    : frontendConfiguration.spin_bonus_enabled;
}

function resolvePromotionOrder(
  frontendConfiguration: SabiFrontendConfig | undefined,
): PromotionKey[] {
  const enabledKeys = (["deposit_bonus", "spin_bonus"] as PromotionKey[]).filter((key) =>
    isPromotionEnabled(frontendConfiguration, key),
  );

  if (enabledKeys.length === 0) {
    return [];
  }

  if (enabledKeys.includes("spin_bonus")) {
    return [
      "spin_bonus",
      ...enabledKeys.filter((key) => key !== "spin_bonus"),
    ];
  }

  return enabledKeys;
}

function GuestPrompt({
  title,
  description,
  onLogin,
}: {
  title: string;
  description: string;
  onLogin: () => void;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-white/15 bg-surface-container-high/60 p-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
        <LogIn className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-xl font-headline font-extrabold text-on-surface">{title}</h3>
      <p className="mt-2 text-sm text-on-surface-variant">{description}</p>
      <button
        type="button"
        onClick={onLogin}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-on-primary transition-transform hover:scale-[1.01]"
      >
        Sign in
      </button>
    </div>
  );
}

export default function PromotionsSection() {
  const navigate = useNavigate();
  const initQuery = useInit();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useUiStore((s) => s.openAuthModal);
  const openWalletModal = useUiStore((s) => s.openWalletModal);

  const frontendConfiguration = initQuery.data?.frontend_configuration;
  const currency = initQuery.data?.company_info?.currency ?? "ETB";
  const promotionOrder = useMemo(
    () => resolvePromotionOrder(frontendConfiguration),
    [frontendConfiguration],
  );

  const [selectedPromotion, setSelectedPromotion] = useState<PromotionKey | null>(null);

  useEffect(() => {
    if (!promotionOrder.length) {
      setSelectedPromotion(null);
      return;
    }

    setSelectedPromotion((current) =>
      current && promotionOrder.includes(current) ? current : promotionOrder[0],
    );
  }, [promotionOrder]);

  const spinEnabled = isPromotionEnabled(frontendConfiguration, "spin_bonus");
  const depositEnabled = isPromotionEnabled(frontendConfiguration, "deposit_bonus");

  const activeBonusStatusQuery = useActiveBonusStatus(spinEnabled || depositEnabled);
  const memberSpinAwardsQuery = useMemberSpinAwards(spinEnabled);
  const memberSpinConditionsQuery = useMemberSpinConditions(spinEnabled);
  const memberSpinResultsQuery = useMemberSpinResults(spinEnabled);
  const memberDepositBonusesQuery = useMemberDepositBonuses(depositEnabled);

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
  const depositBonuses = useMemo(() => toArray(memberDepositBonusesQuery.data), [
    memberDepositBonusesQuery.data,
  ]);

  const handleDeposit = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    navigate("/wallet");
    openWalletModal("deposit");
  };

  if (initQuery.isLoading && !initQuery.data) {
    return (
      <div className="rounded-3xl border border-white/10 bg-surface-container-high/70 p-8">
        <div className="flex items-center gap-3 text-on-surface-variant">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          <span>Loading bonuses…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/80">
          Bonuses
        </p>

        {promotionOrder.length > 1 ? (
          <div className="inline-flex flex-wrap gap-2 rounded-full border border-white/10 bg-surface/75 p-1.5">
            {promotionOrder.map((key) => {
              const isActive = selectedPromotion === key;
              const Icon = key === "deposit_bonus" ? CircleDollarSign : Sparkles;
              const label = key === "deposit_bonus" ? "Deposit Bonus" : "Spin Wheel";

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedPromotion(key)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all",
                    isActive
                      ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
                      : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              );
            })}
          </div>
        ) : null}
      </section>

      {selectedPromotion === "spin_bonus" ? (
        !isAuthenticated ? (
          <GuestPrompt
            title="Sign in to use your bonus spins"
            description="Bonus wheel availability is tied to the player account."
            onLogin={() => openAuthModal()}
          />
        ) : (
          <SpinBonusPanel
            currency={currency}
            spinAwards={spinAwards}
            spinConditions={spinConditions}
            spinResults={spinResults}
            isSpinConditionsLoading={memberSpinConditionsQuery.isLoading}
            isSpinResultsLoading={memberSpinResultsQuery.isLoading}
          />
        )
      ) : null}

      {selectedPromotion === "deposit_bonus" ? (
        !isAuthenticated ? (
          <GuestPrompt
            title="Sign in to view your deposit bonuses"
            description="Deposit bonuses are personal to the player account."
            onLogin={() => openAuthModal()}
          />
        ) : (
          <DepositBonusPanel
            currency={currency}
            items={depositBonuses}
            isLoading={memberDepositBonusesQuery.isLoading}
            onDeposit={handleDeposit}
          />
        )
      ) : null}
    </div>
  );
}

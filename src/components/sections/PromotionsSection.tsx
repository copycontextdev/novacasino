/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import {
  ArrowRight,
  CircleDollarSign,
  Coins,
  Gift,
  LoaderCircle,
  LogIn,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PromotionBannerCarousel, filterActivePromotionBanners } from "@/components/PromotionBannerCarousel";
import { useInit } from "@/hooks/queries/use-init";
import {
  useActiveBonusStatus,
  useMemberDepositBonuses,
  useMemberSpinAwards,
  useMemberSpinConditions,
  useMemberSpinResults,
} from "@/hooks/queries/use-bonus-queries";
import { getSpinTracker } from "@/lib/api-methods/bonus.api";
import { formatBalance } from "@/lib/format";
import { toArray } from "@/lib/payment-utils";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useUiStore } from "@/store/ui-store";
import type {
  SabiDepositBonus,
  SabiFrontendConfig,
  SabiSpinCondition,
  SabiSpinResult,
} from "@/types/api.types";

type PromotionKey = "deposit_bonus" | "spin_bonus";
type SpinView = "wheel" | "active" | "history";

type PromotionCardDefinition = {
  key: PromotionKey;
  title: string;
  eyebrow: string;
  description: string;
  metricLabel: string;
  metricValue: string;
  accentClassName: string;
};

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
    isPromotionEnabled(frontendConfiguration, key)
  );

  if (enabledKeys.length === 0) {
    return [];
  }

  const featured = frontendConfiguration?.featured_promotion;
  if (featured === "deposit_bonus" || featured === "spin_bonus") {
    return [featured, ...enabledKeys.filter((key) => key !== featured)];
  }

  return enabledKeys;
}

function getRecordValue(
  source: Record<string, unknown>,
  keys: string[],
): unknown {
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return undefined;
}

function getRecordString(
  source: Record<string, unknown>,
  keys: string[],
): string | null {
  const value = getRecordValue(source, keys);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getRecordAmount(
  source: Record<string, unknown>,
  keys: string[],
): string | null {
  const value = getRecordValue(source, keys);
  if (typeof value === "number" || typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return formatBalance(parsed);
    }
  }

  return null;
}

function inferPromotionStatus(source: Record<string, unknown>): string {
  const explicitStatus = getRecordString(source, ["status", "state"]);
  if (explicitStatus) {
    return explicitStatus.replace(/_/g, " ");
  }

  if (source.is_completed === true) return "Completed";
  if (source.is_claimed === true) return "Claimed";
  if (source.is_active === true) return "Active";

  return "Available";
}

function formatDateLabel(value: unknown): string | null {
  if (typeof value !== "string" || !value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function buildConditionRequirement(condition: SabiSpinCondition, currency: string): string {
  if (condition.by_bet_amount && condition.bet_amount) {
    return `Bet ${currency} ${formatBalance(condition.bet_amount)}`;
  }

  if (condition.by_deposit_amount && condition.deposit_amount) {
    return `Deposit ${currency} ${formatBalance(condition.deposit_amount)}`;
  }

  if (condition.by_bet_count && condition.bet_count) {
    return `${condition.bet_count} qualifying bets`;
  }

  if (condition.by_login_streak && condition.login_streak_days) {
    return `${condition.login_streak_days} day login streak`;
  }

  if (condition.by_winning_streak && condition.winning_streak) {
    return `${condition.winning_streak} consecutive wins`;
  }

  return "Complete the current qualifying activity";
}

function PromotionOverviewCard({
  card,
  isSelected,
  onClick,
}: {
  card: PromotionCardDefinition;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-left rounded-3xl border p-5 transition-all duration-200",
        "bg-surface-container-high/70 hover:border-primary/40 hover:bg-surface-container-high",
        isSelected
          ? "border-primary/60 shadow-[0_0_0_1px_rgba(168,139,250,0.25)]"
          : "border-white/10",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
            {card.eyebrow}
          </p>
          <h3 className="mt-2 text-xl font-headline font-extrabold text-on-surface">
            {card.title}
          </h3>
        </div>
        <div className={cn("rounded-2xl p-3 text-white shadow-lg", card.accentClassName)}>
          {card.key === "deposit_bonus" ? (
            <CircleDollarSign className="h-5 w-5" />
          ) : (
            <Sparkles className="h-5 w-5" />
          )}
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-on-surface-variant">
        {card.description}
      </p>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
            {card.metricLabel}
          </p>
          <p className="mt-1 text-2xl font-headline font-extrabold text-on-surface">
            {card.metricValue}
          </p>
        </div>
        <ArrowRight className="h-5 w-5 text-on-surface-variant" />
      </div>
    </button>
  );
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
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function DepositBonusList({
  currency,
  items,
}: {
  currency: string;
  items: SabiDepositBonus[];
}) {
  return (
    <div className="grid gap-4">
      {items.map((item, index) => {
        const source = item as Record<string, unknown>;
        const title = getRecordString(source, ["title", "name", "bonus_name", "promo_name"])
          ?? `Deposit Bonus ${index + 1}`;
        const description = getRecordString(source, ["description", "bonus_description"]);
        const amount = getRecordAmount(source, [
          "bonus_amount",
          "reward_amount",
          "amount",
          "deposit_amount",
        ]);
        const createdAt = formatDateLabel(source.created_at);
        const expiresAt = formatDateLabel(source.expires_at);

        return (
          <article
            key={String(item.uuid ?? item.id ?? index)}
            className="rounded-3xl border border-white/10 bg-surface-container-high/70 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">
                  {inferPromotionStatus(source)}
                </p>
                <h4 className="mt-2 text-lg font-headline font-extrabold text-on-surface">
                  {title}
                </h4>
              </div>
              {amount ? (
                <div className="rounded-2xl bg-primary/10 px-4 py-3 text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">
                    Bonus Value
                  </p>
                  <p className="mt-1 text-lg font-headline font-extrabold text-primary">
                    {currency} {amount}
                  </p>
                </div>
              ) : null}
            </div>

            {description ? (
              <p className="mt-3 text-sm leading-6 text-on-surface-variant">{description}</p>
            ) : null}

            {createdAt || expiresAt ? (
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-on-surface-variant">
                {createdAt ? <span>Started {createdAt}</span> : null}
                {expiresAt ? <span>Expires {expiresAt}</span> : null}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

function SpinHistoryList({
  currency,
  items,
}: {
  currency: string;
  items: SabiSpinResult[];
}) {
  return (
    <div className="grid gap-4">
      {items.map((item, index) => {
        const source = item as Record<string, unknown>;
        const title = getRecordString(source, ["reward_name", "name", "title"])
          ?? `Spin Result ${index + 1}`;
        const amount = getRecordAmount(source, ["reward_amount", "amount"]);
        const createdAt = formatDateLabel(source.created_at);

        return (
          <article
            key={String(item.uuid ?? item.id ?? index)}
            className="rounded-3xl border border-white/10 bg-surface-container-high/70 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  {inferPromotionStatus(source)}
                </p>
                <h4 className="mt-2 text-lg font-headline font-extrabold text-on-surface">
                  {title}
                </h4>
              </div>
              {amount ? (
                <div className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    Reward
                  </p>
                  <p className="mt-1 text-lg font-headline font-extrabold text-emerald-200">
                    {currency} {amount}
                  </p>
                </div>
              ) : null}
            </div>

            {createdAt ? (
              <p className="mt-4 text-xs text-on-surface-variant">Recorded {createdAt}</p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

const PromotionsSection = () => {
  const navigate = useNavigate();
  const initQuery = useInit();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useUiStore((s) => s.openAuthModal);
  const openWalletModal = useUiStore((s) => s.openWalletModal);

  const frontendConfiguration = initQuery.data?.frontend_configuration;
  const currency = initQuery.data?.company_info?.currency ?? "ETB";
  const promotionBanners = useMemo(
    () => filterActivePromotionBanners(initQuery.data?.promotion_banners),
    [initQuery.data?.promotion_banners],
  );

  const promotionOrder = useMemo(
    () => resolvePromotionOrder(frontendConfiguration),
    [frontendConfiguration],
  );

  const [selectedPromotion, setSelectedPromotion] = useState<PromotionKey | null>(null);
  const [spinView, setSpinView] = useState<SpinView>("wheel");

  useEffect(() => {
    if (!promotionOrder.length) {
      setSelectedPromotion(null);
      return;
    }

    setSelectedPromotion((current) => (
      current && promotionOrder.includes(current) ? current : promotionOrder[0]
    ));
  }, [promotionOrder]);

  const spinEnabled = isPromotionEnabled(frontendConfiguration, "spin_bonus");
  const depositEnabled = isPromotionEnabled(frontendConfiguration, "deposit_bonus");

  const activeBonusStatusQuery = useActiveBonusStatus(spinEnabled || depositEnabled);
  const memberSpinAwardsQuery = useMemberSpinAwards(spinEnabled);
  const memberSpinConditionsQuery = useMemberSpinConditions(spinEnabled);
  const memberSpinResultsQuery = useMemberSpinResults(spinEnabled);
  const memberDepositBonusesQuery = useMemberDepositBonuses(depositEnabled);

  const spinAwards = useMemo(
    () => toArray(memberSpinAwardsQuery.data),
    [memberSpinAwardsQuery.data],
  );
  const spinConditions = useMemo(
    () => toArray(memberSpinConditionsQuery.data).filter((item) => item.is_active !== false),
    [memberSpinConditionsQuery.data],
  );
  const spinResults = useMemo(
    () => toArray(memberSpinResultsQuery.data),
    [memberSpinResultsQuery.data],
  );
  const depositBonuses = useMemo(
    () => toArray(memberDepositBonusesQuery.data),
    [memberDepositBonusesQuery.data],
  );

  const spinTrackerQueries = useQueries({
    queries: spinConditions.slice(0, 6).map((condition) => ({
      queryKey: ["bonus", "spin-tracker", condition.id],
      queryFn: () => getSpinTracker(condition.id),
      enabled: isAuthenticated && spinEnabled,
      staleTime: 15_000,
    })),
  });

  const spinTrackerByConditionId = useMemo(() => {
    const entries = spinConditions.slice(0, 6).map((condition, index) => [
      condition.id,
      spinTrackerQueries[index]?.data?.active_bet_amount ?? null,
    ] as const);

    return new Map(entries);
  }, [spinConditions, spinTrackerQueries]);

  const promotionCards = useMemo<PromotionCardDefinition[]>(() => {
    return promotionOrder.map((key) => {
      if (key === "deposit_bonus") {
        return {
          key,
          title: "Deposit Bonus",
          eyebrow: "Reload Rewards",
          description: "Track first-deposit and reload offers without leaving the player app.",
          metricLabel: isAuthenticated ? "My bonuses" : "Availability",
          metricValue: isAuthenticated ? String(depositBonuses.length) : "Live",
          accentClassName: "bg-gradient-to-br from-amber-500 to-orange-500",
        };
      }

      return {
        key,
        title: "Bonus Wheel",
        eyebrow: "Spin Rewards",
        description: "Follow spin eligibility, available spins, and previously claimed rewards.",
        metricLabel: isAuthenticated ? "Spins ready" : "Availability",
        metricValue: isAuthenticated ? String(spinAwards.length) : "Live",
        accentClassName: "bg-gradient-to-br from-fuchsia-500 to-violet-500",
      };
    });
  }, [depositBonuses.length, isAuthenticated, promotionOrder, spinAwards.length]);

  const handleLogin = () => openAuthModal();

  const handleDeposit = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    navigate("/wallet");
    openWalletModal("deposit");
  };

  const shortPromotionDescription = frontendConfiguration?.short_promotion_description;

  if (initQuery.isLoading && !initQuery.data) {
    return (
      <div className="rounded-3xl border border-white/10 bg-surface-container-high/70 p-8">
        <div className="flex items-center gap-3 text-on-surface-variant">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          <span>Loading promotions…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {promotionBanners.length > 0 ? (
        <PromotionBannerCarousel banners={promotionBanners} />
      ) : null}

      <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-surface-container-high via-surface-container-high to-surface-container/80 p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/80">
              Promotions
            </p>
            <h2 className="mt-3 text-3xl font-headline font-extrabold tracking-tight text-on-surface md:text-4xl">
              Rewards that are actually actionable
            </h2>
            <p className="mt-3 text-sm leading-6 text-on-surface-variant md:text-base">
              {shortPromotionDescription
                ?? "Track the live promotions Nova currently exposes: deposit bonuses for reload incentives and spin rewards for progression-based prizes."}
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-surface/70 px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
              Feature Status
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {depositEnabled ? (
                <span className="rounded-full bg-amber-500/15 px-3 py-1.5 text-xs font-bold text-amber-200">
                  Deposit Bonus
                </span>
              ) : null}
              {spinEnabled ? (
                <span className="rounded-full bg-fuchsia-500/15 px-3 py-1.5 text-xs font-bold text-fuchsia-200">
                  Spin Bonus
                </span>
              ) : null}
              {!depositEnabled && !spinEnabled ? (
                <span className="rounded-full bg-white/8 px-3 py-1.5 text-xs font-bold text-on-surface-variant">
                  No live promotion features
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {promotionCards.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-2">
          {promotionCards.map((card) => (
            <PromotionOverviewCard
              key={card.key}
              card={card}
              isSelected={selectedPromotion === card.key}
              onClick={() => setSelectedPromotion(card.key)}
            />
          ))}
        </section>
      ) : null}

      {selectedPromotion === "deposit_bonus" ? (
        <section className="space-y-5 rounded-[2rem] border border-white/10 bg-surface-container-high/70 p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-3 text-white shadow-lg">
                  <Coins className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
                    Deposit Bonus
                  </p>
                  <h3 className="mt-1 text-2xl font-headline font-extrabold text-on-surface">
                    First deposit and reload rewards
                  </h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-on-surface-variant">
                The live Nova site treats this as a direct promotion page. In-app, it works better as a clear wallet-adjacent panel with your current eligible bonuses and a deposit shortcut.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDeposit}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-on-primary transition-transform hover:scale-[1.01]"
            >
              Make deposit
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {!isAuthenticated ? (
            <GuestPrompt
              title="Sign in to view your bonus eligibility"
              description="Deposit rewards are personal to the player account, so the section only becomes meaningful after authentication."
              onLogin={handleLogin}
            />
          ) : memberDepositBonusesQuery.isLoading && depositBonuses.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-surface p-6">
              <div className="flex items-center gap-3 text-on-surface-variant">
                <LoaderCircle className="h-5 w-5 animate-spin" />
                <span>Loading deposit bonuses…</span>
              </div>
            </div>
          ) : depositBonuses.length > 0 ? (
            <DepositBonusList currency={currency} items={depositBonuses} />
          ) : (
            <div className="rounded-3xl border border-dashed border-white/15 bg-surface p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-primary/12 p-3 text-primary">
                  <Gift className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-lg font-headline font-extrabold text-on-surface">
                    No active deposit bonus yet
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                    The backend responded successfully but returned an empty bonus list. Keep the section visible and actionable instead of hiding it, because the feature flag is enabled and the player still needs the deposit path.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      ) : null}

      {selectedPromotion === "spin_bonus" ? (
        <section className="space-y-5 rounded-[2rem] border border-white/10 bg-surface-container-high/70 p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-gradient-to-br from-fuchsia-500 to-violet-500 p-3 text-white shadow-lg">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
                    Bonus Wheel
                  </p>
                  <h3 className="mt-1 text-2xl font-headline font-extrabold text-on-surface">
                    Spin progression and reward history
                  </h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-on-surface-variant">
                This mirrors the real product model without inheriting the live site’s broken hard-coded award id. The section is backed by conditions, tracker progress, available spins, and historical spin results.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-surface/70 px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                Current status
              </p>
              <p className="mt-2 text-lg font-headline font-extrabold text-on-surface">
                {activeBonusStatusQuery.data?.spin ? "Active" : "Waiting"}
              </p>
            </div>
          </div>

          {!isAuthenticated ? (
            <GuestPrompt
              title="Sign in to track spins and progress"
              description="Spin rewards are member-specific. Authentication is required before the app can show available spins, active conditions, or reward history."
              onLogin={handleLogin}
            />
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {([
                  ["wheel", "Spin Wheel"],
                  ["active", "Active Bonus"],
                  ["history", "History"],
                ] as const).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSpinView(key)}
                    className={cn(
                      "rounded-full px-4 py-2 text-xs font-bold transition-all",
                      spinView === key
                        ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
                        : "border border-white/10 bg-surface text-on-surface-variant hover:border-primary/30 hover:text-on-surface",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {spinView === "wheel" ? (
                <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                  <div className="rounded-3xl border border-white/10 bg-surface p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                      Spins available
                    </p>
                    <div className="mt-4 flex items-end gap-4">
                      <p className="text-5xl font-headline font-extrabold text-on-surface">
                        {spinAwards.length}
                      </p>
                      <p className="pb-2 text-sm text-on-surface-variant">
                        ready to claim
                      </p>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-on-surface-variant">
                      Available spins come from the member spin-award feed. If the count is zero but an active condition exists, the player is still progressing toward the next unlocked spin.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-surface p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                      Active conditions
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <Trophy className="h-5 w-5 text-primary" />
                      <p className="text-xl font-headline font-extrabold text-on-surface">
                        {spinConditions.length}
                      </p>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-on-surface-variant">
                      {spinConditions.length > 0
                        ? "The next reward is driven by the currently active condition set."
                        : "No active spin condition is assigned to this member right now."}
                    </p>
                  </div>
                </div>
              ) : null}

              {spinView === "active" ? (
                memberSpinConditionsQuery.isLoading && spinConditions.length === 0 ? (
                  <div className="rounded-3xl border border-white/10 bg-surface p-6">
                    <div className="flex items-center gap-3 text-on-surface-variant">
                      <LoaderCircle className="h-5 w-5 animate-spin" />
                      <span>Loading active spin conditions…</span>
                    </div>
                  </div>
                ) : spinConditions.length > 0 ? (
                  <div className="grid gap-4">
                    {spinConditions.map((condition) => (
                      <article
                        key={condition.id}
                        className="rounded-3xl border border-white/10 bg-surface p-5"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                              Active condition
                            </p>
                            <h4 className="mt-2 text-lg font-headline font-extrabold text-on-surface">
                              {condition.name}
                            </h4>
                            <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                              {condition.description
                                ?? "Meet the requirement below to unlock your next bonus wheel spin."}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-primary/10 px-4 py-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">
                              Requirement
                            </p>
                            <p className="mt-1 text-base font-bold text-on-surface">
                              {buildConditionRequirement(condition, currency)}
                            </p>
                          </div>
                        </div>

                        {spinTrackerByConditionId.get(condition.id) ? (
                          <div className="mt-4 rounded-2xl border border-white/8 bg-surface-container-high/60 px-4 py-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                              Progress
                            </p>
                            <p className="mt-1 text-sm font-bold text-on-surface">
                              {spinTrackerByConditionId.get(condition.id)}
                            </p>
                          </div>
                        ) : null}
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-white/15 bg-surface p-6">
                    <h4 className="text-lg font-headline font-extrabold text-on-surface">
                      No active spin conditions
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                      The active bonus status is checked successfully, but the conditions list is empty for this player right now.
                    </p>
                  </div>
                )
              ) : null}

              {spinView === "history" ? (
                memberSpinResultsQuery.isLoading && spinResults.length === 0 ? (
                  <div className="rounded-3xl border border-white/10 bg-surface p-6">
                    <div className="flex items-center gap-3 text-on-surface-variant">
                      <LoaderCircle className="h-5 w-5 animate-spin" />
                      <span>Loading spin history…</span>
                    </div>
                  </div>
                ) : spinResults.length > 0 ? (
                  <SpinHistoryList currency={currency} items={spinResults} />
                ) : (
                  <div className="rounded-3xl border border-dashed border-white/15 bg-surface p-6">
                    <h4 className="text-lg font-headline font-extrabold text-on-surface">
                      No spin history yet
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                      Once the player earns and consumes wheel spins, the member spin-result feed should populate this timeline.
                    </p>
                  </div>
                )
              ) : null}
            </>
          )}
        </section>
      ) : null}
    </div>
  );
};

export default PromotionsSection;

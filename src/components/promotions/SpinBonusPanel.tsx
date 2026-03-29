import { useMemo, useState } from "react";
import { useQueryClient, useQueries } from "@tanstack/react-query";
import {
  CircleAlert,
  Clock3,
  Gift,
  LoaderCircle,
  RefreshCw,
  RotateCw,
  Shield,
} from "lucide-react";
import AppButton from "@/components/ui/AppButton";
import AppTab, { type AppTabItem } from "@/components/ui/AppTab";
import {
  useSpinAwardMutation,
  useSpinAwardRewards,
} from "@/hooks/queries/use-bonus-queries";
import { getSpinTracker } from "@/lib/api-methods/bonus.api";
import { formatBalance, getAxiosErrorMessage } from "@/lib/format";
import { toArray } from "@/lib/payment-utils";
import type {
  SabiSpinAward,
  SabiSpinCondition,
  SabiSpinExecuteResponse,
  SabiSpinResult,
  SabiSpinReward,
} from "@/types/api.types";
import { SpinResultModal } from "@/components/promotions/SpinResultModal";
import { SpinWheel } from "@/components/promotions/SpinWheel";

interface SpinBonusPanelProps {
  currency: string;
  spinAwards: SabiSpinAward[];
  spinConditions: SabiSpinCondition[];
  spinResults: SabiSpinResult[];
  isSpinConditionsLoading: boolean;
  isSpinResultsLoading: boolean;
}

function formatHistoryDate(value: string | undefined): { dayMonth: string; year: string } {
  if (!value) {
    return { dayMonth: "Unknown", year: "" };
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return { dayMonth: "Unknown", year: "" };
  }

  return {
    dayMonth: parsed.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
    }),
    year: parsed.toLocaleDateString(undefined, {
      year: "numeric",
    }),
  };
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

function getHistoryRewardLabel(item: SabiSpinResult, index: number): string {
  return (
    item.reward_display?.trim() ||
    item.reward_name?.trim() ||
    item.reward_type?.trim() ||
    `Spin Result ${index + 1}`
  );
}

function getHistoryRewardAmount(item: SabiSpinResult): string {
  return formatBalance(item.reward_value ?? item.reward_amount ?? 0);
}

function SpinHistoryList({ items }: { items: SabiSpinResult[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-headline font-extrabold text-on-surface">History</h3>

      <div className="grid gap-4">
        {items.map((item, index) => {
          const date = formatHistoryDate(item.created_at);
          const rewardLabel = getHistoryRewardLabel(item, index);
          const amount = getHistoryRewardAmount(item);
          const statusPill = item.reward_display?.trim() || rewardLabel;

          return (
            <article
              key={String(item.uuid ?? item.id ?? index)}
              className="grid grid-cols-[5rem_minmax(0,1fr)_auto_auto] items-center gap-4 rounded-[1.75rem] bg-surface px-5 py-5"
            >
              <div className="text-on-surface-variant">
                <p className="text-lg font-medium leading-none">{date.dayMonth}</p>
                <p className="mt-2 text-lg font-medium leading-none">{date.year}</p>
              </div>

              <p className="truncate text-lg font-medium text-on-surface-variant">
                {rewardLabel}
              </p>

              <p className="text-3xl font-headline font-extrabold text-on-surface">
                {amount}
              </p>

              <span className="rounded-full bg-surface-container-high px-5 py-3 text-base font-semibold text-on-surface-variant">
                {statusPill}
              </span>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function SpinBonusPanel({
  currency,
  spinAwards,
  spinConditions,
  spinResults,
  isSpinConditionsLoading,
  isSpinResultsLoading,
}: SpinBonusPanelProps) {
  const queryClient = useQueryClient();
  const [currentResult, setCurrentResult] = useState<SabiSpinExecuteResponse | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [targetRewardId, setTargetRewardId] = useState<number | null>(null);
  const [isAnimatingSpin, setIsAnimatingSpin] = useState(false);
  const [rewardSnapshot, setRewardSnapshot] = useState<SabiSpinReward[] | null>(null);
  const [wheelResetKey, setWheelResetKey] = useState(0);

  const activeAward = spinAwards[0] ?? null;
  const spinMutation = useSpinAwardMutation();
  const rewardQuery = useSpinAwardRewards(activeAward?.id);

  const liveRewards = useMemo(
    () => toArray(rewardQuery.data).filter((reward) => reward.is_active !== false),
    [rewardQuery.data],
  );

  const displayRewards = rewardSnapshot ?? liveRewards;
  const spinBusy = spinMutation.isPending || isAnimatingSpin;
  const canSpin =
    Boolean(activeAward) &&
    liveRewards.length > 0 &&
    !rewardQuery.isLoading &&
    !rewardQuery.isError &&
    !spinBusy;

  const spinTrackerQueries = useQueries({
    queries: spinConditions.slice(0, 6).map((condition) => ({
      queryKey: ["bonus", "spin-tracker", condition.id],
      queryFn: () => getSpinTracker(condition.id),
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

  const resetSpinResolution = async () => {
    setIsResultOpen(false);
    setCurrentResult(null);
    setTargetRewardId(null);
    setIsAnimatingSpin(false);
    setRewardSnapshot(null);
    setWheelResetKey((value) => value + 1);
    spinMutation.reset();

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["bonus", "spin-awards"] }),
      queryClient.invalidateQueries({ queryKey: ["bonus", "spin-award-rewards"] }),
      queryClient.refetchQueries({
        queryKey: ["bonus", "spin-awards", { is_active: true }],
        type: "active",
      }),
      queryClient.refetchQueries({
        queryKey: ["bonus", "spin-award-rewards"],
        type: "active",
      }),
    ]);
  };

  const handleSpin = () => {
    if (!activeAward || liveRewards.length === 0 || spinBusy) {
      return;
    }

    spinMutation.reset();

    const rewardsSnapshot = liveRewards;
    setRewardSnapshot(rewardsSnapshot);
    setCurrentResult(null);
    setIsResultOpen(false);
    setTargetRewardId(null);

    spinMutation.mutate(activeAward.id, {
      onSuccess: (result) => {
        setCurrentResult(result);

        if (rewardsSnapshot.some((reward) => reward.id === result.id)) {
          setTargetRewardId(result.id);
          setIsAnimatingSpin(true);
          return;
        }

        setIsAnimatingSpin(false);
        setIsResultOpen(true);
      },
      onError: () => {
        setRewardSnapshot(null);
        setCurrentResult(null);
        setTargetRewardId(null);
        setIsAnimatingSpin(false);
      },
    });
  };

  const tabs: AppTabItem[] = [
    {
      key: "wheel",
      name: "Spin Wheel",
      icon: RotateCw,
      content: (
        <div className=" space-y-3 md:space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
            {spinAwards.length} spin{spinAwards.length === 1 ? "" : "s"} remaining
          </div>

          <div className="flex flex-col items-center gap-4 md:gap-8">
            {rewardQuery.isLoading && !displayRewards.length ? (
              <div className="flex min-h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-on-surface-variant">
                  <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                  <p>Loading wheel rewards…</p>
                </div>
              </div>
            ) : rewardQuery.isError ? (
              <div className="flex min-h-96 w-full flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 px-6 text-center">
                <CircleAlert className="h-8 w-8 text-error" />
                <h4 className="mt-4 text-lg font-headline font-extrabold text-on-surface">
                  Wheel configuration could not load
                </h4>
                <p className="mt-2 max-w-md text-sm leading-6 text-on-surface-variant">
                  {getAxiosErrorMessage(rewardQuery.error)}
                </p>
                <AppButton
                  variant="outline"
                  onClick={() => void rewardQuery.refetch()}
                  className="mt-5"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </AppButton>
              </div>
            ) : displayRewards.length > 0 ? (
              <>
                <SpinWheel
                  rewards={displayRewards}
                  targetRewardId={targetRewardId}
                  isSpinning={isAnimatingSpin}
                  resetKey={wheelResetKey}
                  onSpinComplete={() => {
                    setIsAnimatingSpin(false);
                    setIsResultOpen(true);
                  }}
                />

                <div className="flex w-full max-w-md flex-col items-center gap-4">
                  <AppButton
                    onClick={handleSpin}
                    isLoading={spinMutation.isPending}
                    disabled={!canSpin}
                    className="w-full !rounded-full !py-5 text-lg tracking-[0.24em]"
                  >
                    {isAnimatingSpin ? "Spinning..." : "Spin now"}
                  </AppButton>

                  {activeAward?.condition?.name ? (
                    <p className="text-sm text-on-surface-variant">
                      {activeAward.condition.name}
                    </p>
                  ) : null}

                  {!canSpin && !spinMutation.isPending && spinAwards.length === 0 ? (
                    <p className="text-sm text-on-surface-variant">No spins remaining</p>
                  ) : null}

                  {spinMutation.isError ? (
                    <p className="text-center text-sm text-red-200">
                      {getAxiosErrorMessage(spinMutation.error)}
                    </p>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="flex min-h-[24rem] w-full flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-white/15 px-6 text-center">
                <Gift className="h-8 w-8 text-primary" />
                <h4 className="mt-4 text-lg font-headline font-extrabold text-on-surface">
                  No active bonus wheel available
                </h4>
                <p className="mt-2 max-w-md text-sm leading-6 text-on-surface-variant">
                  {activeAward
                    ? "This awarded spin does not currently expose a usable reward list."
                    : "No awarded spin is queued for this player right now."}
                </p>
                <AppButton
                  onClick={handleSpin}
                  disabled
                  className="mt-6 w-full max-w-md !rounded-full !py-5 text-lg tracking-[0.24em]"
                >
                  Spin now
                </AppButton>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "active",
      name: "Active Bonus",
      icon: Shield,
      content:
        isSpinConditionsLoading && spinConditions.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-surface p-6">
            <div className="flex items-center gap-3 text-on-surface-variant">
              <LoaderCircle className="h-5 w-5 animate-spin" />
              <span>Loading active bonus progress…</span>
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
                      Active bonus
                    </p>
                    <h4 className="mt-2 text-lg font-headline font-extrabold text-on-surface">
                      {condition.name}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                      {condition.description
                        ?? "Complete the requirement below to unlock the next spin."}
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
                  <p className="mt-4 text-sm font-semibold text-on-surface-variant">
                    Progress: {spinTrackerByConditionId.get(condition.id)}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/15 bg-surface p-6">
            <h4 className="text-lg font-headline font-extrabold text-on-surface">
              No active bonus yet
            </h4>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant">
              No bonus condition is currently assigned to this player.
            </p>
          </div>
        ),
    },
    {
      key: "history",
      name: "History",
      icon: Clock3,
      content:
        isSpinResultsLoading && spinResults.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-surface p-6">
            <div className="flex items-center gap-3 text-on-surface-variant">
              <LoaderCircle className="h-5 w-5 animate-spin" />
              <span>Loading spin history…</span>
            </div>
          </div>
        ) : spinResults.length > 0 ? (
          <SpinHistoryList items={spinResults} />
        ) : (
          <div className="rounded-3xl border border-dashed border-white/15 bg-surface p-6">
            <h4 className="text-lg font-headline font-extrabold text-on-surface">
              No spin history yet
            </h4>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant">
              Consumed spins and rewards will appear here.
            </p>
          </div>
        ),
    },
  ];

  return (
    <>
      <section className="space-y-4 py-4">
        <AppTab
          items={tabs}
          listClassName="w-full rounded-2xl bg-surface-container-highest/30"
          tabClassName="flex-1 justify-center rounded-xl px-2 md:px-5 py-3 text-xs font-black tracking-widest"
          selectedTabClassName="bg-surface-bright text-primary shadow-2xl border border-primary/20"
          unselectedTabClassName="text-on-surface-variant/60 hover:text-on-surface-variant"
        />
      </section>

      <SpinResultModal
        isOpen={isResultOpen}
        result={currentResult}
        currency={currency}
        hasMoreSpins={spinAwards.length > 0}
        onClose={() => void resetSpinResolution()}
        onTryAgain={() => void resetSpinResolution()}
      />
    </>
  );
}

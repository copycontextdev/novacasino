import { ArrowRight, Coins, Gift, LoaderCircle } from "lucide-react";
import type { SabiDepositBonus } from "@/types/api.types";
import { formatBalance } from "@/lib/format";

interface DepositBonusPanelProps {
  currency: string;
  items: SabiDepositBonus[];
  isLoading: boolean;
  onDeposit: () => void;
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

export function DepositBonusPanel({
  currency,
  items,
  isLoading,
  onDeposit,
}: DepositBonusPanelProps) {
  return (
    <section className="space-y-5 rounded-[2rem] border border-white/10 bg-surface-container-high/70 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-3 text-white shadow-lg">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
              Bonuses
            </p>
            <h3 className="mt-1 text-2xl font-headline font-extrabold text-on-surface">
              Deposit Bonus
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onDeposit}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-on-primary transition-transform hover:scale-[1.01]"
        >
          Make deposit
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {isLoading && items.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-surface p-6">
          <div className="flex items-center gap-3 text-on-surface-variant">
            <LoaderCircle className="h-5 w-5 animate-spin" />
            <span>Loading deposit bonuses…</span>
          </div>
        </div>
      ) : items.length > 0 ? (
        <div className="grid gap-4">
          {items.map((item, index) => {
            const source = item as Record<string, unknown>;
            const title =
              getRecordString(source, ["title", "name", "bonus_name", "promo_name"])
              ?? `Deposit Bonus ${index + 1}`;
            const description = getRecordString(source, [
              "description",
              "bonus_description",
            ]);
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
                className="rounded-3xl border border-white/10 bg-surface p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">
                      {inferPromotionStatus(source)}
                    </p>
                    <h4 className="mt-2 text-lg font-headline font-extrabold text-on-surface">
                      {title}
                    </h4>
                    {description ? (
                      <p className="mt-3 text-sm leading-6 text-on-surface-variant">
                        {description}
                      </p>
                    ) : null}
                  </div>

                  {amount ? (
                    <div className="rounded-2xl bg-primary/10 px-4 py-3 text-right">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">
                        Bonus value
                      </p>
                      <p className="mt-1 text-lg font-headline font-extrabold text-primary">
                        {currency} {amount}
                      </p>
                    </div>
                  ) : null}
                </div>

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
      ) : (
        <div className="rounded-3xl border border-dashed border-white/15 bg-surface p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/12 text-primary">
            <Gift className="h-6 w-6" />
          </div>
          <h4 className="mt-4 text-lg font-headline font-extrabold text-on-surface">
            No deposit bonus available yet
          </h4>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">
            Make a qualifying deposit when you are ready. This page will stay clean until a live bonus is assigned to the player.
          </p>
        </div>
      )}
    </section>
  );
}

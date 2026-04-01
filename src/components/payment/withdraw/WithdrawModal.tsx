import React, { useEffect, useMemo, useState } from "react";
import { CheckCircleIcon, Loader2, RefreshCw } from "lucide-react";
import { Radio, RadioGroup } from "@headlessui/react";
import type { NovaUserBankInfo } from "@/types/api.types";
import { formatBalance } from "@/lib/format";
import { getWithdrawalAmountError } from "@/lib/payment-validation";
import AppModal from "@/components/ui/AppModal";

interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
  userBanks: NovaUserBankInfo[];
  withdrawable?: string | number;
  currencyLabel: string;
  minWithdraw: number;
  maxWithdraw: number;
  isLoadingBanks?: boolean;
  hasBankLoadError?: boolean;
  onRefreshBanks?: () => void;
  initialSelectedBankUuid?: string | null;
  isSubmitting: boolean;
  onSubmit: (amount: string, bankUuid: string) => void;
  onAddAccount: () => void;
}

const WithdrawModal = ({
  open,
  onClose,
  userBanks,
  withdrawable,
  currencyLabel,
  minWithdraw,
  maxWithdraw,
  isLoadingBanks = false,
  hasBankLoadError = false,
  onRefreshBanks,
  initialSelectedBankUuid,
  isSubmitting,
  onSubmit,
  onAddAccount,
}: WithdrawModalProps) => {
  const [amount, setAmount] = useState("");
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (!open) {
      setAmount("");
      setSelected("");
    }
  }, [open]);

  useEffect(() => {
    if (!open || userBanks.length === 0) return;
    const fallbackUuid = initialSelectedBankUuid ?? userBanks[0]?.uuid ?? "";
    const hasSelected = userBanks.some((bank) => bank.uuid === selected);
    if (!hasSelected && fallbackUuid) setSelected(fallbackUuid);
  }, [initialSelectedBankUuid, open, selected, userBanks]);

  const amountError = useMemo(
    () => getWithdrawalAmountError(amount, minWithdraw, maxWithdraw, withdrawable, currencyLabel),
    [amount, currencyLabel, maxWithdraw, minWithdraw, withdrawable],
  );
  const canSubmit = !!amount && !!selected && !amountError && !isSubmitting;

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Withdraw"
      description={`Available: ${currencyLabel} ${withdrawable != null ? formatBalance(withdrawable) : "—"} · Limits: ${currencyLabel} ${minWithdraw} – ${maxWithdraw}`}
      isLoading={isSubmitting}
    >
      <div className="flex flex-col gap-3">
        <input
          type="number"
          className="w-full bg-surface-container-high rounded-2xl py-3 px-4 border border-white/5"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {amountError && (
          <p className="text-sm font-medium text-error">{amountError}</p>
        )}

        {isLoadingBanks ? (
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-on-surface-variant">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Loading your bank accounts…</span>
          </div>
        ) : hasBankLoadError ? (
          <div className="rounded-2xl border border-error/30 bg-error/10 p-4">
            <p className="text-sm font-medium text-error">Could not load your saved bank accounts.</p>
            {onRefreshBanks && (
              <button
                type="button"
                onClick={onRefreshBanks}
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-on-surface"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry
              </button>
            )}
          </div>
        ) : userBanks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4">
            <p className="text-sm font-medium text-on-surface">No bank accounts found.</p>
            <p className="mt-1 text-xs text-on-surface-variant">
              Add a bank account first to request a withdrawal.
            </p>
          </div>
        ) : (
          <RadioGroup
            by="uuid"
            value={userBanks.find((b) => b.uuid === selected) || null}
            onChange={(b) => b && setSelected(b.uuid)}
            aria-label="Player account selection"
            className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide"
          >
            {userBanks.map((b) => (
              <Radio
                key={b.uuid}
                value={b}
                className="group relative flex cursor-pointer rounded-lg bg-white/5 px-4 py-4 text-white shadow-md transition focus:not-data-focus:outline-none data-checked:bg-white/10 data-focus:outline data-focus:outline-white"
              >
                <div className="flex w-full items-center justify-between">
                  <div className="text-sm/6">
                    <div className="flex flex-col gap-0.5 text-on-surface-variant">
                      <p>{b.bank_name ?? "Bank account"}</p>
                      <p className="font-semibold text-white">{b.account_name}</p>
                      <p>{b.account_number}</p>
                    </div>
                  </div>
                  <CheckCircleIcon className="size-6 text-secondary opacity-0 transition group-data-checked:opacity-100" />
                </div>
              </Radio>
            ))}
          </RadioGroup>
        )}

        <button
          type="button"
          onClick={onAddAccount}
          className="w-full py-2 text-xs font-bold text-primary border border-dashed border-white/20 rounded-2xl"
        >
          + Add bank account
        </button>

        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => onSubmit(amount, selected)}
          className="w-full py-4 rounded-full bg-gradient-to-r from-secondary to-primary-dim text-white font-extrabold disabled:opacity-50"
        >
          {isSubmitting ? "…" : "Confirm withdrawal"}
        </button>
      </div>
    </AppModal>
  );
};

export default WithdrawModal;

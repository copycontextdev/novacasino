/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import type { SabiUserBankInfo } from "@/types/api.types";
import { formatBalance } from "@/lib/format";
import { getWithdrawalAmountError } from "@/lib/payment-validation";

interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
  userBanks: SabiUserBankInfo[];
  withdrawable?: string | number;
  currencyLabel: string;
  minWithdraw: number;
  maxWithdraw: number;
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

  const amountError = useMemo(
    () => getWithdrawalAmountError(amount, minWithdraw, maxWithdraw, withdrawable, currencyLabel),
    [amount, currencyLabel, maxWithdraw, minWithdraw, withdrawable],
  );
  const canSubmit = !!amount && !!selected && !amountError && !isSubmitting;

  if (!open) return null;
  return (
    <motion.div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <motion.div className="relative w-full max-w-md bg-surface-container rounded-3xl border border-white/10 p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-headline font-extrabold">Withdraw</h2>
          <button type="button" onClick={onClose}>
            <X />
          </button>
        </div>
        <p className="text-xs text-on-surface-variant mb-2">
          Available: {currencyLabel} {withdrawable != null ? formatBalance(withdrawable) : "—"}
        </p>
        <p className="text-xs text-on-surface-variant mb-3">
          Limits: {currencyLabel} {minWithdraw} - {maxWithdraw}
        </p>
        <input
          type="number"
          className="w-full bg-surface-container-high rounded-2xl py-3 px-4 mb-3 border border-white/5"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {amountError ? (
          <p className="mb-3 text-sm font-medium text-error">{amountError}</p>
        ) : null}
        <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
          {userBanks.map((b) => (
            <button
              key={b.uuid}
              type="button"
              onClick={() => setSelected(b.uuid)}
              className={`w-full p-3 rounded-2xl border text-left ${
                selected === b.uuid ? "border-primary bg-primary/10" : "border-white/10 bg-white/5"
              }`}
            >
              <div className="font-bold text-sm">{b.account_name}</div>
              <div className="text-[10px] text-on-surface-variant">{b.account_number}</div>
            </button>
          ))}
        </div>
        <button type="button" onClick={onAddAccount} className="w-full py-2 mb-3 text-xs font-bold text-primary border border-dashed border-white/20 rounded-2xl">
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
      </motion.div>
    </motion.div>
  );
};

export default WithdrawModal;

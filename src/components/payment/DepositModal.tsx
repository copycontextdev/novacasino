/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import type { SabiPaymentBank, SabiAgentBankInfo } from "@/types/api.types";
import DepositSelectionCard from "./deposit/DepositSelectionCard";

interface DepositModalProps {
  open: boolean;
  onClose: () => void;
  currencyLabel: string;
  minDeposit: number;
  maxDeposit: number;
  depositBanks: SabiPaymentBank[];
  bankInfoOptions: SabiAgentBankInfo[];
  amountValue: string;
  onAmountChange: (v: string) => void;
  selectedBankUuid: string;
  onBankChange: (v: string) => void;
  selectedBankInfoUuid: string;
  onBankInfoChange: (v: string) => void;
  isCreating: boolean;
  onCreate: () => void;
}

const DepositModal = ({
  open,
  onClose,
  currencyLabel,
  minDeposit,
  maxDeposit,
  depositBanks,
  bankInfoOptions,
  amountValue,
  onAmountChange,
  selectedBankUuid,
  onBankChange,
  selectedBankInfoUuid,
  onBankInfoChange,
  isCreating,
  onCreate,
}: DepositModalProps) => {
  if (!open) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-surface-container rounded-3xl overflow-hidden border border-white/10 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-headline font-extrabold">Deposit</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-[10px] text-on-surface-variant font-bold uppercase">
            Limits: {currencyLabel} {minDeposit} – {maxDeposit}
          </p>
          <label className="block space-y-1">
            <span className="text-[10px] font-bold uppercase text-on-surface-variant">Amount</span>
            <input
              type="number"
              className="w-full bg-surface-container-high rounded-2xl py-3 px-4 text-on-surface border border-white/5"
              value={amountValue}
              onChange={(e) => onAmountChange(e.target.value)}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-[10px] font-bold uppercase text-on-surface-variant">Bank</span>
            <select
              className="w-full bg-surface-container-high rounded-2xl py-3 px-4 text-on-surface border border-white/5"
              value={selectedBankUuid}
              onChange={(e) => onBankChange(e.target.value)}
            >
              <option value="">Select bank</option>
              {depositBanks.map((b) => (
                <option key={b.uuid} value={b.uuid}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-[10px] font-bold uppercase text-on-surface-variant">Receiving account</span>
            <select
              className="w-full bg-surface-container-high rounded-2xl py-3 px-4 text-on-surface border border-white/5"
              value={selectedBankInfoUuid}
              onChange={(e) => onBankInfoChange(e.target.value)}
            >
              <option value="">Select account</option>
              {bankInfoOptions.map((info) => (
                <option key={info.uuid} value={info.uuid}>
                  {info.account_name} — {info.account_number}
                </option>
              ))}
            </select>
          </label>

          <DepositSelectionCard 
          account_name=""
          account_number=""
          bank_name=""
          amount=""
          />
          <button
            type="button"
            disabled={isCreating}
            onClick={onCreate}
            className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-extrabold disabled:opacity-50"
          >
            {isCreating ? "Creating…" : "Create deposit order"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DepositModal;

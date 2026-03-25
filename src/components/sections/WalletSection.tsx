/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Loader2, FileUp } from "lucide-react";
import { formatBalance } from "@/lib/format";
import type { SabiDepositOrder, SabiWithdrawalOrder, SabiAmount } from "@/types/api.types";
import DepositTabContent from "../payment/deposit/DepositTabContent";

interface WalletSectionProps {
  isAuthenticated: boolean;
  onLoginClick: () => void;
  walletBalance: SabiAmount | null;
  nonWithdrawableBalance: SabiAmount | null;
  withdrawableBalance: SabiAmount | null;
  currencyLabel: string;
  onDepositClick: () => void;
  onWithdrawClick: () => void;
  deposits: SabiDepositOrder[];
  withdrawals: SabiWithdrawalOrder[];
  isDepositsLoading: boolean;
  isWithdrawalsLoading: boolean;
  onConfirmDeposit: (order: SabiDepositOrder) => void;
}

const WalletSection = ({
  isAuthenticated,
  onLoginClick,
  walletBalance,
  nonWithdrawableBalance,
  withdrawableBalance,
  currencyLabel,
  onDepositClick,
  onWithdrawClick,
  deposits,
  withdrawals,
  isDepositsLoading,
  isWithdrawalsLoading,
  onConfirmDeposit,
}: WalletSectionProps) => {
  const [subTab, setSubTab] = useState<"deposits" | "withdrawals">("deposits");

  if (!isAuthenticated) {
    return (
      <div className="text-center py-16">
        <p className="text-on-surface-variant font-bold mb-4">Login to view your wallet</p>
        <button
          type="button"
          onClick={onLoginClick}
          className="rounded-full bg-gradient-to-r from-primary to-primary-dim px-6 py-3 text-on-primary font-bold"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <section className="bg-surface-container-high rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-white/5">
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center justify-center border-r border-white/10 py-2">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Total</span>
            <span className="text-lg font-extrabold text-primary">
              {walletBalance != null ? `${currencyLabel} ${formatBalance(walletBalance)}` : "—"}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center border-r border-white/10 py-2">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Bonus</span>
            <span className="text-lg font-extrabold text-tertiary">
              {nonWithdrawableBalance != null
                ? formatBalance(nonWithdrawableBalance)
                : "—"}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center py-2">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Withdrawable</span>
            <span className="text-lg font-extrabold text-secondary">
              {withdrawableBalance != null ? formatBalance(withdrawableBalance) : "—"}
            </span>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onDepositClick}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold py-3.5 rounded-2xl"
          >
            <ArrowDownLeft className="w-4 h-4" />
            Deposit
          </button>
          <button
            type="button"
            onClick={onWithdrawClick}
            className="flex-1 flex items-center justify-center gap-2 bg-surface-bright border border-primary/20 text-primary font-bold py-3.5 rounded-2xl"
          >
            <ArrowUpRight className="w-4 h-4" />
            Withdraw
          </button>
        </div>
      </section>
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-headline font-extrabold tracking-tight">History</h2>
          <div className="flex bg-surface-container-low p-1 rounded-full border border-white/5">
            <button
              type="button"
              onClick={() => setSubTab("deposits")}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase rounded-full ${
                subTab === "deposits" ? "bg-primary text-on-primary" : "text-on-surface-variant"
              }`}
            >
              Deposits
            </button>
            <button
              type="button"
              onClick={() => setSubTab("withdrawals")}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase rounded-full ${
                subTab === "withdrawals" ? "bg-primary text-on-primary" : "text-on-surface-variant"
              }`}
            >
              Withdrawals
            </button>
          </div>
        </div>
        {subTab === "deposits" ? (
          <DepositTabContent
          deposits={deposits}
          isDepositsLoading={isDepositsLoading}
          onConfirmDeposit={onConfirmDeposit}
          />
        ) : (
          <div className="space-y-3">
            {isWithdrawalsLoading ? (
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            ) : withdrawals.length === 0 ? (
              <p className="text-center text-on-surface-variant py-8">No withdrawals yet</p>
            ) : (
              withdrawals.map((item) => (
                <div
                  key={item.uuid ?? String(item.amount)}
                  className="bg-surface-container rounded-2xl p-4 flex items-center justify-between border border-white/5"
                >
                  <div>
                    <p className="font-bold text-sm">Withdrawal</p>
                    <p className="text-[10px] text-on-surface-variant">
                      {item.created_at ? new Date(item.created_at).toLocaleString() : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-headline font-bold text-secondary">-{formatBalance(item.amount ?? 0)}</p>
                    <p className="text-[10px] text-on-surface-variant">{item.status_display ?? item.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default WalletSection;

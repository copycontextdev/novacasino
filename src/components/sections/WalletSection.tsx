/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Loader2, FileUp } from "lucide-react";
import { formatBalance } from "@/lib/format";
import type { SabiDepositOrder, SabiWithdrawalOrder, SabiAmount } from "@/types/api.types";
import DepositTabContent from "../payment/deposit/DepositTabContent";
import WithdrawTabContent from "../payment/withdraw/WithdrawTabContent";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

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
  onCancelDeposit: (orderUuid: string) => Promise<void>;
  onCancelWithdrawal: (orderUuid: string) => Promise<void>;
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
  onCancelDeposit,
  onCancelWithdrawal,
}: WalletSectionProps) => {
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
              {walletBalance != null ? `${formatBalance(walletBalance)}` : "—"}
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
      </section>

      <section className="space-y-4">
        <TabGroup>
          <TabList className="flex bg-surface-container-highest/30 p-1.5 rounded-2xl border border-white/10 w-full backdrop-blur-md">
            <Tab
              className="flex-1 px-4 py-3 text-xs font-black uppercase tracking-widest rounded-xl focus:outline-none data-[selected]:bg-surface-bright data-[selected]:text-primary data-[selected]:shadow-2xl data-[selected]:border data-[selected]:border-primary/20 text-on-surface-variant/60 hover:text-on-surface-variant transition-all duration-300"
            >
              Deposits
            </Tab>
            <Tab
              className="flex-1 px-4 py-3 text-xs font-black uppercase tracking-widest rounded-xl focus:outline-none data-[selected]:bg-surface-bright data-[selected]:text-primary data-[selected]:shadow-2xl data-[selected]:border data-[selected]:border-primary/20 text-on-surface-variant/60 hover:text-on-surface-variant transition-all duration-300"
            >
              Withdrawals
            </Tab>
          </TabList>

          <TabPanels className="mt-8">
            <TabPanel>
              <DepositTabContent
                deposits={deposits}
                isDepositsLoading={isDepositsLoading}
                onConfirmDeposit={onConfirmDeposit}
                onCancelDeposit={onCancelDeposit}
                onDepositClick={onDepositClick}
              />
            </TabPanel>
            <TabPanel>
              <WithdrawTabContent
                withdrawals={withdrawals}
                isWithdrawalsLoading={isWithdrawalsLoading}
                onCancelWithdrawal={onCancelWithdrawal}
                onWithdrawClick={onWithdrawClick}
              />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </section>
    </div>
  );
};

export default WalletSection;

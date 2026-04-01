/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useBalanceStore } from "@/store/balance-store";
import { useUiStore } from "@/store/ui-store";
import { useInit } from "@/hooks/queries/use-init";
import {
  useMyDepositOrders,
  useMyWithdrawalOrders,
  useUserBankInfoList,
} from "@/hooks/queries/use-payment-queries";
import { useWallet } from "@/hooks/queries/use-wallet";
import {
  useUpdateDeposit,
  useCancelDeposit,
} from "@/hooks/mutations/use-deposit";
import {
  useCreateWithdrawal,
  useCancelWithdrawal,
} from "@/hooks/mutations/use-withdrawal";
import { formatBalance } from "@/lib/format";
import { toArray, toPositiveNumber } from "@/lib/payment-utils";
import type {
  NovaDepositOrder,
  NovaUserBankInfo,
} from "@/types/api.types";
import DepositConfirmationModal from "../payment/deposit/DepositConfirmationModal";
import DepositTabContent from "../payment/deposit/DepositTabContent";
import WithdrawModal from "../payment/withdraw/WithdrawModal";
import WithdrawTabContent from "../payment/withdraw/WithdrawTabContent";
import AddAccountModal from "../profile/AddAccountModal";
import AppTab from "../ui/AppTab";

const WalletSection = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useUiStore((s) => s.openAuthModal);
  const walletModal = useUiStore((s) => s.walletModal);
  const openWalletModal = useUiStore((s) => s.openWalletModal);
  const closeWalletModal = useUiStore((s) => s.closeWalletModal);
  const walletBalance = useBalanceStore((s) => s.balance);
  const currency = useBalanceStore((s) => s.currency);
  const withdrawableBalance = useBalanceStore((s) => s.withdrawableBalance);
  const nonWithdrawableBalance = useBalanceStore((s) => s.nonWithdrawableBalance);

  const initQuery = useInit();
  const walletQuery = useWallet();
  const depositsQuery = useMyDepositOrders();
  const withdrawalsQuery = useMyWithdrawalOrders();
  const userBanksQuery = useUserBankInfoList();
  const updateDeposit = useUpdateDeposit();
  const cancelDeposit = useCancelDeposit();
  const createWithdrawal = useCreateWithdrawal();
  const cancelWithdrawal = useCancelWithdrawal();

  const [preferredWithdrawBankUuid, setPreferredWithdrawBankUuid] = useState<string | null>(null);
  const [confirmOrder, setConfirmOrder] = useState<NovaDepositOrder | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);

  const currencyLabel = initQuery.data?.company_info?.currency ?? currency ?? "ETB";
  const minWithdraw = toPositiveNumber(initQuery.data?.system_config?.min_withdraw_amount, 50);
  const maxWithdraw = toPositiveNumber(initQuery.data?.system_config?.max_withdraw_amount, 1_000_000);

  const withdrawModalOpen = isAuthenticated && walletModal === "withdraw";
  const deposits = depositsQuery.data?.results ?? [];
  const withdrawals = withdrawalsQuery.data?.results ?? [];
  const userBanks = useMemo(
    () => toArray<NovaUserBankInfo>(userBanksQuery.data),
    [userBanksQuery.data],
  );

  const closeWithdrawModal = () => {
    closeWalletModal();
  };

  React.useEffect(() => {
    if (!withdrawModalOpen) {
      return;
    }

    void userBanksQuery.refetch();
  }, [userBanksQuery, withdrawModalOpen]);

  if (!isAuthenticated) {
    return (
      <div className="text-center py-16">
        <p className="text-on-surface-variant font-bold mb-4">Login to view your wallet</p>
        <button
          type="button"
          onClick={() => openAuthModal()}
          className="rounded-full bg-gradient-to-r from-primary to-primary-dim px-6 py-3 text-on-primary font-bold"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 max-w-2xl mx-auto">
        <section className="bg-surface-container-high rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-white/5">
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center justify-center border-r border-white/10 py-2">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Total</span>
              <span className="text-lg font-extrabold text-primary">
                {walletBalance != null ? formatBalance(walletBalance) : "—"}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center border-r border-white/10 py-2">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Bonus</span>
              <span className="text-lg font-extrabold text-tertiary">
                {nonWithdrawableBalance != null ? formatBalance(nonWithdrawableBalance) : "—"}
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
          <AppTab
            items={[
              {
                key: "deposits",
                name: "Deposits",
                content: (
                  <DepositTabContent
                    deposits={deposits}
                    isDepositsLoading={depositsQuery.isLoading}
                    onConfirmDeposit={(order) => {
                      setConfirmOrder(order);
                      setIsConfirmModalOpen(true);
                    }}
                    onCancelDeposit={async (uuid) => {
                      await cancelDeposit.mutateAsync(uuid, {
                        onSuccess: () => {
                          depositsQuery.refetch();
                          walletQuery.refetch();
                        },
                      });
                    }}
                  />
                ),
              },
              {
                key: "withdrawals",
                name: "Withdrawals",
                content: (
                  <WithdrawTabContent
                    withdrawals={withdrawals}
                    isWithdrawalsLoading={withdrawalsQuery.isLoading}
                    onCancelWithdrawal={async (uuid) => {
                      await cancelWithdrawal.mutateAsync(uuid, {
                        onSuccess: () => {
                          withdrawalsQuery.refetch();
                          walletQuery.refetch();
                        },
                      });
                    }}
                    onWithdrawClick={() => openWalletModal("withdraw")}
                  />
                ),
              },
            ]}
            listClassName="w-full rounded-2xl bg-surface-container-highest/30"
            tabClassName="flex-1 justify-center rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest"
            selectedTabClassName="bg-surface-bright text-primary shadow-2xl border border-primary/20"
            unselectedTabClassName="text-on-surface-variant/60 hover:text-on-surface-variant"
            panelsClassName="mt-8"
          />
        </section>
      </div>

      <DepositConfirmationModal
        open={isConfirmModalOpen}
        order={confirmOrder}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setConfirmOrder(null);
        }}
        isSubmitting={updateDeposit.isPending}
        onCancel={async (uuid) => {
          await cancelDeposit.mutateAsync(uuid, {
            onSuccess: () => {
              setIsConfirmModalOpen(false);
              setConfirmOrder(null);
              depositsQuery.refetch();
            },
          });
        }}
        onSubmit={(reference, file) => {
          if (!confirmOrder?.uuid) return;
          updateDeposit.mutate(
            { uuid: confirmOrder.uuid, body: { reference_number: reference, receipt: file ?? undefined } },
            {
              onSuccess: () => {
                setIsConfirmModalOpen(false);
                setConfirmOrder(null);
                walletQuery.refetch();
                depositsQuery.refetch();
              },
            },
          );
        }}
      />

      <WithdrawModal
        open={withdrawModalOpen}
        onClose={closeWithdrawModal}
        userBanks={userBanks}
        withdrawable={withdrawableBalance ?? undefined}
        currencyLabel={currencyLabel}
        minWithdraw={minWithdraw}
        maxWithdraw={maxWithdraw}
        isLoadingBanks={userBanksQuery.isLoading && userBanks.length === 0}
        hasBankLoadError={userBanksQuery.isError}
        onRefreshBanks={() => {
          void userBanksQuery.refetch();
        }}
        initialSelectedBankUuid={preferredWithdrawBankUuid}
        isSubmitting={createWithdrawal.isPending}
        onSubmit={(amount, bankUuid) => {
          createWithdrawal.mutate(
            { amount, bank_info_id: bankUuid },
            {
              onSuccess: () => {
                closeWithdrawModal();
                walletQuery.refetch();
                withdrawalsQuery.refetch();
              },
            },
          );
        }}
        onAddAccount={() => {
          closeWithdrawModal();
          setIsAddAccountModalOpen(true);
        }}
      />

      <AddAccountModal
        open={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        onSuccess={(account) => {
          setPreferredWithdrawBankUuid(account.uuid);
          setIsAddAccountModalOpen(false);
          void userBanksQuery.refetch();
          openWalletModal("withdraw");
        }}
      />
    </>
  );
};

export default WalletSection;

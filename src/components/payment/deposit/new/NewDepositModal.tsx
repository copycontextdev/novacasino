import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { useBalanceStore } from "@/store/balance-store";
import { useInit } from "@/hooks/queries/use-init";
import {
  useMyDepositOrders,
  useUserBankInfoList,
} from "@/hooks/queries/use-payment-queries";
import { useWallet } from "@/hooks/queries/use-wallet";
import {
  useCreateDeposit,
  useUpdateDeposit,
  useCancelDeposit,
} from "@/hooks/mutations/use-deposit";
import { getAgentBanks, getAgentBankInfo } from "@/lib/api-methods/payment.api";
import { extractEnvelopeData, toArray, toPositiveNumber } from "@/lib/payment-utils";
import { getDepositAmountError } from "@/lib/payment-validation";
import type {
  SabiDepositOrder,
  SabiPaymentBank,
} from "@/types/api.types";
import DepositModal from "../DepositModal";
import DepositConfirmationModal from "../DepositConfirmationModal";
import AppButton from "@/components/ui/AppButton";
import { ArrowDownLeft } from "lucide-react";
import { useUiStore } from "@/store/ui-store";


interface NewDepositModalProps {
  buttonVariant?: "primary" | "secondary";
  className?: string;
}

export default function NewDepositModal({ buttonVariant = "primary", className }: NewDepositModalProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useUiStore((s) => s.openAuthModal);
  const currency = useBalanceStore((s) => s.currency);

  // Modal states
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmOrder, setConfirmOrder] = useState<SabiDepositOrder | null>(null);

  // Form states
  const [depositAmount, setDepositAmount] = useState("");
  const [selectedBankUuid, setSelectedBankUuid] = useState("");
  const [selectedBankInfoUuid, setSelectedBankInfoUuid] = useState("");

  const initQuery = useInit();
  const walletQuery = useWallet();
  const depositsQuery = useMyDepositOrders();
  const createDeposit = useCreateDeposit();
  const updateDeposit = useUpdateDeposit();
  const cancelDeposit = useCancelDeposit();

  const currencyLabel = initQuery.data?.company_info?.currency ?? currency ?? "ETB";
  const minDeposit = toPositiveNumber(initQuery.data?.system_config?.min_deposit_amount, 50);
  const maxDeposit = toPositiveNumber(initQuery.data?.system_config?.max_deposit_amount, 1_000_000);

  const depositBanksQuery = useQuery({
    queryKey: ["deposit-modal-banks"],
    queryFn: () => getAgentBanks({ type: "deposit" }),
    enabled: isOpen,
    staleTime: 60_000,
  });

  const depositBanks = useMemo(
    () => toArray<SabiPaymentBank>(depositBanksQuery.data),
    [depositBanksQuery.data],
  );

  const depositAmountNumber = Number(depositAmount);
  const bankInfoQuery = useQuery({
    queryKey: ["deposit-modal-bank-info", selectedBankUuid, depositAmountNumber],
    queryFn: () => getAgentBankInfo(selectedBankUuid, { amount: depositAmount }),
    enabled:
      isOpen &&
      !!selectedBankUuid &&
      Number.isFinite(depositAmountNumber) &&
      depositAmountNumber > 0,
    staleTime: 15_000,
  });

  const bankInfoOptions = useMemo(
    () => bankInfoQuery.data?.results ?? [],
    [bankInfoQuery.data?.results],
  );

  const effectiveBankInfoUuid = useMemo(() => {
    if (
      selectedBankInfoUuid &&
      bankInfoOptions.some((item) => item.uuid === selectedBankInfoUuid)
    ) {
      return selectedBankInfoUuid;
    }
    return bankInfoOptions[0]?.uuid ?? "";
  }, [bankInfoOptions, selectedBankInfoUuid]);

  const depositAmountError = useMemo(
    () => getDepositAmountError(depositAmount, minDeposit, maxDeposit, currencyLabel),
    [currencyLabel, depositAmount, maxDeposit, minDeposit],
  );

  const canCreateDeposit =
    !depositAmountError && !!selectedBankUuid && !!effectiveBankInfoUuid && !createDeposit.isPending;

  const open = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setDepositAmount("");
    setSelectedBankUuid("");
    setSelectedBankInfoUuid("");
  };

  return (
    <>
      <AppButton
        onClick={open}
        variant={"primary"}
        className={className}
      >
        <ArrowDownLeft className="w-5 h-5 stroke-3" />
        <span className="text-xs uppercase tracking-wider">Deposit</span>
      </AppButton> 
      <DepositModal
        open={isOpen}
        onClose={close}
        currencyLabel={currencyLabel}
        minDeposit={minDeposit}
        maxDeposit={maxDeposit}
        depositBanks={depositBanks}
        bankInfoOptions={bankInfoOptions}
        amountValue={depositAmount}
        onAmountChange={setDepositAmount}
        selectedBankUuid={selectedBankUuid}
        onBankChange={(id) => {
          setSelectedBankUuid(id);
          setSelectedBankInfoUuid("");
        }}
        selectedAgentBankUuid={effectiveBankInfoUuid}
        onBankInfoChange={setSelectedBankInfoUuid}
        isCreating={createDeposit.isPending}
        isLoadingBankInfo={bankInfoQuery.isFetching}
        amountError={depositAmountError}
        canCreate={canCreateDeposit}
        onCreate={() => {
          if (!canCreateDeposit) return;
          createDeposit.mutate(
            { amount: depositAmount, agent_bank_info_id: effectiveBankInfoUuid },
            {
              onSuccess: (res) => {
                const order = extractEnvelopeData<SabiDepositOrder>(res);
                if (order) {
                  close();
                  setConfirmOrder(order);
                  setIsConfirmModalOpen(true);
                }
                depositsQuery.refetch();
              },
            },
          );
        }}
      />

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
    </>
  );
}


 
 

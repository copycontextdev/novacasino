import React from "react";
import {
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import type { NovaPaymentBank, NovaAgentBankInfo } from "@/types/api.types";
import { DepositOrderPreviewInfo } from "@/types/app.types";
import { useMemo } from "react";
import AgentAccountSelectGroup from "./AgentAccountSelectGroup";
import clsx from "clsx";
import AppButton from "@/components/ui/AppButton";
import AppModal from "@/components/ui/AppModal";

interface DepositModalProps {
  open: boolean;
  onClose: () => void;
  currencyLabel: string;
  minDeposit: number;
  maxDeposit: number;
  depositBanks: NovaPaymentBank[];
  bankInfoOptions: NovaAgentBankInfo[];
  amountValue: string;
  onAmountChange: (v: string) => void;
  selectedBankUuid: string;
  onBankChange: (v: string) => void;
  selectedAgentBankUuid: string;
  onBankInfoChange: (v: string) => void;
  isCreating: boolean;
  isLoadingBankInfo?: boolean;
  amountError?: string | null;
  canCreate?: boolean;
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
  selectedAgentBankUuid,
  onBankInfoChange,
  isCreating,
  isLoadingBankInfo,
  amountError,
  canCreate = true,
  onCreate,
}: DepositModalProps) => {
  const previewData = useMemo(() => {
    if (!selectedBankUuid || !selectedAgentBankUuid || !amountValue || !depositBanks || !bankInfoOptions) {
      return null;
    }
    const selectedAccount = bankInfoOptions.find((b) => b.uuid === selectedAgentBankUuid);
    if (!selectedAccount) return null;
    const selectedBankInfo = depositBanks.find((b) => b.uuid === selectedBankUuid);
    if (!selectedBankInfo) return null;

    const info: DepositOrderPreviewInfo = {
      account_name: selectedAccount.account_name ?? "",
      account_number: selectedAccount.account_number ?? "",
      amount: amountValue,
      bank_name: selectedBankInfo.name ?? "",
    };
    return info;
  }, [selectedBankUuid, selectedAgentBankUuid, amountValue, depositBanks, bankInfoOptions]);

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Create deposit"
      description="Choose amount, payment bank, and agent bank account."
      isLoading={isCreating}
      headerExtra={
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary/80 mb-1">
          Step 1 of 2
        </p>
      }
    >
      <Fieldset className="space-y-6">
        <Legend className="text-[10px] text-on-surface-variant font-bold uppercase mb-4">
          Limits: {currencyLabel} {minDeposit} – {maxDeposit}
        </Legend>

        <Field>
          <Label className="text-sm font-medium text-white">Amount</Label>
          <Input
            min={minDeposit}
            max={maxDeposit}
            step={10}
            type="number"
            className={clsx(
              "mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-3 text-sm text-white outline-none",
              "focus:ring-2 focus:ring-primary/40",
            )}
            value={amountValue}
            onChange={(e) => onAmountChange(e.target.value)}
          />
        </Field>

        <Field>
          <Label className="text-sm font-medium text-white">Select Bank & Account</Label>
          <div className="mt-3">
            <TabGroup
              selectedIndex={depositBanks.findIndex((b) => b.uuid === selectedBankUuid)}
              onChange={(index) => onBankChange(depositBanks[index].uuid)}
            >
              <TabList className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {depositBanks.map((bank) => (
                  <Tab
                    key={bank.uuid}
                    className="rounded-full px-4 py-2 text-xs font-semibold text-white whitespace-nowrap focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 border border-white/10 data-[selected]:border-primary transition-all"
                  >
                    {bank.name}
                  </Tab>
                ))}
              </TabList>
              <TabPanels className="mt-4">
                {depositBanks.map((bank) => (
                  <TabPanel key={bank.uuid} className="focus:outline-none">
                    <AgentAccountSelectGroup
                      agentAccounts={bankInfoOptions}
                      onChange={onBankInfoChange}
                      selectedAccountUuid={selectedAgentBankUuid}
                      isLoading={isLoadingBankInfo}
                    />
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>
          </div>
        </Field>

        <div className="pt-4">
          <AppButton
            disabled={isCreating || !canCreate}
            isLoading={isCreating}
            onClick={onCreate}
            className="w-full"
          >
            Create order and continue
          </AppButton>
          {amountError && (
            <p className="mt-3 text-sm font-medium text-error">{amountError}</p>
          )}
        </div>
      </Fieldset>
    </AppModal>
  );
};

export default DepositModal;

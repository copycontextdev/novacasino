/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from "react";
import { X } from "lucide-react";
import type { SabiPaymentBank, SabiAgentBankInfo } from "@/types/api.types";
import { DepositOrderPreviewInfo } from "@/types/app.types";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
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
import AgentAccountSelectGroup from "./AgentAccountSelectGroup";
import clsx from "clsx";
import AppButton from "@/components/ui/AppButton";

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
    if (
      !selectedBankUuid ||
      !selectedAgentBankUuid ||
      !amountValue ||
      !depositBanks ||
      !bankInfoOptions
    ) {
      return null;
    }
    const selectedAccount = selectedAgentBankUuid
      ? bankInfoOptions.find((b) => b.uuid === selectedAgentBankUuid)
      : null;
    if (!selectedAccount) return null;
    const selectedBankInfo = selectedBankUuid
      ? depositBanks.find((b) => b.uuid === selectedBankUuid)
      : null;
    if (!selectedBankInfo) return null;

    const info: DepositOrderPreviewInfo = {
      account_name: selectedAccount?.account_name ?? "",
      account_number: selectedAccount?.account_number ?? "",
      amount: amountValue,
      bank_name: selectedBankInfo?.name ?? "",
    };

    return info;
  }, [
    selectedBankUuid,
    selectedAgentBankUuid,
    amountValue,
    depositBanks,
    bankInfoOptions,
  ]);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-200">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-out data-closed:opacity-0"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="relative w-full max-w-md bg-surface-container rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary/80">
                  Step 1 of 2
                </p>
                <DialogTitle
                  as="h2"
                  className="text-xl font-headline font-extrabold text-on-surface"
                >
                  Create deposit
                </DialogTitle>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Choose amount, payment bank, and agent bank account.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              <Fieldset className="space-y-6">
                <Legend className="text-[10px] text-on-surface-variant font-bold uppercase mb-4">
                  Limits: {currencyLabel} {minDeposit} – {maxDeposit}
                </Legend>

                <Field>
                  <Label className="text-sm font-medium text-white">
                    Amount
                  </Label>
                  <Input
                    min={minDeposit}
                    max={maxDeposit}
                    step={10}
                    type="number"
                    className={clsx(
                      "mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-3 text-sm text-white outline-none",
                      "focus:ring-2 focus:ring-primary/40"
                    )}
                    value={amountValue}
                    onChange={(e) => onAmountChange(e.target.value)}
                  />
                </Field>

                <Field>
                  <Label className="text-sm font-medium text-white">
                    Select Bank & Account
                  </Label>
                  <div className="mt-3">
                    <TabGroup
                      selectedIndex={depositBanks.findIndex(
                        (b) => b.uuid === selectedBankUuid
                      )}
                      onChange={(index) =>
                        onBankChange(depositBanks[index].uuid)
                      }
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
                          <TabPanel
                            key={bank.uuid}
                            className="focus:outline-none"
                          >
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
                  {amountError ? (
                    <p className="mt-3 text-sm font-medium text-error">
                      {amountError}
                    </p>
                  ) : null}
                </div>
              </Fieldset>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default DepositModal;

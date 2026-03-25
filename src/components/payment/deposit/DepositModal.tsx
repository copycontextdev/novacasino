/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import type { SabiPaymentBank, SabiAgentBankInfo } from "@/types/api.types"; 
import { DepositOrderPreviewInfo } from "@/types/app.types";
import { Field, Fieldset, Input, Label, Legend, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'  
import AgentAccountSelectGroup from "./AgentAccountSelectGroup";
import clsx from "clsx";


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


 const previewData =  useMemo(() => {

  if(!selectedBankUuid || !selectedAgentBankUuid || !amountValue || !depositBanks || !bankInfoOptions){
    return null;
  }
  const selectedAccount = selectedAgentBankUuid ? bankInfoOptions.find((b) => b.uuid === selectedAgentBankUuid) : null;
  if(!selectedAccount) return null;
  const selectedBankInfo = selectedBankUuid ? depositBanks.find((b) => b.uuid === selectedBankUuid) : null;
  if(!selectedBankInfo) return null; 

    const info: DepositOrderPreviewInfo = {
      account_name: selectedAccount?.account_name ?? "",
      account_number: selectedAccount?.account_number ?? "",
      amount: amountValue,
      bank_name: selectedBankInfo?.name ?? ""

    }

    return info;
        

 }, [
  selectedBankUuid,
  selectedAgentBankUuid,
  amountValue,
  depositBanks,
  bankInfoOptions
 ])

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
        <div className="p-6">
          <Fieldset className="space-y-6">
            <Legend className="text-[10px] text-on-surface-variant font-bold uppercase mb-4">
              Limits: {currencyLabel} {minDeposit} – {maxDeposit}
            </Legend>
            
            <Field>
              <Label className="text-sm/6 font-medium text-white">Amount</Label>
              <Input
              min={minDeposit}
              max={maxDeposit}
              step={10}
                type="number"
                className={clsx(
                  'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-3 text-sm/6 text-white',
                  'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'
                )}
                value={amountValue}
                onChange={(e) => onAmountChange(e.target.value)}
              />
            </Field>

            <Field>
              <Label className="text-sm/6 font-medium text-white">Select Bank & Account</Label>
              <div className="mt-3">
                <TabGroup 
                  selectedIndex={depositBanks.findIndex(b => b.uuid === selectedBankUuid)} 
                  onChange={(index) => onBankChange(depositBanks[index].uuid)}
                >
                  <TabList className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {depositBanks.map((bank) => (
                      <Tab
                        key={bank.uuid}
                        className="rounded-full px-4 py-2 text-xs font-semibold text-white whitespace-nowrap focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 border border-white/10 data-[selected]:border-primary"
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

        
          <button
            type="button"
            disabled={isCreating || !canCreate}
            onClick={onCreate}
            className="w-full mt-4 py-4 rounded-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-extrabold disabled:opacity-50"
          >
            {isCreating ? "Creating…" : "Create deposit order"}
          </button>
          {amountError ? (
            <p className="mt-3 text-sm font-medium text-error">{amountError}</p>
          ) : null}
          </Fieldset>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DepositModal;

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { CheckCircleIcon, X } from "lucide-react";
import type { SabiPaymentBank, SabiAgentBankInfo } from "@/types/api.types";
import DepositOrderPreviewCard from "./DepositOrderPreviewCard";
import { DepositOrderPreviewInfo } from "@/types/app.types";
import { Field, Fieldset, Input, Label, Legend, Radio, RadioGroup } from '@headlessui/react'  
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
              defaultValue={1000}
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
              <Label className="text-sm/6 font-medium text-white">Bank</Label>
              <div className="mt-3">
                <BankSelectModal
                  depositBanks={depositBanks}
                  onSelect={(selected) => onBankChange(selected.uuid)}
                  selectedBank={depositBanks.find(b => b.uuid == selectedBankUuid)}
                />
              </div>
            </Field>

            <Field>
              <Label className="text-sm/6 font-medium text-white">Receiving account</Label>
              <div className="mt-3">
                <AgentAccountSelectGroup agentAccounts={bankInfoOptions} onChange={onBankInfoChange} selectedAccountUuid={selectedAgentBankUuid} />
              </div>
            </Field>

         {
          previewData && <DepositOrderPreviewCard {...previewData} />
         }
          <button
            type="button"
            disabled={isCreating}
            onClick={onCreate}
            className="w-full mt-4 py-4 rounded-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-extrabold disabled:opacity-50"
          >
            {isCreating ? "Creating…" : "Create deposit order"}
          </button>
          </Fieldset>
        </div>
      </motion.div>
    </motion.div>
  );
};

 

 function BankSelectModal({selectedBank, depositBanks, onSelect}: {
  depositBanks: SabiPaymentBank[];
  selectedBank?: SabiPaymentBank; 
  onSelect: (bank: SabiPaymentBank) => void;

 }) { 

  return ( 
      <div className="mx-auto w-full max-w-md">
        <RadioGroup by="uuid" value={selectedBank} onChange={onSelect} aria-label="Server size" className=" grid auto-cols-max grid-flow-col w-full gap-4  items-center">
          {depositBanks.map((bank) => (
            <Radio
              key={bank.uuid}
              value={bank}
              className="group relative flex cursor-pointer rounded-lg bg-white/5 px-5 py-4 text-white shadow-md transition focus:not-data-focus:outline-none data-checked:bg-white/10 data-focus:outline data-focus:outline-white"
            >
              <div className="flex w-full items-center justify-between">
                <div className="text-sm/6">
                  {
                      bank.logo && (<img src={bank.logo}/>)
                  }
                  <div className="flex gap-2 text-white/50">
                    <div>{bank.name}</div>
                    
                  </div>
                </div>
                <CheckCircleIcon className="size-6 fill-purple opacity-0 transition group-data-checked:opacity-100" />
              </div>
            </Radio>
          ))}
        </RadioGroup>
      </div> 
  )
}


export default DepositModal;

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { getAgentBanks } from "@/lib/api-methods/payment.api";
import { toArray } from "@/lib/payment-utils";
import { useAddUserBankInfo } from "@/hooks/mutations/use-withdrawal";
import type { SabiPaymentBank } from "@/types/api.types";

interface AddAccountModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddAccountModal = ({
  open,
  onClose,
  onSuccess,
}: AddAccountModalProps) => {
  const [bankUuid, setBankUuid] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const banksQuery = useQuery({
    queryKey: ["withdraw-banks-modal"],
    queryFn: () => getAgentBanks({ type: "withdraw" }),
    enabled: open,
  });

  const banks = useMemo(() => toArray<SabiPaymentBank>(banksQuery.data), [banksQuery.data]);
  const addBank = useAddUserBankInfo();

  if (!open) return null;

  return (
    <motion.div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 px-4">
      <div className="w-full max-w-md bg-surface-container rounded-3xl border border-white/10 p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-headline font-extrabold">Add bank account</h2>
          <button type="button" onClick={onClose}>
            <X />
          </button>
        </div>
        <select
          className="w-full bg-surface-container-high rounded-2xl py-3 px-4 mb-3 border border-white/5"
          value={bankUuid}
          onChange={(e) => setBankUuid(e.target.value)}
        >
          <option value="">Select bank</option>
          {banks.map((b) => (
            <option key={b.uuid} value={b.uuid}>
              {b.name}
            </option>
          ))}
        </select>
        <input
          className="w-full bg-surface-container-high rounded-2xl py-3 px-4 mb-3 border border-white/5"
          placeholder="Account holder name"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
        />
        <input
          className="w-full bg-surface-container-high rounded-2xl py-3 px-4 mb-3 border border-white/5"
          placeholder="Account number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
        <button
          type="button"
          disabled={addBank.isPending || !bankUuid || !accountName || !accountNumber}
          onClick={() =>
            addBank.mutate(
              { bank: bankUuid, account_name: accountName, account_number: accountNumber },
              { onSuccess: () => onSuccess() },
            )
          }
          className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-extrabold disabled:opacity-50"
        >
          {addBank.isPending ? "Saving…" : "Save"}
        </button>
      </div>
    </motion.div>
  );
};

export default AddAccountModal;

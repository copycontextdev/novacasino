/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import type { SabiDepositOrder } from "@/types/api.types";
import { formatBalance } from "@/lib/format";
import DepositOrderPreviewCard from "./DepositOrderPreviewCard";

interface DepositConfirmationModalProps {
  open: boolean;
  order: SabiDepositOrder | null;
  onClose: () => void;
  onSubmit: (reference: string, file: File | null) => void;
  isSubmitting: boolean;
}

const DepositConfirmationModal = ({
  open,
  order,
  onClose,
  onSubmit,
  isSubmitting,
}: DepositConfirmationModalProps) => {
  const [reference, setReference] = useState("");
  const [file, setFile] = useState<File | null>(null);
  if (!open || !order) return null;
  return (
    <motion.div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <motion.div className="relative w-full max-w-md bg-surface-container rounded-3xl border border-white/10 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-headline font-extrabold">Confirm deposit</h2>
          <button type="button" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <DepositOrderPreviewCard {...order} />
        <div className="space-y-3 text-sm mb-4">
          <p>
            <span className="text-on-surface-variant">Amount:</span>{" "}
            <span className="font-bold text-primary">{formatBalance(order.amount)}</span>
          </p>
          <p>
            <span className="text-on-surface-variant">Bank:</span> {order.bank_name}
          </p>
        </div>
        <input
          className="w-full bg-surface-container-high rounded-2xl py-3 px-4 mb-3 border border-white/5"
          placeholder="Transaction reference"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />
        <input
          type="file"
          className="w-full text-xs text-on-surface-variant mb-4"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          disabled={isSubmitting || !reference.trim()}
          onClick={() => onSubmit(reference.trim(), file)}
          className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-extrabold disabled:opacity-50"
        >
          {isSubmitting ? "Submitting…" : "Submit"}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default DepositConfirmationModal;

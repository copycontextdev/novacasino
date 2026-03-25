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
import DepositCancelConfirmationDialog from "./DepositCancelConfirmationDialog";

interface DepositConfirmationModalProps {
  open: boolean;
  order: SabiDepositOrder | null;
  onClose: () => void;
  onSubmit: (reference: string, file: File | null) => void;
  onCancel: (orderUuid: string) => Promise<void>;
  isSubmitting: boolean;
}

const DepositConfirmationModal = ({
  open,
  order,
  onClose,
  onSubmit,
  onCancel,
  isSubmitting,
}: DepositConfirmationModalProps) => {
  const [reference, setReference] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  if (!open || !order) return null;

  const handleCancelConfirm = async () => {
    setIsCancelling(true);
    try {
      await onCancel(order.uuid);
      setShowCancelDialog(false);
      onClose();
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <motion.div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <motion.div className="relative w-full max-w-md flex flex-col gap-2 bg-surface-container rounded-3xl border border-white/10 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-headline font-extrabold">Confirm deposit</h2>
          <button type="button" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <DepositOrderPreviewCard {...order} /> 
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
 
        <div className="flex flex-col gap-3 mt-2">
          <button
            type="button"
            disabled={isSubmitting || !reference.trim()}
            onClick={() => onSubmit(reference.trim(), file)}
            className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-extrabold disabled:opacity-50"
          >
            {isSubmitting ? "Submitting…" : "Submit Confirmation"}
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => setShowCancelDialog(true)}
            className="w-full py-4 rounded-full bg-white/5 text-on-surface-variant font-bold hover:bg-red-500/10 hover:text-red-500 transition-all disabled:opacity-50"
          >
            Cancel Deposit
          </button>
        </div>
      </motion.div>

      <DepositCancelConfirmationDialog
        isOpen={showCancelDialog}
        order={order}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancelConfirm}
        isCancelling={isCancelling}
      />
    </motion.div>
  );
};

export default DepositConfirmationModal;

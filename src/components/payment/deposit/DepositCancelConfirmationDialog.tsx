/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import type { NovaDepositOrder } from "@/types/api.types";
import { formatBalance } from "@/lib/format";

interface DepositCancelConfirmationDialogProps {
  isOpen: boolean;
  order: NovaDepositOrder | null;
  onClose: () => void;
  onConfirm: () => void;
  isCancelling: boolean;
}

const DepositCancelConfirmationDialog = ({
  isOpen,
  order,
  onClose,
  onConfirm,
  isCancelling,
}: DepositCancelConfirmationDialogProps) => {
  if (!isOpen || !order) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Prevent closing if cancellation is in progress
    if (!isCancelling && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
        className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-full max-w-sm flex flex-col gap-6 bg-surface-container rounded-3xl border border-white/10 p-6"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-error">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-headline font-extrabold text-white">Cancel Deposit</h2>
            </div>
            {!isCancelling && (
              <button type="button" onClick={onClose} className="p-1 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Are you sure you want to cancel this deposit? This action cannot be undone.
            </p>
            <div className="p-4 bg-surface-container-high rounded-2xl border border-white/5">
              <p className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Amount to cancel</p>
              <p className="font-headline font-bold text-lg text-primary">{formatBalance(order.amount)}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              disabled={isCancelling}
              onClick={onConfirm}
              className="w-full py-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-extrabold disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
            >
              {isCancelling ? <Loader2 className="w-5 h-5 animate-spin" /> : "Yes, Cancel Deposit"}
            </button>
            {!isCancelling && (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-4 rounded-full bg-white/5 hover:bg-white/10 text-white font-extrabold transition-colors"
              >
                No, Keep it
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DepositCancelConfirmationDialog;
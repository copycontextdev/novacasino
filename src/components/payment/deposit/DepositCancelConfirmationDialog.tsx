import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import type { NovaDepositOrder } from "@/types/api.types";
import { formatBalance } from "@/lib/format";
import AppModal from "@/components/ui/AppModal";

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
  return (
    <AppModal
      open={isOpen && !!order}
      onClose={onClose}
      isLoading={isCancelling}
      size="sm"
      title="Cancel Deposit"
      headerExtra={
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4 text-red-500" />
        </div>
      }
    >
      {order && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Are you sure you want to cancel this deposit? This action cannot be undone.
          </p>

          <div className="p-4 bg-surface-container-high rounded-2xl border border-white/5">
            <p className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">
              Amount to cancel
            </p>
            <p className="font-headline font-bold text-lg text-primary">
              {formatBalance(order.amount)}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              disabled={isCancelling}
              onClick={onConfirm}
              className="w-full py-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-extrabold disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
            >
              {isCancelling ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Yes, Cancel Deposit"
              )}
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
        </div>
      )}
    </AppModal>
  );
};

export default DepositCancelConfirmationDialog;

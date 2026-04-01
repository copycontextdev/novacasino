import React, { useId, useState } from "react";
import { Upload } from "lucide-react";
import type { NovaDepositOrder } from "@/types/api.types";
import DepositOrderPreviewCard from "./DepositOrderPreviewCard";
import DepositCancelConfirmationDialog from "./DepositCancelConfirmationDialog";
import AppModal from "@/components/ui/AppModal";

interface DepositConfirmationModalProps {
  open: boolean;
  order: NovaDepositOrder | null;
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
  const fileInputId = useId();
  const [reference, setReference] = useState(order?.reference_number ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelConfirm = async () => {
    if (!order) return;
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
    <>
      <AppModal
        open={open && !!order}
        onClose={onClose}
        title="Confirm deposit"
        description="Add the transaction reference and optional receipt after creating the order."
        isLoading={isSubmitting}
        headerExtra={
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary/80 mb-1">
            Step 2 of 2
          </p>
        }
      >
        {order && (
          <div className="flex flex-col gap-3">
            <DepositOrderPreviewCard {...order} />

            <input
              className="w-full bg-surface-container-high rounded-2xl py-3 px-4 border border-white/5"
              placeholder="Transaction reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />

            <div>
              <label
                htmlFor={fileInputId}
                className="block cursor-pointer rounded-2xl border border-dashed border-white/15 bg-surface-container-high px-4 py-5 transition hover:border-primary/50 hover:bg-surface-container-highest/70"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-on-surface">Upload receipt or screenshot</p>
                    <p className="mt-1 text-xs text-on-surface-variant">
                      Optional. Tap to choose a file for this deposit confirmation.
                    </p>
                    <p className="mt-2 truncate text-xs font-semibold text-primary">
                      {file ? file.name : "No file selected"}
                    </p>
                  </div>
                </div>
              </label>
              <input
                id={fileInputId}
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>

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
          </div>
        )}
      </AppModal>

      {order && (
        <DepositCancelConfirmationDialog
          isOpen={showCancelDialog}
          order={order}
          onClose={() => setShowCancelDialog(false)}
          onConfirm={handleCancelConfirm}
          isCancelling={isCancelling}
        />
      )}
    </>
  );
};

export default DepositConfirmationModal;

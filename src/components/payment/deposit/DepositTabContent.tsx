import React, { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Loader2, FileUp, Trash2 } from "lucide-react";
import { formatBalance } from "@/lib/format";
import type { NovaDepositOrder, NovaWithdrawalOrder, NovaAmount } from "@/types/api.types";
import DepositOrderPreviewCard from "./DepositOrderPreviewCard";
import AppCard from "@/components/ui/card";
import DepositCancelConfirmationDialog from "./DepositCancelConfirmationDialog";
import AppButton from "@/components/ui/AppButton";
import NewDepositModal from "./new/NewDepositModal";

interface DepositTabContentProps {
  deposits: NovaDepositOrder[];
  isDepositsLoading: boolean;
  onConfirmDeposit: (order: NovaDepositOrder) => void;
  onCancelDeposit: (orderUuid: string) => Promise<void>;
}

const pendingStatuses = ["pending", "paid"];

function DepositTabContent({ deposits, isDepositsLoading, onConfirmDeposit, onCancelDeposit }: DepositTabContentProps) {
  const [cancellingOrder, setCancellingOrder] = useState<NovaDepositOrder | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const pendingDeposits = useMemo(() => deposits.filter((d) => pendingStatuses.includes(d.status)), [deposits]);
  const otherDeposits = useMemo(() => deposits.filter((d) => !pendingStatuses.includes(d.status)), [deposits]);

  const handleCancelConfirm = async () => {
    if (!cancellingOrder) return;
    setIsCancelling(true);
    try {
      await onCancelDeposit(cancellingOrder.uuid);
      setCancellingOrder(null);
    } finally {
      setIsCancelling(false);
    }
  };

  const renderDepositItem = (item: NovaDepositOrder) => (
    <div
      key={item.uuid}
      className="bg-surface-container rounded-2xl p-4 flex items-center justify-between border border-white/5"
    >
      <div className="flex-1">
        <p className="font-bold text-sm">{item.bank_name ?? "Deposit"}</p>
        <p className="text-[10px] text-on-surface-variant">
          {item.created_at ? new Date(item.created_at).toLocaleString() : ""}
        </p>
      </div>
      <div className="text-right flex items-center gap-3">
        <div>
          <p className="font-headline font-bold text-primary">+{formatBalance(item.amount)}</p>
          <p
            className={`text-[10px] ${
              item.status === "cancelled" ? "line-through text-error/70" : "text-on-surface-variant"
            }`}
          >
            {item.status_display ?? item.status}
          </p>
        </div>
        {pendingStatuses.includes(item.status) ? (
          <div className="flex gap-2">
           
              <button
                type="button"
                onClick={() => onConfirmDeposit(item)}
                className="w-10 h-10 rounded-full bg-primary/10 text-secondary flex items-center justify-center hover:bg-primary/20 transition-colors"
                title="Confirm"
              >
                <FileUp className="w-5 h-5" />
              </button>
          
            <button
              type="button"
              onClick={() => setCancellingOrder(item)}
              className="w-10 h-10 rounded-full bg-error/10 text-error flex items-center justify-center hover:bg-error/20 transition-colors"
              title="Cancel Deposit"
            >
              <Trash2 className="w-5 h-5 text-red-500" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {isDepositsLoading ? (
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
      ) : (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex flex-row w-full justify-between items-center gap-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-primary/80 px-1">Pending</h3>
              <NewDepositModal buttonVariant="secondary" />
            </div>

            {pendingDeposits.length > 0 && (
              <div className="space-y-2">{pendingDeposits.map(renderDepositItem)}</div>
            )}
          </div>

          {otherDeposits.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">History</h3>
              <div className="space-y-2">
                {otherDeposits.map(renderDepositItem)}
              </div>
            </div>
          )}
        </div>
      )}

      <DepositCancelConfirmationDialog
        isOpen={!!cancellingOrder}
        order={cancellingOrder}
        onClose={() => setCancellingOrder(null)}
        onConfirm={handleCancelConfirm}
        isCancelling={isCancelling}
      />
    </div>
  );
}

export default DepositTabContent

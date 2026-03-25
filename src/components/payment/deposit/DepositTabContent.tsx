import React, { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Loader2, FileUp, Trash2 } from "lucide-react";
import { formatBalance } from "@/lib/format";
import type { SabiDepositOrder, SabiWithdrawalOrder, SabiAmount } from "@/types/api.types";
import DepositOrderPreviewCard from "./DepositOrderPreviewCard";
import AppCard from "@/components/ui/card";
import DepositCancelConfirmationDialog from "./DepositCancelConfirmationDialog";

interface DepositTabContentProps {
  deposits: SabiDepositOrder[];
  isDepositsLoading: boolean;
  onConfirmDeposit: (order: SabiDepositOrder) => void;
  onCancelDeposit: (orderUuid: string) => Promise<void>;
}

function DepositTabContent({ deposits, isDepositsLoading, onConfirmDeposit, onCancelDeposit }: DepositTabContentProps) {
  const [cancellingOrder, setCancellingOrder] = useState<SabiDepositOrder | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

    const pendingCards = useMemo(() => {
      const pending=  deposits.filter((d) => d.status === "pending")
      if(pending.length== 0){
        return [];
      }

      return pending.map(item => {
        return <div key={`pending-${item.uuid}`}>
            <AppCard>
                <DepositOrderPreviewCard  {...item}/>
            </AppCard>
        </div>
      })
    }, [deposits]) 

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

  return (
     <div className="space-y-3 flex flex-col gap-2">
            {isDepositsLoading ? (
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            ) : deposits.length === 0 ? (
              <p className="text-center text-on-surface-variant py-8">No deposits yet</p>
            ) : (
            <div className="space-y-2 flex flex-col ">
                {pendingCards.length > 0 && (
                    <div className="flex flex-col">
                       {
                        
                            pendingCards

                       }
                    </div>
                )}
                {
                      deposits.map((item) => (
                <div
                  key={item.uuid}
                  className="bg-surface-container rounded-2xl p-4 flex items-center justify-between border border-white/5"
                >
                  <div>
                    <p className="font-bold text-sm">{item.bank_name ?? "Deposit"}</p>
                    <p className="text-[10px] text-on-surface-variant">
                      {item.created_at ? new Date(item.created_at).toLocaleString() : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-headline font-bold text-primary">+{formatBalance(item.amount)}</p>
                    <p className="text-[10px] text-on-surface-variant">{item.status_display ?? item.status}</p>
                  </div>
                  {item.status === "pending" ? (
                    <div className="flex gap-2 ml-2">
                      {!item.reference_number && (
                        <button
                          type="button"
                          onClick={() => onConfirmDeposit(item)}
                          className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                          title="Confirm"
                        >
                          <FileUp className="w-5 h-5" />
                        </button>
                      )}
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
              ))
                }
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
  )
}

export default DepositTabContent

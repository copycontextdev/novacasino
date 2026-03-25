import React, { useMemo, useState } from "react";
import { Loader2, Trash2, Info, ArrowUpRight } from "lucide-react";
import { formatBalance } from "@/lib/format";
import type { SabiWithdrawalOrder } from "@/types/api.types";
import { Dialog, DialogPanel, DialogTitle, Description } from "@headlessui/react";

interface WithdrawTabContentProps {
  withdrawals: SabiWithdrawalOrder[];
  isWithdrawalsLoading: boolean;
  onCancelWithdrawal: (orderUuid: string) => Promise<void>;
  onWithdrawClick: () => void;
}

export default function WithdrawTabContent({ 
  withdrawals, 
  isWithdrawalsLoading, 
  onCancelWithdrawal,
  onWithdrawClick
}: WithdrawTabContentProps) {
  const [cancellingOrder, setCancellingOrder] = useState<SabiWithdrawalOrder | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const pendingWithdrawals = useMemo(() => withdrawals.filter((w) => w.status === "pending"), [withdrawals]);
  const otherWithdrawals = useMemo(() => withdrawals.filter((w) => w.status !== "pending"), [withdrawals]);

  const handleCancelConfirm = async () => {
    if (!cancellingOrder?.uuid) return;
    setIsCancelling(true);
    try {
      await onCancelWithdrawal(cancellingOrder.uuid);
      setCancellingOrder(null);
    } catch (error) {
      console.error("Failed to cancel withdrawal:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  const renderWithdrawItem = (item: SabiWithdrawalOrder) => (
    <div
      key={item.uuid}
      className="bg-surface-container rounded-2xl p-4 flex items-center justify-between border border-white/5"
    >
      <div className="flex-1">
        <p className="font-bold text-sm">Withdrawal</p>
        <p className="text-[10px] text-on-surface-variant">
          {item.created_at ? new Date(item.created_at).toLocaleString() : ""}
        </p>
      </div>
      <div className="text-right flex items-center gap-3">
        <div>
          <p className="font-headline font-bold text-secondary">-{formatBalance(item.amount)}</p>
          <p className="text-[10px] text-on-surface-variant">{item.status_display ?? item.status}</p>
        </div>
        {item.status === "pending" && (
          <button
            type="button"
            onClick={() => setCancellingOrder(item)}
            className="w-10 h-10 rounded-full bg-error/10 text-error flex items-center justify-center hover:bg-error/20 transition-colors"
            title="Cancel Withdrawal"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {isWithdrawalsLoading ? (
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
      ) : (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex flex-row w-full justify-between items-center gap-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-secondary/80 px-1">Pending</h3>
              <button
                type="button"
                onClick={onWithdrawClick}
                className="flex items-center justify-center gap-2 bg-surface-bright border border-secondary/30 hover:border-secondary/60 text-secondary font-black py-3 px-6 rounded-2xl shadow-xl active:scale-95 transition-all duration-200"
              >
                <ArrowUpRight className="w-5 h-5 stroke-[3]" />
                <span className="text-xs uppercase tracking-wider">Withdraw</span>
              </button>
            </div>

            {pendingWithdrawals.length > 0 ? (
              <div className="space-y-2">
                {pendingWithdrawals.map(renderWithdrawItem)}
              </div>
            ) : (
              <div className="bg-white/5 rounded-3xl border border-dashed border-white/10 py-10 text-center">
                <p className="text-sm font-medium text-on-surface-variant">No pending withdrawal requests</p>
              </div>
            )}
          </div>

          {otherWithdrawals.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">History</h3>
              <div className="space-y-2">
                {otherWithdrawals.map(renderWithdrawItem)}
              </div>
            </div>
          )}

          {withdrawals.length === 0 && (
            <p className="text-center text-on-surface-variant py-8">No withdrawals yet</p>
          )}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog open={!!cancellingOrder} onClose={() => setCancellingOrder(null)} className="relative z-[300]">
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="mx-auto max-w-sm rounded-3xl bg-surface-container-high p-6 border border-white/10">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
                <Info className="w-8 h-8 text-error" />
              </div>
              <DialogTitle className="text-xl font-bold">Cancel Withdrawal?</DialogTitle>
              <Description className="text-sm text-on-surface-variant">
                Are you sure you want to cancel this withdrawal of <span className="text-white font-bold">{formatBalance(cancellingOrder?.amount ?? 0)}</span>? This action cannot be undone.
              </Description>
              <div className="flex w-full gap-3 mt-4">
                <button
                  onClick={() => setCancellingOrder(null)}
                  className="flex-1 py-3 px-4 rounded-full bg-white/5 font-bold hover:bg-white/10 transition-colors"
                >
                  Keep it
                </button>
                <button
                  onClick={handleCancelConfirm}
                  disabled={isCancelling}
                  className="flex-1 py-3 px-4 rounded-full bg-error text-on-error font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCancelling && <Loader2 className="w-4 h-4 animate-spin" />}
                  Cancel Order
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}

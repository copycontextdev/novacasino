import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createWithdrawalOrder,
  cancelWithdrawalOrder,
  addUserBankInfo,
} from "@/lib/api-methods/payment.api";
import { WALLET_QUERY_KEY } from "@/hooks/queries/use-wallet";
import type {
  SabiCreateWithdrawalRequest,
  SabiCreateUserBankInfoRequest,
} from "@/types/api.types";

export function useCreateWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SabiCreateWithdrawalRequest) => createWithdrawalOrder(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["withdrawal-orders"] });
    },
  });
}

export function useCancelWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => cancelWithdrawalOrder(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawal-orders"] });
    },
  });
}

export function useAddUserBankInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SabiCreateUserBankInfoRequest) => addUserBankInfo(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bank-info"] });
    },
  });
}

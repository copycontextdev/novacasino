import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDepositOrder,
  updateDepositOrder,
  cancelDepositOrder,
} from "@/lib/api-methods/payment.api";
import { WALLET_QUERY_KEY } from "@/hooks/queries/use-wallet";
import type {
  SabiCreateDepositRequest,
  SabiUpdateDepositRequest,
} from "@/types/api.types";

export function useCreateDeposit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SabiCreateDepositRequest) => createDepositOrder(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["deposit-orders"] });
    },
  });
}

export function useUpdateDeposit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, body }: { uuid: string; body: SabiUpdateDepositRequest }) =>
      updateDepositOrder(uuid, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["deposit-orders"] });
    },
  });
}

export function useCancelDeposit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => cancelDepositOrder(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deposit-orders"] });
    },
  });
}

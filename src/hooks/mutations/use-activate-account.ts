import { useMutation } from "@tanstack/react-query";
import { activateAccount } from "@/lib/api-methods/auth.api";
import type { NovaActivateAccountRequest } from "@/types/api.types";

export function useActivateAccount() {
  return useMutation({
    mutationFn: (body: NovaActivateAccountRequest) => activateAccount(body),
  });
}

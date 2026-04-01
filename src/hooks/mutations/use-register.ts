import { useMutation } from "@tanstack/react-query";
import { registerMember } from "@/lib/api-methods/auth.api";
import type { NovaRegisterRequest } from "@/types/api.types";

export function useRegister() {
  return useMutation({
    mutationFn: (body: NovaRegisterRequest) => registerMember(body),
  });
}

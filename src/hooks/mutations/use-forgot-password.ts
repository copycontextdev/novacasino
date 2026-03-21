import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/lib/api-methods/auth.api";
import type { SabiForgotPasswordRequest } from "@/types/api.types";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (body: SabiForgotPasswordRequest) => forgotPassword(body),
  });
}

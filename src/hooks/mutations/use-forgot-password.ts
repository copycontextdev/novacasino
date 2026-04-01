import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/lib/api-methods/auth.api";
import type { NovaForgotPasswordRequest } from "@/types/api.types";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (body: NovaForgotPasswordRequest) => forgotPassword(body),
  });
}

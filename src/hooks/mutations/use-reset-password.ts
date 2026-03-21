import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/lib/api-methods/auth.api";
import type { SabiResetPasswordRequest } from "@/types/api.types";

export function useResetPassword() {
  return useMutation({
    mutationFn: (body: SabiResetPasswordRequest) => resetPassword(body),
  });
}

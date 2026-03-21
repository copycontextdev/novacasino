import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/api-methods/auth.api";
import { getMe } from "@/lib/api-methods/core.api";
import { useAuthStore } from "@/store/auth-store";
import { useUiStore } from "@/store/ui-store";
import type { SabiLoginRequest } from "@/types/api.types";

export function useLogin() {
  const authLogin = useAuthStore((s) => s.login);
  const closeAuthModal = useUiStore((s) => s.closeAuthModal);

  return useMutation({
    mutationFn: (body: SabiLoginRequest) => login(body),
    onSuccess: async () => {
      const member = await getMe();
      authLogin(member);
      closeAuthModal();
    },
  });
}

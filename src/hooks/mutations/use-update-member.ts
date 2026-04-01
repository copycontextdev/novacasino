import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "@/lib/api-methods/core.api";
import { useAuthStore } from "@/store/auth-store";
import type { NovaMemberProfile } from "@/types/api.types";

export function useUpdateMember() {
  const queryClient = useQueryClient();
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (body: Partial<NovaMemberProfile>) => updateMe(body),
    onSuccess: (updated) => {
      login(updated);
      queryClient.invalidateQueries({ queryKey: ["member"] });
    },
  });
}

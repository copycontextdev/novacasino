import { apiClient } from "@/lib/api/client";
import type {
  NovaInitResponse,
  NovaMemberProfile,
  NovaWalletResponse,
} from "@/types/api.types";
import { CORE_INIT, CORE_ME, CORE_ME_UPDATE, CORE_WALLET } from "@/lib/api/endpoints";

export async function getInit(): Promise<NovaInitResponse> {
  const { data } = await apiClient.get<NovaInitResponse>(CORE_INIT);
  return data;
}

export async function getMe(): Promise<NovaMemberProfile> {
  const { data } = await apiClient.get<NovaMemberProfile>(CORE_ME);
  return data;
}

export async function updateMe(
  body: Partial<NovaMemberProfile>,
): Promise<NovaMemberProfile> {
  const { data } = await apiClient.patch<NovaMemberProfile>(CORE_ME_UPDATE, body);
  return data;
}

export async function getWallet(): Promise<NovaWalletResponse> {
  const { data } = await apiClient.get<NovaWalletResponse>(CORE_WALLET);
  return data;
}

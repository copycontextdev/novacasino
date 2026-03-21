import { apiClient } from "@/lib/api/client";
import type {
  SabiInitResponse,
  SabiMemberProfile,
  SabiWalletResponse,
} from "@/types/api.types";
import { CORE_INIT, CORE_ME, CORE_ME_UPDATE, CORE_WALLET } from "@/lib/api/endpoints";

export async function getInit(): Promise<SabiInitResponse> {
  const { data } = await apiClient.get<SabiInitResponse>(CORE_INIT);
  return data;
}

export async function getMe(): Promise<SabiMemberProfile> {
  const { data } = await apiClient.get<SabiMemberProfile>(CORE_ME);
  return data;
}

export async function updateMe(
  body: Partial<SabiMemberProfile>,
): Promise<SabiMemberProfile> {
  const { data } = await apiClient.patch<SabiMemberProfile>(CORE_ME_UPDATE, body);
  return data;
}

export async function getWallet(): Promise<SabiWalletResponse> {
  const { data } = await apiClient.get<SabiWalletResponse>(CORE_WALLET);
  return data;
}

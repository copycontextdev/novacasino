import { apiClient } from "@/lib/api/client";
import type {
  SabiAgentBanksQuery,
  SabiAgentBankListResponse,
  SabiAgentBankInfoQuery,
  SabiAgentBankInfoListResponse,
  SabiCreateDepositRequest,
  SabiCreateDepositResponse,
  SabiUpdateDepositRequest,
  SabiUpdateDepositResponse,
  SabiCancelDepositResponse,
  SabiDepositOrderListResponse,
  SabiDepositOrder,
  SabiCreateWithdrawalRequest,
  SabiCreateWithdrawalResponse,
  SabiWithdrawalOrderListResponse,
  SabiCreateUserBankInfoRequest,
  SabiUserBankInfo,
  SabiUserBankInfoListResponse,
  SabiTransactionListResponse,
  SabiPaginationQuery,
} from "@/types/api.types";
import {
  PAYMENT_BANKS,
  PAYMENT_BANK_INFO,
  PAYMENT_DEPOSIT_ORDERS,
  PAYMENT_DEPOSIT_ORDER,
  PAYMENT_DEPOSIT_UPDATE,
  PAYMENT_DEPOSIT_CANCEL,
  PAYMENT_MY_DEPOSITS,
  PAYMENT_USER_BANK_INFO,
  PAYMENT_WITHDRAWAL_ORDERS,
  PAYMENT_WITHDRAWAL_CANCEL,
  PAYMENT_MY_WITHDRAWALS,
  PAYMENT_TRANSACTIONS,
} from "@/lib/api/endpoints";

// --- Banks ---

export async function getAgentBanks(
  query: SabiAgentBanksQuery,
): Promise<SabiAgentBankListResponse> {
  const { data } = await apiClient.get<SabiAgentBankListResponse>(PAYMENT_BANKS, {
    params: query,
  });
  return data;
}

export async function getAgentBankInfo(
  bankUuid: string,
  query?: SabiAgentBankInfoQuery,
): Promise<SabiAgentBankInfoListResponse> {
  const { data } = await apiClient.get<SabiAgentBankInfoListResponse>(
    PAYMENT_BANK_INFO(bankUuid),
    { params: query },
  );
  return data;
}

// --- Deposits ---

export async function createDepositOrder(
  body: SabiCreateDepositRequest,
): Promise<SabiCreateDepositResponse> {
  const { data } = await apiClient.post<SabiCreateDepositResponse>(
    PAYMENT_DEPOSIT_ORDERS,
    body,
  );
  return data;
}

export async function getDepositOrder(uuid: string): Promise<SabiDepositOrder> {
  const { data } = await apiClient.get<SabiDepositOrder>(PAYMENT_DEPOSIT_ORDER(uuid));
  return data;
}

export async function updateDepositOrder(
  uuid: string,
  body: SabiUpdateDepositRequest,
): Promise<SabiUpdateDepositResponse> {
  const formData = new FormData();
  if (body.reference_number) formData.append("reference_number", body.reference_number);
  if (body.receipt instanceof File || body.receipt instanceof Blob) {
    formData.append("receipt", body.receipt);
  }
  const { data } = await apiClient.put<SabiUpdateDepositResponse>(
    PAYMENT_DEPOSIT_UPDATE(uuid),
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function cancelDepositOrder(
  uuid: string,
): Promise<SabiCancelDepositResponse> {
  const { data } = await apiClient.post<SabiCancelDepositResponse>(
    PAYMENT_DEPOSIT_CANCEL(uuid),
  );
  return data;
}

export async function getMyDepositOrders(
  query?: SabiPaginationQuery,
): Promise<SabiDepositOrderListResponse> {
  const { data } = await apiClient.get<SabiDepositOrderListResponse>(
    PAYMENT_MY_DEPOSITS,
    { params: query },
  );
  return data;
}

// --- Withdrawals ---

export async function createWithdrawalOrder(
  body: SabiCreateWithdrawalRequest,
): Promise<SabiCreateWithdrawalResponse> {
  const { data } = await apiClient.post<SabiCreateWithdrawalResponse>(
    PAYMENT_WITHDRAWAL_ORDERS,
    body,
  );
  return data;
}

export async function cancelWithdrawalOrder(
  uuid: string,
): Promise<SabiCreateWithdrawalResponse> {
  const { data } = await apiClient.post<SabiCreateWithdrawalResponse>(
    PAYMENT_WITHDRAWAL_CANCEL(uuid),
  );
  return data;
}

export async function getMyWithdrawalOrders(
  query?: SabiPaginationQuery,
): Promise<SabiWithdrawalOrderListResponse> {
  const { data } = await apiClient.get<SabiWithdrawalOrderListResponse>(
    PAYMENT_MY_WITHDRAWALS,
    { params: query },
  );
  return data;
}

// --- User Bank Info ---

export async function getUserBankInfo(): Promise<SabiUserBankInfoListResponse> {
  const { data } = await apiClient.get<SabiUserBankInfoListResponse>(
    PAYMENT_USER_BANK_INFO,
  );
  return data;
}

export async function addUserBankInfo(
  body: SabiCreateUserBankInfoRequest,
): Promise<SabiUserBankInfo> {
  const { data } = await apiClient.post<SabiUserBankInfo>(
    PAYMENT_USER_BANK_INFO,
    body,
  );
  return data;
}

// --- Transactions ---

export async function getMyTransactions(
  query?: SabiPaginationQuery,
): Promise<SabiTransactionListResponse> {
  const { data } = await apiClient.get<SabiTransactionListResponse>(
    PAYMENT_TRANSACTIONS,
    { params: query },
  );
  return data;
}

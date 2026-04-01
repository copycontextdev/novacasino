import { apiClient } from "@/lib/api/client";
import type {
  NovaAgentBanksQuery,
  NovaAgentBankListResponse,
  NovaAgentBankInfoQuery,
  NovaAgentBankInfoListResponse,
  NovaCreateDepositRequest,
  NovaCreateDepositResponse,
  NovaUpdateDepositRequest,
  NovaUpdateDepositResponse,
  NovaCancelDepositResponse,
  NovaDepositOrderListResponse,
  NovaDepositOrder,
  NovaCreateWithdrawalRequest,
  NovaCreateWithdrawalResponse,
  NovaWithdrawalOrderListResponse,
  NovaCreateUserBankInfoRequest,
  NovaUserBankInfo,
  NovaUserBankInfoListResponse,
  NovaTransactionListResponse,
  NovaPaginationQuery,
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
  query: NovaAgentBanksQuery,
): Promise<NovaAgentBankListResponse> {
  const { data } = await apiClient.get<NovaAgentBankListResponse>(PAYMENT_BANKS, {
    params: query,
  });
  return data;
}

export async function getAgentBankInfo(
  bankUuid: string,
  query?: NovaAgentBankInfoQuery,
): Promise<NovaAgentBankInfoListResponse> {
  const { data } = await apiClient.get<NovaAgentBankInfoListResponse>(
    PAYMENT_BANK_INFO(bankUuid),
    { params: query },
  );
  return data;
}

// --- Deposits ---

export async function createDepositOrder(
  body: NovaCreateDepositRequest,
): Promise<NovaCreateDepositResponse> {
  const { data } = await apiClient.post<NovaCreateDepositResponse>(
    PAYMENT_DEPOSIT_ORDERS,
    body,
  );
  return data;
}

export async function getDepositOrder(uuid: string): Promise<NovaDepositOrder> {
  const { data } = await apiClient.get<NovaDepositOrder>(PAYMENT_DEPOSIT_ORDER(uuid));
  return data;
}

export async function updateDepositOrder(
  uuid: string,
  body: NovaUpdateDepositRequest,
): Promise<NovaUpdateDepositResponse> {
  const formData = new FormData();
  if (body.reference_number) formData.append("reference_number", body.reference_number);
  if (body.receipt instanceof File || body.receipt instanceof Blob) {
    formData.append("receipt", body.receipt);
  }
  const { data } = await apiClient.put<NovaUpdateDepositResponse>(
    PAYMENT_DEPOSIT_UPDATE(uuid),
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function cancelDepositOrder(
  uuid: string,
): Promise<NovaCancelDepositResponse> {
  const { data } = await apiClient.post<NovaCancelDepositResponse>(
    PAYMENT_DEPOSIT_CANCEL(uuid),
  );
  return data;
}

export async function getMyDepositOrders(
  query?: NovaPaginationQuery,
): Promise<NovaDepositOrderListResponse> {
  const { data } = await apiClient.get<NovaDepositOrderListResponse>(
    PAYMENT_MY_DEPOSITS,
    { params: query },
  );
  return data;
}

// --- Withdrawals ---

export async function createWithdrawalOrder(
  body: NovaCreateWithdrawalRequest,
): Promise<NovaCreateWithdrawalResponse> {
  const { data } = await apiClient.post<NovaCreateWithdrawalResponse>(
    PAYMENT_WITHDRAWAL_ORDERS,
    body,
  );
  return data;
}

export async function cancelWithdrawalOrder(
  uuid: string,
): Promise<NovaCreateWithdrawalResponse> {
  const { data } = await apiClient.post<NovaCreateWithdrawalResponse>(
    PAYMENT_WITHDRAWAL_CANCEL(uuid),
  );
  return data;
}

export async function getMyWithdrawalOrders(
  query?: NovaPaginationQuery,
): Promise<NovaWithdrawalOrderListResponse> {
  const { data } = await apiClient.get<NovaWithdrawalOrderListResponse>(
    PAYMENT_MY_WITHDRAWALS,
    { params: query },
  );
  return data;
}

// --- User Bank Info ---

export async function getUserBankInfo(): Promise<NovaUserBankInfoListResponse> {
  const { data } = await apiClient.get<NovaUserBankInfoListResponse>(
    PAYMENT_USER_BANK_INFO,
  );
  return data;
}

export async function addUserBankInfo(
  body: NovaCreateUserBankInfoRequest,
): Promise<NovaUserBankInfo> {
  const { data } = await apiClient.post<NovaUserBankInfo>(
    PAYMENT_USER_BANK_INFO,
    body,
  );
  return data;
}

// --- Transactions ---

export async function getMyTransactions(
  query?: NovaPaginationQuery,
): Promise<NovaTransactionListResponse> {
  const { data } = await apiClient.get<NovaTransactionListResponse>(
    PAYMENT_TRANSACTIONS,
    { params: query },
  );
  return data;
}

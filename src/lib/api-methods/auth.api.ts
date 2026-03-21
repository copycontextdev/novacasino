import { apiClient } from "@/lib/api/client";
import { setTokens } from "@/lib/session";
import type {
  SabiLoginRequest,
  SabiLoginResponse,
  SabiTokenRefreshRequest,
  SabiTokenRefreshResponse,
  SabiRegisterRequest,
  SabiActivateAccountRequest,
  SabiForgotPasswordRequest,
  SabiResetPasswordRequest,
  SabiResendOtpRequest,
  SabiApiEnvelope,
  SabiMemberProfile,
} from "@/types/api.types";
import {
  AUTH_LOGIN,
  AUTH_REFRESH,
  CORE_REGISTER,
  CORE_ACTIVATE,
  CORE_FORGOT_PASSWORD,
  CORE_RESET_PASSWORD,
  CORE_RESEND_OTP,
} from "@/lib/api/endpoints";

export async function login(body: SabiLoginRequest): Promise<SabiLoginResponse> {
  const { data } = await apiClient.post<SabiLoginResponse>(AUTH_LOGIN, body);
  setTokens(data.access, data.refresh);
  return data;
}

export async function refreshToken(
  body: SabiTokenRefreshRequest,
): Promise<SabiTokenRefreshResponse> {
  const { data } = await apiClient.post<SabiTokenRefreshResponse>(
    AUTH_REFRESH,
    body,
  );
  return data;
}

export async function registerMember(
  body: SabiRegisterRequest,
): Promise<SabiApiEnvelope<SabiMemberProfile>> {
  const { data } = await apiClient.post<SabiApiEnvelope<SabiMemberProfile>>(
    CORE_REGISTER,
    body,
  );
  return data;
}

export async function activateAccount(
  body: SabiActivateAccountRequest,
): Promise<SabiApiEnvelope> {
  const { data } = await apiClient.post<SabiApiEnvelope>(CORE_ACTIVATE, body);
  return data;
}

export async function forgotPassword(
  body: SabiForgotPasswordRequest,
): Promise<SabiApiEnvelope> {
  const { data } = await apiClient.post<SabiApiEnvelope>(
    CORE_FORGOT_PASSWORD,
    body,
  );
  return data;
}

export async function resetPassword(
  body: SabiResetPasswordRequest,
): Promise<SabiApiEnvelope> {
  const { data } = await apiClient.post<SabiApiEnvelope>(
    CORE_RESET_PASSWORD,
    body,
  );
  return data;
}

export async function resendOtp(
  body: SabiResendOtpRequest,
): Promise<SabiApiEnvelope> {
  const { data } = await apiClient.post<SabiApiEnvelope>(CORE_RESEND_OTP, body);
  return data;
}

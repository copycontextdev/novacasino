import { apiClient } from "@/lib/api/client";
import { setTokens } from "@/lib/session";
import type {
  NovaLoginRequest,
  NovaLoginResponse,
  NovaTokenRefreshRequest,
  NovaTokenRefreshResponse,
  NovaRegisterRequest,
  NovaActivateAccountRequest,
  NovaForgotPasswordRequest,
  NovaResetPasswordRequest,
  NovaResendOtpRequest,
  NovaApiEnvelope,
  NovaMemberProfile,
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

export async function login(body: NovaLoginRequest): Promise<NovaLoginResponse> {
  const { data } = await apiClient.post<NovaLoginResponse>(AUTH_LOGIN, body);
  setTokens(data.access, data.refresh);
  return data;
}

export async function refreshToken(
  body: NovaTokenRefreshRequest,
): Promise<NovaTokenRefreshResponse> {
  const { data } = await apiClient.post<NovaTokenRefreshResponse>(
    AUTH_REFRESH,
    body,
  );
  return data;
}

export async function registerMember(
  body: NovaRegisterRequest,
): Promise<NovaApiEnvelope<NovaMemberProfile>> {
  const { data } = await apiClient.post<NovaApiEnvelope<NovaMemberProfile>>(
    CORE_REGISTER,
    body,
  );
  return data;
}

export async function activateAccount(
  body: NovaActivateAccountRequest,
): Promise<NovaApiEnvelope> {
  const { data } = await apiClient.post<NovaApiEnvelope>(CORE_ACTIVATE, body);
  return data;
}

export async function forgotPassword(
  body: NovaForgotPasswordRequest,
): Promise<NovaApiEnvelope> {
  const { data } = await apiClient.post<NovaApiEnvelope>(
    CORE_FORGOT_PASSWORD,
    body,
  );
  return data;
}

export async function resetPassword(
  body: NovaResetPasswordRequest,
): Promise<NovaApiEnvelope> {
  const { data } = await apiClient.post<NovaApiEnvelope>(
    CORE_RESET_PASSWORD,
    body,
  );
  return data;
}

export async function resendOtp(
  body: NovaResendOtpRequest,
): Promise<NovaApiEnvelope> {
  const { data } = await apiClient.post<NovaApiEnvelope>(CORE_RESEND_OTP, body);
  return data;
}

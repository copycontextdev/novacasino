export type AuthView =
  | "login"
  | "register"
  | "otp"
  | "forgot-password"
  | "reset-password";

export interface NovaLoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  onSwitchToForgotPassword?: () => void;
}

export interface NovaRegisterFormProps {
  onSuccess?: (phoneNumber: string) => void;
  onSwitchToLogin?: () => void;
}

export interface NovaOtpFormProps {
  phoneNumber: string;
  onSuccess?: () => void;
  onResend?: () => void;
}

export interface NovaForgotPasswordFormProps {
  onSuccess?: (payload: { phoneNumber: string; otpId: string }) => void;
  onSwitchToLogin?: () => void;
}

export interface NovaResetPasswordFormProps {
  phoneNumber: string;
  otpId: string;
  onSuccess?: () => void;
  onBack?: () => void;
}

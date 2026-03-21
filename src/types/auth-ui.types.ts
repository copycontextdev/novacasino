export type AuthView =
  | "login"
  | "register"
  | "otp"
  | "forgot-password"
  | "reset-password";

export interface SabiLoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  onSwitchToForgotPassword?: () => void;
}

export interface SabiRegisterFormProps {
  onSuccess?: (phoneNumber: string) => void;
  onSwitchToLogin?: () => void;
}

export interface SabiOtpFormProps {
  phoneNumber: string;
  onSuccess?: () => void;
  onResend?: () => void;
}

export interface SabiForgotPasswordFormProps {
  onSuccess?: (payload: { phoneNumber: string; otpId: string }) => void;
  onSwitchToLogin?: () => void;
}

export interface SabiResetPasswordFormProps {
  phoneNumber: string;
  otpId: string;
  onSuccess?: () => void;
  onBack?: () => void;
}

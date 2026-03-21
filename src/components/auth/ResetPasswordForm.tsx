import { FormEvent, useMemo, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useResetPassword } from "@/hooks/mutations/use-reset-password";
import type { SabiResetPasswordFormProps } from "@/types/auth-ui.types";
import { getAxiosErrorMessage } from "@/lib/format";

const field =
  "w-full rounded-2xl border border-white/10 bg-surface-container-high px-4 py-3 text-sm text-on-surface outline-none transition focus-visible:ring-2 focus-visible:ring-primary/40";

export default function ResetPasswordForm({
  phoneNumber,
  otpId,
  onSuccess,
  onBack,
}: SabiResetPasswordFormProps) {
  const [otpCode, setOtpCode] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { mutate: resetPwd, isPending, isSuccess, isError, error } = useResetPassword();
  const errorMessage = useMemo(() => getAxiosErrorMessage(error), [error]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== password2) {
      setLocalError("Passwords do not match.");
      return;
    }
    setLocalError(null);
    resetPwd(
      { otp_id: otpId, otp_code: otpCode.trim(), password, password2 },
      { onSuccess: () => onSuccess?.() },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-surface-container-low p-3 text-xs text-on-surface-variant">
        Resetting for <span className="font-semibold text-on-surface">{phoneNumber}</span>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="reset-otp-code" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          OTP Code
        </label>
        <input
          id="reset-otp-code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="123456"
          className={field}
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
          required
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="reset-password" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          New Password
        </label>
        <div className="relative">
          <input
            id="reset-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            className={`${field} pr-11`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="reset-password2" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            id="reset-password2"
            type={showPassword2 ? "text" : "password"}
            autoComplete="new-password"
            className={`${field} pr-11`}
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword2((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            aria-label={showPassword2 ? "Hide confirm password" : "Show confirm password"}
          >
            {showPassword2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {localError ? (
        <p className="rounded-xl border border-error/40 bg-error/10 px-3 py-2 text-xs text-error">{localError}</p>
      ) : null}
      {isError ? (
        <p className="rounded-xl border border-error/40 bg-error/10 px-3 py-2 text-xs text-error">{errorMessage}</p>
      ) : null}
      {isSuccess ? (
        <p className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-primary">
          Password reset successful. Sign in with your new password.
        </p>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-dim py-3.5 text-sm font-extrabold text-on-primary disabled:opacity-60"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isPending ? "Resetting..." : "Reset Password"}
        </button>
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="w-full rounded-2xl border border-white/15 bg-white/5 py-3.5 text-sm font-semibold text-on-surface"
          >
            Back
          </button>
        ) : null}
      </div>
    </form>
  );
}

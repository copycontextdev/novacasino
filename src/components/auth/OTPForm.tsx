import { FormEvent, useMemo, useState } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import { useActivateAccount } from "@/hooks/mutations/use-activate-account";
import { resendOtp } from "@/lib/api-methods/auth.api";
import type { NovaOtpFormProps } from "@/types/auth-ui.types";
import { getAxiosErrorMessage } from "@/lib/format";

const field =
  "w-full rounded-2xl border border-white/10 bg-surface-container-high px-4 py-3 text-on-surface outline-none transition focus-visible:ring-2 focus-visible:ring-primary/40";

export default function OTPForm({ phoneNumber, onSuccess, onResend }: NovaOtpFormProps) {
  const [otp, setOtp] = useState("");
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  const { mutate: activate, isPending, isError, error } = useActivateAccount();
  const errorMessage = useMemo(() => getAxiosErrorMessage(error), [error]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    activate(
      { phone_number: phoneNumber, otp: otp.trim() },
      { onSuccess: () => onSuccess?.() },
    );
  };

  const handleResend = async () => {
    setIsResending(true);
    setResendMessage(null);
    setResendError(null);
    try {
      await resendOtp({ phone_number: phoneNumber });
      setResendMessage("OTP resent successfully.");
      onResend?.();
    } catch (err) {
      setResendError(getAxiosErrorMessage(err));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-surface-container-low p-3 text-xs text-on-surface-variant">
        Code sent to <span className="font-semibold text-on-surface">{phoneNumber}</span>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="otp-code" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          6-Digit OTP
        </label>
        <input
          id="otp-code"
          type="text"
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          autoComplete="one-time-code"
          placeholder="123456"
          className={`${field} text-center text-lg tracking-[0.3em]`}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          required
        />
      </div>
      {isError ? (
        <p className="rounded-xl border border-error/40 bg-error/10 px-3 py-2 text-xs text-error">{errorMessage}</p>
      ) : null}
      {resendError ? (
        <p className="rounded-xl border border-error/40 bg-error/10 px-3 py-2 text-xs text-error">{resendError}</p>
      ) : null}
      {resendMessage ? (
        <p className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-primary">{resendMessage}</p>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-dim py-3.5 text-sm font-extrabold text-on-primary disabled:opacity-60"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isPending ? "Verifying..." : "Verify OTP"}
        </button>
        <button
          type="button"
          disabled={isResending}
          onClick={handleResend}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 py-3.5 text-sm font-semibold text-on-surface disabled:opacity-60"
        >
          {isResending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
          {isResending ? "Resending..." : "Resend OTP"}
        </button>
      </div>
    </form>
  );
}

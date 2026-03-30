import { FormEvent, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useForgotPassword } from "@/hooks/mutations/use-forgot-password";
import type { SabiForgotPasswordFormProps } from "@/types/auth-ui.types";
import type { SabiApiEnvelope } from "@/types/api.types";
import { getAxiosErrorMessage } from "@/lib/format";

const field =
  "w-full rounded-2xl border border-white/10 bg-surface-container-high px-4 py-3 text-sm text-on-surface outline-none transition focus-visible:ring-2 focus-visible:ring-primary/40";

export default function ForgotPasswordForm({
  onSuccess,
  onSwitchToLogin,
}: SabiForgotPasswordFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fallbackSuccessMessage, setFallbackSuccessMessage] = useState<string | null>(null);

  const { mutate: requestReset, isPending, isSuccess, isError, error } = useForgotPassword();
  const errorMessage = useMemo(() => getAxiosErrorMessage(error), [error]);

  const getOtpId = (payload: SabiApiEnvelope): string | null => {
    const directId = payload.id;
    if (typeof directId === "string") return directId;
    const data = payload.data as Record<string, unknown> | undefined;
    if (data && typeof data.id === "string") return data.id;
    if (data && typeof data.otp_id === "string") return data.otp_id;
    const otpId = payload.otp_id;
    return typeof otpId === "string" ? otpId : null;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFallbackSuccessMessage(null);
    requestReset(
      { phone_number: phoneNumber.trim() },
      {
        onSuccess: (payload) => {
          const otpId = getOtpId(payload);
          if (!otpId) {
            setFallbackSuccessMessage("Reset request submitted. Check your phone for next steps.");
            return;
          }
          onSuccess?.({ phoneNumber: phoneNumber.trim(), otpId });
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-on-surface-variant">Enter your phone number for reset instructions.</p>
      <div className="space-y-1.5">
        <label htmlFor="forgot-phone" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          Phone Number
        </label>
        <input
          id="forgot-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="09XXXXXXXX"
          className={field}
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </div>
      {isError ? (
        <p className="rounded-xl border border-error/40 bg-error/10 px-3 py-2 text-xs text-error">{errorMessage}</p>
      ) : null}
      {(isSuccess && !onSuccess) || fallbackSuccessMessage ? (
        <p className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-primary">
          {fallbackSuccessMessage ?? "Reset request submitted. Check your phone for next steps."}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-dim py-4 text-sm font-extrabold text-on-primary disabled:opacity-60"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {isPending ? "Submitting..." : "Send Reset Request"}
      </button>
      <div className="text-center text-xs">
        <button type="button" onClick={onSwitchToLogin} className="font-semibold text-on-surface-variant hover:text-primary hover:underline">
          Back to login
        </button>
      </div>
    </form>
  );
}

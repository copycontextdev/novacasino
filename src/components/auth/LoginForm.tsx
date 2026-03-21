import { FormEvent, useMemo, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLogin } from "@/hooks/mutations/use-login";
import type { SabiLoginFormProps } from "@/types/auth-ui.types";
import { getAxiosErrorMessage } from "@/lib/format";

const field =
  "w-full rounded-2xl border border-white/10 bg-surface-container-high px-4 py-3 text-sm text-on-surface outline-none transition focus-visible:ring-2 focus-visible:ring-primary/40";

export default function LoginForm({
  onSuccess,
  onSwitchToRegister,
  onSwitchToForgotPassword,
}: SabiLoginFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login, isPending, isError, error } = useLogin();
  const errorMessage = useMemo(() => getAxiosErrorMessage(error), [error]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login(
      { phone_number: phoneNumber.trim(), password },
      { onSuccess: () => onSuccess?.() },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="login-phone" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          Phone Number
        </label>
        <input
          id="login-phone"
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
      <div className="space-y-1.5">
        <label htmlFor="login-password" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          Password
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            className={`${field} pr-11`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {isError ? (
        <p className="rounded-xl border border-error/40 bg-error/10 px-3 py-2 text-xs text-error">{errorMessage}</p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-dim py-4 text-sm font-extrabold text-on-primary shadow-lg shadow-primary/20 disabled:opacity-60"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {isPending ? "Signing In..." : "Sign In"}
      </button>
      <div className="flex items-center justify-between text-xs">
        <button type="button" onClick={onSwitchToRegister} className="font-bold text-primary hover:underline">
          Register
        </button>
        <button
          type="button"
          onClick={onSwitchToForgotPassword}
          className="font-semibold text-on-surface-variant hover:text-on-surface hover:underline"
        >
          Forgot password?
        </button>
      </div>
    </form>
  );
}

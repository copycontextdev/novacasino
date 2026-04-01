import { FormEvent, useMemo, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRegister } from "@/hooks/mutations/use-register";
import type { NovaRegisterFormProps } from "@/types/auth-ui.types";
import { getAxiosErrorMessage } from "@/lib/format";

const field =
  "w-full rounded-2xl border border-white/10 bg-surface-container-high px-4 py-3 text-sm text-on-surface outline-none transition focus-visible:ring-2 focus-visible:ring-primary/40";

export default function RegisterForm({ onSuccess, onSwitchToLogin }: NovaRegisterFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const { mutate: register, isPending, isError, error } = useRegister();
  const errorMessage = useMemo(() => getAxiosErrorMessage(error), [error]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    register(
      {
        user_profile: {
          first_name: firstName.trim() || undefined,
          last_name: lastName.trim() || undefined,
          phone_number: phoneNumber.trim(),
          password,
          password2,
        },
        promo_code: promoCode.trim() || undefined,
      },
      { onSuccess: () => onSuccess?.(phoneNumber.trim()) },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="register-first-name" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            First Name
          </label>
          <input
            id="register-first-name"
            type="text"
            autoComplete="given-name"
            className={field}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="register-last-name" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            Last Name
          </label>
          <input
            id="register-last-name"
            type="text"
            autoComplete="family-name"
            className={field}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="register-phone" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          Phone Number
        </label>
        <input
          id="register-phone"
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
        <label htmlFor="register-password" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          Password
        </label>
        <div className="relative">
          <input
            id="register-password"
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
        <label htmlFor="register-password2" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="register-password2"
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
      <div className="space-y-1.5">
        <label htmlFor="register-promo" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          Promo Code (Optional)
        </label>
        <input
          id="register-promo"
          type="text"
          className={field}
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
        />
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
        {isPending ? "Creating Account..." : "Create Account"}
      </button>
      <div className="text-center text-xs">
        <button type="button" onClick={onSwitchToLogin} className="font-semibold text-on-surface-variant hover:text-primary hover:underline">
          Already have an account? Sign in
        </button>
      </div>
    </form>
  );
}

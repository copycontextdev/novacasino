import { LogIn } from "lucide-react";

interface BonusGuestPromptProps {
  title: string;
  description: string;
  onLogin: () => void;
}

export function BonusGuestPrompt({
  title,
  description,
  onLogin,
}: BonusGuestPromptProps) {
  return (
    <div className="rounded-3xl border border-dashed border-white/15 bg-surface-container-high/60 p-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
        <LogIn className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-xl font-headline font-extrabold text-on-surface">{title}</h3>
      <p className="mt-2 text-sm text-on-surface-variant">{description}</p>
      <button
        type="button"
        onClick={onLogin}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-on-primary transition-transform hover:scale-[1.01]"
      >
        Sign in
      </button>
    </div>
  );
}

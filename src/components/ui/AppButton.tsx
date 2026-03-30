import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@headlessui/react";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface AppButtonProps extends ButtonProps {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  isLoading?: boolean;
  children: ReactNode;
  className?: string;
}



const variants = {
  primary:
    "bg-gradient-to-r from-primary to-primary-dim text-on-primary shadow-lg shadow-primary/20",
  secondary:
    "bg-surface-bright border border-primary/40 text-primary hover:border-primary/70 shadow-xl shadow-primary/10",
  danger: "bg-error text-white shadow-lg shadow-error/20",
  outline: "border border-white/15 bg-white/5 text-on-surface hover:bg-white/10",
  ghost: "bg-transparent text-on-surface hover:bg-white/5",
};

export default function AppButton({
  variant = "primary",
  isLoading = false,
  disabled,
  className,
  children,
  ...props
}: AppButtonProps) {
  return (
    <Button
      disabled={disabled || isLoading}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-2xl">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}

      <span className={cn("flex items-center gap-2", isLoading && "invisible")}>
        {children}
      </span>
    </Button>
  );
}

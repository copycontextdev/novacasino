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
  // Solid colored background of the secondary theme
  primary: "bg-gradient-to-r from-[#9A47FF] to-[#8536e5] text-white hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(157,0,255,0.5)] hover:shadow-[0_0_50px_rgba(157,0,255,0.7)] border border-[#9D00FF]/50",
  // Bordered version with surface-bright background
  secondary: "bg-surface-bright border-2 border-secondary/40 hover:border-secondary/80 text-secondary shadow-2xl shadow-secondary/10",
  danger: "bg-error text-white border-2 border-error hover:bg-error/90 shadow-2xl shadow-error/20",
  outline: "bg-transparent border-2 border-on-surface/20 text-on-surface hover:bg-on-surface/10",
  ghost: "bg-transparent text-on-surface hover:bg-surface-bright",
};

/**
 * A reusable button component that integrates with the project's design system.
 * Handles loading states, variants, and disabled states with consistent styling.
 */
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
        // Increased py-2.5 to py-3.5 for a more substantial "tall" feel as requested
        "relative flex items-center justify-center gap-2 font-black py-3.5 px-8 rounded-2xl text-sm active:scale-95 transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wider",
        variants[variant],
        className
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

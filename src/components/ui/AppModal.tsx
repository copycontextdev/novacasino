import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Description,
} from "@headlessui/react";
import { X } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

interface AppModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  /** Rendered above the title — useful for step badges */
  headerExtra?: ReactNode;
  children?: ReactNode;
  /** Footer slot — right-aligned, typically action buttons */
  footer?: ReactNode;
  size?: keyof typeof sizes;
  hideCloseButton?: boolean;
  /** Align to the bottom on mobile (bottom sheet), centered on md+ */
  sheet?: boolean;
  /** Block backdrop click and Esc while true — use during API calls */
  isLoading?: boolean;
  className?: string;
}

export default function AppModal({
  open,
  onClose,
  title,
  description,
  headerExtra,
  children,
  footer,
  size = "md",
  hideCloseButton = false,
  sheet = false,
  isLoading = false,
  className,
}: AppModalProps) {
  const hasHeader = !!(title || description || headerExtra || !hideCloseButton);
  const handleClose = () => { if (!isLoading) onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-200">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-out data-closed:opacity-0"
      />

      <div className={cn(
        "fixed inset-0 z-10 w-screen overflow-y-auto",
        sheet ? "flex flex-col justify-end md:justify-center md:p-4" : "flex items-center justify-center p-4",
      )}>
        <DialogPanel
          transition
          className={cn(
            "relative w-full bg-surface-container overflow-hidden",
            "border border-white/10 shadow-2xl",
            "transition-all duration-300 ease-out data-closed:opacity-0",
            sheet
              ? "rounded-t-3xl md:rounded-3xl data-closed:translate-y-full md:data-closed:translate-y-0 md:data-closed:scale-95"
              : "rounded-3xl data-closed:scale-95",
            sizes[size],
            className,
          )}
        >
          {/* Header */}
          {hasHeader && (
            <div className={cn(
              "flex items-start justify-between gap-4 px-6",
              title || description || headerExtra ? "pt-6 pb-5 border-b border-white/5" : "pt-4 pb-2",
            )}>
              <div className="flex-1 min-w-0">
                {headerExtra}
                {title && (
                  <DialogTitle
                    as="h2"
                    className="text-xl font-headline font-extrabold text-on-surface"
                  >
                    {title}
                  </DialogTitle>
                )}
                {description && (
                  <Description className="mt-1 text-sm text-on-surface-variant">
                    {description}
                  </Description>
                )}
              </div>

              {!hideCloseButton && (
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          {children && <div className="p-6">{children}</div>}

          {/* Footer */}
          {footer && (
            <div className="px-6 pb-6 pt-2 flex items-center justify-end gap-3">
              {footer}
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}

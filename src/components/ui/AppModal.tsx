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
  title: string;
  description?: string;
  /** Optional content rendered below the title/description in the header area */
  headerExtra?: ReactNode;
  children?: ReactNode;
  /** Optional footer — typically action buttons */
  footer?: ReactNode;
  size?: keyof typeof sizes;
  /** Hide the X close button */
  hideCloseButton?: boolean;
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
  className,
}: AppModalProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-200">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-out data-closed:opacity-0"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className={cn(
              "relative w-full bg-surface-container rounded-3xl overflow-hidden",
              "border border-white/10 shadow-2xl",
              "transition-all duration-300 ease-out data-closed:scale-95 data-closed:opacity-0",
              sizes[size],
              className,
            )}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-5 border-b border-white/5 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <DialogTitle
                  as="h2"
                  className="text-xl font-headline font-extrabold text-on-surface"
                >
                  {title}
                </DialogTitle>
                {description && (
                  <Description className="mt-1 text-sm text-on-surface-variant">
                    {description}
                  </Description>
                )}
                {headerExtra}
              </div>

              {!hideCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

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
      </div>
    </Dialog>
  );
}

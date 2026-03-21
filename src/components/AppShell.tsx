import type { ReactNode } from "react";
import { AnimatePresence } from "motion/react";
import { useAuthStore } from "@/store/auth-store";
import { useInit } from "@/hooks/queries/use-init";
import { AppLoader } from "@/components/AppLoader";

/**
 * Blocks main app content until auth has hydrated from storage and /core/init has completed once.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const hydrated = useAuthStore((s) => s.hydrated);
  const initQuery = useInit();
  const ready = hydrated && initQuery.isFetched;

  return (
    <>
      <AnimatePresence mode="wait">{!ready ? <AppLoader key="app-loader" /> : null}</AnimatePresence>
      {ready ? children : null}
    </>
  );
}

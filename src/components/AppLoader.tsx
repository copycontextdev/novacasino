import { motion } from "motion/react";
import { APP_NAME, APP_LOGO_SRC } from "@/lib/app_constants";

/** Full-screen bootstrap loader; mount inside `<AnimatePresence>` for exit fade. */
export function AppLoader() {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={`Loading ${APP_NAME}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[400] flex flex-col items-center justify-center bg-surface gap-8"
    >
      <motion.div
        animate={{ scale: [1, 1.04, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <img
          src={APP_LOGO_SRC}
          alt=""
          className="h-24 w-24 md:h-28 md:w-28 object-contain drop-shadow-[0_12px_40px_rgba(167,165,255,0.35)]"
          width={112}
          height={112}
        />
      </motion.div>
      <div className="flex flex-col items-center gap-3">
        <p className="font-headline text-lg font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dim">
          {APP_NAME}
        </p>
        <div className="h-1 w-40 rounded-full bg-surface-container-highest overflow-hidden">
          <motion.div
            className="h-full w-1/3 rounded-full bg-gradient-to-r from-primary to-primary-dim"
            animate={{ x: ["-100%", "280%"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

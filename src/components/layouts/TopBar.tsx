 
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  LogOut,
  UserCircle,
  Search,
  Wallet,
  Loader2,
} from "lucide-react";
import { APP_NAME, APP_LOGO_SRC } from "@/lib/app_constants";
import { useAuthStore } from "@/store/auth-store";

const TopBar = ({
  walletBalanceLabel,
  walletLoading,
  isLoggedIn,
  onLoginClick,
  onLogout,
  onProfileClick,
  onDepositClick,
}: {
  walletBalanceLabel: string;
  walletLoading: boolean;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
  onProfileClick: () => void;
  onDepositClick: () => void;
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const member = useAuthStore((s) => s.member);
  const displayName =
    member?.name ||
    [member?.first_name, member?.last_name].filter(Boolean).join(" ") ||
    member?.username ||
    "Player";

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 z-50 bg-surface/80 backdrop-blur-xl h-16 flex justify-between items-center px-4 md:px-6 border-b border-white/5">
      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
        <img
          src={APP_LOGO_SRC}
          alt=""
          className="h-8 w-8 md:h-9 md:w-9 shrink-0 object-contain rounded-xl border border-white/10 bg-surface-container-low p-0.5"
          width={36}
          height={36}
        />
        <span className="font-headline font-extrabold text-sm text-on-surface truncate lg:hidden">{APP_NAME}</span>
        <div className="relative w-full max-w-md hidden lg:block min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
          <input
            className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary/20 placeholder:text-on-surface-variant/50"
            placeholder="Search games, providers..."
            type="text"
            readOnly
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isLoggedIn ? (
          <>
            <div className="flex items-center gap-1.5 bg-surface-container-highest px-3 py-1.5 rounded-full border border-white/5 min-w-[5rem] justify-center">
              <Wallet className="text-tertiary w-4 h-4 fill-tertiary shrink-0" />
              {walletLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              ) : (
                <span className="font-headline font-bold text-xs md:text-sm">{walletBalanceLabel}</span>
              )}
            </div>
            <button
              type="button"
              onClick={onDepositClick}
              className="bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold px-4 py-1.5 rounded-full text-xs md:text-sm active:scale-95 transition-transform shadow-lg shadow-primary/20"
            >
              Deposit
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border border-white/5 hover:bg-surface-bright transition-colors active:scale-95"
              >
                <User className="w-5 h-5 text-on-surface" />
              </button>
              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-surface-container-high/95 backdrop-blur-2xl rounded-2xl p-4 shadow-2xl shadow-primary/20 z-50 border border-white/10"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-headline font-bold text-sm text-on-surface">{displayName}</p>
                          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                            {member?.phone_number ?? ""}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="w-full mt-1 flex items-center gap-3 px-3 py-2.5 text-primary hover:bg-primary/10 rounded-xl transition-colors font-bold text-sm"
                        onClick={() => {
                          setIsProfileOpen(false);
                          onProfileClick();
                        }}
                      >
                        <UserCircle className="w-4 h-4" />
                        <span>View Profile</span>
                      </button>
                      <button
                        type="button"
                        className="w-full mt-1 flex items-center gap-3 px-3 py-2.5 text-error hover:bg-error/10 rounded-xl transition-colors font-bold text-sm"
                        onClick={() => {
                          setIsProfileOpen(false);
                          onLogout();
                        }}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={onLoginClick}
            className="bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold px-6 py-2 rounded-full text-sm active:scale-95 transition-transform shadow-lg shadow-primary/20"
          >
            Login / Register
          </button>
        )}
      </div>
    </header>
  );
};

export default TopBar

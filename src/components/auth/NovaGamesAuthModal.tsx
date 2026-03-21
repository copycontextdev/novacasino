import { type ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import type { AuthView } from "@/types/auth-ui.types";
import { APP_NAME, APP_LOGO_SRC } from "@/lib/app_constants";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import OTPForm from "./OTPForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";

const viewTitles: Record<AuthView, string> = {
  login: "Welcome Back",
  register: "Create Account",
  otp: "Verify OTP",
  "forgot-password": "Recover Account",
  "reset-password": "Reset Password",
};

function AuthFlow() {
  const [activeView, setActiveView] = useState<AuthView>("login");
  const [otpPhone, setOtpPhone] = useState("");
  const [resetOtpId, setResetOtpId] = useState("");
  const [resetPhone, setResetPhone] = useState("");

  const renderActiveView = () => {
    if (activeView === "login") {
      return (
        <LoginForm
          onSwitchToRegister={() => setActiveView("register")}
          onSwitchToForgotPassword={() => setActiveView("forgot-password")}
        />
      );
    }
    if (activeView === "register") {
      return (
        <RegisterForm
          onSuccess={(phone) => {
            setOtpPhone(phone);
            setActiveView("otp");
          }}
          onSwitchToLogin={() => setActiveView("login")}
        />
      );
    }
    if (activeView === "otp") {
      return <OTPForm phoneNumber={otpPhone} onSuccess={() => setActiveView("login")} />;
    }
    if (activeView === "forgot-password") {
      return (
        <ForgotPasswordForm
          onSuccess={({ phoneNumber, otpId }) => {
            setResetPhone(phoneNumber);
            setResetOtpId(otpId);
            setActiveView("reset-password");
          }}
          onSwitchToLogin={() => setActiveView("login")}
        />
      );
    }
    return (
      <ResetPasswordForm
        otpId={resetOtpId}
        phoneNumber={resetPhone}
        onSuccess={() => setActiveView("login")}
        onBack={() => setActiveView("forgot-password")}
      />
    );
  };

  const subtitle: ReactNode =
    activeView === "otp" && otpPhone ? (
      <p className="text-on-surface-variant text-sm mt-1">Phone: {otpPhone}</p>
    ) : activeView === "reset-password" && resetPhone ? (
      <p className="text-on-surface-variant text-sm mt-1">Phone: {resetPhone}</p>
    ) : (
      <p className="text-on-surface-variant text-sm mt-1">
        {activeView === "login" && `Sign in to ${APP_NAME}`}
        {activeView === "register" && "Create an account to start playing"}
        {activeView === "forgot-password" && "We will send reset instructions"}
        {activeView === "reset-password" && "Choose a new password"}
      </p>
    );

  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-surface-container-lowest border border-white/10 p-2 mx-auto mb-4 shadow-lg shadow-primary/15 flex items-center justify-center overflow-hidden">
          <img src={APP_LOGO_SRC} alt="" className="w-full h-full object-contain" width={56} height={56} />
        </div>
        <h2 className="text-2xl font-headline font-extrabold text-white tracking-tight">{viewTitles[activeView]}</h2>
        {subtitle}
      </div>
      {renderActiveView()}
    </div>
  );
}

export function NovaGamesAuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [flowKey, setFlowKey] = useState(0);

  useEffect(() => {
    if (open) setFlowKey((k) => k + 1);
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-surface-container rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/10 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-[210] w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest/60 backdrop-blur-md text-on-surface hover:bg-surface-bright"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <AuthFlow key={flowKey} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

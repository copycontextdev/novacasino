
import {
  UserCircle,
  Settings,
  HelpCircle,
} from "lucide-react";
import { APP_NAME, APP_LOGO_SRC } from "@/lib/app_constants";
import { useAuthStore } from "@/store/auth-store";
import {
  BONUS_NAV_ITEMS,
  PRIMARY_NAV_ITEMS,
} from "@/components/layouts/navigation-items";


const Sidebar = ({
  activeTab,
  setActiveTab,
  isLoggedIn,
  onLoginClick,
  onHelpClick,
}: {
  activeTab: string;
  setActiveTab: (t: string) => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onHelpClick: () => void;
}) => {
  const member = useAuthStore((s) => s.member);
  const displayName =
    member?.name ||
    [member?.first_name, member?.last_name].filter(Boolean).join(" ") ||
    "Player";

  return (
    <aside className="hidden md:flex flex-col py-8 px-4 gap-4 h-screen w-64 border-r border-white/15 bg-surface fixed left-0 top-0 z-[60]">
      <button
        type="button"
        onClick={() => setActiveTab("lobby")}
        className="mb-8 px-4 flex items-center rounded-2xl text-left transition-opacity hover:opacity-90 active:scale-[0.98]"
        aria-label={`Go to ${APP_NAME} home`}
      >
        <img
          src={APP_LOGO_SRC}
          alt=""
          className="h-20 w-auto object-contain shrink-0 drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)]"
          width={120}
          height={80}
        />
      </button>
      {isLoggedIn ? (
        <div className="flex items-center gap-3 px-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center">
            <UserCircle className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-headline font-bold text-sm text-on-surface">{displayName}</p>
            <p className="text-[10px] uppercase tracking-widest text-tertiary-dim font-bold">Member</p>
          </div>
        </div>
      ) : (
        <div className="px-4 mb-6">
          <button
            type="button"
            onClick={onLoginClick}
            className="w-full py-3 bg-surface-container-high hover:bg-surface-bright border border-white/5 rounded-2xl flex items-center justify-center gap-2 text-primary font-bold text-sm transition-all active:scale-95"
          >
            <UserCircle className="w-5 h-5" />
            Login / Register
          </button>
        </div>
      )}
      <nav className="flex flex-col gap-1 flex-1">
        {PRIMARY_NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 px-4 py-3 font-semibold text-sm rounded-full transition-all duration-200 ${
              activeTab === item.id
                ? "bg-primary/10 text-primary translate-x-1"
                : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}

        <div className="px-4 pt-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-on-surface-variant/70">
            Bonuses
          </p>
        </div>

        {BONUS_NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 px-4 py-3 font-semibold text-sm rounded-full transition-all duration-200 ${
              activeTab === item.id
                ? "bg-primary/10 text-primary translate-x-1"
                : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="flex flex-col gap-1 border-t border-white/10 pt-4">
        <button
          type="button"
          className="flex items-center gap-3 text-on-surface-variant px-4 py-3 hover:text-on-surface hover:bg-white/5 rounded-full transition-colors font-semibold text-sm"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
        <button
          type="button"
          onClick={onHelpClick}
          className="flex items-center gap-3 text-on-surface-variant px-4 py-3 hover:text-on-surface hover:bg-white/5 rounded-full transition-colors font-semibold text-sm"
        >
          <HelpCircle className="w-5 h-5" />
          <span>Support</span>
        </button>
      </div>
    </aside>
  );
};
 
export default Sidebar

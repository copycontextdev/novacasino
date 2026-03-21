/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  LogOut,
  Phone,
  UserCircle,
  Grid2X2,
  Dices,
  Video,
  Gamepad2,
  Star,
  Settings,
  HelpCircle,
  Search,
  Wallet,
  X,
  Rocket,
  Trophy,
  Zap,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileUp,
  History,
  Home,
  Gift,
  Award,
  Play,
  Plus,
  Edit,
  Trash2,
  Mail,
  ShieldCheck,
  Loader2,
  Landmark,
} from "lucide-react";
import { NebulaAuthModal } from "@/components/auth/NebulaAuthModal";
import { useAuthStore } from "@/store/auth-store";
import { useUiStore } from "@/store/ui-store";
import { useLobby } from "@/hooks/queries/use-lobby";
import { useTopGames } from "@/hooks/queries/use-top-games";
import { useProviders } from "@/hooks/queries/use-providers";
import { useGames } from "@/hooks/queries/use-games";
import { useInit } from "@/hooks/queries/use-init";
import { useWallet } from "@/hooks/queries/use-wallet";
import {
  useMyDepositOrders,
  useMyWithdrawalOrders,
  useUserBankInfoList,
} from "@/hooks/queries/use-payment-queries";
import { useCreateDeposit, useUpdateDeposit } from "@/hooks/mutations/use-deposit";
import {
  useCreateWithdrawal,
  useAddUserBankInfo,
} from "@/hooks/mutations/use-withdrawal";
import { useUpdateMember } from "@/hooks/mutations/use-update-member";
import { getAgentBanks, getAgentBankInfo } from "@/lib/api-methods/payment.api";
import {
  toArray,
  toPositiveNumber,
  extractEnvelopeData,
} from "@/lib/payment-utils";
import { formatBalance } from "@/lib/format";
import type {
  SabiGame,
  SabiGameCategory,
  SabiProvider,
  SabiDepositOrder,
  SabiWithdrawalOrder,
  SabiUserBankInfo,
  SabiPaymentBank,
  SabiAgentBankInfo,
} from "@/types/api.types";

function resolveProviderName(game: SabiGame, providers: SabiProvider[]): string {
  const key = String(game.provider);
  const p = providers.find(
    (item) =>
      item.uuid === key || String(item.id) === key || item.name.toLowerCase() === key.toLowerCase(),
  );
  if (p) return p.name;
  if (typeof game.provider === "string") return game.provider;
  return "Provider";
}

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
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
          <input
            className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary/20 placeholder:text-on-surface-variant/50"
            placeholder="Search games, providers..."
            type="text"
            readOnly
          />
        </div>
        <div className="md:hidden flex flex-col">
          <span className="text-sm font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dim font-headline">
            NEBULA
          </span>
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

const Sidebar = ({
  activeTab,
  setActiveTab,
  isLoggedIn,
  onLoginClick,
}: {
  activeTab: string;
  setActiveTab: (t: string) => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
}) => {
  const member = useAuthStore((s) => s.member);
  const displayName =
    member?.name ||
    [member?.first_name, member?.last_name].filter(Boolean).join(" ") ||
    "Player";

  const navItems = [
    { id: "lobby", label: "Lobby", icon: Grid2X2 },
    { id: "slots", label: "Slots", icon: Dices },
    { id: "live", label: "Live Casino", icon: Video },
    { id: "sports", label: "Sports", icon: Gamepad2 },
    { id: "vip", label: "VIP Club", icon: Star },
    ...(isLoggedIn ? [{ id: "profile", label: "Profile", icon: UserCircle }] : []),
  ];

  return (
    <aside className="hidden md:flex flex-col py-8 px-4 gap-4 h-screen w-64 border-r border-white/15 bg-surface fixed left-0 top-0 z-[60]">
      <div className="mb-8 px-4">
        <span className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dim font-headline">
          NEBULA CASINO
        </span>
      </div>
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
        {navItems.map((item) => (
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
          className="flex items-center gap-3 text-on-surface-variant px-4 py-3 hover:text-on-surface hover:bg-white/5 rounded-full transition-colors font-semibold text-sm"
        >
          <HelpCircle className="w-5 h-5" />
          <span>Support</span>
        </button>
      </div>
    </aside>
  );
};

const BottomNav = ({
  activeTab,
  setActiveTab,
  isLoggedIn,
}: {
  activeTab: string;
  setActiveTab: (t: string) => void;
  isLoggedIn: boolean;
}) => {
  const items = [
    { id: "lobby", label: "Home", icon: Home },
    { id: "search", label: "Search", icon: Search },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "promotions", label: "Promos", icon: Gift },
    ...(isLoggedIn ? [{ id: "profile", label: "Profile", icon: UserCircle }] : []),
  ];
  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 h-16 bg-surface-container-low/95 backdrop-blur-xl z-50 rounded-2xl border border-primary/20 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center justify-around px-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center justify-center p-2 transition-all ${
            activeTab === item.id ? "text-primary" : "text-on-surface-variant/60"
          }`}
        >
          <item.icon className={`w-6 h-6 ${activeTab === item.id ? "fill-primary/20" : ""}`} />
          <span className="font-label text-[9px] font-bold uppercase mt-0.5">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

const GameCard = ({
  game,
  providerName,
  onClick,
}: {
  game: SabiGame;
  providerName: string;
  onClick: () => void;
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-surface-container-highest cursor-pointer border border-white/5"
  >
    <img
      alt={game.name}
      className="w-full h-full object-cover transition-transform duration-500"
      src={game.default_logo || undefined}
      referrerPolicy="no-referrer"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
    {game.label ? (
      <div className="absolute top-2 left-2 flex gap-2">
        <span className="glass-panel px-1.5 py-0.5 rounded text-[8px] font-bold text-tertiary border border-tertiary/20">
          {game.label}
        </span>
      </div>
    ) : null}
    <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4">
      <p className="font-headline font-extrabold text-[10px] md:text-sm text-white mb-0.5 md:mb-1 truncate">
        {game.name}
      </p>
      <p className="text-[8px] md:text-[10px] text-on-surface-variant font-bold uppercase tracking-widest truncate">
        {providerName}
      </p>
    </div>
  </motion.div>
);

const GameModal = ({
  game,
  onClose,
  onPlayReal,
  onPlayDemo,
  similarGames,
  providers,
}: {
  game: SabiGame | null;
  onClose: () => void;
  onPlayReal: () => void;
  onPlayDemo: () => void;
  similarGames: SabiGame[];
  providers: SabiProvider[];
}) => {
  if (!game) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm px-0 md:px-4"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="relative w-full max-w-lg bg-surface-container rounded-t-3xl md:rounded-3xl overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.6)] flex flex-col max-h-[90vh]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-[110] w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest/60 backdrop-blur-md text-on-surface hover:bg-surface-bright"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="relative w-full aspect-[4/3] bg-surface-container-lowest flex items-center justify-center overflow-hidden">
          <img
            alt={game.name}
            className="w-full h-full object-cover"
            src={game.default_logo || undefined}
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-6 left-6 z-20 flex items-center gap-4">
            <div>
              <h1 className="font-headline text-2xl font-extrabold text-white tracking-tight">{game.name}</h1>
              <p className="text-primary text-sm font-semibold">{resolveProviderName(game, providers)}</p>
            </div>
          </div>
        </div>
        <div className="px-6 pb-8 pt-2 flex flex-col gap-6 overflow-y-auto">
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={onPlayReal}
              className="w-full py-5 bg-gradient-to-r from-primary to-primary-dim rounded-full text-on-primary font-headline font-extrabold text-lg shadow-[0_10px_30px_rgba(99,102,241,0.4)] active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <Play className="w-6 h-6 fill-on-primary" />
              Play Now
            </button>
            {game.demo_support ? (
              <button
                type="button"
                onClick={onPlayDemo}
                className="w-full py-4 bg-transparent border-2 border-primary/20 rounded-full text-primary font-headline font-bold text-md hover:bg-primary/5 active:scale-95 transition-all"
              >
                Play Demo
              </button>
            ) : null}
          </div>
          {similarGames.length > 0 ? (
            <div className="flex flex-col gap-4">
              <h3 className="font-headline font-bold text-on-surface px-2">Similar Games</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {similarGames.map((sg) => (
                  <div key={sg.uuid} className="flex-none w-32">
                    <div className="aspect-square rounded-3xl overflow-hidden bg-surface-container-highest mb-2">
                      <img
                        alt={sg.name}
                        className="w-full h-full object-cover"
                        src={sg.default_logo || undefined}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <p className="text-xs font-bold text-on-surface text-center truncate px-1">{sg.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
};

function useLobbyGamesFiltered(
  lobbyCategories: SabiGameCategory[],
  navTab: string,
  categoryFilter: string,
): { trending: SabiGame[]; gridGames: SabiGame[] } {
  return useMemo(() => {
    const flat: SabiGame[] = [];
    const seen = new Set<string>();
    for (const cat of lobbyCategories) {
      for (const g of cat.games) {
        if (!seen.has(g.uuid)) {
          seen.add(g.uuid);
          flat.push(g);
        }
      }
    }

    const byNav = (games: SabiGame[]) => {
      const n = navTab.toLowerCase();
      if (n === "slots")
        return games.filter(
          (g) =>
            g.name.toLowerCase().includes("slot") ||
            lobbyCategories.some(
              (c) =>
                (c.slug?.toLowerCase().includes("slot") || c.name.toLowerCase().includes("slot")) &&
                c.games.some((x) => x.uuid === g.uuid),
            ),
        );
      if (n === "live")
        return games.filter(
          (g) =>
            lobbyCategories.some(
              (c) =>
                (c.slug?.toLowerCase().includes("live") || c.name.toLowerCase().includes("live")) &&
                c.games.some((x) => x.uuid === g.uuid),
            ) || g.name.toLowerCase().includes("live"),
        );
      if (n === "sports")
        return games.filter(
          (g) =>
            lobbyCategories.some(
              (c) =>
                (c.slug?.toLowerCase().includes("sport") || c.name.toLowerCase().includes("sport")) &&
                c.games.some((x) => x.uuid === g.uuid),
            ) || g.name.toLowerCase().includes("sport"),
        );
      return games;
    };

    let base = byNav(flat);
    if (categoryFilter && categoryFilter !== "All") {
      const cat = lobbyCategories.find((c) => c.name === categoryFilter);
      base = cat ? cat.games : base;
    }

    const trending = flat.filter((g) => g.is_top_game).slice(0, 20);
    return {
      trending: trending.length ? trending : base.slice(0, 12),
      gridGames: base,
    };
  }, [lobbyCategories, navTab, categoryFilter]);
}

export default function App() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hydrated = useAuthStore((s) => s.hydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const member = useAuthStore((s) => s.member);
  const logout = useAuthStore((s) => s.logout);
  const authModalOpen = useUiStore((s) => s.authModalOpen);
  const openAuthModal = useUiStore((s) => s.openAuthModal);
  const closeAuthModal = useUiStore((s) => s.closeAuthModal);

  const [activeTab, setActiveTab] = useState("lobby");
  const [selectedGame, setSelectedGame] = useState<SabiGame | null>(null);
  const [lobbyCategoryFilter, setLobbyCategoryFilter] = useState("All");
  const [searchInput, setSearchInput] = useState("");

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmOrder, setConfirmOrder] = useState<SabiDepositOrder | null>(null);

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);

  const initQuery = useInit();
  const lobbyQuery = useLobby();
  const topGamesQuery = useTopGames();
  const providersQuery = useProviders();
  const walletQuery = useWallet();
  const depositsQuery = useMyDepositOrders();
  const withdrawalsQuery = useMyWithdrawalOrders();
  const userBanksQuery = useUserBankInfoList();

  const gamesSearchQuery = useGames(
    searchInput.trim().length >= 2 ? { name: searchInput.trim() } : undefined,
  );

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "wallet" || tab === "profile" || tab === "lobby") setActiveTab(tab);
  }, [searchParams]);

  const lobbyCategories = lobbyQuery.data ?? [];
  const providers = useMemo(
    () => toArray<SabiProvider>(providersQuery.data),
    [providersQuery.data],
  );
  const { trending: trendingGames, gridGames: lobbyGridGames } = useLobbyGamesFiltered(
    lobbyCategories,
    activeTab,
    lobbyCategoryFilter,
  );

  const topFromApi = useMemo(() => topGamesQuery.data?.results ?? [], [topGamesQuery.data?.results]);
  const displayTrending = topFromApi.length ? topFromApi : trendingGames;

  const searchGames = useMemo(() => gamesSearchQuery.data?.results ?? [], [gamesSearchQuery.data?.results]);

  const currencyLabel =
    initQuery.data?.company_info?.currency ?? walletQuery.data?.currency ?? "ETB";
  const minDeposit = toPositiveNumber(initQuery.data?.system_config?.min_deposit_amount, 50);
  const maxDeposit = toPositiveNumber(initQuery.data?.system_config?.max_deposit_amount, 1_000_000);

  const walletBalanceLabel = walletQuery.data
    ? `${currencyLabel} ${formatBalance(walletQuery.data.balance)}`
    : `${currencyLabel} 0.00`;

  const createDeposit = useCreateDeposit();
  const updateDeposit = useUpdateDeposit();
  const createWithdrawal = useCreateWithdrawal();
  const addUserBank = useAddUserBankInfo();
  const updateMember = useUpdateMember();

  const depositModalOpen = isDepositModalOpen && hydrated && isAuthenticated;
  const depositBanksQuery = useQuery({
    queryKey: ["deposit-modal-banks"],
    queryFn: () => getAgentBanks({ type: "deposit" }),
    enabled: depositModalOpen,
    staleTime: 60_000,
  });
  const [depositAmount, setDepositAmount] = useState("");
  const [selectedBankUuid, setSelectedBankUuid] = useState("");
  const [selectedBankInfoUuid, setSelectedBankInfoUuid] = useState("");
  const depositBanks = useMemo(() => toArray<SabiPaymentBank>(depositBanksQuery.data), [depositBanksQuery.data]);
  const amountNum = Number(depositAmount);
  const bankInfoQuery = useQuery({
    queryKey: ["deposit-modal-bank-info", selectedBankUuid, amountNum],
    queryFn: () => getAgentBankInfo(selectedBankUuid, { amount: depositAmount }),
    enabled: depositModalOpen && !!selectedBankUuid && Number.isFinite(amountNum) && amountNum > 0,
    staleTime: 15_000,
  });
  const bankInfoOptions = useMemo(
    () => bankInfoQuery.data?.results ?? [],
    [bankInfoQuery.data?.results],
  );
  const effectiveBankInfoUuid = useMemo(() => {
    if (selectedBankInfoUuid && bankInfoOptions.some((i) => i.uuid === selectedBankInfoUuid))
      return selectedBankInfoUuid;
    return bankInfoOptions[0]?.uuid ?? "";
  }, [bankInfoOptions, selectedBankInfoUuid]);

  const categoryChips = useMemo(() => {
    const names = lobbyCategories.map((c) => c.name).filter(Boolean);
    return ["All", ...names.slice(0, 8)];
  }, [lobbyCategories]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const openLogin = () => openAuthModal();

  const deposits = depositsQuery.data?.results ?? [];
  const withdrawals = withdrawalsQuery.data?.results ?? [];
  const userBanks = useMemo(() => toArray<SabiUserBankInfo>(userBanksQuery.data), [userBanksQuery.data]);

  const navigatePlay = (game: SabiGame, mode: "real" | "demo") => {
    setSelectedGame(null);
    navigate(`/play/${encodeURIComponent(game.slug)}?mode=${mode}`);
  };

  const LobbyPage = () => {
    if (lobbyQuery.isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-on-surface-variant text-sm font-bold">Loading lobby…</p>
        </div>
      );
    }
    if (lobbyQuery.isError) {
      return (
        <div className="rounded-2xl border border-error/30 bg-error/10 p-6 text-center">
          <p className="text-error font-bold">Could not load games</p>
          <button
            type="button"
            onClick={() => lobbyQuery.refetch()}
            className="mt-4 rounded-full bg-primary px-4 py-2 text-on-primary font-bold text-sm"
          >
            Retry
          </button>
        </div>
      );
    }
    return (
      <div className="space-y-8">
        <section className="relative h-48 md:h-80 rounded-2xl overflow-hidden bg-surface-container-high border border-white/5 flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent z-10" />
          <div className="relative z-20 p-6 md:p-12 max-w-lg">
            <h1 className="text-2xl md:text-5xl font-headline font-extrabold text-white tracking-tight mb-2">
              Welcome to <span className="text-primary">Nebula</span>
            </h1>
            <p className="text-on-surface-variant text-sm md:text-base mb-4">
              Real games, wallet, and secure payments — powered by Sabi.
            </p>
          </div>
        </section>
        <section className="space-y-4 md:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-2xl font-headline font-extrabold tracking-tight">Trending</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
            {displayTrending.map((game) => (
              <GameCard
                key={game.uuid}
                game={game}
                providerName={resolveProviderName(game, providers)}
                onClick={() => setSelectedGame(game)}
              />
            ))}
          </div>
        </section>
        <section className="space-y-4 md:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-2xl font-headline font-extrabold tracking-tight">All Games</h2>
          </div>
          <nav className="flex items-center gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {categoryChips.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setLobbyCategoryFilter(label)}
                className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
                  lobbyCategoryFilter === label
                    ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
                    : "bg-surface-container-high text-on-surface hover:bg-surface-bright border border-white/5"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-6">
            {lobbyGridGames.map((game) => (
              <GameCard
                key={game.uuid}
                game={game}
                providerName={resolveProviderName(game, providers)}
                onClick={() => setSelectedGame(game)}
              />
            ))}
          </div>
        </section>
      </div>
    );
  };

  const PromotionsPage = () => (
    <div className="space-y-8">
      <h2 className="text-2xl md:text-4xl font-headline font-extrabold tracking-tight">Promotions & Rewards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div className="glass-panel p-5 md:p-8 rounded-2xl border border-white/5 flex items-center gap-4 md:gap-6">
          <Gift className="w-12 h-12 text-primary shrink-0" />
          <div>
            <h3 className="text-sm md:text-xl font-headline font-extrabold mb-1">Daily Rewards</h3>
            <p className="text-[10px] md:text-sm text-on-surface-variant">Login daily for bonus opportunities.</p>
          </div>
        </div>
        <div className="glass-panel p-5 md:p-8 rounded-2xl border border-white/5 flex items-center gap-4 md:gap-6">
          <Award className="w-12 h-12 text-tertiary shrink-0" />
          <div>
            <h3 className="text-sm md:text-xl font-headline font-extrabold mb-1">VIP Rewards</h3>
            <p className="text-[10px] md:text-sm text-on-surface-variant">Level up for exclusive perks.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const WalletPage = () => {
    const [subTab, setSubTab] = useState<"deposits" | "withdrawals">("deposits");
    const w = walletQuery.data;

    if (!isAuthenticated) {
      return (
        <div className="text-center py-16">
          <p className="text-on-surface-variant font-bold mb-4">Login to view your wallet</p>
          <button
            type="button"
            onClick={openLogin}
            className="rounded-full bg-gradient-to-r from-primary to-primary-dim px-6 py-3 text-on-primary font-bold"
          >
            Login
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <section className="bg-surface-container-high rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-white/5">
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center justify-center border-r border-white/10 py-2">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Total</span>
              <span className="text-lg font-extrabold text-primary">
                {w ? `${currencyLabel} ${formatBalance(w.balance)}` : "—"}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center border-r border-white/10 py-2">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Bonus</span>
              <span className="text-lg font-extrabold text-tertiary">
                {w?.non_withdrawable_balance != null
                  ? formatBalance(w.non_withdrawable_balance)
                  : "—"}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center py-2">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Withdrawable</span>
              <span className="text-lg font-extrabold text-secondary">
                {w?.withdrawable_balance != null ? formatBalance(w.withdrawable_balance) : "—"}
              </span>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsDepositModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold py-3.5 rounded-2xl"
            >
              <ArrowDownLeft className="w-4 h-4" />
              Deposit
            </button>
            <button
              type="button"
              onClick={() => setIsWithdrawModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-surface-bright border border-primary/20 text-primary font-bold py-3.5 rounded-2xl"
            >
              <ArrowUpRight className="w-4 h-4" />
              Withdraw
            </button>
          </div>
        </section>
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-headline font-extrabold tracking-tight">History</h2>
            <div className="flex bg-surface-container-low p-1 rounded-full border border-white/5">
              <button
                type="button"
                onClick={() => setSubTab("deposits")}
                className={`px-4 py-1.5 text-[10px] font-bold uppercase rounded-full ${
                  subTab === "deposits" ? "bg-primary text-on-primary" : "text-on-surface-variant"
                }`}
              >
                Deposits
              </button>
              <button
                type="button"
                onClick={() => setSubTab("withdrawals")}
                className={`px-4 py-1.5 text-[10px] font-bold uppercase rounded-full ${
                  subTab === "withdrawals" ? "bg-primary text-on-primary" : "text-on-surface-variant"
                }`}
              >
                Withdrawals
              </button>
            </div>
          </div>
          {subTab === "deposits" ? (
            <div className="space-y-3">
              {depositsQuery.isLoading ? (
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              ) : deposits.length === 0 ? (
                <p className="text-center text-on-surface-variant py-8">No deposits yet</p>
              ) : (
                deposits.map((item) => (
                  <div
                    key={item.uuid}
                    className="bg-surface-container rounded-2xl p-4 flex items-center justify-between border border-white/5"
                  >
                    <div>
                      <p className="font-bold text-sm">{item.bank_name ?? "Deposit"}</p>
                      <p className="text-[10px] text-on-surface-variant">
                        {item.created_at ? new Date(item.created_at).toLocaleString() : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-headline font-bold text-primary">+{formatBalance(item.amount)}</p>
                      <p className="text-[10px] text-on-surface-variant">{item.status_display ?? item.status}</p>
                    </div>
                    {item.status === "pending" && !item.reference_number ? (
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmOrder(item);
                          setIsConfirmModalOpen(true);
                        }}
                        className="ml-2 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center"
                        title="Confirm"
                      >
                        <FileUp className="w-5 h-5" />
                      </button>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {withdrawalsQuery.isLoading ? (
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              ) : withdrawals.length === 0 ? (
                <p className="text-center text-on-surface-variant py-8">No withdrawals yet</p>
              ) : (
                withdrawals.map((item) => (
                  <div
                    key={item.uuid ?? String(item.amount)}
                    className="bg-surface-container rounded-2xl p-4 flex items-center justify-between border border-white/5"
                  >
                    <div>
                      <p className="font-bold text-sm">Withdrawal</p>
                      <p className="text-[10px] text-on-surface-variant">
                        {item.created_at ? new Date(item.created_at).toLocaleString() : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-headline font-bold text-secondary">-{formatBalance(item.amount ?? 0)}</p>
                      <p className="text-[10px] text-on-surface-variant">{item.status_display ?? item.status}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    );
  };

  const SearchPage = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-headline font-extrabold">Search Games</h2>
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
        <input
          className="w-full bg-surface-container-high border-none rounded-2xl py-4 pl-12 pr-4 text-lg focus:ring-2 focus:ring-primary/20"
          placeholder="Type at least 2 characters…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      {gamesSearchQuery.isFetching ? (
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {searchGames.map((game) => (
            <GameCard
              key={game.uuid}
              game={game}
              providerName={resolveProviderName(game, providers)}
              onClick={() => setSelectedGame(game)}
            />
          ))}
        </div>
      )}
      {searchInput.trim().length >= 2 && !gamesSearchQuery.isFetching && searchGames.length === 0 ? (
        <p className="text-on-surface-variant text-center py-8">No games found</p>
      ) : null}
    </div>
  );

  const ProfilePage = () => {
    if (!isAuthenticated || !member) {
      return (
        <div className="text-center py-16">
          <button
            type="button"
            onClick={openLogin}
            className="rounded-full bg-gradient-to-r from-primary to-primary-dim px-6 py-3 text-on-primary font-bold"
          >
            Login
          </button>
        </div>
      );
    }
    return (
      <div className="space-y-8 max-w-2xl mx-auto">
        <section className="bg-surface-container-high rounded-3xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <UserCircle className="w-12 h-12 text-primary" />
              <div>
                <h2 className="text-xl font-headline font-extrabold">
                  {member.name || [member.first_name, member.last_name].filter(Boolean).join(" ") || "Player"}
                </h2>
                <p className="text-[10px] text-on-surface-variant flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-primary" />
                  Verified
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsEditProfileModalOpen(true)}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-container rounded-2xl p-4 flex items-center gap-3">
              <Phone className="w-4 h-4 text-on-surface-variant" />
              <div>
                <div className="text-[8px] uppercase text-on-surface-variant font-bold">Phone</div>
                <div className="text-sm font-bold">{member.phone_number}</div>
              </div>
            </div>
            <div className="bg-surface-container rounded-2xl p-4 flex items-center gap-3">
              <Mail className="w-4 h-4 text-on-surface-variant" />
              <div>
                <div className="text-[8px] uppercase text-on-surface-variant font-bold">Email</div>
                <div className="text-sm font-bold">{member.email ?? "—"}</div>
              </div>
            </div>
          </div>
        </section>
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-headline font-extrabold">My Bank Accounts</h2>
            <button
              type="button"
              onClick={() => setIsAddAccountModalOpen(true)}
              className="flex items-center gap-2 text-[10px] font-bold uppercase text-primary"
            >
              <Plus className="w-3 h-3" />
              Add New
            </button>
          </div>
          <div className="space-y-3">
            {userBanksQuery.isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            ) : (
              userBanks.map((acc) => (
                <div
                  key={acc.uuid}
                  className="bg-surface-container rounded-2xl p-4 flex items-center justify-between border border-white/5"
                >
                  <div className="flex items-center gap-4">
                    <Landmark className="w-6 h-6 text-secondary" />
                    <div>
                      <div className="font-bold text-sm">{acc.account_name}</div>
                      <div className="text-[10px] text-on-surface-variant">
                        {acc.bank_name ?? acc.bank} • {acc.account_number}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "lobby":
      case "slots":
      case "live":
      case "sports":
      case "vip":
        return <LobbyPage />;
      case "promotions":
        return <PromotionsPage />;
      case "wallet":
        return <WalletPage />;
      case "search":
        return <SearchPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <LobbyPage />;
    }
  };

  const similarForModal = selectedGame
    ? displayTrending.filter((g) => g.uuid !== selectedGame.uuid).slice(0, 8)
    : [];

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoggedIn={isAuthenticated}
        onLoginClick={openLogin}
      />
      <main className="flex-1 md:ml-64 pb-32 md:pb-8 w-full max-w-full">
        <TopBar
          walletBalanceLabel={walletBalanceLabel}
          walletLoading={isAuthenticated && walletQuery.isLoading}
          isLoggedIn={isAuthenticated}
          onLoginClick={openLogin}
          onLogout={logout}
          onProfileClick={() => setActiveTab("profile")}
          onDepositClick={() => {
            if (!isAuthenticated) openLogin();
            else setIsDepositModalOpen(true);
          }}
        />
        <div className="pt-20 px-4 md:pt-24 md:px-8 max-w-full overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isLoggedIn={isAuthenticated} />
      <AnimatePresence>
        {selectedGame ? (
          <GameModal
            game={selectedGame}
            onClose={() => setSelectedGame(null)}
            onPlayReal={() => navigatePlay(selectedGame, "real")}
            onPlayDemo={() => navigatePlay(selectedGame, "demo")}
            similarGames={similarForModal}
            providers={providers}
          />
        ) : null}
      </AnimatePresence>
      <NebulaAuthModal open={authModalOpen} onClose={closeAuthModal} />
      <DepositModal
        open={isDepositModalOpen}
        onClose={() => {
          setIsDepositModalOpen(false);
          setDepositAmount("");
          setSelectedBankUuid("");
          setSelectedBankInfoUuid("");
        }}
        currencyLabel={currencyLabel}
        minDeposit={minDeposit}
        maxDeposit={maxDeposit}
        depositBanks={depositBanks}
        bankInfoOptions={bankInfoOptions}
        amountValue={depositAmount}
        onAmountChange={setDepositAmount}
        selectedBankUuid={selectedBankUuid}
        onBankChange={(id) => {
          setSelectedBankUuid(id);
          setSelectedBankInfoUuid("");
        }}
        selectedBankInfoUuid={effectiveBankInfoUuid}
        onBankInfoChange={setSelectedBankInfoUuid}
        isCreating={createDeposit.isPending}
        onCreate={() => {
          const parsed = Number(depositAmount);
          if (!effectiveBankInfoUuid || !Number.isFinite(parsed) || parsed < minDeposit || parsed > maxDeposit)
            return;
          createDeposit.mutate(
            { amount: depositAmount, agent_bank_info_id: effectiveBankInfoUuid },
            {
              onSuccess: (res) => {
                const order = extractEnvelopeData<SabiDepositOrder>(res);
                if (order) {
                  setIsDepositModalOpen(false);
                  setConfirmOrder(order);
                  setIsConfirmModalOpen(true);
                }
                depositsQuery.refetch();
              },
            },
          );
        }}
      />
      <DepositConfirmationModal
        open={isConfirmModalOpen}
        order={confirmOrder}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setConfirmOrder(null);
        }}
        isSubmitting={updateDeposit.isPending}
        onSubmit={(reference, file) => {
          if (!confirmOrder?.uuid) return;
          updateDeposit.mutate(
            { uuid: confirmOrder.uuid, body: { reference_number: reference, receipt: file ?? undefined } },
            {
              onSuccess: () => {
                setIsConfirmModalOpen(false);
                setConfirmOrder(null);
                walletQuery.refetch();
                depositsQuery.refetch();
              },
            },
          );
        }}
      />
      <WithdrawModal
        open={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        userBanks={userBanks}
        withdrawable={walletQuery.data?.withdrawable_balance}
        currencyLabel={currencyLabel}
        isSubmitting={createWithdrawal.isPending}
        onSubmit={(amount, bankUuid) => {
          createWithdrawal.mutate(
            { amount, bank_info_id: bankUuid },
            {
              onSuccess: () => {
                setIsWithdrawModalOpen(false);
                walletQuery.refetch();
                withdrawalsQuery.refetch();
              },
            },
          );
        }}
        onAddAccount={() => {
          setIsWithdrawModalOpen(false);
          setIsAddAccountModalOpen(true);
        }}
      />
      {member ? (
        <EditProfileModal
          open={isEditProfileModalOpen}
          member={member}
          onClose={() => setIsEditProfileModalOpen(false)}
          isSubmitting={updateMember.isPending}
          onSave={(body) => updateMember.mutate(body, { onSuccess: () => setIsEditProfileModalOpen(false) })}
        />
      ) : null}
      <AddAccountModal
        open={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        onSuccess={() => {
          setIsAddAccountModalOpen(false);
          userBanksQuery.refetch();
        }}
      />
    </div>
  );
}

function DepositModal({
  open,
  onClose,
  currencyLabel,
  minDeposit,
  maxDeposit,
  depositBanks,
  bankInfoOptions,
  amountValue,
  onAmountChange,
  selectedBankUuid,
  onBankChange,
  selectedBankInfoUuid,
  onBankInfoChange,
  isCreating,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  currencyLabel: string;
  minDeposit: number;
  maxDeposit: number;
  depositBanks: SabiPaymentBank[];
  bankInfoOptions: SabiAgentBankInfo[];
  amountValue: string;
  onAmountChange: (v: string) => void;
  selectedBankUuid: string;
  onBankChange: (v: string) => void;
  selectedBankInfoUuid: string;
  onBankInfoChange: (v: string) => void;
  isCreating: boolean;
  onCreate: () => void;
}) {
  if (!open) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-surface-container rounded-3xl overflow-hidden border border-white/10 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-headline font-extrabold">Deposit</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-[10px] text-on-surface-variant font-bold uppercase">
            Limits: {currencyLabel} {minDeposit} – {maxDeposit}
          </p>
          <label className="block space-y-1">
            <span className="text-[10px] font-bold uppercase text-on-surface-variant">Amount</span>
            <input
              type="number"
              className="w-full bg-surface-container-high rounded-2xl py-3 px-4 text-on-surface border border-white/5"
              value={amountValue}
              onChange={(e) => onAmountChange(e.target.value)}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-[10px] font-bold uppercase text-on-surface-variant">Bank</span>
            <select
              className="w-full bg-surface-container-high rounded-2xl py-3 px-4 text-on-surface border border-white/5"
              value={selectedBankUuid}
              onChange={(e) => onBankChange(e.target.value)}
            >
              <option value="">Select bank</option>
              {depositBanks.map((b) => (
                <option key={b.uuid} value={b.uuid}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-[10px] font-bold uppercase text-on-surface-variant">Receiving account</span>
            <select
              className="w-full bg-surface-container-high rounded-2xl py-3 px-4 text-on-surface border border-white/5"
              value={selectedBankInfoUuid}
              onChange={(e) => onBankInfoChange(e.target.value)}
            >
              <option value="">Select account</option>
              {bankInfoOptions.map((info) => (
                <option key={info.uuid} value={info.uuid}>
                  {info.account_name} — {info.account_number}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            disabled={isCreating}
            onClick={onCreate}
            className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-extrabold disabled:opacity-50"
          >
            {isCreating ? "Creating…" : "Create deposit order"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DepositConfirmationModal({
  open,
  order,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  open: boolean;
  order: SabiDepositOrder | null;
  onClose: () => void;
  onSubmit: (reference: string, file: File | null) => void;
  isSubmitting: boolean;
}) {
  const [reference, setReference] = useState("");
  const [file, setFile] = useState<File | null>(null);
  if (!open || !order) return null;
  return (
    <motion.div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <motion.div className="relative w-full max-w-md bg-surface-container rounded-3xl border border-white/10 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-headline font-extrabold">Confirm deposit</h2>
          <button type="button" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3 text-sm mb-4">
          <p>
            <span className="text-on-surface-variant">Amount:</span>{" "}
            <span className="font-bold text-primary">{formatBalance(order.amount)}</span>
          </p>
          <p>
            <span className="text-on-surface-variant">Bank:</span> {order.bank_name}
          </p>
        </div>
        <input
          className="w-full bg-surface-container-high rounded-2xl py-3 px-4 mb-3 border border-white/5"
          placeholder="Transaction reference"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />
        <input
          type="file"
          className="w-full text-xs text-on-surface-variant mb-4"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          disabled={isSubmitting || !reference.trim()}
          onClick={() => onSubmit(reference.trim(), file)}
          className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-extrabold disabled:opacity-50"
        >
          {isSubmitting ? "Submitting…" : "Submit"}
        </button>
      </motion.div>
    </motion.div>
  );
}

function WithdrawModal({
  open,
  onClose,
  userBanks,
  withdrawable,
  currencyLabel,
  isSubmitting,
  onSubmit,
  onAddAccount,
}: {
  open: boolean;
  onClose: () => void;
  userBanks: SabiUserBankInfo[];
  withdrawable?: string | number;
  currencyLabel: string;
  isSubmitting: boolean;
  onSubmit: (amount: string, bankUuid: string) => void;
  onAddAccount: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [selected, setSelected] = useState("");
  if (!open) return null;
  const maxStr = withdrawable != null ? String(withdrawable) : "";
  return (
    <motion.div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <motion.div className="relative w-full max-w-md bg-surface-container rounded-3xl border border-white/10 p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-headline font-extrabold">Withdraw</h2>
          <button type="button" onClick={onClose}>
            <X />
          </button>
        </div>
        <p className="text-xs text-on-surface-variant mb-2">
          Available: {currencyLabel} {withdrawable != null ? formatBalance(withdrawable) : "—"}
        </p>
        <input
          type="number"
          className="w-full bg-surface-container-high rounded-2xl py-3 px-4 mb-3 border border-white/5"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
          {userBanks.map((b) => (
            <button
              key={b.uuid}
              type="button"
              onClick={() => setSelected(b.uuid)}
              className={`w-full p-3 rounded-2xl border text-left ${
                selected === b.uuid ? "border-primary bg-primary/10" : "border-white/10 bg-white/5"
              }`}
            >
              <div className="font-bold text-sm">{b.account_name}</div>
              <div className="text-[10px] text-on-surface-variant">{b.account_number}</div>
            </button>
          ))}
        </div>
        <button type="button" onClick={onAddAccount} className="w-full py-2 mb-3 text-xs font-bold text-primary border border-dashed border-white/20 rounded-2xl">
          + Add bank account
        </button>
        <button
          type="button"
          disabled={isSubmitting || !amount || !selected}
          onClick={() => onSubmit(amount, selected)}
          className="w-full py-4 rounded-full bg-gradient-to-r from-secondary to-primary-dim text-white font-extrabold disabled:opacity-50"
        >
          {isSubmitting ? "…" : "Confirm withdrawal"}
        </button>
      </motion.div>
    </motion.div>
  );
}

function EditProfileModal({
  open,
  member,
  onClose,
  onSave,
  isSubmitting,
}: {
  open: boolean;
  member: NonNullable<ReturnType<typeof useAuthStore.getState>["member"]>;
  onClose: () => void;
  onSave: (b: { first_name?: string; last_name?: string; email?: string }) => void;
  isSubmitting: boolean;
}) {
  const [first, setFirst] = useState(member?.first_name ?? "");
  const [last, setLast] = useState(member?.last_name ?? "");
  const [email, setEmail] = useState(member?.email ?? "");
  useEffect(() => {
    if (open && member) {
      setFirst(member.first_name ?? "");
      setLast(member.last_name ?? "");
      setEmail(member.email ?? "");
    }
  }, [open, member]);
  if (!open) return null;
  return (
    <motion.div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 px-4">
      <div className="w-full max-w-md bg-surface-container rounded-3xl border border-white/10 p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-headline font-extrabold">Edit profile</h2>
          <button type="button" onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="space-y-3">
          <input className="w-full bg-surface-container-high rounded-2xl py-3 px-4 border border-white/5" value={first} onChange={(e) => setFirst(e.target.value)} placeholder="First name" />
          <input className="w-full bg-surface-container-high rounded-2xl py-3 px-4 border border-white/5" value={last} onChange={(e) => setLast(e.target.value)} placeholder="Last name" />
          <input className="w-full bg-surface-container-high rounded-2xl py-3 px-4 border border-white/5" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
        </div>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => onSave({ first_name: first, last_name: last, email })}
          className="w-full mt-4 py-4 rounded-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-extrabold"
        >
          Save
        </button>
      </div>
    </motion.div>
  );
}

function AddAccountModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [bankUuid, setBankUuid] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const banksQuery = useQuery({
    queryKey: ["withdraw-banks-modal"],
    queryFn: () => getAgentBanks({ type: "withdraw" }),
    enabled: open,
  });
  const banks = useMemo(() => toArray<SabiPaymentBank>(banksQuery.data), [banksQuery.data]);
  const addBank = useAddUserBankInfo();

  if (!open) return null;
  return (
    <motion.div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 px-4">
      <div className="w-full max-w-md bg-surface-container rounded-3xl border border-white/10 p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-headline font-extrabold">Add bank account</h2>
          <button type="button" onClick={onClose}>
            <X />
          </button>
        </div>
        <select
          className="w-full bg-surface-container-high rounded-2xl py-3 px-4 mb-3 border border-white/5"
          value={bankUuid}
          onChange={(e) => setBankUuid(e.target.value)}
        >
          <option value="">Select bank</option>
          {banks.map((b) => (
            <option key={b.uuid} value={b.uuid}>
              {b.name}
            </option>
          ))}
        </select>
        <input
          className="w-full bg-surface-container-high rounded-2xl py-3 px-4 mb-3 border border-white/5"
          placeholder="Account holder name"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
        />
        <input
          className="w-full bg-surface-container-high rounded-2xl py-3 px-4 mb-3 border border-white/5"
          placeholder="Account number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
        <button
          type="button"
          disabled={addBank.isPending || !bankUuid || !accountName || !accountNumber}
          onClick={() =>
            addBank.mutate(
              { bank: bankUuid, account_name: accountName, account_number: accountNumber },
              { onSuccess: () => onSuccess() },
            )
          }
          className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-extrabold disabled:opacity-50"
        >
          {addBank.isPending ? "Saving…" : "Save"}
        </button>
      </div>
    </motion.div>
  );
}

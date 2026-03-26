/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { NovaGamesAuthModal } from "@/components/auth/NovaGamesAuthModal";
import { SUPPORT_TELEGRAM_URL } from "@/lib/app_constants";
import { useAuthStore } from "@/store/auth-store";
import { useBalanceStore } from "@/store/balance-store";
import { useUiStore } from "@/store/ui-store";
import { useUserBankInfoList } from "@/hooks/queries/use-payment-queries";
import { useUpdateMember } from "@/hooks/mutations/use-update-member";
import { useLobbyContent } from "@/hooks/use-lobby-content";
import { toArray } from "@/lib/payment-utils";
import { formatBalance } from "@/lib/format";
import type { SabiGame, SabiUserBankInfo } from "@/types/api.types";

import TopBar from "./components/layouts/TopBar";
import Sidebar from "./components/layouts/Sidebar";
import BottomNav from "./components/layouts/BottomNav";
import GameModal from "./components/game-components/GameModal";
import EditProfileModal from "./components/profile/EditProfileModal";
import AddAccountModal from "./components/profile/AddAccountModal";
import LobbySection from "./components/sections/LobbySection";
import PromotionsSection from "./components/sections/PromotionsSection";
import WalletSection from "./components/sections/WalletSection";
import SearchSection from "./components/sections/SearchSection";
import ProfileSection from "./components/sections/ProfileSection";

const TAB_PATHS = {
  lobby: "/",
  search: "/search",
  wallet: "/wallet",
  promotions: "/promotions",
  profile: "/profile",
} as const;

type AppTab = keyof typeof TAB_PATHS;

function isAppTab(value: string): value is AppTab {
  return value in TAB_PATHS;
}

function getTabPath(tab: string): string {
  return isAppTab(tab) ? TAB_PATHS[tab] : TAB_PATHS.lobby;
}

function getTabFromPathname(pathname: string): AppTab {
  const segment = pathname.split("/").filter(Boolean)[0];

  if (!segment) {
    return "lobby";
  }

  return isAppTab(segment) ? segment : "lobby";
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hydrated = useAuthStore((s) => s.hydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const member = useAuthStore((s) => s.member);
  const logout = useAuthStore((s) => s.logout);
  const authModalOpen = useUiStore((s) => s.authModalOpen);
  const openAuthModal = useUiStore((s) => s.openAuthModal);
  const closeAuthModal = useUiStore((s) => s.closeAuthModal);
  const openWalletModal = useUiStore((s) => s.openWalletModal);
  const walletBalance = useBalanceStore((s) => s.balance);
  const walletCurrency = useBalanceStore((s) => s.currency);
  const hasLoadedInitialBalance = useBalanceStore((s) => s.hasLoadedInitialBalance);

  const [activeTab, setActiveTab] = useState<AppTab>("lobby");
  const [selectedGame, setSelectedGame] = useState<SabiGame | null>(null);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);

  const {
    providers,
    promotionBanners,
    quickGames,
    quickGamesHeading,
    quickGamesDescription,
    categoryChips,
    categoryFilter,
    setCategoryFilter,
    gridGames,
    trendingGames,
    rememberRecentGame,
    displayTrending,
    lobbyQuery,
  } = useLobbyContent(activeTab);

  const userBanksQuery = useUserBankInfoList();
  const updateMember = useUpdateMember();
  const userBanks = useMemo(
    () => toArray<SabiUserBankInfo>(userBanksQuery.data),
    [userBanksQuery.data],
  );

  const handleTabChange = (tab: string) => {
    if ((tab === "wallet" || tab === "profile") && !isAuthenticated) {
      openAuthModal();
      return;
    }

    navigate(getTabPath(tab));
  };

  useEffect(() => {
    const legacyTab = searchParams.get("tab");
    if (legacyTab && isAppTab(legacyTab)) {
      const nextPath = getTabPath(legacyTab);
      if (`${location.pathname}${location.search}` !== nextPath) {
        navigate(nextPath, { replace: true });
      }
      return;
    }

    const nextTab = getTabFromPathname(location.pathname);

    if ((nextTab === "wallet" || nextTab === "profile") && !isAuthenticated) {
      openAuthModal();
      if (location.pathname !== TAB_PATHS.lobby) {
        navigate(TAB_PATHS.lobby, { replace: true });
      }
      if (activeTab !== "lobby") {
        setActiveTab("lobby");
      }
      return;
    }

    if (activeTab !== nextTab) {
      setActiveTab(nextTab);
    }
  }, [
    activeTab,
    isAuthenticated,
    location.pathname,
    location.search,
    navigate,
    openAuthModal,
    searchParams,
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const openLogin = () => openAuthModal();
  const openHelpTelegram = () => {
    if (typeof window === "undefined") {
      return;
    }

    window.open(SUPPORT_TELEGRAM_URL, "_blank", "noopener,noreferrer");
  };

  const walletBalanceLabel =
    hasLoadedInitialBalance && walletBalance != null
      ? `${walletCurrency ?? "ETB"} ${formatBalance(walletBalance)}`
      : `${walletCurrency ?? "ETB"} 0.00`;

  const navigatePlay = (game: SabiGame, mode: "real" | "demo") => {
    rememberRecentGame(game.uuid);
    setSelectedGame(null);
    navigate(`/play/${encodeURIComponent(game.slug)}?mode=${mode}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "lobby":
        return (
          <LobbySection
            isLoading={lobbyQuery.isLoading}
            isError={lobbyQuery.isError}
            refetch={() => lobbyQuery.refetch()}
            promotionBanners={promotionBanners}
            quickGames={quickGames}
            quickGamesHeading={quickGamesHeading}
            quickGamesDescription={quickGamesDescription}
            displayTrending={trendingGames}
            providers={providers}
            onGameClick={(game) => setSelectedGame(game)}
            categoryChips={categoryChips}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            gridGames={gridGames}
          />
        );
      case "promotions":
        return <PromotionsSection />;
      case "wallet":
        return <WalletSection />;
      case "search":
        return <SearchSection onGameClick={(game) => setSelectedGame(game)} />;
      case "profile":
        return (
          <ProfileSection
            isAuthenticated={isAuthenticated}
            member={member}
            onLoginClick={openLogin}
            onEditProfileClick={() => setIsEditProfileModalOpen(true)}
            onAddAccountClick={() => setIsAddAccountModalOpen(true)}
            isUserBanksLoading={userBanksQuery.isLoading}
            userBanks={userBanks}
          />
        );
      default:
        return (
          <LobbySection
            isLoading={lobbyQuery.isLoading}
            isError={lobbyQuery.isError}
            refetch={() => lobbyQuery.refetch()}
            promotionBanners={promotionBanners}
            quickGames={quickGames}
            quickGamesHeading={quickGamesHeading}
            quickGamesDescription={quickGamesDescription}
            displayTrending={trendingGames}
            providers={providers}
            onGameClick={(game) => setSelectedGame(game)}
            categoryChips={categoryChips}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            gridGames={gridGames}
          />
        );
    }
  };

  const similarForModal = selectedGame
    ? displayTrending.filter((game) => game.uuid !== selectedGame.uuid).slice(0, 8)
    : [];

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isLoggedIn={isAuthenticated}
        onLoginClick={openLogin}
        onHelpClick={openHelpTelegram}
      />
      <main className="flex-1 md:ml-64 pb-32 md:pb-8 w-full max-w-full">
        <TopBar
          walletBalanceLabel={walletBalanceLabel}
          walletLoading={isAuthenticated && !hasLoadedInitialBalance}
          isLoggedIn={isAuthenticated}
          onLoginClick={openLogin}
          onLogout={logout}
          onProfileClick={() => handleTabChange("profile")}
          onDepositClick={() => {
            if (!isAuthenticated) {
              openLogin();
              return;
            }

            navigate(TAB_PATHS.wallet);
            openWalletModal("deposit");
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
      <BottomNav
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isLoggedIn={isAuthenticated}
        onHelpClick={openHelpTelegram}
      />
      <AnimatePresence>
        {selectedGame ? (
          <GameModal
            game={selectedGame}
            onClose={() => setSelectedGame(null)}
            onPlayReal={() => {
              if (!isAuthenticated) {
                openLogin();
                return;
              }

              navigatePlay(selectedGame, "real");
            }}
            onPlayDemo={() => navigatePlay(selectedGame, "demo")}
            similarGames={similarForModal}
            providers={providers}
          />
        ) : null}
      </AnimatePresence>
      <NovaGamesAuthModal open={authModalOpen} onClose={closeAuthModal} />
      {member ? (
        <EditProfileModal
          open={isEditProfileModalOpen}
          member={member}
          onClose={() => setIsEditProfileModalOpen(false)}
          isSubmitting={updateMember.isPending}
          onSave={(body) =>
            updateMember.mutate(body, {
              onSuccess: () => setIsEditProfileModalOpen(false),
            })}
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

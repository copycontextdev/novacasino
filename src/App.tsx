/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { NovaGamesAuthModal } from "@/components/auth/NovaGamesAuthModal";
import { filterActivePromotionBanners } from "@/components/PromotionBannerCarousel";
import { APP_NAME, APP_LOGO_SRC } from "@/lib/app_constants";
import { useAuthStore } from "@/store/auth-store";
import { useBalanceStore } from "@/store/balance-store";
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
  SabiProvider,
  SabiDepositOrder,
  SabiPaymentBank,
  SabiUserBankInfo,
} from "@/types/api.types";

import TopBar from "./components/layouts/TopBar";
import Sidebar from "./components/layouts/Sidebar";
import BottomNav from "./components/layouts/BottomNav";
import GameModal from "./components/game-components/GameModal";
import DepositModal from "./components/payment/DepositModal";
import DepositConfirmationModal from "./components/payment/DepositConfirmationModal";
import WithdrawModal from "./components/payment/WithdrawModal";
import EditProfileModal from "./components/profile/EditProfileModal";
import AddAccountModal from "./components/profile/AddAccountModal";

import LobbySection from "./components/sections/LobbySection";
import PromotionsSection from "./components/sections/PromotionsSection";
import WalletSection from "./components/sections/WalletSection";
import SearchSection from "./components/sections/SearchSection";
import ProfileSection from "./components/sections/ProfileSection";

import { useLobbyGamesFiltered } from "./hooks/use-lobby-games-filtered";

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
  const walletBalance = useBalanceStore((s) => s.balance);
  const walletCurrency = useBalanceStore((s) => s.currency);
  const withdrawableBalance = useBalanceStore((s) => s.withdrawableBalance);
  const nonWithdrawableBalance = useBalanceStore((s) => s.nonWithdrawableBalance);
  const hasLoadedInitialBalance = useBalanceStore((s) => s.hasLoadedInitialBalance);
  const depositsQuery = useMyDepositOrders();
  const withdrawalsQuery = useMyWithdrawalOrders();
  const userBanksQuery = useUserBankInfoList();

  const gamesSearchQuery = useGames(
    searchInput.trim().length >= 2 ? { name: searchInput.trim() } : undefined,
  );

  const handleTabChange = (tab: string) => {
    if ((tab === "wallet" || tab === "profile") && !isAuthenticated) {
      openAuthModal();
      return;
    }

    setActiveTab(tab);
  };

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "wallet" || tab === "profile") {
      if (!isAuthenticated) {
        openAuthModal();
        return;
      }

      setActiveTab(tab);
      return;
    }

    if (tab === "lobby") {
      setActiveTab(tab);
    }
  }, [isAuthenticated, openAuthModal, searchParams]);

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

  const promotionBannersFiltered = useMemo(
    () => filterActivePromotionBanners(initQuery.data?.promotion_banners),
    [initQuery.data?.promotion_banners],
  );

  const currencyLabel =
    initQuery.data?.company_info?.currency ?? walletCurrency ?? "ETB";
  const minDeposit = toPositiveNumber(initQuery.data?.system_config?.min_deposit_amount, 50);
  const maxDeposit = toPositiveNumber(initQuery.data?.system_config?.max_deposit_amount, 1_000_000);

  const walletBalanceLabel = hasLoadedInitialBalance && walletBalance != null
    ? `${currencyLabel} ${formatBalance(walletBalance)}`
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

  const renderContent = () => {
    switch (activeTab) {
      case "lobby":
      case "slots":
      case "live":
      case "sports":
      case "vip":
        return (
          <LobbySection
            isLoading={lobbyQuery.isLoading}
            isError={lobbyQuery.isError}
            refetch={() => lobbyQuery.refetch()}
            promotionBanners={promotionBannersFiltered}
            displayTrending={displayTrending}
            providers={providers}
            onGameClick={(game) => setSelectedGame(game)}
            categoryChips={categoryChips}
            categoryFilter={lobbyCategoryFilter}
            onCategoryFilterChange={setLobbyCategoryFilter}
            gridGames={lobbyGridGames}
          />
        );
      case "promotions":
        return <PromotionsSection promotionBanners={promotionBannersFiltered} />;
      case "wallet":
        return (
          <WalletSection
            isAuthenticated={isAuthenticated}
            onLoginClick={openLogin}
            walletBalance={walletBalance}
            nonWithdrawableBalance={nonWithdrawableBalance}
            withdrawableBalance={withdrawableBalance}
            currencyLabel={currencyLabel}
            onDepositClick={() => setIsDepositModalOpen(true)}
            onWithdrawClick={() => setIsWithdrawModalOpen(true)}
            deposits={deposits}
            withdrawals={withdrawals}
            isDepositsLoading={depositsQuery.isLoading}
            isWithdrawalsLoading={withdrawalsQuery.isLoading}
            onConfirmDeposit={(order) => {
              setConfirmOrder(order);
              setIsConfirmModalOpen(true);
            }}
          />
        );
      case "search":
        return (
          <SearchSection
            searchInput={searchInput}
            onSearchInputChange={setSearchInput}
            isFetching={gamesSearchQuery.isFetching}
            searchGames={searchGames}
            providers={providers}
            onGameClick={(game) => setSelectedGame(game)}
          />
        );
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
            promotionBanners={promotionBannersFiltered}
            displayTrending={displayTrending}
            providers={providers}
            onGameClick={(game) => setSelectedGame(game)}
            categoryChips={categoryChips}
            categoryFilter={lobbyCategoryFilter}
            onCategoryFilterChange={setLobbyCategoryFilter}
            gridGames={lobbyGridGames}
          />
        );
    }
  };

  const similarForModal = selectedGame
    ? displayTrending.filter((g) => g.uuid !== selectedGame.uuid).slice(0, 8)
    : [];

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
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
          onProfileClick={() => handleTabChange("profile")}
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
      <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} isLoggedIn={isAuthenticated} />
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
        withdrawable={withdrawableBalance ?? undefined}
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

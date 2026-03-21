/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User,
  LogOut,
  Phone,
  Lock,
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
  Bell, 
  ChevronRight, 
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
  ChevronDown,
  ExternalLink,
  Copy,
  Check,
  Home,
  Gift,
  Award,
  Ticket,
  CreditCard,
  Landmark,
  Coins,
  Play,
  Users
} from 'lucide-react';
import { MOCK_GAMES, MOCK_BANNERS, MOCK_WALLET, MOCK_ACTIVITY, MOCK_PROVIDERS, MOCK_BANKS, MOCK_PLAYER_ACCOUNTS } from './constants';
import { CasinoGame, DepositOrder, PlayerWallet, Bank, PlayerBankAccount } from './types';

// --- Components ---

const TopBar = ({ activeTab, wallet, isLoggedIn, onLoginClick, onLogout }: { activeTab: string, wallet: typeof MOCK_WALLET, isLoggedIn: boolean, onLoginClick: () => void, onLogout: () => void }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 z-50 bg-surface/80 backdrop-blur-xl h-16 flex justify-between items-center px-4 md:px-6 border-b border-white/5">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
          <input 
            className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary/20 placeholder:text-on-surface-variant/50" 
            placeholder="Search games, providers..." 
            type="text"
          />
        </div>
        <div className="md:hidden flex flex-col">
          <span className="text-sm font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dim font-headline">NEBULA</span>
          <div className="flex items-center gap-1">
            <span className="text-[8px] text-tertiary-dim font-bold uppercase">Gold</span>
            <div className="w-12 h-1 bg-surface-container-highest rounded-full">
              <div className="h-full bg-tertiary-dim w-[65%]"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isLoggedIn ? (
          <>
            <div className="flex items-center gap-1.5 bg-surface-container-highest px-3 py-1.5 rounded-full border border-white/5">
              <Wallet className="text-tertiary w-4 h-4 fill-tertiary" />
              <span className="font-headline font-bold text-xs md:text-sm">${wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <button className="bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold px-4 py-1.5 rounded-full text-xs md:text-sm active:scale-95 transition-transform shadow-lg shadow-primary/20">
              Deposit
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border border-white/5 hover:bg-surface-bright transition-colors active:scale-95"
              >
                <User className="w-5 h-5 text-on-surface" />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-[-1]" 
                      onClick={() => setIsProfileOpen(false)}
                    />
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
                          <p className="font-headline font-bold text-sm text-on-surface">NeonPlayer</p>
                          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Gold Tier</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1 border-t border-white/10 pt-3">
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase mb-2 px-2">Account Info</p>
                        <div className="px-2 py-1.5">
                          <p className="text-[10px] text-on-surface-variant uppercase font-bold">Email</p>
                          <p className="text-xs font-semibold text-on-surface">neon.player@nebula.com</p>
                        </div>
                        <div className="px-2 py-1.5">
                          <p className="text-[10px] text-on-surface-variant uppercase font-bold">Member Since</p>
                          <p className="text-xs font-semibold text-on-surface">January 2026</p>
                        </div>
                      </div>

                      <button 
                        className="w-full mt-4 flex items-center gap-3 px-3 py-2.5 text-error hover:bg-error/10 rounded-xl transition-colors font-bold text-sm"
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

const Sidebar = ({ activeTab, setActiveTab, isLoggedIn, onLoginClick }: { activeTab: string, setActiveTab: (t: string) => void, isLoggedIn: boolean, onLoginClick: () => void }) => {
  const navItems = [
    { id: 'lobby', label: 'Lobby', icon: Grid2X2 },
    { id: 'slots', label: 'Slots', icon: Dices },
    { id: 'live', label: 'Live Casino', icon: Video },
    { id: 'sports', label: 'Sports', icon: Gamepad2 },
    { id: 'vip', label: 'VIP Club', icon: Star },
  ];

  return (
    <aside className="hidden md:flex flex-col py-8 px-4 gap-4 h-screen w-64 border-r border-white/15 bg-surface fixed left-0 top-0 z-[60]">
      <div className="mb-8 px-4">
        <span className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dim font-headline">NEBULA CASINO</span>
      </div>
      
      {isLoggedIn ? (
        <div className="flex items-center gap-3 px-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden">
            <img 
              alt="NeonPlayer Avatar" 
              className="w-full h-full object-cover" 
              src="https://picsum.photos/seed/avatar/100/100" 
            />
          </div>
          <div>
            <p className="font-headline font-bold text-sm text-on-surface">NeonPlayer</p>
            <div className="flex flex-col gap-1">
              <p className="text-[10px] uppercase tracking-widest text-tertiary-dim font-bold">Gold Tier</p>
              <div className="w-24 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-tertiary-dim w-[65%]"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 mb-6">
          <button 
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
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 px-4 py-3 font-semibold text-sm rounded-full transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-primary/10 text-primary translate-x-1' 
                : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
        
        <div className="mt-8 px-4 py-4 bg-surface-container-high rounded-lg">
          <p className="text-[10px] text-on-surface-variant font-bold uppercase mb-2">Refer & Earn</p>
          <button className="w-full py-2 bg-gradient-to-r from-primary to-primary-dim text-on-primary rounded-full text-xs font-bold shadow-lg">
            Invite Friends
          </button>
        </div>
      </nav>

      <div className="flex flex-col gap-1 border-t border-white/10 pt-4">
        <button className="flex items-center gap-3 text-on-surface-variant px-4 py-3 hover:text-on-surface hover:bg-white/5 rounded-full transition-colors font-semibold text-sm">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
        <button className="flex items-center gap-3 text-on-surface-variant px-4 py-3 hover:text-on-surface hover:bg-white/5 rounded-full transition-colors font-semibold text-sm">
          <HelpCircle className="w-5 h-5" />
          <span>Support</span>
        </button>
      </div>
    </aside>
  );
};

const BottomNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const items = [
    { id: 'lobby', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'promotions', label: 'Promos', icon: Gift },
  ];

  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 h-16 bg-surface-container-low/95 backdrop-blur-xl z-50 rounded-2xl border border-primary/20 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center justify-around px-2">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center justify-center p-2 transition-all ${
            activeTab === item.id ? 'text-primary' : 'text-on-surface-variant/60'
          }`}
        >
          <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'fill-primary/20' : ''}`} />
          <span className="font-label text-[9px] font-bold uppercase mt-0.5">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

const GameCard = ({ game, onClick }: { game: CasinoGame, onClick: () => void, key?: string }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-surface-container-highest cursor-pointer border border-white/5"
    >
      <img 
        alt={game.name} 
        className="w-full h-full object-cover transition-transform duration-500" 
        src={game.default_logo || 'https://picsum.photos/seed/game/300/400'} 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
      
      {game.label && (
        <div className="absolute top-2 left-2 flex gap-2">
          <span className="glass-panel px-1.5 py-0.5 rounded text-[8px] font-bold text-tertiary border border-tertiary/20">
            {game.label}
          </span>
        </div>
      )}
      
      <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4">
        <p className="font-headline font-extrabold text-[10px] md:text-sm text-white mb-0.5 md:mb-1 truncate">
          {game.name}
        </p>
        <p className="text-[8px] md:text-[10px] text-on-surface-variant font-bold uppercase tracking-widest truncate">
          {MOCK_PROVIDERS.find(p => p.id === game.provider)?.name || 'Nebula Games'}
        </p>
      </div>
    </motion.div>
  );
};

const GameModal = ({ game, onClose }: { game: CasinoGame | null, onClose: () => void }) => {
  if (!game) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm px-0 md:px-4"
    >
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="relative w-full max-w-lg bg-surface-container rounded-t-3xl md:rounded-3xl overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.6)] flex flex-col max-h-[90vh]"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-[110] w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest/60 backdrop-blur-md text-on-surface hover:bg-surface-bright active:scale-90 transition-all duration-300"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative w-full aspect-[4/3] bg-surface-container-lowest flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent z-10"></div>
          <div className="absolute inset-0 opacity-60">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-dim/30 via-secondary-container/10 to-transparent"></div>
          </div>
          <img 
            alt={game.name} 
            className="w-full h-full object-cover" 
            src={game.default_logo || 'https://picsum.photos/seed/game-hero/800/600'} 
          />
          <div className="absolute bottom-6 left-6 z-20 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dim p-1 shadow-lg shadow-primary-dim/20">
              <div className="w-full h-full rounded-xl bg-surface-container-lowest flex items-center justify-center">
                <Rocket className="text-primary w-8 h-8 fill-primary" />
              </div>
            </div>
            <div>
              <h1 className="font-headline text-2xl font-extrabold text-white tracking-tight">{game.name}</h1>
              <p className="text-primary text-sm font-semibold flex items-center gap-1">
                < Award className="w-4 h-4 fill-primary" />
                Nebula Originals
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-8 pt-2 flex flex-col gap-8 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-high rounded-2xl p-4 border border-white/5 flex flex-col gap-1">
              <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">RTP</span>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-headline font-bold text-on-surface">96.8</span>
                <span className="text-primary font-bold mb-1">%</span>
              </div>
            </div>
            <div className="bg-surface-container-high rounded-2xl p-4 border border-white/5 flex flex-col gap-1">
              <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Volatility</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-headline font-bold text-tertiary">Very High</span>
                <span className="flex gap-0.5">
                  <div className="w-1 h-3 rounded-full bg-tertiary"></div>
                  <div className="w-1 h-3 rounded-full bg-tertiary"></div>
                  <div className="w-1 h-3 rounded-full bg-tertiary"></div>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button className="w-full py-5 bg-gradient-to-r from-primary to-primary-dim rounded-full text-on-primary font-headline font-extrabold text-lg shadow-[0_10px_30px_rgba(99,102,241,0.4)] active:scale-95 transition-transform duration-200 flex items-center justify-center gap-2">
              <Play className="w-6 h-6 fill-on-primary" />
              Play Now
            </button>
            <button className="w-full py-4 bg-transparent border-2 border-primary/20 rounded-full text-primary font-headline font-bold text-md hover:bg-primary/5 active:scale-95 transition-all duration-200">
              Play Demo
            </button>
          </div>

          <div className="flex items-center justify-between text-on-surface-variant px-2">
            <div className="flex flex-col items-center gap-1">
              <Gamepad2 className="w-5 h-5 text-primary/60" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Mines Game</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10"></div>
            <div className="flex flex-col items-center gap-1">
              <Users className="w-5 h-5 text-primary/60" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">1.2k Active</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10"></div>
            <div className="flex flex-col items-center gap-1">
              <History className="w-5 h-5 text-primary/60" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Instant Play</span>
            </div>
          </div>

          {/* Similar Games */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-headline font-bold text-on-surface">Similar Games</h3>
              <span className="text-primary text-xs font-bold uppercase tracking-wider">Explore All</span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {MOCK_GAMES.filter(g => g.uuid !== game.uuid).map(sg => (
                <div key={sg.uuid} className="flex-none w-32 group cursor-pointer">
                  <div className="aspect-square rounded-3xl overflow-hidden bg-surface-container-highest mb-2 relative ring-2 ring-transparent group-hover:ring-primary/40 transition-all">
                    <img 
                      alt={sg.name} 
                      className="w-full h-full object-cover" 
                      src={sg.default_logo || 'https://picsum.photos/seed/similar/200/200'} 
                    />
                  </div>
                  <p className="text-xs font-bold text-on-surface text-center truncate px-1">{sg.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Pages ---

const LobbyPage = ({ onGameClick }: { onGameClick: (g: CasinoGame) => void }) => {
  const trendingGames = MOCK_GAMES.filter(g => g.is_top_game);
  const allGames = MOCK_GAMES;

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <section className="relative h-48 md:h-80 rounded-2xl overflow-hidden bg-surface-container-high group border border-white/5">
        <img 
          alt="Giveaway Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2s]" 
          src={MOCK_BANNERS[0].image || 'https://picsum.photos/seed/casino/1200/600'} 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/40 to-transparent"></div>
        <div className="relative h-full flex flex-col justify-center p-6 md:p-12 z-10 max-w-md md:max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2 py-1 bg-tertiary/20 text-tertiary rounded-full border border-tertiary/30 mb-2 md:mb-4 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
            <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Live Giveaway</span>
          </div>
          <h1 className="text-2xl md:text-6xl font-headline font-extrabold tracking-tighter mb-2 md:mb-4 leading-[1.1] text-white">
            $50,000 <br/><span className="text-primary">WEEKLY NEBULA</span>
          </h1>
          <div className="flex gap-3 md:gap-4 items-center">
            <div className="flex flex-col items-center">
              <span className="text-xl md:text-3xl font-headline font-black text-white leading-none">04</span>
              <span className="text-[8px] md:text-[10px] font-bold uppercase text-on-surface-variant">Days</span>
            </div>
            <span className="text-xl md:text-3xl font-headline font-black text-white/50 leading-none mb-3">:</span>
            <div className="flex flex-col items-center">
              <span className="text-xl md:text-3xl font-headline font-black text-white leading-none">12</span>
              <span className="text-[8px] md:text-[10px] font-bold uppercase text-on-surface-variant">Hrs</span>
            </div>
            <span className="text-xl md:text-3xl font-headline font-black text-white/50 leading-none mb-3">:</span>
            <div className="flex flex-col items-center">
              <span className="text-xl md:text-3xl font-headline font-black text-white leading-none">45</span>
              <span className="text-[8px] md:text-[10px] font-bold uppercase text-on-surface-variant">Mins</span>
            </div>
          </div>
          <button className="mt-4 md:mt-8 bg-white text-surface px-6 py-2 md:px-8 md:py-3 rounded-full text-xs md:text-base font-bold w-fit hover:bg-primary transition-colors shadow-lg">
            Enter Draw
          </button>
        </div>
      </section>

      {/* Winners Ticker */}
      <section className="overflow-hidden py-1 -mx-4">
        <div className="animate-marquee whitespace-nowrap">
          <div className="flex items-center gap-3 md:gap-4 px-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-2 glass-panel px-3 py-1.5 rounded-full border border-white/5">
                <Trophy className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-bold text-on-surface">Player_{i}</span>
                <span className="text-[10px] text-tertiary font-bold">${(Math.random() * 5000).toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Games */}
      <section className="space-y-4 md:space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-2xl font-headline font-extrabold tracking-tight">Trending Games</h2>
          <button className="text-primary text-xs md:text-sm font-bold flex items-center gap-1 hover:underline">
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
          {trendingGames.map(game => (
            <GameCard key={game.uuid} game={game} onClick={() => onGameClick(game)} />
          ))}
        </div>
      </section>

      {/* Categories & All Games */}
      <section className="space-y-4 md:space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-2xl font-headline font-extrabold tracking-tight">All Games</h2>
          <button className="text-primary text-xs md:text-sm font-bold flex items-center gap-1 hover:underline">
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <nav className="flex items-center gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {[
            { label: 'Featured', icon: Star, active: true },
            { label: 'Slots', icon: Dices },
            { label: 'Live', icon: Video },
            { label: 'Mines', icon: Zap },
            { label: 'Crash', icon: Rocket },
          ].map((cat) => (
            <button 
              key={cat.label}
              className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                cat.active 
                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-bright border border-white/5'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </nav>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-6">
          {allGames.map(game => (
            <GameCard key={game.uuid} game={game} onClick={() => onGameClick(game)} />
          ))}
        </div>
      </section>
    </div>
  );
};

const PromotionsPage = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl md:text-4xl font-headline font-extrabold tracking-tight">Promotions & Rewards</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div className="glass-panel p-5 md:p-8 rounded-2xl border border-white/5 flex items-center gap-4 md:gap-6 group hover:border-primary/20 transition-all">
          <div className="w-16 h-16 md:w-24 md:h-24 shrink-0 rounded-full bg-primary/10 flex items-center justify-center neon-glow">
            <Gift className="w-8 h-8 md:w-12 md:h-12 text-primary fill-primary/20" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm md:text-xl font-headline font-extrabold mb-1 truncate">Daily Rewards</h3>
            <p className="text-[10px] md:text-sm text-on-surface-variant mb-2 md:mb-4 line-clamp-2">Login daily to claim your bonus spins and nebula dust.</p>
            <button className="text-[8px] md:text-xs font-bold uppercase tracking-widest text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 md:gap-2">
              Claim Now <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="glass-panel p-5 md:p-8 rounded-2xl border border-white/5 flex items-center gap-4 md:gap-6 group hover:border-tertiary/20 transition-all">
          <div className="w-16 h-16 md:w-24 md:h-24 shrink-0 rounded-full bg-tertiary/10 flex items-center justify-center shadow-[0_0_20px_rgba(255,224,131,0.2)]">
            <Award className="w-8 h-8 md:w-12 md:h-12 text-tertiary fill-tertiary/20" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm md:text-xl font-headline font-extrabold mb-1 truncate">VIP Rewards</h3>
            <p className="text-[10px] md:text-sm text-on-surface-variant mb-2 md:mb-4 line-clamp-2">Level up to unlock exclusive weekly cashback and high stakes events.</p>
            <button className="text-[8px] md:text-xs font-bold uppercase tracking-widest text-tertiary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 md:gap-2">
              Upgrade Tier <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WalletPage = ({ 
  wallet, 
  activity, 
  onDepositClick, 
  onWithdrawClick,
  onConfirmDeposit
}: { 
  wallet: typeof MOCK_WALLET, 
  activity: typeof MOCK_ACTIVITY,
  onDepositClick: () => void,
  onWithdrawClick: () => void,
  onConfirmDeposit: (tx: DepositOrder) => void
}) => {
  const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals'>('deposits');

  const filteredActivity = useMemo(() => {
    if (activeTab === 'deposits') {
      return activity.filter(item => parseFloat(item.amount) > 0);
    }
    return activity.filter(item => parseFloat(item.amount) < 0);
  }, [activity, activeTab]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Balance Card */}
      <section className="bg-surface-container-high rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-white/5">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20"></div>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center justify-center border-r border-white/10 py-2">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Total</span>
            <span className="text-lg font-extrabold text-primary">${wallet.balance.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-center justify-center border-r border-white/10 py-2">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Bonus</span>
            <span className="text-lg font-extrabold text-tertiary">${wallet.non_withdrawable_balance}</span>
          </div>
          <div className="flex flex-col items-center justify-center py-2">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Withdrawable</span>
            <span className="text-lg font-extrabold text-secondary">${wallet.withdrawable_balance}</span>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button 
            onClick={onDepositClick}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold py-3.5 rounded-2xl active:scale-95 transition-transform shadow-lg shadow-primary/20"
          >
            <ArrowDownLeft className="w-4 h-4" />
            Deposit
          </button>
          <button 
            onClick={onWithdrawClick}
            className="flex-1 flex items-center justify-center gap-2 bg-surface-bright border border-primary/20 text-primary font-bold py-3.5 rounded-2xl active:scale-95 transition-transform"
          >
            <ArrowUpRight className="w-4 h-4" />
            Withdraw
          </button>
        </div>
      </section>

      {/* Activity Tabs */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-headline font-extrabold tracking-tight">Transaction History</h2>
          <div className="flex bg-surface-container-low p-1 rounded-full border border-white/5">
            <button 
              onClick={() => setActiveTab('deposits')}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all ${activeTab === 'deposits' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Deposits
            </button>
            <button 
              onClick={() => setActiveTab('withdrawals')}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all ${activeTab === 'withdrawals' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Withdrawals
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredActivity.length === 0 ? (
            <div className="bg-surface-container-low rounded-3xl p-12 flex flex-col items-center justify-center text-center border border-dashed border-white/10">
              <History className="w-12 h-12 text-on-surface-variant/20 mb-4" />
              <p className="text-on-surface-variant font-bold">No transactions found</p>
              <p className="text-xs text-on-surface-variant/60 mt-1">Your cosmic history will appear here.</p>
            </div>
          ) : (
            filteredActivity.map((item) => (
              <div key={item.uuid} className="bg-surface-container rounded-2xl p-4 flex items-center justify-between group active:bg-surface-bright transition-colors border border-white/5">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-surface-bright flex items-center justify-center ${parseFloat(item.amount) < 0 ? 'text-secondary' : 'text-primary'}`}>
                    {parseFloat(item.amount) < 0 ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="font-bold text-sm flex items-center gap-2">
                      {item.bank_name}
                      {item.status === 'pending' && (
                        <span className="flex items-center gap-1 text-[8px] bg-tertiary/10 text-tertiary px-1.5 py-0.5 rounded-full uppercase tracking-widest font-black">
                          <Clock className="w-2 h-2" />
                          Pending
                        </span>
                      )}
                      {item.status === 'completed' && (
                        <span className="flex items-center gap-1 text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full uppercase tracking-widest font-black">
                          <CheckCircle2 className="w-2 h-2" />
                          Success
                        </span>
                      )}
                      {item.status === 'failed' && (
                        <span className="flex items-center gap-1 text-[8px] bg-error/10 text-error px-1.5 py-0.5 rounded-full uppercase tracking-widest font-black">
                          <AlertCircle className="w-2 h-2" />
                          Failed
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-on-surface-variant uppercase tracking-tighter">
                      {new Date(item.created_at).toLocaleDateString()} • ID: #{item.uuid.toUpperCase()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`font-headline font-bold ${parseFloat(item.amount) < 0 ? 'text-secondary' : 'text-primary'}`}>
                      {parseFloat(item.amount) < 0 ? '' : '+'}${Math.abs(parseFloat(item.amount)).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-on-surface-variant font-bold uppercase">
                      {item.status_display}
                    </div>
                  </div>
                  
                  {item.status === 'pending' && parseFloat(item.amount) > 0 && (
                    <button 
                      onClick={() => onConfirmDeposit(item)}
                      className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all active:scale-90 shadow-lg shadow-primary/10"
                      title="Confirm Deposit"
                    >
                      <FileUp className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

const DepositModal = ({ isOpen, onClose, onInitiated }: { isOpen: boolean, onClose: () => void, onInitiated: (tx: any) => void }) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      // Simulate creating a pending transaction
      const newTx = {
        uuid: `nb-${Math.floor(Math.random() * 9000) + 1000}`,
        amount,
        bank_name: selectedBank?.name,
        status: 'pending',
        created_at: new Date().toISOString(),
        status_display: 'Pending Confirmation'
      };
      onInitiated(newTx);
    }
  };

  if (!isOpen) return null;

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
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-surface-container rounded-3xl overflow-hidden shadow-2xl border border-white/10"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-headline font-extrabold">New Deposit</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {/* Progress Bar */}
          <div className="flex gap-1 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${step >= i ? 'bg-primary' : 'bg-white/10'}`} />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Enter Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-headline font-bold text-primary">$</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-surface-container-high border-none rounded-2xl py-6 pl-10 pr-4 text-3xl font-headline font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['100', '500', '1000', '5000', '10000', '50000'].map(val => (
                  <button 
                    key={val} 
                    onClick={() => setAmount(val)}
                    className="py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all"
                  >
                    +${val}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Select Bank</label>
              <div className="space-y-2">
                {MOCK_BANKS.map(bank => (
                  <button 
                    key={bank.id}
                    onClick={() => setSelectedBank(bank)}
                    className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${selectedBank?.id === bank.id ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                        <Landmark className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-bold">{bank.name}</span>
                    </div>
                    {selectedBank?.id === bank.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Select Deposit Account</label>
              <div className="space-y-2">
                {selectedBank?.accounts.map(acc => (
                  <button 
                    key={acc.id}
                    onClick={() => setSelectedAccount(acc)}
                    className={`w-full p-4 rounded-2xl border flex flex-col gap-1 transition-all text-left ${selectedAccount?.id === acc.id ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Holder Name</span>
                      {selectedAccount?.id === acc.id && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="font-headline font-bold text-lg">{acc.holder_name}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-2">Account Number</div>
                    <div className="font-mono text-sm tracking-widest text-on-surface">{acc.account_number}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <button 
                onClick={() => setStep(step - 1)}
                className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold transition-all"
              >
                Back
              </button>
            )}
            <button 
              disabled={!amount || (step === 2 && !selectedBank) || (step === 3 && !selectedAccount)}
              onClick={handleNext}
              className="flex-[2] py-4 bg-gradient-to-r from-primary to-primary-dim text-on-primary rounded-2xl font-headline font-extrabold shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {step === 3 ? 'Initiate Deposit' : 'Continue'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const DepositConfirmationModal = ({ isOpen, onClose, transaction }: { isOpen: boolean, onClose: () => void, transaction: any }) => {
  const [txId, setTxId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setIsSuccess(true);
      setTimeout(onClose, 2000);
    }, 2000);
  };

  if (!isOpen) return null;

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
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-surface-container rounded-3xl overflow-hidden shadow-2xl border border-white/10"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-headline font-extrabold">Confirm Deposit</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {isSuccess ? (
            <div className="py-12 flex flex-col items-center text-center animate-in zoom-in-95">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-headline font-extrabold mb-2">Confirmation Sent!</h3>
              <p className="text-on-surface-variant text-sm">Our cosmic agents will verify your deposit shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="bg-white/5 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Amount</span>
                  <span className="font-headline font-bold text-primary text-lg">${parseFloat(transaction.amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Bank</span>
                  <span className="text-sm font-bold">{transaction.bank_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Order ID</span>
                  <span className="text-[10px] font-mono font-bold">#{transaction.uuid.toUpperCase()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Transaction ID / Reference</label>
                  <input 
                    required
                    value={txId}
                    onChange={(e) => setTxId(e.target.value)}
                    placeholder="Enter the ID from your bank receipt"
                    className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Upload Receipt (Optional)</label>
                  <div className="relative group">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className="w-full bg-surface-container-high border-2 border-dashed border-white/10 rounded-2xl py-8 flex flex-col items-center justify-center gap-2 group-hover:border-primary/30 transition-all">
                      <FileUp className="w-8 h-8 text-on-surface-variant/40 group-hover:text-primary transition-colors" />
                      <span className="text-xs font-bold text-on-surface-variant">Click or drag receipt image</span>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                disabled={isUploading || !txId}
                className="w-full py-4 bg-gradient-to-r from-primary to-primary-dim text-on-primary rounded-2xl font-headline font-extrabold shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Submit Confirmation'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const WithdrawModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [amount, setAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<PlayerBankAccount | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(onClose, 2000);
    }, 2000);
  };

  if (!isOpen) return null;

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
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-surface-container rounded-3xl overflow-hidden shadow-2xl border border-white/10"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-headline font-extrabold">Withdraw Funds</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {isSuccess ? (
            <div className="py-12 flex flex-col items-center text-center animate-in zoom-in-95">
              <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-secondary" />
              </div>
              <h3 className="text-2xl font-headline font-extrabold mb-2">Withdrawal Initiated!</h3>
              <p className="text-on-surface-variant text-sm">Your funds will be processed within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Enter Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-headline font-bold text-secondary">$</span>
                  <input 
                    required
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-surface-container-high border-none rounded-2xl py-6 pl-10 pr-4 text-3xl font-headline font-bold focus:ring-2 focus:ring-secondary/20 transition-all"
                  />
                </div>
                <div className="flex justify-between px-1">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">Available: $11,250.00</span>
                  <button type="button" onClick={() => setAmount('11250')} className="text-[10px] font-bold text-secondary uppercase hover:underline">Max</button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Receive to Account</label>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-hide">
                  {MOCK_PLAYER_ACCOUNTS.map(acc => (
                    <button 
                      key={acc.id}
                      type="button"
                      onClick={() => setSelectedAccount(acc)}
                      className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${selectedAccount?.id === acc.id ? 'bg-secondary/10 border-secondary shadow-lg shadow-secondary/10' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                          <Landmark className="w-5 h-5 text-secondary" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-sm">{acc.name}</div>
                          <div className="text-[10px] text-on-surface-variant font-mono">{acc.number}</div>
                        </div>
                      </div>
                      {selectedAccount?.id === acc.id && <CheckCircle2 className="w-5 h-5 text-secondary" />}
                    </button>
                  ))}
                </div>
                <button type="button" className="w-full py-3 border border-dashed border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:bg-white/5 transition-all">
                  + Add New Account
                </button>
              </div>

              <button 
                disabled={isLoading || !amount || !selectedAccount}
                className="w-full py-4 bg-gradient-to-r from-secondary to-secondary-dim text-on-secondary rounded-2xl font-headline font-extrabold shadow-lg shadow-secondary/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Confirm Withdrawal'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const AuthModal = ({ isOpen, onClose, onLoginSuccess }: { isOpen: boolean, onClose: () => void, onLoginSuccess: () => void }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (mode !== 'forgot') {
        onLoginSuccess();
        onClose();
      } else {
        setMode('login');
      }
    }, 1500);
  };

  if (!isOpen) return null;

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
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-surface-container rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/10"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-[210] w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest/60 backdrop-blur-md text-on-surface hover:bg-surface-bright active:scale-90 transition-all duration-300"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dim p-1 mx-auto mb-4 shadow-lg shadow-primary-dim/20">
              <div className="w-full h-full rounded-xl bg-surface-container-lowest flex items-center justify-center">
                <Rocket className="text-primary w-8 h-8 fill-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-headline font-extrabold text-white tracking-tight">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'register' && 'Join the Nebula'}
              {mode === 'forgot' && 'Reset Password'}
            </h2>
            <p className="text-on-surface-variant text-sm mt-1">
              {mode === 'login' && 'Login to access your high-stakes dashboard'}
              {mode === 'register' && 'Create an account to start your cosmic journey'}
              {mode === 'forgot' && 'Enter your phone to receive a reset code'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Full Name</label>
                <div className="relative">
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
                  <input 
                    required
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/30"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
                <input 
                  required
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/30"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
                  <input 
                    required
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/30"
                  />
                </div>
                {mode === 'login' && (
                  <button 
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[10px] font-bold text-primary hover:underline px-1"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
            )}

            <button 
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-primary to-primary-dim rounded-full text-on-primary font-headline font-extrabold text-md shadow-lg shadow-primary-dim/20 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 mt-4"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <>
                  {mode === 'login' && 'Login Now'}
                  {mode === 'register' && 'Create Account'}
                  {mode === 'forgot' && 'Send Reset Code'}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            {mode === 'login' ? (
              <p className="text-xs text-on-surface-variant">
                Don't have an account?{' '}
                <button onClick={() => setMode('register')} className="text-primary font-bold hover:underline">Register</button>
              </p>
            ) : (
              <p className="text-xs text-on-surface-variant">
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="text-primary font-bold hover:underline">Login</button>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('lobby');
  const [selectedGame, setSelectedGame] = useState<CasinoGame | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Wallet Modal States
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'lobby':
        return <LobbyPage onGameClick={setSelectedGame} />;
      case 'promotions':
        return <PromotionsPage />;
      case 'wallet':
        return (
          <WalletPage 
            wallet={MOCK_WALLET} 
            activity={MOCK_ACTIVITY} 
            onDepositClick={() => setIsDepositModalOpen(true)}
            onWithdrawClick={() => setIsWithdrawModalOpen(true)}
            onConfirmDeposit={(tx) => {
              setSelectedTx(tx);
              setIsConfirmModalOpen(true);
            }}
          />
        );
      case 'search':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-headline font-extrabold">Search Games</h2>
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
              <input 
                className="w-full bg-surface-container-high border-none rounded-2xl py-4 pl-12 pr-4 text-lg focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/50" 
                placeholder="Search for games, providers..." 
                autoFocus
                type="text"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {MOCK_GAMES.slice(0, 4).map(game => (
                <GameCard key={game.uuid} game={game} onClick={() => setSelectedGame(game)} />
              ))}
            </div>
          </div>
        );
      default:
        return <LobbyPage onGameClick={setSelectedGame} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setIsAuthModalOpen(true)}
      />
      
      <main className="flex-1 md:ml-64 pb-32 md:pb-8 w-full max-w-full">
        <TopBar 
          activeTab={activeTab} 
          wallet={MOCK_WALLET} 
          isLoggedIn={isLoggedIn}
          onLoginClick={() => setIsAuthModalOpen(true)}
          onLogout={() => setIsLoggedIn(false)}
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

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <AnimatePresence>
        {selectedGame && (
          <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAuthModalOpen && (
          <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={() => setIsAuthModalOpen(false)}
            onLoginSuccess={() => setIsLoggedIn(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDepositModalOpen && (
          <DepositModal 
            isOpen={isDepositModalOpen} 
            onClose={() => setIsDepositModalOpen(false)}
            onInitiated={(tx) => {
              setIsDepositModalOpen(false);
              setSelectedTx(tx);
              setIsConfirmModalOpen(true);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isConfirmModalOpen && (
          <DepositConfirmationModal 
            isOpen={isConfirmModalOpen} 
            onClose={() => setIsConfirmModalOpen(false)}
            transaction={selectedTx}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isWithdrawModalOpen && (
          <WithdrawModal 
            isOpen={isWithdrawModalOpen} 
            onClose={() => setIsWithdrawModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

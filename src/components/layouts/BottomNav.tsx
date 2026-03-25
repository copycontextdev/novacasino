/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Home, Search, Wallet, Gift, UserCircle, HelpCircle } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (t: string) => void;
  isLoggedIn: boolean;
  onHelpClick: () => void;
}

const BottomNav = ({
  activeTab,
  setActiveTab,
  isLoggedIn,
  onHelpClick,
}: BottomNavProps) => {
  const items = [
    { id: "lobby", label: "Home", icon: Home },
    { id: "search", label: "Search", icon: Search },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "promotions", label: "Promos", icon: Gift },
    { id: "profile", label: "Profile", icon: UserCircle },
    { id: "help", label: "Help", icon: HelpCircle, onClick: onHelpClick },
  ];
  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 h-16 bg-surface-container-low/95 backdrop-blur-xl z-50 rounded-2xl border border-primary/20 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center justify-around px-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => item.onClick?.() ?? setActiveTab(item.id)}
          className={`flex flex-col items-center justify-center p-2 transition-all ${
            activeTab === item.id ? "text-primary" : "text-on-surface-variant/60"
          }`}
          aria-label={item.label}
        >
          <item.icon className={`w-6 h-6 ${activeTab === item.id ? "fill-primary/20" : ""}`} />
          <span className="font-label text-[9px] font-bold uppercase mt-0.5">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;

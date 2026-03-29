/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BONUS_NAV_ITEMS, MOBILE_BONUS_NAV_ITEM, PRIMARY_NAV_ITEMS } from "@/components/layouts/navigation-items";

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (t: string) => void;
  onBonusSelect: (t: "bonusSpin" | "bonusDeposit") => void;
  bonusActive: boolean;
}

const BottomNav = ({
  activeTab,
  setActiveTab,
  onBonusSelect,
  bonusActive,
}: BottomNavProps) => {
  const [bonusPickerOpen, setBonusPickerOpen] = useState(false);
  const items = [
    ...PRIMARY_NAV_ITEMS.filter((item) =>
      ["lobby", "wallet", "profile"].includes(item.id)
    ).map((item) => ({
      id: item.id,
      label: item.shortLabel,
      icon: item.icon,
    })),
    {
      id: MOBILE_BONUS_NAV_ITEM.id,
      label: MOBILE_BONUS_NAV_ITEM.label,
      icon: MOBILE_BONUS_NAV_ITEM.icon,
    },
  ];
  const orderedItems = [
    items.find((item) => item.id === "lobby"),
    items.find((item) => item.id === "wallet"),
    items.find((item) => item.id === MOBILE_BONUS_NAV_ITEM.id),
    items.find((item) => item.id === "profile"),
  ].filter(Boolean) as typeof items;

  return (
    <>
      <AnimatePresence>
        {bonusPickerOpen ? (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
              onClick={() => setBonusPickerOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              className="md:hidden fixed bottom-24 left-4 right-4 z-50 rounded-4xl border border-white/15 bg-surface-container p-5 shadow-[0_20px_70px_rgba(0,0,0,0.55)]"
            >
              <p className="text-center text-2xl font-headline font-extrabold text-on-surface">
                Bonus
              </p>
              <div className="mt-5 space-y-3">
                {BONUS_NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setBonusPickerOpen(false);
                      onBonusSelect(item.id as "bonusSpin" | "bonusDeposit");
                    }}
                    className="flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left transition-colors hover:bg-white/5"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dim text-on-primary">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <span className="text-xl font-headline font-bold text-on-surface">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <nav className="md:hidden fixed bottom-4 left-4 right-4 h-16 bg-surface-container-low/95 backdrop-blur-xl z-50 rounded-2xl border border-primary/20 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center justify-around px-2">
        {orderedItems.map((item) => {
          const isBonusButton = item.id === MOBILE_BONUS_NAV_ITEM.id;
          const isActive = isBonusButton ? bonusActive || bonusPickerOpen : activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (isBonusButton) {
                  setBonusPickerOpen((open) => !open);
                  return;
                }

                setBonusPickerOpen(false);
                setActiveTab(item.id);
              }}
              className={`flex flex-col items-center justify-center p-2 transition-all ${
                isActive ? "text-primary" : "text-on-surface-variant/60"
              }`}
              aria-label={item.label}
            >
              <item.icon className={`w-6 h-6 ${isActive ? "fill-primary/20" : ""}`} />
              <span className="font-label text-[9px] font-bold uppercase mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default BottomNav;

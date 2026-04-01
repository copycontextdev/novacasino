/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { UserCircle, ShieldCheck, Edit, Phone, Mail, Plus, Loader2, Landmark } from "lucide-react";
import type { NovaMemberProfile, NovaUserBankInfo } from "@/types/api.types";

interface ProfileSectionProps {
  isAuthenticated: boolean;
  member: NovaMemberProfile | null;
  onLoginClick: () => void;
  onEditProfileClick: () => void;
  onAddAccountClick: () => void;
  isUserBanksLoading: boolean;
  userBanks: NovaUserBankInfo[];
}

const ProfileSection = ({
  isAuthenticated,
  member,
  onLoginClick,
  onEditProfileClick,
  onAddAccountClick,
  isUserBanksLoading,
  userBanks,
}: ProfileSectionProps) => {
  if (!isAuthenticated || !member) {
    return (
      <div className="text-center py-16">
        <button
          type="button"
          onClick={onLoginClick}
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
            onClick={onEditProfileClick}
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
            onClick={onAddAccountClick}
            className="flex items-center gap-2 text-[10px] font-bold uppercase text-primary"
          >
            <Plus className="w-3 h-3" />
            Add New
          </button>
        </div>
        <div className="space-y-3">
          {isUserBanksLoading ? (
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

export default ProfileSection;

import {
  CircleDollarSign,
  Gift,
  Home,
  Search,
  Sparkles,
  UserCircle,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
}

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { id: "lobby", label: "Lobby", shortLabel: "Home", icon: Home },
  { id: "search", label: "Search", shortLabel: "Search", icon: Search },
  { id: "wallet", label: "Wallet", shortLabel: "Wallet", icon: Wallet },
  { id: "profile", label: "Profile", shortLabel: "Profile", icon: UserCircle },
];

export const BONUS_NAV_ITEMS: NavItem[] = [
  { id: "bonusSpin", label: "Spin Bonuses", shortLabel: "Spin", icon: Sparkles },
  {
    id: "bonusDeposit",
    label: "Deposit Bonus",
    shortLabel: "Deposit",
    icon: CircleDollarSign,
  },
];

export const MOBILE_BONUS_NAV_ITEM: NavItem = {
  id: "bonusMenu",
  label: "Bonus",
  shortLabel: "Bonus",
  icon: Gift,
};

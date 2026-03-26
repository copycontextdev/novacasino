import {
  Gift,
  Home,
  Search,
  UserCircle,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export interface PrimaryNavItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
}

export const PRIMARY_NAV_ITEMS: PrimaryNavItem[] = [
  { id: "lobby", label: "Lobby", shortLabel: "Home", icon: Home },
  { id: "search", label: "Search", shortLabel: "Search", icon: Search },
  { id: "wallet", label: "Wallet", shortLabel: "Wallet", icon: Wallet },
  { id: "promotions", label: "Promotions", shortLabel: "Promos", icon: Gift },
  { id: "profile", label: "Profile", shortLabel: "Profile", icon: UserCircle },
];

export interface CasinoGame {
  uuid: string;
  slug: string;
  name: string;
  description: string;
  order: number;
  default_logo: string | null;
  logo: string | null;
  demo_support: boolean;
  label: string | null;
  label_bg_color: string | null;
  icon: string | null;
  is_crash: boolean;
  is_top_game: boolean;
  provider: number;
}

export interface GameProvider {
  id: number;
  uuid: string;
  name: string;
  description: string;
  order: number;
  default_logo: string | null;
  logo: string | null;
}

export interface GameLobby {
  name: string;
  slug: string | null;
  description: string;
  logo: string | null;
  order: number;
  games: string[]
}

export interface PromotionBanner {
  id: number;
  location_display: string;
  created_at: string;
  updated_at: string;
  title: string | null;
  description: string;
  image: string | null;
  link: string | null;
  button_text: string | null;
  location: number;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
}

export interface DepositOrder {
  uuid: string;
  user_name: string;
  user_phone: string;
  agent_nickname: string;
  deposited_by_agent_nickname: string | null;
  deposited_by_agent_phone: string | null;
  account_number: string;
  account_name: string;
  bank_name: string;
  amount: string;
  status: string;
  status_display: string;
  reference_number: string | null;
  receipt: string | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface PlayerWallet {
  balance: number;
  withdrawable_balance: string;
  non_withdrawable_balance: string;
  is_active: boolean;
}

export interface Bank {
  id: number | string;
  uuid?: string;
  code?: string;
  name: string;
  order?: number;
  logo?: string | null;
  transaction_support?: string;
  is_active?: boolean;
  accounts?: { id: number | string; holder_name: string; account_number: string }[];
}

export interface PlayerBankAccount {
  id: number | string;
  bank_name: string;
  account_number: string;
  account_name: string;
  is_active?: boolean;
}

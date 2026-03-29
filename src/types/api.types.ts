/**
 * Sabi API Type Definitions
 *
 * Source of truth for all API request/response shapes.
 * All types use the Sabi prefix. Use these directly as component prop types
 * where the data maps 1:1 from the API — no adapters needed.
 *
 * Companion: docs/api/SABI_API_CONTRACT.md
 */

/* ============================================================
 * 0. Shared Primitives
 * ============================================================ */

export type SabiUUID = string;
export type SabiISODate = string;
/** Currency amount as decimal string — e.g. "55.00" (ETB) */
export type SabiAmount = string;
export type SabiUrl = string;
export type SabiPhone = string;

/* ============================================================
 * 1. API Envelope & Pagination
 * ============================================================ */

export interface SabiApiEnvelope<TData = Record<string, unknown>> {
  status?: "success" | "error" | string;
  message?: string;
  detail?: string;
  data?: TData;
  [key: string]: unknown;
}

export interface SabiPaginatedResponse<TItem> {
  count: number;
  next: string | null;
  previous: string | null;
  results: TItem[];
}

export type SabiApiError =
  | SabiApiEnvelope
  | Record<string, string[] | string>
  | { detail: string }
  | { message: string }
  | string;

export interface SabiPaginationQuery {
  page?: number;
  page_size?: number;
}

/* ============================================================
 * 2. Auth & Account
 * ============================================================ */

export interface SabiLoginRequest {
  phone_number: SabiPhone;
  password: string;
}

export interface SabiLoginResponse {
  status: "success" | string;
  access: string;
  refresh: string;
  message?: string;
}

export interface SabiTokenRefreshRequest {
  refresh: string;
}

export interface SabiTokenRefreshResponse {
  access: string;
}

export interface SabiRegisterRequest {
  user_profile: {
    phone_number: SabiPhone;
    email?: string;
    first_name?: string;
    last_name?: string;
    password: string;
    password2: string;
  };
  promo_code?: string;
}

export interface SabiActivateAccountRequest {
  phone_number: SabiPhone;
  otp: string;
}

export interface SabiForgotPasswordRequest {
  phone_number: SabiPhone;
}

export interface SabiResetPasswordRequest {
  otp_id: SabiUUID;
  otp_code: string;
  password: string;
  password2: string;
}

export interface SabiResendOtpRequest {
  phone_number: SabiPhone;
}

export interface SabiMemberProfile {
  id?: number | SabiUUID;
  uuid?: SabiUUID;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  /** Convenience field — may be a combined first + last name */
  name?: string;
  phone_number: SabiPhone;
  is_active?: boolean;
  created_at?: SabiISODate;
  updated_at?: SabiISODate;
  [key: string]: unknown;
}

export interface SabiWalletResponse {
  id?: number | SabiUUID;
  currency?: string;
  balance: SabiAmount | number;
  bonus_balance?: SabiAmount | null;
  withdrawable_balance?: SabiAmount;
  non_withdrawable_balance?: SabiAmount;
  is_active?: boolean;
  [key: string]: unknown;
}

export interface SabiTransferRequest {
  phone_number: SabiPhone;
  amount: number | SabiAmount;
}

export type SabiTransferResponse = SabiApiEnvelope;

/* ============================================================
 * 3. Core & Init
 * ============================================================ */

export interface SabiCompanyInfo {
  id: number;
  company_name: string;
  domain: SabiUrl;
  country: string;
  country_code: string;
  language: string;
  currency: string;
  created_at: SabiISODate;
  updated_at: SabiISODate;
}

export interface SabiSystemConfig {
  id: number;
  min_deposit_amount: SabiAmount;
  max_deposit_amount: SabiAmount;
  min_withdraw_amount: SabiAmount;
  max_withdraw_amount: SabiAmount;
  transfer_min_amount: SabiAmount | null;
  transfer_max_amount: SabiAmount | null;
  daily_max_withdraw_amount: SabiAmount | null;
  daily_max_transfer_amount: SabiAmount | null;
  daily_max_deposit_amount: SabiAmount | null;
  dashboard_deposit_allowed: boolean;
  company_info: number;
  created_at: SabiISODate;
  updated_at: SabiISODate;
}

export interface SabiPromotionBanner {
  id: number;
  title: string | null;
  description: string;
  image: SabiUrl;
  link: SabiUrl | null;
  button_text: string | null;
  location: number;
  location_display: string;
  is_active: boolean;
  start_date: SabiISODate | null;
  end_date: SabiISODate | null;
  created_at: SabiISODate;
  updated_at: SabiISODate;
}

export interface SabiContactInfo {
  id: number;
  phone: string[];
  email: string;
  facebook: string;
  twitter: string;
  instagram: string;
  tiktok: string;
  telegram: SabiUrl;
  chat: string | null;
}

export interface SabiWebsiteInfo {
  about_us: string;
  terms_conditions: string;
  privacy_policy: string;
  how_to_play: string;
  faq: string;
  contact_info: string;
  responsible_gaming: string;
}

export interface SabiFrontendConfig {
  id: number;
  withdrawal_mode: "bank_info" | "unique_code" | string;
  transfer_enabled: boolean;
  tournament_enabled: boolean;
  crash_jackpot_enabled: boolean;
  loyalty_bonus_enabled: boolean;
  spin_bonus_enabled: boolean;
  raffle_enabled: boolean;
  challenge_enabled: boolean;
  deposit_bonus_enabled: boolean;
  shamo_enabled: boolean;
  affiliate_enabled: boolean;
  chat_enabled: boolean;
  socials_enabled: boolean;
  featured_promotion: string;
  short_promotion_description: string | null;
}

/** Response from GET /core/init — bootstraps the entire frontend */
export interface SabiInitResponse {
  company_info: SabiCompanyInfo;
  system_config: SabiSystemConfig;
  promotion_banners: SabiPromotionBanner[];
  promotion_configs: Record<string, unknown>[];
  contact_info: SabiContactInfo;
  website_info: SabiWebsiteInfo;
  frontend_configuration: SabiFrontendConfig;
  text_banners: Record<string, unknown>[];
}

/* ============================================================
 * 4. Bonus & Promotions
 * ============================================================ */

export interface SabiActiveBonusStatus {
  challenge_badge: boolean;
  crash_jackpot: boolean;
  deposit: boolean;
  loyalty: boolean;
  raffle: boolean;
  shamo: boolean;
  spin: boolean;
  tournament: boolean;
}

export interface SabiSpinAward {
  id: number;
  uuid?: SabiUUID;
  condition?: {
    id: number;
    name: string;
  };
  is_active?: boolean;
  created_at?: SabiISODate;
  updated_at?: SabiISODate;
  [key: string]: unknown;
}

export interface SabiSpinCondition {
  id: number;
  name: string;
  by_bet_count: boolean;
  by_bet_amount: boolean;
  by_winning_streak: boolean;
  by_login_streak: boolean;
  by_deposit_amount: boolean;
  bet_count: number | null;
  winning_streak: number | null;
  login_streak_days: number | null;
  bet_amount: SabiAmount | null;
  deposit_amount: SabiAmount | null;
  is_active: boolean;
  image: SabiUrl | null;
  description: string | null;
  [key: string]: unknown;
}

export interface SabiSpinResult {
  id: number;
  uuid?: SabiUUID;
  reward?: number | null;
  reward_display?: string | null;
  reward_value?: SabiAmount | null;
  created_at?: SabiISODate;
  updated_at?: SabiISODate;
  status?: string;
  reward_name?: string | null;
  reward_type?: string | null;
  reward_amount?: SabiAmount | null;
  [key: string]: unknown;
}

export interface SabiSpinReward {
  id: number;
  condition: number;
  reward_type: string;
  name: string;
  value: SabiAmount;
  probability: number;
  text_color: string;
  background_color: string;
  is_active: boolean;
  [key: string]: unknown;
}

export interface SabiSpinExecuteResponse {
  id: number;
  value: number | SabiAmount;
  name: string;
  reward_type: string;
  reward_value: number | SabiAmount;
  [key: string]: unknown;
}

export interface SabiSpinTrackerResponse {
  active_bet_amount?: string;
  [key: string]: unknown;
}

export interface SabiDepositBonus {
  id: number | SabiUUID | string;
  uuid?: SabiUUID;
  name?: string;
  title?: string;
  description?: string | null;
  status?: string;
  amount?: SabiAmount | number | null;
  bonus_amount?: SabiAmount | number | null;
  deposit_amount?: SabiAmount | number | null;
  reward_amount?: SabiAmount | number | null;
  is_active?: boolean;
  is_claimed?: boolean;
  is_completed?: boolean;
  created_at?: SabiISODate;
  updated_at?: SabiISODate;
  expires_at?: SabiISODate | null;
  [key: string]: unknown;
}

export type SabiSpinAwardListResponse = SabiPaginatedResponse<SabiSpinAward>;
export type SabiSpinConditionListResponse = SabiPaginatedResponse<SabiSpinCondition>;
export type SabiSpinResultListResponse = SabiPaginatedResponse<SabiSpinResult>;
export type SabiSpinRewardListResponse = SabiPaginatedResponse<SabiSpinReward>;
export type SabiDepositBonusListResponse = SabiPaginatedResponse<SabiDepositBonus>;

/* ============================================================
 * 5. Casino
 * ============================================================ */

export type SabiGameMode = "demo" | "real";
export type SabiDeviceType = "desktop" | "mobile";

export interface SabiGame {
  uuid: SabiUUID;
  slug: string;
  name: string;
  description: string;
  order: number;
  /**
   * Primary thumbnail URL — served from icons.inout.games CDN.
   * IMPORTANT: always render with <img> or <Image unoptimized>.
   * The CDN rejects Next.js image proxy requests (/_next/image).
   */
  default_logo: SabiUrl | null;
  logo: SabiUrl | null;
  icon: SabiUrl | null;
  demo_support: boolean;
  /** Badge text shown on the card — e.g. "HOT", "NEW". Null = no badge. */
  label: string | null;
  label_bg_color: string | null;
  is_crash: boolean;
  is_top_game: boolean;
  /** Provider id or uuid — cross-reference with SabiProvider */
  provider: number | SabiUUID | string;
  [key: string]: unknown;
}

/**
 * A named lobby category with its games list.
 *
 * Returned by GET /xcasino/lobby/ as SabiLobbyResponse.
 * This is the primary data source for category view.
 * Do NOT use /xcasino/categories/ — it returns count: 0 for all categories.
 *
 * Examples: "Top Games", "Slots", "Live Casino", "Fishing", "Crash"
 */
export interface SabiGameCategory {
  name: string;
  slug: string | null;
  description: string;
  logo: SabiUrl | null;
  order: number;
  games: SabiGame[];
  [key: string]: unknown;
}

export interface SabiProvider {
  id: number;
  uuid: SabiUUID;
  name: string;
  description: string;
  order: number;
  default_logo: SabiUrl | null;
  logo: SabiUrl | null;
  [key: string]: unknown;
}

export interface SabiCategory {
  id?: number;
  uuid?: SabiUUID;
  slug?: string | null;
  name?: string;
  description?: string;
  order?: number;
  logo?: SabiUrl | null;
  [key: string]: unknown;
}

export interface SabiGamesQuery extends SabiPaginationQuery {
  name?: string;
  provider?: number | string;
  category?: number | string;
}

export interface SabiStartGameQuery {
  mode: SabiGameMode;
  device: SabiDeviceType;
  lobby_url?: string;
}

export interface SabiStartGameResponse {
  /** One-time launch URL from qtlauncher.com — render in <iframe> without sandbox */
  url: SabiUrl;
  [key: string]: unknown;
}

// Response type aliases — casino
export type SabiLobbyResponse = SabiGameCategory[];
export type SabiProviderListResponse = SabiPaginatedResponse<SabiProvider>;
export type SabiCategoryListResponse = SabiPaginatedResponse<SabiCategory>;
export type SabiGamesListResponse = SabiPaginatedResponse<SabiGame>;
export type SabiTopGamesResponse = SabiPaginatedResponse<SabiGame>;

/* ============================================================
 * 5. Payment & Transactions
 * ============================================================ */

export type SabiOrderStatus =
  | "pending"
  | "success"
  | "completed"
  | "failed"
  | "cancelled"
  | string;

export type SabiPaymentBankType = "deposit" | "withdraw" | "both" | string;

export interface SabiPaymentBank {
  id?: number;
  uuid: SabiUUID;
  code: string;
  name: string;
  order?: number;
  logo?: SabiUrl | null;
  transaction_support?: SabiPaymentBankType;
  is_active?: boolean;
  [key: string]: unknown;
}

/** Bank account owned by an agent — used to receive deposit transfers */
export interface SabiAgentBankInfo {
  uuid: SabiUUID;
  agent_name?: string;
  agent_nickname?: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  note?: string;
  min_amount?: SabiAmount;
  max_amount?: SabiAmount;
  [key: string]: unknown;
}

/** Bank account owned by the member — used for withdrawal */
export interface SabiUserBankInfo {
  uuid: SabiUUID;
  bank: SabiUUID;
  bank_name?: string;
  account_number: string;
  account_name: string;
  is_active: boolean;
  [key: string]: unknown;
}

export interface SabiDepositOrder {
  uuid: SabiUUID;
  amount: SabiAmount;
  status: SabiOrderStatus;
  status_display?: string;
  user_name?: string;
  user_phone?: string;
  agent_name?: string;
  agent_nickname?: string;
  bank_name?: string;
  account_name?: string;
  account_number?: string;
  reference_number?: string | null;
  receipt?: string | null;
  expires_at?: SabiISODate;
  created_at?: SabiISODate;
  updated_at?: SabiISODate;
  [key: string]: unknown;
}

export interface SabiWithdrawalOrder {
  uuid?: SabiUUID;
  amount?: SabiAmount;
  status?: SabiOrderStatus;
  status_display?: string;
  created_at?: SabiISODate;
  updated_at?: SabiISODate;
  [key: string]: unknown;
}

export interface SabiTransactionItem {
  id?: number | SabiUUID;
  uuid?: SabiUUID;
  type?: string;
  status?: string;
  status_display?: string;
  amount?: SabiAmount;
  created_at?: SabiISODate;
  updated_at?: SabiISODate;
  [key: string]: unknown;
}

// Request types — payment
export interface SabiCreateDepositRequest {
  agent_bank_info_id?: SabiUUID;
  agent_bank_info?: SabiUUID;
  amount: SabiAmount;
}

export interface SabiUpdateDepositRequest {
  reference_number?: string;
  receipt?: File | Blob | string; // sent as multipart/form-data
}

export interface SabiCreateWithdrawalRequest {
  amount: SabiAmount;
  bank_info_id: SabiUUID;
}

export interface SabiCreateUserBankInfoRequest {
  bank: SabiUUID;
  account_number: string;
  account_name: string;
}

export interface SabiAgentBanksQuery {
  type: "deposit" | "withdraw";
}

export interface SabiAgentBankInfoQuery {
  amount?: SabiAmount | number;
}

// Response type aliases — payment
export type SabiDepositOrderListResponse = SabiPaginatedResponse<SabiDepositOrder>;
export type SabiWithdrawalOrderListResponse = SabiPaginatedResponse<SabiWithdrawalOrder>;
export type SabiTransactionListResponse = SabiPaginatedResponse<SabiTransactionItem>;
export type SabiAgentBankListResponse =
  | SabiPaymentBank[]
  | SabiPaginatedResponse<SabiPaymentBank>;
export type SabiAgentBankInfoListResponse = SabiPaginatedResponse<SabiAgentBankInfo>;
export type SabiUserBankInfoListResponse =
  | SabiUserBankInfo[]
  | SabiPaginatedResponse<SabiUserBankInfo>;
export type SabiCreateDepositResponse = SabiApiEnvelope<SabiDepositOrder>;
export type SabiUpdateDepositResponse = SabiApiEnvelope<Partial<SabiDepositOrder>>;
export type SabiCancelDepositResponse = SabiApiEnvelope<SabiDepositOrder>;
export type SabiCreateWithdrawalResponse = SabiApiEnvelope<SabiWithdrawalOrder>;

/* ============================================================
 * 6. WebSocket
 * ============================================================ */

export interface SabiWsAuthQuery {
  token: string;
}

export type SabiWsClientAction =
  | { action: "join_crash_jackpot" }
  | { action: "leave_crash_jackpot" };

export interface SabiBalanceUpdatePayload {
  balance?: number | SabiAmount;
  withdrawable?: number | SabiAmount;
  non_withdrawable?: number | SabiAmount;
  [key: string]: unknown;
}

export type SabiWsMessage =
  | { type: "authenticated"; [key: string]: unknown }
  | {
      type: "authentication_error";
      detail?: string;
      message?: string;
      [key: string]: unknown;
    }
  | { type: "balance.update"; payload?: SabiBalanceUpdatePayload; [key: string]: unknown }
  | { type: "jackpot_contribution"; [key: string]: unknown }
  | { type: "personal_crash_jackpot_win"; [key: string]: unknown }
  | { type: "crash_jackpot_win"; [key: string]: unknown }
  | Record<string, unknown>;

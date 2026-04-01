/**
 * Nova API Type Definitions
 *
 * Source of truth for all API request/response shapes.
 * All types use the Nova prefix. Use these directly as component prop types
 * where the data maps 1:1 from the API — no adapters needed.
 *
 * Companion: docs/api/NOVA_API_CONTRACT.md
 */

/* ============================================================
 * 0. Shared Primitives
 * ============================================================ */

export type NovaUUID = string;
export type NovaISODate = string;
/** Currency amount as decimal string — e.g. "55.00" (ETB) */
export type NovaAmount = string;
export type NovaUrl = string;
export type NovaPhone = string;

/* ============================================================
 * 1. API Envelope & Pagination
 * ============================================================ */

export interface NovaApiEnvelope<TData = Record<string, unknown>> {
  status?: "success" | "error" | string;
  message?: string;
  detail?: string;
  data?: TData;
  [key: string]: unknown;
}

export interface NovaPaginatedResponse<TItem> {
  count: number;
  next: string | null;
  previous: string | null;
  results: TItem[];
}

export type NovaApiError =
  | NovaApiEnvelope
  | Record<string, string[] | string>
  | { detail: string }
  | { message: string }
  | string;

export interface NovaPaginationQuery {
  page?: number;
  page_size?: number;
}

/* ============================================================
 * 2. Auth & Account
 * ============================================================ */

export interface NovaLoginRequest {
  phone_number: NovaPhone;
  password: string;
}

export interface NovaLoginResponse {
  status: "success" | string;
  access: string;
  refresh: string;
  message?: string;
}

export interface NovaTokenRefreshRequest {
  refresh: string;
}

export interface NovaTokenRefreshResponse {
  access: string;
}

export interface NovaRegisterRequest {
  user_profile: {
    phone_number: NovaPhone;
    email?: string;
    first_name?: string;
    last_name?: string;
    password: string;
    password2: string;
  };
  promo_code?: string;
}

export interface NovaActivateAccountRequest {
  phone_number: NovaPhone;
  otp: string;
}

export interface NovaForgotPasswordRequest {
  phone_number: NovaPhone;
}

export interface NovaResetPasswordRequest {
  otp_id: NovaUUID;
  otp_code: string;
  password: string;
  password2: string;
}

export interface NovaResendOtpRequest {
  phone_number: NovaPhone;
}

export interface NovaMemberProfile {
  id?: number | NovaUUID;
  uuid?: NovaUUID;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  /** Convenience field — may be a combined first + last name */
  name?: string;
  phone_number: NovaPhone;
  is_active?: boolean;
  created_at?: NovaISODate;
  updated_at?: NovaISODate;
  [key: string]: unknown;
}

export interface NovaWalletResponse {
  id?: number | NovaUUID;
  currency?: string;
  balance: NovaAmount | number;
  bonus_balance?: NovaAmount | null;
  withdrawable_balance?: NovaAmount;
  non_withdrawable_balance?: NovaAmount;
  is_active?: boolean;
  [key: string]: unknown;
}

export interface NovaTransferRequest {
  phone_number: NovaPhone;
  amount: number | NovaAmount;
}

export type NovaTransferResponse = NovaApiEnvelope;

/* ============================================================
 * 3. Core & Init
 * ============================================================ */

export interface NovaCompanyInfo {
  id: number;
  company_name: string;
  domain: NovaUrl;
  country: string;
  country_code: string;
  language: string;
  currency: string;
  created_at: NovaISODate;
  updated_at: NovaISODate;
}

export interface NovaSystemConfig {
  id: number;
  min_deposit_amount: NovaAmount;
  max_deposit_amount: NovaAmount;
  min_withdraw_amount: NovaAmount;
  max_withdraw_amount: NovaAmount;
  transfer_min_amount: NovaAmount | null;
  transfer_max_amount: NovaAmount | null;
  daily_max_withdraw_amount: NovaAmount | null;
  daily_max_transfer_amount: NovaAmount | null;
  daily_max_deposit_amount: NovaAmount | null;
  dashboard_deposit_allowed: boolean;
  company_info: number;
  created_at: NovaISODate;
  updated_at: NovaISODate;
}

export interface NovaPromotionBanner {
  id: number;
  title: string | null;
  description: string;
  image: NovaUrl;
  link: NovaUrl | null;
  button_text: string | null;
  location: number;
  location_display: string;
  is_active: boolean;
  start_date: NovaISODate | null;
  end_date: NovaISODate | null;
  created_at: NovaISODate;
  updated_at: NovaISODate;
}

export interface NovaContactInfo {
  id: number;
  phone: string[];
  email: string;
  facebook: string;
  twitter: string;
  instagram: string;
  tiktok: string;
  telegram: NovaUrl;
  chat: string | null;
}

export interface NovaWebsiteInfo {
  about_us: string;
  terms_conditions: string;
  privacy_policy: string;
  how_to_play: string;
  faq: string;
  contact_info: string;
  responsible_gaming: string;
}

export interface NovaFrontendConfig {
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
export interface NovaInitResponse {
  company_info: NovaCompanyInfo;
  system_config: NovaSystemConfig;
  promotion_banners: NovaPromotionBanner[];
  promotion_configs: Record<string, unknown>[];
  contact_info: NovaContactInfo;
  website_info: NovaWebsiteInfo;
  frontend_configuration: NovaFrontendConfig;
  text_banners: Record<string, unknown>[];
}

/* ============================================================
 * 4. Bonus & Promotions
 * ============================================================ */

export interface NovaActiveBonusStatus {
  challenge_badge: boolean;
  crash_jackpot: boolean;
  deposit: boolean;
  loyalty: boolean;
  raffle: boolean;
  shamo: boolean;
  spin: boolean;
  tournament: boolean;
}

export interface NovaSpinAward {
  id: number;
  uuid?: NovaUUID;
  condition?: {
    id: number;
    name: string;
  };
  is_active?: boolean;
  created_at?: NovaISODate;
  updated_at?: NovaISODate;
  [key: string]: unknown;
}

export interface NovaSpinCondition {
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
  bet_amount: NovaAmount | null;
  deposit_amount: NovaAmount | null;
  is_active: boolean;
  image: NovaUrl | null;
  description: string | null;
  [key: string]: unknown;
}

export interface NovaSpinResult {
  id: number;
  uuid?: NovaUUID;
  reward?: number | null;
  reward_display?: string | null;
  reward_value?: NovaAmount | null;
  created_at?: NovaISODate;
  updated_at?: NovaISODate;
  status?: string;
  reward_name?: string | null;
  reward_type?: string | null;
  reward_amount?: NovaAmount | null;
  [key: string]: unknown;
}

export interface NovaSpinReward {
  id: number;
  condition: number;
  reward_type: string;
  name: string;
  value: NovaAmount;
  probability: number;
  text_color: string;
  background_color: string;
  is_active: boolean;
  [key: string]: unknown;
}

export interface NovaSpinExecuteResponse {
  id: number;
  value: number | NovaAmount;
  name: string;
  reward_type: string;
  reward_value: number | NovaAmount;
  [key: string]: unknown;
}

export interface NovaSpinTrackerResponse {
  active_bet_amount?: string;
  [key: string]: unknown;
}

export interface NovaDepositBonus {
  id: number | NovaUUID | string;
  uuid?: NovaUUID;
  name?: string;
  title?: string;
  description?: string | null;
  status?: string;
  amount?: NovaAmount | number | null;
  bonus_amount?: NovaAmount | number | null;
  deposit_amount?: NovaAmount | number | null;
  reward_amount?: NovaAmount | number | null;
  is_active?: boolean;
  is_claimed?: boolean;
  is_completed?: boolean;
  created_at?: NovaISODate;
  updated_at?: NovaISODate;
  expires_at?: NovaISODate | null;
  [key: string]: unknown;
}

export type NovaSpinAwardListResponse = NovaPaginatedResponse<NovaSpinAward>;
export type NovaSpinConditionListResponse = NovaPaginatedResponse<NovaSpinCondition>;
export type NovaSpinResultListResponse = NovaPaginatedResponse<NovaSpinResult>;
export type NovaSpinRewardListResponse = NovaPaginatedResponse<NovaSpinReward>;
export type NovaDepositBonusListResponse = NovaPaginatedResponse<NovaDepositBonus>;

/* ============================================================
 * 5. Casino
 * ============================================================ */

export type NovaGameMode = "demo" | "real";
export type NovaDeviceType = "desktop" | "mobile";

export interface NovaGame {
  uuid: NovaUUID;
  slug: string;
  name: string;
  description: string;
  order: number;
  /**
   * Primary thumbnail URL — served from icons.inout.games CDN.
   * IMPORTANT: always render with <img> or <Image unoptimized>.
   * The CDN rejects Next.js image proxy requests (/_next/image).
   */
  default_logo: NovaUrl | null;
  logo: NovaUrl | null;
  icon: NovaUrl | null;
  demo_support: boolean;
  /** Badge text shown on the card — e.g. "HOT", "NEW". Null = no badge. */
  label: string | null;
  label_bg_color: string | null;
  is_crash: boolean;
  is_top_game: boolean;
  /** Provider id or uuid — cross-reference with NovaProvider */
  provider: number | NovaUUID | string;
  [key: string]: unknown;
}

/**
 * A named lobby category with its games list.
 *
 * Returned by GET /xcasino/lobby/ as NovaLobbyResponse.
 * This is the primary data source for category view.
 * Do NOT use /xcasino/categories/ — it returns count: 0 for all categories.
 *
 * Examples: "Top Games", "Slots", "Live Casino", "Fishing", "Crash"
 */
export interface NovaGameCategory {
  name: string;
  slug: string | null;
  description: string;
  logo: NovaUrl | null;
  order: number;
  games: NovaGame[];
  [key: string]: unknown;
}

export interface NovaProvider {
  id: number;
  uuid: NovaUUID;
  name: string;
  description: string;
  order: number;
  default_logo: NovaUrl | null;
  logo: NovaUrl | null;
  [key: string]: unknown;
}

export interface NovaCategory {
  id?: number;
  uuid?: NovaUUID;
  slug?: string | null;
  name?: string;
  description?: string;
  order?: number;
  logo?: NovaUrl | null;
  [key: string]: unknown;
}

export interface NovaGamesQuery extends NovaPaginationQuery {
  name?: string;
  provider?: number | string;
  category?: number | string;
}

export interface NovaStartGameQuery {
  mode: NovaGameMode;
  device: NovaDeviceType;
  lobby_url?: string;
}

export interface NovaStartGameResponse {
  /** One-time launch URL from qtlauncher.com — render in <iframe> without sandbox */
  url: NovaUrl;
  [key: string]: unknown;
}

// Response type aliases — casino
export type NovaLobbyResponse = NovaGameCategory[];
export type NovaProviderListResponse = NovaPaginatedResponse<NovaProvider>;
export type NovaCategoryListResponse = NovaPaginatedResponse<NovaCategory>;
export type NovaGamesListResponse = NovaPaginatedResponse<NovaGame>;
export type NovaTopGamesResponse = NovaPaginatedResponse<NovaGame>;

/* ============================================================
 * 5. Payment & Transactions
 * ============================================================ */

export type NovaOrderStatus =
  | "pending"
  | "success"
  | "completed"
  | "failed"
  | "cancelled"
  | string;

export type NovaPaymentBankType = "deposit" | "withdraw" | "both" | string;

export interface NovaPaymentBank {
  id?: number;
  uuid: NovaUUID;
  code: string;
  name: string;
  order?: number;
  logo?: NovaUrl | null;
  transaction_support?: NovaPaymentBankType;
  is_active?: boolean;
  [key: string]: unknown;
}

/** Bank account owned by an agent — used to receive deposit transfers */
export interface NovaAgentBankInfo {
  uuid: NovaUUID;
  agent_name?: string;
  agent_nickname?: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  note?: string;
  min_amount?: NovaAmount;
  max_amount?: NovaAmount;
  [key: string]: unknown;
}

/** Bank account owned by the member — used for withdrawal */
export interface NovaUserBankInfo {
  uuid: NovaUUID;
  bank: NovaUUID;
  bank_name?: string;
  account_number: string;
  account_name: string;
  is_active: boolean;
  [key: string]: unknown;
}

export interface NovaDepositOrder {
  uuid: NovaUUID;
  amount: NovaAmount;
  status: NovaOrderStatus;
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
  expires_at?: NovaISODate;
  created_at?: NovaISODate;
  updated_at?: NovaISODate;
  [key: string]: unknown;
}

export interface NovaWithdrawalOrder {
  uuid?: NovaUUID;
  amount?: NovaAmount;
  status?: NovaOrderStatus;
  status_display?: string;
  created_at?: NovaISODate;
  updated_at?: NovaISODate;
  [key: string]: unknown;
}

export interface NovaTransactionItem {
  id?: number | NovaUUID;
  uuid?: NovaUUID;
  type?: string;
  status?: string;
  status_display?: string;
  amount?: NovaAmount;
  created_at?: NovaISODate;
  updated_at?: NovaISODate;
  [key: string]: unknown;
}

// Request types — payment
export interface NovaCreateDepositRequest {
  agent_bank_info_id?: NovaUUID;
  agent_bank_info?: NovaUUID;
  amount: NovaAmount;
}

export interface NovaUpdateDepositRequest {
  reference_number?: string;
  receipt?: File | Blob | string; // sent as multipart/form-data
}

export interface NovaCreateWithdrawalRequest {
  amount: NovaAmount;
  bank_info_id: NovaUUID;
}

export interface NovaCreateUserBankInfoRequest {
  bank: NovaUUID;
  account_number: string;
  account_name: string;
}

export interface NovaAgentBanksQuery {
  type: "deposit" | "withdraw";
}

export interface NovaAgentBankInfoQuery {
  amount?: NovaAmount | number;
}

// Response type aliases — payment
export type NovaDepositOrderListResponse = NovaPaginatedResponse<NovaDepositOrder>;
export type NovaWithdrawalOrderListResponse = NovaPaginatedResponse<NovaWithdrawalOrder>;
export type NovaTransactionListResponse = NovaPaginatedResponse<NovaTransactionItem>;
export type NovaAgentBankListResponse =
  | NovaPaymentBank[]
  | NovaPaginatedResponse<NovaPaymentBank>;
export type NovaAgentBankInfoListResponse = NovaPaginatedResponse<NovaAgentBankInfo>;
export type NovaUserBankInfoListResponse =
  | NovaUserBankInfo[]
  | NovaPaginatedResponse<NovaUserBankInfo>;
export type NovaCreateDepositResponse = NovaApiEnvelope<NovaDepositOrder>;
export type NovaUpdateDepositResponse = NovaApiEnvelope<Partial<NovaDepositOrder>>;
export type NovaCancelDepositResponse = NovaApiEnvelope<NovaDepositOrder>;
export type NovaCreateWithdrawalResponse = NovaApiEnvelope<NovaWithdrawalOrder>;

/* ============================================================
 * 6. WebSocket
 * ============================================================ */

export interface NovaWsAuthQuery {
  token: string;
}

export type NovaWsClientAction =
  | { action: "join_crash_jackpot" }
  | { action: "leave_crash_jackpot" };

export interface NovaBalanceUpdatePayload {
  balance?: number | NovaAmount;
  withdrawable?: number | NovaAmount;
  non_withdrawable?: number | NovaAmount;
  [key: string]: unknown;
}

export type NovaWsMessage =
  | { type: "authenticated"; [key: string]: unknown }
  | {
      type: "authentication_error";
      detail?: string;
      message?: string;
      [key: string]: unknown;
    }
  | { type: "balance.update"; payload?: NovaBalanceUpdatePayload; [key: string]: unknown }
  | { type: "jackpot_contribution"; [key: string]: unknown }
  | { type: "personal_crash_jackpot_win"; [key: string]: unknown }
  | { type: "crash_jackpot_win"; [key: string]: unknown }
  | Record<string, unknown>;

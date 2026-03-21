/** All API path constants. Combine with getApiBaseUrl() from config.ts */

// Auth
export const AUTH_LOGIN = "/auth/login/";
export const AUTH_REFRESH = "/auth/token/refresh/";

// Core / Member
export const CORE_INIT = "/core/init";
export const CORE_REGISTER = "/core/register-member";
export const CORE_ACTIVATE = "/core/member/activate-account";
export const CORE_FORGOT_PASSWORD = "/core/member/password/forgot";
export const CORE_RESET_PASSWORD = "/core/member/password/reset";
export const CORE_RESEND_OTP = "/core/member/resend-otp";
export const CORE_ME = "/core/member/me";
export const CORE_ME_UPDATE = "/core/member/me/update";
export const CORE_WALLET = "/core/member/me/wallet";
export const CORE_TRANSFER = "/core/member/transfer/";

// Casino
export const CASINO_LOBBY = "/xcasino/lobby/";
export const CASINO_PROVIDERS = "/xcasino/providers/";
export const CASINO_CATEGORIES = "/xcasino/categories/";
export const CASINO_GAMES = "/xcasino/games";
export const CASINO_TOP_GAMES = "/xcasino/top-games/";
export const CASINO_GAME_START = (slug: string) =>
  `/xcasino/game/${slug}/start/`;

// Payment
export const PAYMENT_BANKS = "/payment/agent/banks/";
export const PAYMENT_BANK_INFO = (bankUuid: string) =>
  `/payment/agent/bank-info/${bankUuid}/list/`;
export const PAYMENT_DEPOSIT_ORDERS = "/payment/agent/deposit-orders/";
export const PAYMENT_DEPOSIT_ORDER = (uuid: string) =>
  `/payment/agent/deposit-orders/${uuid}/`;
export const PAYMENT_DEPOSIT_UPDATE = (uuid: string) =>
  `/payment/agent/deposit-orders/${uuid}/update/`;
export const PAYMENT_DEPOSIT_CANCEL = (uuid: string) =>
  `/payment/agent/deposit-orders/${uuid}/cancel/`;
export const PAYMENT_MY_DEPOSITS = "/payment/agent/my-deposit-orders/";
export const PAYMENT_USER_BANK_INFO = "/payment/agent/user-bank-info/";
export const PAYMENT_WITHDRAWAL_ORDERS = "/payment/agent/withdrawal-orders/";
export const PAYMENT_WITHDRAWAL_CANCEL = (uuid: string) =>
  `/payment/agent/withdrawal-orders/${uuid}/cancel/`;
export const PAYMENT_MY_WITHDRAWALS = "/payment/agent/my-withdrawal-orders/";
export const PAYMENT_TRANSACTIONS = "/payment/my-transactions/";

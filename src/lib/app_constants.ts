import appLogoSrc from "@/assets/loader-logo.png";

/** Display name across header, loader, and document title */
export const APP_NAME = "NovaGames";

/** Resolved URL for Vite static asset (replace `src/assets/app-logo.svg` with your logo file; keep the import path or update it here). */
export const APP_LOGO_SRC: string = appLogoSrc;

const DEFAULT_SUPPORT_TELEGRAM_USERNAME = "novasu";
const rawSupportTelegramUsername =
  import.meta.env.VITE_TELEGRAM_HELP_USERNAME?.trim() ?? `@${DEFAULT_SUPPORT_TELEGRAM_USERNAME}`;
const normalizedSupportTelegramUsername =
  rawSupportTelegramUsername.replace(/^@+/, "") || DEFAULT_SUPPORT_TELEGRAM_USERNAME;

export const SUPPORT_TELEGRAM_USERNAME = `@${normalizedSupportTelegramUsername}`;
export const SUPPORT_TELEGRAM_URL = `https://t.me/${normalizedSupportTelegramUsername}`;

export const APP_CONSTANTS = {
  appName: APP_NAME,
  logoSrc: APP_LOGO_SRC,
  supportTelegramUsername: SUPPORT_TELEGRAM_USERNAME,
  supportTelegramUrl: SUPPORT_TELEGRAM_URL,
} as const;

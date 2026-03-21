import appLogoSrc from "@/assets/app-logo.svg";

/** Display name across header, loader, and document title */
export const APP_NAME = "NovaGames";

/** Resolved URL for Vite static asset (replace `src/assets/app-logo.svg` with your logo file; keep the import path or update it here). */
export const APP_LOGO_SRC: string = appLogoSrc;

export const APP_CONSTANTS = {
  appName: APP_NAME,
  logoSrc: APP_LOGO_SRC,
} as const;

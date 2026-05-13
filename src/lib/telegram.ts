declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        ready(): void;
        expand(): void;
      };
    };
  }
}

export function isTelegramMiniApp(): boolean {
  return typeof window !== "undefined" && !!window.Telegram?.WebApp?.initData;
}

export function getTelegramInitData(): string {
  return window.Telegram?.WebApp?.initData ?? "";
}

export function initTelegramWebApp(): void {
  window.Telegram?.WebApp?.ready();
  window.Telegram?.WebApp?.expand();
}

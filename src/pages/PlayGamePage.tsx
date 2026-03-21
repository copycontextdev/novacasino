import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { ArrowLeft, Loader2, LogIn, RefreshCw } from "lucide-react";
import { AppLoader } from "@/components/AppLoader";
import { startGame } from "@/lib/api-methods/casino.api";
import { useAuthStore } from "@/store/auth-store";
import { useUiStore } from "@/store/ui-store";
import { useWallet } from "@/hooks/queries/use-wallet";
import { formatBalance } from "@/lib/format";

type GameMode = "demo" | "real";

export function PlayGamePage() {
  const params = useParams<{ gameSlug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const hydrated = useAuthStore((s) => s.hydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useUiStore((s) => s.openAuthModal);
  const { data: wallet } = useWallet();

  const modeParam = searchParams.get("mode");
  const mode: GameMode = modeParam === "real" ? "real" : "demo";
  const slug = params.gameSlug ? decodeURIComponent(params.gameSlug) : "";

  const [launchUrl, setLaunchUrl] = useState<string | null>(null);
  const [isRequestLoading, setIsRequestLoading] = useState(true);
  const [isIframeReady, setIsIframeReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadNonce, setReloadNonce] = useState(0);

  useEffect(() => {
    if (!hydrated) return;

    if (mode === "real" && !isAuthenticated) {
      openAuthModal();
      setLaunchUrl(null);
      setError("Login required for real play mode.");
      setIsRequestLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsRequestLoading(true);
      setIsIframeReady(false);
      setError(null);
      setLaunchUrl(null);

      try {
        const device =
          typeof window !== "undefined" && window.innerWidth < 768 ? "mobile" : "desktop";

        const response = await startGame(slug, {
          mode,
          device,
          lobby_url:
            typeof window !== "undefined" ? `${window.location.origin}/` : undefined,
        });

        if (cancelled) return;
        setLaunchUrl(response.url);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to launch this game.");
      } finally {
        if (!cancelled) setIsRequestLoading(false);
      }
    };

    if (slug) void load();

    return () => {
      cancelled = true;
    };
  }, [hydrated, isAuthenticated, mode, openAuthModal, reloadNonce, slug]);

  const isLoadingOverlayVisible = isRequestLoading || (!!launchUrl && !isIframeReady);

  const currencyLabel = useMemo(() => wallet?.currency ?? "ETB", [wallet?.currency]);

  if (!hydrated) {
    return (
      <AnimatePresence mode="wait">
        <AppLoader key="play-hydrate" />
      </AnimatePresence>
    );
  }

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-black text-on-surface">
      <header className="flex h-14 items-center justify-between border-b border-white/10 bg-surface/90 px-3 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/15"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="leading-tight">
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface">{slug}</p>
            <p className="text-[10px] font-semibold uppercase text-primary">
              {mode === "real" ? "Real" : "Demo"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <p className="hidden text-[11px] font-semibold text-primary sm:block">
                {currencyLabel} {formatBalance(wallet?.balance)}
              </p>
              <button
                type="button"
                onClick={() => navigate("/?tab=wallet")}
                className="rounded-lg bg-gradient-to-r from-primary to-primary-dim px-3 py-1.5 text-xs font-black text-on-primary"
              >
                Deposit
              </button>
            </>
          ) : (
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-primary to-primary-dim px-3 py-1.5 text-xs font-black text-on-primary"
              onClick={() => openAuthModal()}
            >
              <LogIn className="h-3.5 w-3.5" />
              Login
            </button>
          )}

          <button
            type="button"
            onClick={() => setReloadNonce((n) => n + 1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/15"
            aria-label="Reload game"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="relative flex-1">
        {isLoadingOverlayVisible ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/90">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              {isRequestLoading ? "Launching Game..." : "Initializing Player..."}
            </p>
          </div>
        ) : null}

        {error && !isRequestLoading ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black px-6 text-center">
            <p className="text-base font-black text-on-surface">Failed to launch game</p>
            <p className="max-w-md text-sm text-on-surface-variant">{error}</p>
            <button
              type="button"
              onClick={() => setReloadNonce((n) => n + 1)}
              className="rounded-full bg-gradient-to-r from-primary to-primary-dim px-4 py-2 text-sm font-black text-on-primary"
            >
              Try Again
            </button>
          </div>
        ) : null}

        {launchUrl ? (
          <iframe
            src={launchUrl}
            title={slug}
            className="absolute inset-0 h-full w-full border-0"
            allow="fullscreen; autoplay; encrypted-media"
            onLoad={() => setIsIframeReady(true)}
          />
        ) : null}
      </div>
    </div>
  );
}

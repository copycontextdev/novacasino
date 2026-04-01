# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server on port 3000 (host 0.0.0.0)
npm run build        # Production build to dist/
npm run preview      # Preview production build
npm run lint         # TypeScript type checking (tsc --noEmit)
npm run type-check   # Alias for lint
npm run clean        # Remove dist/
```

No test framework is configured. Type checking via `npm run lint` is the primary validation step.

## Environment

Copy `.env.example` to `.env` and configure:
- `VITE_API_URL` — API base URL (default: `https://api.novacasino.games`)
- `VITE_WS_ENABLED` — Enable WebSocket (`false` by default; backend can be unstable)
- `VITE_TELEGRAM_HELP_USERNAME` — Support contact handle

## Architecture

### App Shell & Routing

`main.tsx` sets up providers in order: `QueryClientProvider` → `BrowserRouter` → `SabiBootstrap` (init hook renderer) → `WsDebugPanel`.

Two route groups:
- `/play/:gameSlug` → `PlayGamePage` (iframe-embedded game, outside app shell)
- `/*` → `AppShell` wrapping `App.tsx` (tab-based navigation with 6 tabs)

`App.tsx` handles tab routing, auth-gating protected routes (wallet, profile, bonuses), game modal lifecycle, and renders all modal overlays.

### State Management (Two Layers)

**Zustand** (client state, 4 stores in `src/store/`):
- `auth-store` — `hydrated`, `isAuthenticated`, `member`; `hydrate()` reads localStorage on mount
- `balance-store` — wallet amounts; updated by both API response (`syncFromWallet`) and WebSocket (`applyBalanceUpdate`)
- `ui-store` — modal open/close state, `pendingPostAuthPath` for redirect-after-login
- `ws-store` — WebSocket connection status and message metadata

**React Query** (server state, hooks in `src/hooks/queries/` and `src/hooks/mutations/`):
- `staleTime: 60s`, `retry: 1`, `refetchOnWindowFocus: false`, mutations `retry: 0`
- Balance is also kept in sync in the React Query cache when WebSocket updates arrive

### API Layer (`src/lib/`)

- `lib/api/client.ts` — Axios instance with request interceptor (adds Bearer token) and response interceptor (handles 401s by refreshing token, then retrying the original request)
- `lib/api/config.ts` — reads `VITE_API_URL`; exposes `isWsEnabled()`
- `lib/api/endpoints.ts` — all API path constants
- `lib/api-methods/` — domain-grouped API call functions (auth, core, casino, bonus, payment)
- `lib/token-refresh.ts` — deduplicates concurrent refresh requests using a cached promise
- `lib/session.ts` — localStorage token helpers (`sabi_access_token`, `sabi_refresh_token`)

### WebSocket (`src/lib/ws/ws-client.ts`)

`SabiWsClient` is a singleton. Connection flow: validate JWT expiry → connect → send token → await `"authenticated"` message. Auto-retries with exponential backoff (up to 6 retries, cap 30s). Handles `balance.update` messages.

The bootstrap hook (`src/hooks/useSabiBootstrap.ts`) wires everything together on mount: hydrate auth → fetch member profile → sync wallet → connect WebSocket → handle WS messages.

### Game Play Flow

1. User selects game → `GameModal` shown (real/demo options)
2. Real mode requires auth; unauthed users get `openAuthModal(pendingPath)`
3. On play: navigate to `/play/{slug}?mode=real|demo`
4. `PlayGamePage` calls `startGame()` API → receives iframe URL
5. In real mode, wallet balance polls every 10 seconds

### Component Conventions

- `src/components/ui/` — generic reusable primitives (`AppButton`, `AppTab`, `card`, `copy-button`, `slot-loader`)
- `src/components/layouts/` — `TopBar`, `Sidebar`, `BottomNav`, `navigation-items.ts`
- `src/components/sections/` — full-page tab content components
- Feature-specific modals live alongside their section (e.g., `payment/`, `profile/`, `auth/`)
- Path alias `@/*` maps to `src/*`

### Styling

Tailwind CSS 4 with custom theme defined in `src/index.css`. Key custom utilities: `.glass-panel` (glassmorphism), `.neon-glow` (box-shadow neon effect). Custom colors: purple `#a7a5ff`, orange/gold `#ffe083`. Animations use `motion/react` (formerly Framer Motion) with `AnimatePresence` for tab transitions.

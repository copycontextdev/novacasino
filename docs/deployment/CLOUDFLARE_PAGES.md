# Cloudflare Pages Deployment

This project can be deployed to Cloudflare Pages as a static Vite app.

The frontend is browser-first:
- Cloudflare serves the built files from `dist/`
- the browser calls `https://api.novacasino.games` directly
- no Cloudflare Functions are required

This setup does not block other deployments such as Vercel. The changes made for Cloudflare are:
- a static SPA fallback file: [public/_redirects](/Users/mikiasbirhanu/develop/nova/nova-player/public/_redirects)
- environment-driven API and websocket configuration

## 1. Current Deployment Defaults

The repo now defaults to:

```env
VITE_API_URL=https://api.novacasino.games
VITE_WS_ENABLED=false
VITE_TELEGRAM_HELP_USERNAME=@novasu
```

Notes:
- websocket is intentionally disabled by default because the backend socket is currently unstable
- wallet/balance still works through the HTTP fallback polling already present in the app
- when backend websocket is fixed, set `VITE_WS_ENABLED=true`

## 2. Cloudflare Pages Project Setup

Create a new Cloudflare Pages project and connect it to the repository.

Use these settings:

- Framework preset: `Vite`
- Root directory: `nova-player`
- Build command: `pnpm build`
- Build output directory: `dist`
- Node version: `20` or newer

## 3. Environment Variables

Add these environment variables in Cloudflare Pages for the production environment:

```env
VITE_API_URL=https://api.novacasino.games
VITE_WS_ENABLED=false
VITE_TELEGRAM_HELP_USERNAME=@novasu
```

If you later want websocket back:

```env
VITE_WS_ENABLED=true
```

## 4. SPA Routing

This app uses `BrowserRouter`, so direct refreshes for routes like:

- `/promotions`
- `/wallet`
- `/profile`
- `/play/some-game`

must return `index.html`.

That is handled by:

- [public/_redirects](/Users/mikiasbirhanu/develop/nova/nova-player/public/_redirects)

Content:

```txt
/* /index.html 200
```

Vite copies this file into `dist/`, and Cloudflare Pages uses it for SPA fallback routing.

## 5. Backend Requirements

Cloudflare hosting alone is not enough. The backend must allow the frontend domain.

Ensure the backend accepts the final frontend origin in:

- CORS allowlist
- CSRF or origin protections if any exist
- websocket origin/handshake policy when websocket is re-enabled

Examples for a future production domain:

- `https://novacasino.games`
- `https://www.novacasino.games`
- or a subdomain such as `https://play.novacasino.games`

Use the exact final frontend hostname, not just the API hostname.

## 6. Custom Domain

You said `novacasino.games` will be used later.

Recommended approach:

- keep API on `api.novacasino.games`
- point the frontend to either:
  - `novacasino.games`, or
  - `play.novacasino.games`

Then set:

```env
VITE_API_URL=https://api.novacasino.games
```

This keeps frontend and backend clearly separated.

## 7. Verification Checklist

After deployment, verify:

1. Opening `/` loads the app shell
2. Refreshing `/promotions` still works
3. Refreshing `/play/<slug>` still works
4. Login works against the external backend
5. Wallet loads through HTTP polling fallback
6. Deposit and withdraw flows reach the external API
7. Search and lobby data load correctly

## 8. Why This Does Not Break Vercel

These changes are provider-safe:

- `public/_redirects` is harmless for Vercel
- Vite env vars work the same on Cloudflare and Vercel
- no Cloudflare-only runtime code was added
- no Wrangler config or Functions runtime was introduced

So the same repo can still be deployed on Vercel with:

- Root directory: `nova-player`
- Build command: `pnpm build`
- Output directory: `dist`

and the same env variables.

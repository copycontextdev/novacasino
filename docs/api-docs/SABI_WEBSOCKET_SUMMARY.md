# Sabi WebSocket Summary

> **Type definitions:** `src/types/api.types.ts` — `WsInboundMessage`, `WsClientAction`, `WsAuthQuery`, `BalanceUpdatePayload`
> **Implementation:** `src/lib/ws/ws-client.ts` (singleton)
> **Lifecycle managed in:** `src/components/bootstrap/AppBootstrap.tsx`

---

## 1. Connection

```
wss://api.sabii.games/ws/init/?token=<access_token>
```

- Auth is passed as a **query string parameter** — not as a header or initial message
- Connect after login; disconnect on logout
- Do not connect for unauthenticated users (no token available)

```ts
const base = "https://api.sabii.games"
  .replace(/^https/, "wss")
  .replace(/^http/, "ws");
const url = `${base}/ws/init/?token=${encodeURIComponent(accessToken)}`;
```

---

## 2. Server → Client Messages

All messages are JSON with a `type` field.

### `authenticated`
Connection is ready. Reset retry counter.
```json
{ "type": "authenticated" }
```

### `authentication_error`
Token is invalid or expired. **Do NOT retry.** Call `logout()` immediately.
```json
{ "type": "authentication_error", "detail": "Token is invalid or expired." }
```

### `balance.update`
Player's wallet balance changed (game win/loss, deposit credited, withdrawal processed).
```json
{
  "type": "balance.update",
  "payload": {
    "balance": 1250.00,
    "withdrawable": 1000.00,
    "non_withdrawable": 250.00
  }
}
```
**Action:** Write directly to TanStack Query cache — do NOT store in Zustand.
```ts
queryClient.setQueryData(['wallet'], (old: WalletResponse | undefined) => ({
  ...old,
  balance: String(payload.balance ?? old?.balance),
  withdrawable_balance: String(payload.withdrawable ?? old?.withdrawable_balance),
  non_withdrawable_balance: String(payload.non_withdrawable ?? old?.non_withdrawable_balance),
}));
```

### `jackpot_contribution`
Any user contributed to the crash jackpot pool. Update `ws-store.lastJackpotEvent` for UI display.
```json
{ "type": "jackpot_contribution", "amount": 50, "total": 12500 }
```

### `personal_crash_jackpot_win`
The currently authenticated user won the crash jackpot.
```json
{ "type": "personal_crash_jackpot_win", "amount": 12500 }
```

### `crash_jackpot_win`
Any user (may not be the current user) won the crash jackpot. For ticker/toast display.
```json
{ "type": "crash_jackpot_win", "winner": "username", "amount": 12500 }
```

---

## 3. Client → Server Actions

Send JSON with an `action` field when the client needs to subscribe/unsubscribe to jackpot events.

```ts
// Subscribe (when crash jackpot section is visible)
socket.send(JSON.stringify({ action: "join_crash_jackpot" }));

// Unsubscribe (when leaving crash jackpot section)
socket.send(JSON.stringify({ action: "leave_crash_jackpot" }));
```

Only send if `socket.readyState === WebSocket.OPEN`.

---

## 4. TypeScript Types

```ts
// src/types/api.types.ts

export interface WsAuthQuery {
  token: string;
}

export type WsClientAction =
  | { action: "join_crash_jackpot" }
  | { action: "leave_crash_jackpot" };

export interface BalanceUpdatePayload {
  balance?: number | string;
  withdrawable?: number | string;
  non_withdrawable?: number | string;
}

export type WsInboundMessage =
  | { type: "authenticated" }
  | { type: "authentication_error"; detail?: string; message?: string }
  | { type: "balance.update"; payload?: BalanceUpdatePayload }
  | { type: "jackpot_contribution"; [key: string]: unknown }
  | { type: "personal_crash_jackpot_win"; [key: string]: unknown }
  | { type: "crash_jackpot_win"; [key: string]: unknown };
```

---

## 5. Lifecycle

### Connect (on login)

```
AppBootstrap mounts
  → auth-store.hydrate() runs
  → isAuthenticated becomes true
  → AppBootstrap useEffect fires
  → getAccessToken() from session.ts
  → ws-client.connect(token)
  → ws-store.setStatus("connecting")
```

### On `authenticated`

```
ws-store.setStatus("connected")
reset retry counter
```

### On `authentication_error`

```
ws-store.setStatus("error")
auth-store.logout()      ← clears tokens, member, isAuthenticated
ws-client.disconnect()   ← no retry
```

### On `balance.update`

```
queryClient.setQueryData(['wallet'], updater)
→ any component using useWallet() re-renders with new balance
```

### Disconnect (on logout)

```
auth-store.logout() called
  → ws-client.disconnect()
  → ws-store.setStatus("disconnected")
```

---

## 6. Reconnect Strategy

| Attempt | Delay |
|---------|-------|
| 1 | 1 s |
| 2 | 2 s |
| 3 | 4 s |
| 4 | 8 s |
| 5 | 16 s |
| 6+ | 30 s (cap) |

- Reset attempt counter on successful `authenticated` message
- **Stop all retries** on explicit `disconnect()` call or `authentication_error`
- Max 5–6 attempts before giving up and setting `wsStatus: "error"`

---

## 7. What Does NOT Use WebSocket

Most data uses TanStack Query polling/refetch, not WS:

| Data | Source |
|---|---|
| Wallet balance | WS `balance.update` → query cache (primary) / `['wallet']` refetch on mount |
| Jackpot pool size | WS `jackpot_contribution` |
| Lobby sections | TanStack Query `['lobby']` — refetch every 5 min |
| Games list | TanStack Query `['games', filters]` |
| Providers | TanStack Query `['providers']` |
| Init data | TanStack Query `['init']` — staleTime: Infinity |

WS is only used for **balance updates** and **jackpot events**. Everything else is REST.

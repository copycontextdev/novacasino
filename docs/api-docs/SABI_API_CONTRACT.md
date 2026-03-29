# Sabi API Contract

> **Base URL:** `https://api.sabii.games`
> **Type definitions:** All request/response types are in `src/types/api.types.ts`
> **Last updated:** 2026-02-28

---

## Contract Conventions

| Convention | Detail |
|---|---|
| Base URL | `https://api.sabii.games` |
| Auth header | `Authorization: Bearer <access_token>` |
| Error shape | `ApiErrorResponse` — can be `ApiEnvelope`, field error map, `{ detail }`, or plain string |
| Pagination | `{ count, next, previous, results[] }` |
| Currency | All amounts are strings (e.g. `"55.00"`) — ETB |
| Dates | ISO 8601 strings |

**Verification status legend used in source docs:**
- `verified-live-read` — confirmed via live GET
- `verified-live-success` — confirmed via live success response
- `verified-live-negative` — confirmed via live error response
- `observed-har-only` — seen in network capture only
- `inferred-from-bundle` — inferred from JS bundle analysis

---

## 1. Auth & Account

| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| POST | `/auth/login/` | No | `LoginRequest` | `LoginResponse` |
| POST | `/auth/token/refresh/` | No | `TokenRefreshRequest` | `TokenRefreshResponse` |
| POST | `/core/register-member` | No | `RegisterMemberRequest` | `ApiEnvelope<MemberProfile>` |
| POST | `/core/member/activate-account` | No | `ActivateAccountRequest` | `ApiEnvelope<unknown>` |
| POST | `/core/member/password/forgot` | No | `ForgotPasswordRequest` | `ApiEnvelope<unknown>` |
| POST | `/core/member/resend-otp` | No | `ResendOtpRequest` | `ApiEnvelope<unknown>` |
| GET | `/core/member/me` | **Yes** | — | `MemberProfile` |
| PATCH | `/core/member/me/update` | **Yes** | `Partial<MemberProfile>` | `MemberProfile` |
| GET | `/core/member/me/wallet` | **Yes** | — | `WalletResponse` |
| POST | `/core/member/transfer/` | **Yes** | `TransferRequest` | `TransferResponse` |

### Key types

```ts
// Login
{ phone_number: string; password: string }                   // LoginRequest
{ status: "success"; access: string; refresh: string }      // LoginResponse

// Register (2-step flow)
{ user_profile: { phone_number, password, password2, first_name?, last_name?, email? }; promo_code? }
// → POST activate-account with { phone_number, otp }

// Wallet
{ balance: string; withdrawable_balance?: string; non_withdrawable_balance?: string; currency?: string }
```

**Token storage keys:** `sabi_access_token` / `sabi_refresh_token` in `localStorage`.
**No automatic token refresh implemented** — expired access token requires re-login.

---

## 2. Core & Dashboard

| Method | Path | Auth | Response |
|---|---|---|---|
| GET | `/core/init` | Optional | `CoreInitResponse` |
| GET | `/core/promotion-banner/list/` | Optional | `PromotionBanner[]` |
| GET | `/core/website-info/` | Optional | `WebsiteInfo` |
| GET | `/dashboard/promotion-config` | Optional | `PromotionConfigListResponse` |
| GET | `/bonus/active-bonus/status/` | **Yes** | `ActiveBonusStatusResponse` |
| GET | `/bonus/member-spin-award/list/` | **Yes** | `PaginatedResponse<SpinAward>` |
| GET | `/bonus/member-spin-result/list/` | **Yes** | `PaginatedResponse<SpinResult>` |
| GET | `/bonus/spin-award/{id}/reward/list/` | **Yes** | `PaginatedResponse<SpinReward>` |
| POST | `/bonus/spin-award/{id}/spin/` | **Yes** | `SpinExecuteResponse` |

### `GET /core/init` — the bootstrap endpoint

Called once on app mount. Works for guests and authenticated users. Returns everything needed to render the app shell.

| Field | Type | Purpose |
|---|---|---|
| `company_info` | `CompanyInfo` | Company name, domain, currency, language |
| `system_config` | `SystemConfig` | Deposit/withdrawal min/max limits, daily limits |
| `promotion_banners` | `PromotionBanner[]` | Active hero banners (image, title, description, link, button_text) |
| `contact_info` | `ContactInfo` | Telegram, email, social links |
| `website_info` | `WebsiteInfo` | About us, T&C, privacy policy, how-to-play, FAQ |
| `frontend_configuration` | `FrontendConfiguration` | Feature flags + withdrawal mode (see below) |
| `text_banners` | `unknown[]` | Text-only banners — not yet consumed in UI |
| `promotion_configs` | `unknown[]` | Promotion configs — not yet consumed in UI |

### Feature flags (in `frontend_configuration`)

```ts
interface FrontendConfiguration {
  withdrawal_mode: "bank_info" | "unique_code";
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
}
```

Check these flags before rendering bonus/feature UI sections.

### Spin bonus live notes

`GET /bonus/member-spin-result/list/?page=1` currently returns entries like:

```json
{
  "id": 1170,
  "reward_display": "No Reward",
  "reward": 4,
  "reward_value": "0.00",
  "status": "completed",
  "created_at": "2026-03-29T22:09:33.566299Z",
  "updated_at": "2026-03-29T22:09:33.571753Z"
}
```

Use `reward_display` as the primary row label in history UI, `reward_value` as the amount, and `created_at` as the display date. `status` remains useful for state but is not the primary user-facing label in the legacy history list.

---

## 3. Casino

| Method | Path | Auth | Query | Response |
|---|---|---|---|---|
| GET | `/xcasino/lobby/` | Optional | — | `LobbySection[]` |
| GET | `/xcasino/providers/` | Optional | `PaginationQuery` | `PaginatedResponse<SabiProvider>` |
| GET | `/xcasino/categories/` | Optional | `PaginationQuery` | `PaginatedResponse<SabiCategory>` |
| GET | `/xcasino/top-games/` | Optional | `PaginationQuery` | `PaginatedResponse<SabiGame>` |
| GET | `/xcasino/games` | Optional | `GamesListQuery` | `PaginatedResponse<SabiGame>` |
| GET | `/xcasino/game/{slug}/start/` | Yes (real), Optional (demo) | `StartGameQuery` | `StartGameResponse` |

### Key types

```ts
interface SabiGame {
  uuid: string;
  slug: string;
  name: string;
  default_logo: string | null;   // thumbnail URL — hosted on icons.inout.games
  demo_support: boolean;
  label: string | null;          // badge text (e.g. "HOT", "NEW")
  label_bg_color: string | null;
  is_top_game: boolean;
  provider: number | string;     // provider id or uuid
}

interface LobbySection {
  name: string;      // e.g. "Top Games", "Slots", "Live Casino"
  slug: string | null;
  games: SabiGame[];
}

interface GamesListQuery {
  name?: string;      // search by name
  provider?: string;  // filter by provider id/uuid
  category?: string;  // filter by category
  page?: number;
  page_size?: number;
}

interface StartGameQuery {
  mode: "demo" | "real";
  device: "desktop" | "mobile";
}
```

### Data source strategy

| View | Endpoint | Why |
|---|---|---|
| Category/lobby view | `/xcasino/lobby/` | All games pre-grouped by section, no pagination needed |
| Search results | `/xcasino/games?name=...` | Paginated — cannot fetch all games at once |
| Provider view | `/xcasino/games?provider=...` | Paginated, filtered by provider |
| Top games strip | `/xcasino/top-games/` | Dedicated endpoint |

**Do NOT use `/xcasino/categories/`** as the source for game counts — it returns `count: 0` for all categories. Use lobby sections instead.

### Game launch

```
GET /xcasino/game/{slug}/start/?mode=demo&device=desktop
→ { "url": "https://client.qtlauncher.com/client/game-launcher.html?..." }
```

Render the returned URL in an `<iframe>`. Critical rules:
- **Do NOT add `sandbox` attribute** — breaks game JavaScript
- **Do NOT proxy the URL** — must load directly
- Game exit button redirects to `https://sabii.games` — this is intentional operator config in qtlauncher, not a bug
- Guests can use `mode=demo`; `mode=real` requires an authenticated user

---

## 4. Payment

### Deposit flow (2 steps)

```
1. GET  /payment/agent/banks/?type=deposit          → list available banks
2. GET  /payment/agent/bank-info/{bank_uuid}/list/?amount=55  → get agent accounts for that bank + amount
3. POST /payment/agent/deposit-orders/              → create order (get account details to transfer to)
4. User manually transfers money to the agent account
5. PUT  /payment/agent/deposit-orders/{uuid}/update/ → submit reference number + optional receipt screenshot (multipart/form-data)
```

| Method | Path | Auth | Body / Query | Response |
|---|---|---|---|---|
| GET | `/payment/agent/banks/` | **Yes** | `?type=deposit\|withdraw` | `PaymentBank[]` |
| GET | `/payment/agent/bank-info/{uuid}/list/` | **Yes** | `?amount=55` | `PaginatedResponse<PaymentAgentBankInfo>` |
| POST | `/payment/agent/deposit-orders/` | **Yes** | `CreateDepositOrderRequest` | `ApiEnvelope<DepositOrder>` |
| GET | `/payment/agent/deposit-orders/{uuid}/` | **Yes** | — | `DepositOrder` |
| PUT | `/payment/agent/deposit-orders/{uuid}/update/` | **Yes** | `UpdateDepositOrderRequest` (multipart) | `UpdateDepositOrderResponse` |
| POST | `/payment/agent/deposit-orders/{uuid}/cancel/` | **Yes** | — | `ApiEnvelope<DepositOrder>` |
| GET | `/payment/agent/my-deposit-orders/` | **Yes** | `PaginationQuery` | `PaginatedResponse<DepositOrder>` |

### Withdrawal flow

```
1. GET  /payment/agent/user-bank-info/              → check saved bank accounts (required before withdrawal)
2. POST /payment/agent/user-bank-info/              → add bank account if none exists
3. POST /payment/agent/withdrawal-orders/           → request withdrawal
```

| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| GET | `/payment/agent/user-bank-info/` | **Yes** | — | `UserBankInfo[]` |
| POST | `/payment/agent/user-bank-info/` | **Yes** | `CreateUserBankInfoRequest` | `UserBankInfo` |
| POST | `/payment/agent/withdrawal-orders/` | **Yes** | `CreateWithdrawalOrderRequest` | `ApiEnvelope<WithdrawalOrder>` |
| POST | `/payment/agent/withdrawal-orders/{uuid}/cancel/` | **Yes** | — | `ApiEnvelope<WithdrawalOrder>` |
| GET | `/payment/agent/my-withdrawal-orders/` | **Yes** | `PaginationQuery` | `PaginatedResponse<WithdrawalOrder>` |
| GET | `/payment/my-transactions/` | **Yes** | `PaginationQuery` | `PaginatedResponse<TransactionItem>` |

### Limits (from `init.system_config`)

| Limit | Value |
|---|---|
| Min deposit | 50.00 ETB |
| Min withdrawal | 100.00 ETB |

Always read limits from init response — do not hardcode.

### Key types

```ts
interface CreateDepositOrderRequest {
  agent_bank_info_id: string;   // UUID from bank-info list
  amount: string;               // e.g. "55"
}

interface UpdateDepositOrderRequest {
  reference_number?: string;
  receipt?: File | Blob;        // multipart/form-data
}

interface DepositOrder {
  uuid: string;
  amount: string;
  status: "pending" | "success" | "completed" | "failed" | "cancelled";
  bank_name?: string;
  account_name?: string;
  account_number?: string;
  reference_number?: string | null;
  expires_at?: string;
}
```

---

## 5. Deferred Routes (Not Yet Wired to UI)

These endpoints exist in the backend but have no UI implementation yet. Do not build UI for these until feature flags are confirmed active.

| Feature | Endpoints | Flag |
|---|---|---|
| Crash Jackpot | `/bonus/crash-jackpot/active/`, `/history/`, `/member-wins/` | `crash_jackpot_enabled` |
| Spin Bonus | `/bonus/member-spin-award/list/`, `/spin-award/{id}/reward/list/` | `spin_bonus_enabled` |
| Lottery | `/bonus/lottery/campaign-list/` + 5 more | `raffle_enabled` |
| Affiliate | `/bonus/member/affiliate-promo-code/`, `/payments/`, `/referrals/`, `/summary/` | `affiliate_enabled` |
| Challenge | `/bonus/member/challenge/` + 5 more | `challenge_enabled` |
| Loyalty | `/bonus/member/loyalty-info/`, `/redemption-list/` | `loyalty_bonus_enabled` |
| Shamo | `/bonus/shamo/active-campaigns/`, `/participations/`, `/claim/{id}/` | `shamo_enabled` |
| Deposit Bonus | `/bonus/deposit/member/bonuses/` | `deposit_bonus_enabled` |

---

## 6. Tournament Routes (Deferred)

| Method | Path | Flag |
|---|---|---|
| GET | `/tournament/list/active/` | `tournament_enabled` |
| GET | `/tournament/list/completed/` | `tournament_enabled` |
| GET | `/tournament/leaderboard/{id}/` | `tournament_enabled` |
| GET | `/tournament/rewards/{id}/` | `tournament_enabled` |
| POST | `/tournament/join/` | `tournament_enabled` |

---

## 7. Canonical Examples

### POST `/auth/login/`

```http
POST /auth/login/
Content-Type: application/json

{ "phone_number": "0923213768", "password": "yourpassword" }
```

```json
{ "status": "success", "access": "<jwt>", "refresh": "<jwt>" }
```

### GET `/core/init`

```json
{
  "company_info": { "company_name": "Sabi Games", "currency": "ETB" },
  "system_config": { "min_deposit_amount": "50.00", "min_withdraw_amount": "100.00" },
  "promotion_banners": [],
  "contact_info": { "telegram": "https://t.me/Sabigames_support" },
  "frontend_configuration": {
    "withdrawal_mode": "bank_info",
    "spin_bonus_enabled": true,
    "crash_jackpot_enabled": false
  }
}
```

### POST `/payment/agent/deposit-orders/`

```http
POST /payment/agent/deposit-orders/
Authorization: Bearer <token>
Content-Type: application/json

{ "agent_bank_info_id": "8732548d-69a0-464c-ad52-7843a8c1faa4", "amount": "55" }
```

```json
{
  "status": "success",
  "message": "Deposit order created successfully.",
  "data": {
    "uuid": "f9ecec88-4006-4d7f-84a0-816265c08e2d",
    "bank_name": "Telebirr",
    "account_name": "Agent Name",
    "account_number": "0911234567",
    "amount": "55.00",
    "status": "pending",
    "expires_at": "2026-02-25T20:29:16.908981Z"
  }
}
```

### GET `/xcasino/game/{slug}/start/`

```http
GET /xcasino/game/lucky-dice/start/?mode=real&device=desktop
Authorization: Bearer <token>
```

```json
{ "url": "https://client.qtlauncher.com/client/game-launcher.html?..." }
```

---

## 8. Known Gotchas

| # | Issue |
|---|---|
| 1 | **CDN blocks `/_next/image`** — game thumbnails from `icons.inout.games` reject Next.js image proxy. Always use `<img>` or `<Image unoptimized>` for game thumbnails. |
| 2 | **No token refresh** — no automatic refresh flow exists. Expired token = re-login required. |
| 3 | **Deposit cancel with invalid UUID** — returns HTML `500` instead of typed JSON `404`. Handle at network level, not type level. |
| 4 | **Game exit redirects to `sabii.games`** — intentional qtlauncher operator config, not a frontend bug. |
| 5 | **Categories endpoint returns `count: 0`** — do not use for game counts; use lobby sections. |
| 6 | **All API calls are client-side only** — `getAccessToken()` returns `null` on server. No middleware auth protection. |

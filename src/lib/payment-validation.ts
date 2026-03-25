import type { SabiAmount } from "@/types/api.types";

export function parseAmountInput(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const normalized = typeof value === "string" ? value.trim() : String(value);
  if (!normalized) return null;

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

export function getDepositAmountError(
  amount: string,
  minDeposit: number,
  maxDeposit: number,
  currencyLabel: string,
): string | null {
  if (!amount.trim()) {
    return null;
  }

  const parsed = parseAmountInput(amount);
  if (parsed === null) {
    return "Enter a valid deposit amount.";
  }

  if (parsed < minDeposit) {
    return `Minimum deposit is ${currencyLabel} ${minDeposit}.`;
  }

  if (parsed > maxDeposit) {
    return `Maximum deposit is ${currencyLabel} ${maxDeposit}.`;
  }

  return null;
}

export function getWithdrawalAmountError(
  amount: string,
  minWithdraw: number,
  maxWithdraw: number,
  withdrawableBalance: SabiAmount | number | null | undefined,
  currencyLabel: string,
): string | null {
  if (!amount.trim()) {
    return null;
  }

  const parsed = parseAmountInput(amount);
  if (parsed === null) {
    return "Enter a valid withdrawal amount.";
  }

  if (parsed < minWithdraw) {
    return `Minimum withdrawal is ${currencyLabel} ${minWithdraw}.`;
  }

  if (parsed > maxWithdraw) {
    return `Maximum withdrawal is ${currencyLabel} ${maxWithdraw}.`;
  }

  const available = parseAmountInput(withdrawableBalance ?? null);
  if (available !== null && parsed > available) {
    return `Withdrawal exceeds your withdrawable balance of ${currencyLabel} ${available}.`;
  }

  return null;
}

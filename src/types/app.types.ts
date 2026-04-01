import { NovaAmount } from "./api.types";

export interface DepositOrderPreviewInfo {
  amount?: NovaAmount;
  bank_name?: string;
  account_name?: string;
  account_number?: string;
}

import { SabiAmount } from "./api.types";

export interface DepositOrderPreviewInfo {
  amount?: SabiAmount;
  bank_name?: string;
  account_name?: string;
  account_number?: string;
}

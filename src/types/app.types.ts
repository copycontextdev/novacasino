import { SabiAmount } from "./api.types";

export interface DepositOrderPreview {
  amount: SabiAmount;
  status_display?: string;
  bank_name: string;
  account_name: string;
  account_number: string;
}

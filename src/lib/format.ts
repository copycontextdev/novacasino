export function formatBalance(balance: string | number | null | undefined): string {
  if (balance === undefined || balance === null) return "0.00";
  const value = Number(balance);
  if (!Number.isFinite(value)) return "0.00";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function getAxiosErrorMessage(error: unknown): string {
  if (!error) return "Something went wrong.";
  if (typeof error === "string") return error;
  if (typeof error === "object") {
    const maybeRecord = error as Record<string, unknown>;
    const response = maybeRecord.response as
      | { data?: Record<string, unknown> }
      | undefined;
    const detail = response?.data?.detail;
    if (typeof detail === "string") return detail;
    const message = response?.data?.message;
    if (typeof message === "string") return message;
    if (typeof maybeRecord.message === "string") return maybeRecord.message;
  }
  return "Something went wrong.";
}

import type { NovaApiEnvelope } from "@/types/api.types";

export function toArray<T>(
  payload:
    | T[]
    | {
        results?: T[];
      }
    | undefined,
): T[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  return payload.results ?? [];
}

export function toPositiveNumber(
  value: string | number | undefined,
  fallback: number,
): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

export function extractEnvelopeData<T>(payload: NovaApiEnvelope): T | null {
  const data = payload.data;
  if (data && typeof data === "object") return data as T;
  return null;
}

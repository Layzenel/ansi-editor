import { optimizeDoc, type Doc } from "./model";
import { serializeParts, type SerializeOptions, type SerializedParts } from "./serializer";

export type LimitSetting = "auto" | "2000" | "4000";

export const BASE_LIMIT = 2000;
export const NITRO_LIMIT = 4000;

/**
 * Message length limit for a user. premiumType: 1 = Nitro Classic, 2 = Nitro, 3 = Nitro Basic.
 * Nitro Basic does not include longer messages.
 */
export function messageLimit(setting: LimitSetting, premiumType: number | null | undefined): number {
  if (setting === "2000") return BASE_LIMIT;
  if (setting === "4000") return NITRO_LIMIT;
  return premiumType === 1 || premiumType === 2 ? NITRO_LIMIT : BASE_LIMIT;
}

export type LimitLevel = "ok" | "warning" | "error";

export interface LengthInfo extends SerializedParts {
  total: number;
  limit: number;
  level: LimitLevel;
}

/** <90% ok, 90–100% warning, >100% error. */
export function limitLevel(total: number, limit: number): LimitLevel {
  if (total > limit) return "error";
  if (total >= limit * 0.9) return "warning";
  return "ok";
}

export function lengthInfo(doc: Doc, options: Partial<SerializeOptions>, limit: number): LengthInfo {
  const parts = serializeParts(doc, options);
  const total = parts.output.length;
  return { ...parts, total, limit, level: limitLevel(total, limit) };
}

/** True if the text contains a triple backtick that would close the block early. */
export function hasTripleBackticks(text: string): boolean {
  return text.includes("```");
}

/** Optimizes the document and returns how many characters it saves with the given options. */
export function optimizeWithSavings(doc: Doc, options: Partial<SerializeOptions>) {
  const before = serializeParts(doc, options).output.length;
  const optimized = optimizeDoc(doc);
  const after = serializeParts(optimized, { ...options, aggressive: true }).output.length;
  return { doc: optimized, saved: Math.max(0, before - after) };
}

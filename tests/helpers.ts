import { DEFAULT_STYLE, type Doc, type Style } from "../src/core/model";

export const S = (patch: Partial<Style> = {}): Style => ({ ...DEFAULT_STYLE, ...patch });
export const run = (text: string, patch: Partial<Style> = {}) => ({ text, style: S(patch) });
export const doc = (...runs: ReturnType<typeof run>[]): Doc => runs;
export const E = "\u001b";

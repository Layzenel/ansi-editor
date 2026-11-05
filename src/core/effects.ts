import { normalize, sliceDoc, replaceRange, type Doc, type Range } from "./model";
import { codeFor, type Layer } from "./palette";
import { graphemeBoundaries } from "./graphemes";

export type EffectStep = "char" | "word" | "line";

export interface ColorCycleOptions {
  /** Palette indices 0..7, applied in order. */
  colors: number[];
  step: EffectStep;
  /** Whitespace does not consume a color (char step only; words/lines skip it anyway). */
  skipSpaces: boolean;
  layer: Layer;
}

/** Default rainbow order: red → yellow → green → cyan → blue → pink. */
export const RAINBOW_COLORS = [1, 3, 2, 6, 4, 5];

export const DEFAULT_RAINBOW: ColorCycleOptions = {
  colors: RAINBOW_COLORS,
  step: "char",
  skipSpaces: true,
  layer: "fg",
};

export const DEFAULT_ALTERNATE: ColorCycleOptions = {
  colors: [1, 4],
  step: "word",
  skipSpaces: true,
  layer: "fg",
};

/** Units of text the effect colors, as offsets relative to `text`. */
export function effectUnits(text: string, step: EffectStep, skipSpaces: boolean): Range[] {
  if (step === "char") {
    const b = graphemeBoundaries(text);
    const out: Range[] = [];
    for (let i = 0; i + 1 < b.length; i++) {
      const ch = text.slice(b[i], b[i + 1]);
      if (skipSpaces && /^\s+$/.test(ch)) continue;
      out.push({ start: b[i], end: b[i + 1] });
    }
    return out;
  }
  const re = step === "word" ? /\S+/g : /[^\n]+/g;
  return [...text.matchAll(re)].map((m) => ({
    start: m.index ?? 0,
    end: (m.index ?? 0) + m[0].length,
  }));
}

/** Colors consecutive units of the range with a repeating list of colors. */
export function applyColorCycle(doc: Doc, start: number, end: number, opts: ColorCycleOptions): Doc {
  if (!opts.colors.length || start >= end) return doc;
  const part = sliceDoc(doc, start, end);
  const text = part.map((r) => r.text).join("");
  const units = effectUnits(text, opts.step, opts.skipSpaces);
  let colored: Doc = part;
  units.forEach((u, i) => {
    const code = codeFor(opts.layer, opts.colors[i % opts.colors.length]);
    colored = recolor(colored, u, opts.layer, code);
  });
  return replaceRange(doc, start, end, normalize(colored));
}

function recolor(doc: Doc, r: Range, layer: Layer, code: number): Doc {
  const out: Doc = [];
  let pos = 0;
  for (const run of doc) {
    const rs = pos;
    const re = pos + run.text.length;
    pos = re;
    if (re <= r.start || rs >= r.end) {
      out.push(run);
      continue;
    }
    const a = Math.max(r.start, rs) - rs;
    const b = Math.min(r.end, re) - rs;
    if (a > 0) out.push({ text: run.text.slice(0, a), style: run.style });
    out.push({ text: run.text.slice(a, b), style: { ...run.style, [layer]: code } });
    if (b < run.text.length) out.push({ text: run.text.slice(b), style: run.style });
  }
  return out;
}

export const rainbow = (doc: Doc, start: number, end: number, opts: Partial<ColorCycleOptions> = {}) =>
  applyColorCycle(doc, start, end, { ...DEFAULT_RAINBOW, ...opts });

export const alternate = (doc: Doc, start: number, end: number, opts: Partial<ColorCycleOptions> = {}) =>
  applyColorCycle(doc, start, end, {
    ...DEFAULT_ALTERNATE,
    ...opts,
    colors: (opts.colors ?? DEFAULT_ALTERNATE.colors).slice(0, 4),
  });

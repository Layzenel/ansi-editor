import type { BgCode, FgCode } from "./palette";
import { ceilBoundary, floorBoundary, graphemeBoundaries } from "./graphemes";

export interface Style {
  /** null = default text color */
  fg: FgCode | null;
  /** null = no background */
  bg: BgCode | null;
  bold: boolean;
  underline: boolean;
}

export interface Run {
  text: string;
  style: Style;
}

/** Always normalized: no empty runs, no adjacent runs with equal style. */
export type Doc = Run[];

export interface Range {
  start: number;
  end: number;
}

export const DEFAULT_STYLE: Readonly<Style> = Object.freeze({
  fg: null,
  bg: null,
  bold: false,
  underline: false,
});

export function styleEquals(a: Style, b: Style): boolean {
  return a.fg === b.fg && a.bg === b.bg && a.bold === b.bold && a.underline === b.underline;
}

export function isDefaultStyle(s: Style): boolean {
  return styleEquals(s, DEFAULT_STYLE);
}

/** Drops empty runs and merges neighbours with the same style. */
export function normalize(doc: Doc): Doc {
  const out: Doc = [];
  for (const run of doc) {
    if (!run.text) continue;
    const last = out[out.length - 1];
    if (last && styleEquals(last.style, run.style)) {
      out[out.length - 1] = { text: last.text + run.text, style: last.style };
    } else {
      out.push({ text: run.text, style: { ...run.style } });
    }
  }
  return out;
}

export function plainText(doc: Doc): string {
  return doc.map((r) => r.text).join("");
}

export function docLength(doc: Doc): number {
  let n = 0;
  for (const r of doc) n += r.text.length;
  return n;
}

/** Clamps a range to the document and snaps it outward to grapheme boundaries. */
export function snapRange(doc: Doc, start: number, end: number): Range {
  const text = plainText(doc);
  const lo = Math.max(0, Math.min(start, end, text.length));
  const hi = Math.min(text.length, Math.max(start, end, 0));
  const bounds = graphemeBoundaries(text);
  return { start: floorBoundary(bounds, lo), end: ceilBoundary(bounds, hi) };
}

/** Snaps a caret offset down to a grapheme boundary. */
export function snapOffset(doc: Doc, offset: number): number {
  const text = plainText(doc);
  const clamped = Math.max(0, Math.min(offset, text.length));
  return floorBoundary(graphemeBoundaries(text), clamped);
}

/** Raw slice by UTF-16 offsets (no snapping). */
function rawSlice(doc: Doc, start: number, end: number): Doc {
  const out: Doc = [];
  let pos = 0;
  for (const run of doc) {
    const rs = pos;
    const re = pos + run.text.length;
    pos = re;
    if (re <= start || rs >= end) continue;
    const text = run.text.slice(Math.max(0, start - rs), Math.min(run.text.length, end - rs));
    if (text) out.push({ text, style: run.style });
  }
  return out;
}

/** Returns the part of the document in [start, end). */
export function sliceDoc(doc: Doc, start: number, end: number): Doc {
  const r = snapRange(doc, start, end);
  return normalize(rawSlice(doc, r.start, r.end));
}

/** Inserts another document at offset. */
export function insertDoc(doc: Doc, offset: number, other: Doc): Doc {
  const at = snapOffset(doc, offset);
  const len = docLength(doc);
  return normalize([...rawSlice(doc, 0, at), ...other, ...rawSlice(doc, at, len)]);
}

export function insertText(doc: Doc, offset: number, text: string, style: Style): Doc {
  return insertDoc(doc, offset, [{ text, style }]);
}

export function deleteRange(doc: Doc, start: number, end: number): Doc {
  const r = snapRange(doc, start, end);
  return normalize([...rawSlice(doc, 0, r.start), ...rawSlice(doc, r.end, docLength(doc))]);
}

/** Replaces [start, end) with `other`. */
export function replaceRange(doc: Doc, start: number, end: number, other: Doc): Doc {
  const r = snapRange(doc, start, end);
  return normalize([
    ...rawSlice(doc, 0, r.start),
    ...other,
    ...rawSlice(doc, r.end, docLength(doc)),
  ]);
}

/** Maps the style of every character in [start, end). */
export function mapStyle(doc: Doc, start: number, end: number, fn: (s: Style) => Style): Doc {
  const r = snapRange(doc, start, end);
  const mid = rawSlice(doc, r.start, r.end).map((run) => ({
    text: run.text,
    style: fn(run.style),
  }));
  return normalize([...rawSlice(doc, 0, r.start), ...mid, ...rawSlice(doc, r.end, docLength(doc))]);
}

export function applyStyle(doc: Doc, start: number, end: number, patch: Partial<Style>): Doc {
  return mapStyle(doc, start, end, (s) => ({ ...s, ...patch }));
}

/** Removes the attribute if the whole range has it, otherwise sets it everywhere. */
export function toggle(doc: Doc, start: number, end: number, attr: "bold" | "underline"): Doc {
  const r = snapRange(doc, start, end);
  const slice = rawSlice(doc, r.start, r.end);
  const all = slice.length > 0 && slice.every((run) => run.style[attr]);
  return applyStyle(doc, r.start, r.end, { [attr]: !all });
}

export function clearStyle(doc: Doc, start: number, end: number): Doc {
  return mapStyle(doc, start, end, () => ({ ...DEFAULT_STYLE }));
}

/** Style a newly typed character at `offset` inherits: the character to the left (or right at 0). */
export function styleAt(doc: Doc, offset: number): Style {
  if (!doc.length) return { ...DEFAULT_STYLE };
  let pos = 0;
  for (const run of doc) {
    const end = pos + run.text.length;
    if (offset > pos && offset <= end) return { ...run.style };
    pos = end;
  }
  return { ...(offset <= 0 ? doc[0].style : doc[doc.length - 1].style) };
}

export type Mixed<T> = T | "mixed";

export interface RangeStyle {
  fg: Mixed<FgCode | null>;
  bg: Mixed<BgCode | null>;
  bold: Mixed<boolean>;
  underline: Mixed<boolean>;
}

/** Common style of a range; attributes that differ are reported as "mixed". */
export function rangeStyle(doc: Doc, start: number, end: number): RangeStyle {
  const slice = rawSlice(doc, Math.min(start, end), Math.max(start, end));
  if (!slice.length) {
    const s = styleAt(doc, start);
    return { ...s };
  }
  const first = slice[0].style;
  const res: RangeStyle = { ...first };
  for (const run of slice) {
    if (run.style.fg !== first.fg) res.fg = "mixed";
    if (run.style.bg !== first.bg) res.bg = "mixed";
    if (run.style.bold !== first.bold) res.bold = "mixed";
    if (run.style.underline !== first.underline) res.underline = "mixed";
  }
  return res;
}

/** Ranges whose style matches the predicate (adjacent matches are merged). */
export function findStyleRanges(doc: Doc, pred: (s: Style) => boolean): Range[] {
  const out: Range[] = [];
  let pos = 0;
  for (const run of doc) {
    const end = pos + run.text.length;
    if (pred(run.style)) {
      const last = out[out.length - 1];
      if (last && last.end === pos) last.end = end;
      else out.push({ start: pos, end });
    }
    pos = end;
  }
  return out;
}

/** Replaces one color with another in the given layer across the whole document. */
export function replaceColor(
  doc: Doc,
  layer: "fg" | "bg",
  from: FgCode | BgCode | null,
  to: FgCode | BgCode | null,
): Doc {
  return normalize(
    doc.map((run) =>
      run.style[layer] === from ? { text: run.text, style: { ...run.style, [layer]: to } } : run,
    ),
  );
}

/**
 * Visual-preserving optimization: whitespace runs without background or underline
 * look the same whatever their fg/bold, so they adopt the previous run's fg/bold and merge.
 */
export function optimizeDoc(doc: Doc): Doc {
  const out: Doc = [];
  for (const run of doc) {
    const prev = out[out.length - 1];
    const invisible = /^\s+$/.test(run.text) && run.style.bg === null && !run.style.underline;
    if (prev && invisible) {
      out.push({ text: run.text, style: { ...prev.style, bg: null, underline: false } });
    } else {
      out.push(run);
    }
  }
  return normalize(out);
}

/** Grapheme-boundary helpers so offsets never split a surrogate pair or an emoji sequence. */

const segmenter: Intl.Segmenter | null =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;

/** Sorted UTF-16 offsets of every grapheme boundary in `text`, including 0 and text.length. */
export function graphemeBoundaries(text: string): number[] {
  const out: number[] = [];
  if (segmenter) {
    for (const seg of segmenter.segment(text)) out.push(seg.index);
  } else {
    let i = 0;
    for (const ch of text) {
      out.push(i);
      i += ch.length;
    }
  }
  out.push(text.length);
  return out;
}

/** Largest boundary <= offset. */
export function floorBoundary(bounds: readonly number[], offset: number): number {
  let best = 0;
  for (const b of bounds) {
    if (b > offset) break;
    best = b;
  }
  return best;
}

/** Smallest boundary >= offset. */
export function ceilBoundary(bounds: readonly number[], offset: number): number {
  for (const b of bounds) if (b >= offset) return b;
  return bounds[bounds.length - 1] ?? 0;
}

/** Splits text into graphemes. */
export function graphemes(text: string): string[] {
  const b = graphemeBoundaries(text);
  const out: string[] = [];
  for (let i = 0; i + 1 < b.length; i++) out.push(text.slice(b[i], b[i + 1]));
  return out;
}

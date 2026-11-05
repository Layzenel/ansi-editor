import type { Range as TextRange } from "../core/model";

/** Plain-text offset of a DOM position inside root (text nodes only; <br> counts as nothing). */
export function offsetOf(root: Node, node: Node, offset: number): number {
  const r = document.createRange();
  r.setStart(root, 0);
  try {
    r.setEnd(node, offset);
  } catch {
    return 0;
  }
  return r.toString().length;
}

export function getSelectionOffsets(root: HTMLElement): TextRange | null {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return null;
  const range = sel.getRangeAt(0);
  if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) return null;
  return {
    start: offsetOf(root, range.startContainer, range.startOffset),
    end: offsetOf(root, range.endContainer, range.endOffset),
  };
}

/** Converts a DOM StaticRange (from beforeinput target ranges) into offsets. */
export function rangeOffsets(root: HTMLElement, r: AbstractRange): TextRange | null {
  if (!root.contains(r.startContainer) || !root.contains(r.endContainer)) return null;
  return {
    start: offsetOf(root, r.startContainer, r.startOffset),
    end: offsetOf(root, r.endContainer, r.endOffset),
  };
}

/** DOM position for a plain-text offset. */
function positionAt(root: HTMLElement, offset: number): [Node, number] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let acc = 0;
  let last: Text | null = null;
  for (let n = walker.nextNode() as Text | null; n; n = walker.nextNode() as Text | null) {
    const len = n.data.length;
    if (offset <= acc + len) return [n, offset - acc];
    acc += len;
    last = n;
  }
  if (last) return [last, last.data.length];
  return [root, 0];
}

export function setSelectionOffsets(root: HTMLElement, start: number, end: number): void {
  const sel = window.getSelection();
  if (!sel) return;
  const [sn, so] = positionAt(root, start);
  const [en, eo] = start === end ? [sn, so] : positionAt(root, end);
  const cur = getSelectionOffsets(root);
  if (cur && cur.start === start && cur.end === end) return;
  sel.setBaseAndExtent(sn, so, en, eo);
}

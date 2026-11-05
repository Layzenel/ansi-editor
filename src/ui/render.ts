import type { Doc, Range, Style } from "../core/model";

/** CSS classes for a run's style (shared by editor and preview). */
export function styleClasses(s: Style): string {
  const c: string[] = [];
  if (s.fg !== null) c.push(`ansiEditor-fg-${s.fg}`);
  if (s.bg !== null) c.push(`ansiEditor-bg-${s.bg}`);
  if (s.bold) c.push("ansiEditor-b");
  if (s.underline) c.push("ansiEditor-u");
  return c.join(" ");
}

export interface Segment {
  text: string;
  style: Style;
  marked: boolean;
}

/** Splits runs at multi-selection boundaries so marked parts can be highlighted. */
export function segments(doc: Doc, marks: Range[] | null): Segment[] {
  if (!marks?.length) return doc.map((r) => ({ text: r.text, style: r.style, marked: false }));
  const cuts = new Set<number>();
  for (const m of marks) cuts.add(m.start).add(m.end);
  const inMark = (pos: number) => marks.some((m) => pos >= m.start && pos < m.end);
  const out: Segment[] = [];
  let pos = 0;
  for (const run of doc) {
    let from = 0;
    for (let i = 1; i <= run.text.length; i++) {
      if (i === run.text.length || cuts.has(pos + i)) {
        out.push({ text: run.text.slice(from, i), style: run.style, marked: inMark(pos + from) });
        from = i;
      }
    }
    pos += run.text.length;
  }
  return out;
}

/** Rebuilds the editor DOM from the model (never parsed back). */
export function renderInto(root: HTMLElement, doc: Doc, marks: Range[] | null): void {
  const frag = document.createDocumentFragment();
  for (const seg of segments(doc, marks)) {
    const span = document.createElement("span");
    span.className = styleClasses(seg.style) + (seg.marked ? " ansiEditor-marked" : "");
    span.textContent = seg.text;
    frag.appendChild(span);
  }
  // Sentinel keeps a trailing newline visible and gives an empty editor a caret line.
  const br = document.createElement("br");
  br.setAttribute("data-sentinel", "");
  frag.appendChild(br);
  root.replaceChildren(frag);
}

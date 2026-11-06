import { DEFAULT_STYLE, styleEquals, type Doc, type Style } from "./model";
import { ESC, ZWSP } from "./parser";

export interface SerializeOptions {
  /** Wrap into ```ansi … ``` */
  wrap: boolean;
  /** Emit ESC[0m at the end when a style is still active. */
  trailingReset: boolean;
  /** Break ``` inside the text with zero-width spaces. */
  escapeBackticks: boolean;
  /** Replace tabs with N spaces (0 = keep tabs). */
  tabSize: number;
  /** Skip fg/bold switches on whitespace runs that have no background/underline. */
  aggressive: boolean;
}

export const DEFAULT_SERIALIZE_OPTIONS: Readonly<SerializeOptions> = Object.freeze({
  wrap: true,
  trailingReset: true,
  escapeBackticks: true,
  tabSize: 4,
  aggressive: true,
});

export const FENCE_OPEN = "```ansi\n";
export const FENCE_CLOSE = "\n```";

export interface SerializedParts {
  /** Final string. */
  output: string;
  /** Characters of visible text (including escaping). */
  textChars: number;
  /** Characters spent on escape sequences. */
  escapeChars: number;
  /** Characters spent on the code-block wrapper. */
  wrapChars: number;
}

/** Codes for the full style from a reset state (without the leading 0). */
function fullCodes(s: Style): number[] {
  const c: number[] = [];
  if (s.bold) c.push(1);
  if (s.underline) c.push(4);
  if (s.fg !== null) c.push(s.fg);
  if (s.bg !== null) c.push(s.bg);
  return c;
}

/**
 * Minimal SGR sequence for going from `cur` to `next`.
 * Removing anything resets (0) and re-applies the full style, since Discord's support
 * for 22/24/39/49 is not guaranteed.
 */
export function transition(cur: Style, next: Style): string {
  if (styleEquals(cur, next)) return "";
  const needsReset =
    (cur.bold && !next.bold) ||
    (cur.underline && !next.underline) ||
    (cur.fg !== null && next.fg === null) ||
    (cur.bg !== null && next.bg === null);
  let codes: number[];
  if (needsReset) {
    codes = [0, ...fullCodes(next)];
  } else {
    codes = [];
    if (next.bold && !cur.bold) codes.push(1);
    if (next.underline && !cur.underline) codes.push(4);
    if (next.fg !== cur.fg && next.fg !== null) codes.push(next.fg);
    if (next.bg !== cur.bg && next.bg !== null) codes.push(next.bg);
  }
  return `${ESC}[${codes.join(";")}m`;
}

export function escapeTripleBackticks(text: string): string {
  return text.replace(/```/g, `\`${ZWSP}\`${ZWSP}\``);
}

function transformText(text: string, opts: SerializeOptions): string {
  let t = text;
  if (opts.tabSize > 0) t = t.replace(/\t/g, " ".repeat(opts.tabSize));
  return t;
}

/** Serializes a document and reports how the length splits into text / escapes / wrapper. */
export function serializeParts(doc: Doc, options: Partial<SerializeOptions> = {}): SerializedParts {
  const opts = { ...DEFAULT_SERIALIZE_OPTIONS, ...options };
  let cur: Style = { ...DEFAULT_STYLE };
  const pieces: { text: string; esc: boolean }[] = [];

  for (const run of doc) {
    let target = run.style;
    const invisible = /^\s+$/.test(run.text) && target.bg === null && !target.underline;
    if (opts.aggressive && invisible) {
      target = { ...target, fg: cur.fg, bold: cur.bold };
      // Keeping fg/bold is only possible without a reset; otherwise use the real style.
      if (transition(cur, target).startsWith(`${ESC}[0`)) target = run.style;
    }
    const seq = transition(cur, target);
    if (seq) pieces.push({ text: seq, esc: true });
    pieces.push({ text: transformText(run.text, opts), esc: false });
    cur = target;
  }
  if (opts.trailingReset && !styleEquals(cur, DEFAULT_STYLE)) {
    pieces.push({ text: `${ESC}[0m`, esc: true });
  }

  // Escape ``` across adjacent text pieces (escape codes between backticks already break them).
  let body = "";
  let escapeChars = 0;
  let textBuf = "";
  const flush = () => {
    body += opts.escapeBackticks ? escapeTripleBackticks(textBuf) : textBuf;
    textBuf = "";
  };
  for (const p of pieces) {
    if (p.esc) {
      flush();
      body += p.text;
      escapeChars += p.text.length;
    } else {
      textBuf += p.text;
    }
  }
  flush();

  const output = opts.wrap ? FENCE_OPEN + body + FENCE_CLOSE : body;
  const wrapChars = opts.wrap ? FENCE_OPEN.length + FENCE_CLOSE.length : 0;
  return { output, escapeChars, wrapChars, textChars: body.length - escapeChars };
}

export function serialize(doc: Doc, options: Partial<SerializeOptions> = {}): string {
  return serializeParts(doc, options).output;
}

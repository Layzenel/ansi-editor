import { normalize, type Doc, type Style, DEFAULT_STYLE } from "./model";
import { isBgCode, isFgCode } from "./palette";

export const ESC = "\u001b";

export interface AnsiBlock {
  /** Offsets of the whole ```ansi … ``` block inside the message. */
  start: number;
  end: number;
  /** Text between the fences. */
  content: string;
}

export interface ParseOptions {
  /** Treat typed literals like \u001b, \x1b, \e, \033 as a real ESC. */
  literalEscapes?: boolean;
}

export interface ParseWarnings {
  /** SGR codes Discord does not render (italic, 256-color, …). */
  unsupportedCodes: number;
  /** Non-SGR control sequences that were stripped. */
  strippedSequences: number;
}

export interface ParseResult {
  doc: Doc;
  warnings: ParseWarnings;
}

const BLOCK_RE = /```ansi[ \t]*\n?([\s\S]*?)```/gi;

/** Finds every ```ansi block in a message. */
export function extractAnsiBlocks(message: string): AnsiBlock[] {
  const out: AnsiBlock[] = [];
  for (const m of message.matchAll(BLOCK_RE)) {
    const start = m.index ?? 0;
    out.push({ start, end: start + m[0].length, content: trimFenceNewline(m[1]) });
  }
  return out;
}

/** Discord ignores one newline right before the closing fence; so do we. */
function trimFenceNewline(s: string): string {
  return s.endsWith("\n") ? s.slice(0, -1) : s;
}

export function hasAnsi(text: string, literalEscapes = false): boolean {
  if (text.includes(ESC) || /```ansi/i.test(text)) return true;
  return literalEscapes && LITERAL_RE.test(text);
}

const LITERAL_RE = /\\(?:u001b|x1b|e|033)(?=\[)/gi;
// CSI: ESC [ params intermediates final; or a lone ESC.
const SEQ_RE = /\u001b(?:\[([0-?]*)[ -/]*([@-~]))?/g;

/** Applies the SGR parameter list to a style; returns the number of unsupported codes. */
function applySgr(style: Style, params: string): number {
  const codes = params === "" ? [0] : params.split(/[;:]/).map((p) => (p === "" ? 0 : Number(p)));
  let unsupported = 0;
  for (let i = 0; i < codes.length; i++) {
    const c = codes[i];
    if (c === 0) Object.assign(style, DEFAULT_STYLE);
    else if (c === 1) style.bold = true;
    else if (c === 4) style.underline = true;
    else if (c === 22) style.bold = false;
    else if (c === 24) style.underline = false;
    else if (c === 39) style.fg = null;
    else if (c === 49) style.bg = null;
    else if (isFgCode(c)) style.fg = c;
    else if (isBgCode(c)) style.bg = c;
    else {
      unsupported++;
      // Extended colors carry their own parameters: 38;5;n or 38;2;r;g;b.
      if ((c === 38 || c === 48 || c === 58) && codes[i + 1] === 5) i += 2;
      else if ((c === 38 || c === 48 || c === 58) && codes[i + 1] === 2) i += 4;
    }
  }
  return unsupported;
}

/** Parses ANSI-colored text (the content of a block) into a normalized document. */
export function parseAnsi(input: string, options: ParseOptions = {}): ParseResult {
  let text = input.replace(/\r\n?/g, "\n");
  if (options.literalEscapes) text = text.replace(LITERAL_RE, ESC);
  // Undo our own triple-backtick escaping (zero-width spaces between backticks).
  text = text.replace(/`​(?=`)/g, "`");

  const warnings: ParseWarnings = { unsupportedCodes: 0, strippedSequences: 0 };
  const doc: Doc = [];
  const style: Style = { ...DEFAULT_STYLE };
  let last = 0;
  for (const m of text.matchAll(SEQ_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) doc.push({ text: text.slice(last, idx), style: { ...style } });
    last = idx + m[0].length;
    if (m[2] === "m") warnings.unsupportedCodes += applySgr(style, m[1] ?? "");
    else warnings.strippedSequences++;
  }
  if (last < text.length) doc.push({ text: text.slice(last), style: { ...style } });
  return { doc: normalize(doc), warnings };
}

/**
 * Parses a whole message: the chosen ```ansi block if there is one,
 * otherwise the whole text (useful for pasted raw escape codes).
 */
export function parseMessage(message: string, blockIndex = 0, options: ParseOptions = {}) {
  const blocks = extractAnsiBlocks(message);
  const block = blocks[blockIndex];
  return { ...parseAnsi(block ? block.content : message, options), block, blocks };
}

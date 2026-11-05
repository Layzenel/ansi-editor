import { describe, expect, it } from "vitest";
import { extractAnsiBlocks, hasAnsi, parseAnsi, parseMessage } from "../src/core/parser";
import { E, doc, run } from "./helpers";

describe("parseAnsi", () => {
  it("parses every supported fg and bg code", () => {
    for (let c = 30; c <= 37; c++) {
      expect(parseAnsi(`${E}[${c}mx`).doc).toEqual(doc(run("x", { fg: c as never })));
    }
    for (let c = 40; c <= 47; c++) {
      expect(parseAnsi(`${E}[${c}mx`).doc).toEqual(doc(run("x", { bg: c as never })));
    }
  });

  it("parses bold, underline and reset", () => {
    expect(parseAnsi(`${E}[1ma${E}[4mb${E}[0mc`).doc).toEqual(
      doc(run("a", { bold: true }), run("b", { bold: true, underline: true }), run("c")),
    );
  });

  it("parses combinations separated by ;", () => {
    expect(parseAnsi(`${E}[1;4;31;40mx`).doc).toEqual(
      doc(run("x", { bold: true, underline: true, fg: 31, bg: 40 })),
    );
  });

  it("treats ESC[m as reset", () => {
    expect(parseAnsi(`${E}[31ma${E}[mb`).doc).toEqual(doc(run("a", { fg: 31 }), run("b")));
  });

  it("understands 22, 24, 39, 49", () => {
    const d = parseAnsi(`${E}[1;4;31;41ma${E}[22mb${E}[24mc${E}[39md${E}[49me`).doc;
    expect(d).toEqual(
      doc(
        run("a", { bold: true, underline: true, fg: 31, bg: 41 }),
        run("b", { underline: true, fg: 31, bg: 41 }),
        run("c", { fg: 31, bg: 41 }),
        run("d", { bg: 41 }),
        run("e"),
      ),
    );
  });

  it("ignores unknown codes and counts them", () => {
    const r = parseAnsi(`${E}[3;31mx${E}[38;5;200my${E}[38;2;1;2;3mz`);
    expect(r.doc).toEqual(doc(run("xyz", { fg: 31 })));
    expect(r.warnings.unsupportedCodes).toBe(3);
  });

  it("strips other CSI sequences and lone ESC", () => {
    const r = parseAnsi(`a${E}[2Kb${E}c`);
    expect(r.doc).toEqual(doc(run("abc")));
    expect(r.warnings.strippedSequences).toBe(2);
  });

  it("parses text literals only when enabled", () => {
    expect(parseAnsi("\\u001b[31mx").doc).toEqual(doc(run("\\u001b[31mx")));
    for (const lit of ["\\u001b", "\\x1b", "\\e", "\\033", "\\U001B"]) {
      expect(parseAnsi(`${lit}[31mx`, { literalEscapes: true }).doc).toEqual(
        doc(run("x", { fg: 31 })),
      );
    }
  });

  it("keeps newlines and emoji", () => {
    expect(parseAnsi(`${E}[32m👍🏽\nok`).doc).toEqual(doc(run("👍🏽\nok", { fg: 32 })));
  });

  it("normalizes CRLF and removes own backtick escaping", () => {
    expect(parseAnsi("a\r\nb").doc).toEqual(doc(run("a\nb")));
    expect(parseAnsi("`200b`200b`").doc).toEqual(doc(run("```")));
  });

  it("returns an empty doc for empty input", () => {
    expect(parseAnsi("").doc).toEqual([]);
  });
});

describe("blocks", () => {
  const msg = `hi\n\`\`\`ansi\n${E}[31mred\n\`\`\`\nmid\n\`\`\`ansi\n${E}[34mblue\`\`\` end`;

  it("extracts several blocks with offsets", () => {
    const blocks = extractAnsiBlocks(msg);
    expect(blocks).toHaveLength(2);
    expect(blocks[0].content).toBe(`${E}[31mred`);
    expect(blocks[1].content).toBe(`${E}[34mblue`);
    expect(msg.slice(blocks[0].start, blocks[0].end).startsWith("```ansi")).toBe(true);
    expect(msg.slice(blocks[1].end)).toBe(" end");
  });

  it("handles an empty block", () => {
    expect(extractAnsiBlocks("```ansi\n```")[0].content).toBe("");
  });

  it("parseMessage picks the requested block or falls back to the whole text", () => {
    expect(parseMessage(msg, 1).doc).toEqual(doc(run("blue", { fg: 34 })));
    expect(parseMessage(`${E}[31mx`).doc).toEqual(doc(run("x", { fg: 31 })));
    expect(parseMessage(`${E}[31mx`).block).toBeUndefined();
  });

  it("hasAnsi detects escapes, blocks and literals", () => {
    expect(hasAnsi("plain")).toBe(false);
    expect(hasAnsi(`${E}[1m`)).toBe(true);
    expect(hasAnsi("```ansi\nx```")).toBe(true);
    expect(hasAnsi("\\u001b[1m")).toBe(false);
    expect(hasAnsi("\\u001b[1m", true)).toBe(true);
  });
});

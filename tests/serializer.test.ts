import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { serialize, serializeParts, transition } from "../src/core/serializer";
import { parseAnsi } from "../src/core/parser";
import { normalize, type Doc, type Style } from "../src/core/model";
import { E, S, doc, run } from "./helpers";

const raw = { wrap: false, aggressive: false };

describe("serialize", () => {
  it("emits nothing for plain text", () => {
    expect(serialize(doc(run("hello")), raw)).toBe("hello");
  });

  it("wraps into an ansi block", () => {
    expect(serialize(doc(run("x")), { aggressive: false })).toBe("```ansi\nx\n```");
  });

  it("only adds attributes when nothing is removed", () => {
    expect(serialize(doc(run("a", { fg: 31 }), run("b", { fg: 31, bold: true })), raw)).toBe(
      `${E}[31ma${E}[1mb${E}[0m`,
    );
  });

  it("resets and re-applies the full style when removing an attribute", () => {
    expect(
      serialize(doc(run("a", { fg: 31, bold: true }), run("b", { fg: 34 }), run("c")), raw),
    ).toBe(`${E}[1;31ma${E}[0;34mb${E}[0mc`);
  });

  it("matches reference snapshots", () => {
    const d = doc(
      run("Red bold", { fg: 31, bold: true }),
      run(" normal "),
      run("blue on white", { fg: 34, bg: 47, underline: true }),
    );
    const visible = serialize(d, { aggressive: false }).replaceAll(E, "␛");
    expect(visible).toBe("```ansi\n␛[1;31mRed bold␛[0m normal ␛[4;34;47mblue on white␛[0m\n```");
  });

  it("can omit the trailing reset", () => {
    expect(serialize(doc(run("a", { fg: 31 })), { ...raw, trailingReset: false })).toBe(
      `${E}[31ma`,
    );
  });

  it("escapes triple backticks, also across runs of equal text", () => {
    expect(serialize(doc(run("a```b")), raw)).toBe("a`​`​`b");
    expect(serialize(doc(run("a```b")), { ...raw, escapeBackticks: false })).toBe("a```b");
    // An escape code between backticks already breaks the fence.
    expect(serialize(doc(run("``"), run("`", { fg: 31 })), raw)).toBe(`\`\`${E}[31m\`${E}[0m`);
  });

  it("replaces tabs", () => {
    expect(serialize(doc(run("\tx")), { ...raw, tabSize: 2 })).toBe("  x");
    expect(serialize(doc(run("\tx")), { ...raw, tabSize: 0 })).toBe("\tx");
  });

  it("aggressive mode does not switch fg on plain whitespace", () => {
    const d = doc(run("a", { fg: 31 }), run(" "), run("b", { fg: 31 }));
    expect(serialize(d, raw)).toBe(`${E}[31ma${E}[0m ${E}[31mb${E}[0m`);
    expect(serialize(d, { wrap: false })).toBe(`${E}[31ma b${E}[0m`);
  });

  it("aggressive mode keeps whitespace with background", () => {
    const d = doc(run("a", { fg: 31 }), run(" ", { bg: 41 }));
    expect(serialize(d, { wrap: false })).toBe(`${E}[31ma${E}[0;41m ${E}[0m`);
  });

  it("reports length parts that sum to the output length", () => {
    const p = serializeParts(doc(run("ab", { fg: 31 }), run("c")));
    expect(p.textChars + p.escapeChars + p.wrapChars).toBe(p.output.length);
    expect(p.wrapChars).toBe(12);
  });

  it("transition is empty for equal styles", () => {
    expect(transition(S({ fg: 31 }), S({ fg: 31 }))).toBe("");
    expect(transition(S({ fg: 31 }), S())).toBe(`${E}[0m`);
  });
});

const styleArb: fc.Arbitrary<Style> = fc.record({
  fg: fc.constantFrom(null, 30, 31, 32, 33, 34, 35, 36, 37),
  bg: fc.constantFrom(null, 40, 41, 42, 43, 44, 45, 46, 47),
  bold: fc.boolean(),
  underline: fc.boolean(),
}) as fc.Arbitrary<Style>;

const textArb = fc
  .array(fc.constantFrom("a", "Ж", " ", "\n", "😀", "`", "x", "1"), { minLength: 1, maxLength: 6 })
  .map((a) => a.join(""));

const docArb: fc.Arbitrary<Doc> = fc
  .array(fc.record({ text: textArb, style: styleArb }), { maxLength: 8 })
  .map(normalize);

describe("round-trip", () => {
  it("parse(serialize(doc)) equals doc for any normalized doc", () => {
    fc.assert(
      fc.property(docArb, (d) => {
        expect(parseAnsi(serialize(d, { ...raw, tabSize: 0 })).doc).toEqual(d);
      }),
      { numRuns: 500 },
    );
  });

  it("aggressive output keeps the same text", () => {
    fc.assert(
      fc.property(docArb, (d) => {
        const back = parseAnsi(serialize(d, { wrap: false, tabSize: 0 })).doc;
        expect(back.map((r) => r.text).join("")).toBe(d.map((r) => r.text).join(""));
      }),
    );
  });
});

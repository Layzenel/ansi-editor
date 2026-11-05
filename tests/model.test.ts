import { describe, expect, it } from "vitest";
import {
  applyStyle,
  clearStyle,
  deleteRange,
  docLength,
  findStyleRanges,
  insertDoc,
  insertText,
  isDefaultStyle,
  normalize,
  optimizeDoc,
  plainText,
  rangeStyle,
  replaceColor,
  sliceDoc,
  snapOffset,
  styleAt,
  toggle,
} from "../src/core/model";
import { graphemes } from "../src/core/graphemes";
import { S, doc, run } from "./helpers";

describe("normalize", () => {
  it("drops empty runs and merges equal neighbours", () => {
    expect(normalize(doc(run(""), run("a"), run("b"), run("c", { fg: 31 }), run("")))).toEqual(
      doc(run("ab"), run("c", { fg: 31 })),
    );
  });
});

describe("applyStyle", () => {
  const base = doc(run("hello"), run("world", { fg: 31 }));

  it("splits runs on boundaries", () => {
    expect(applyStyle(base, 1, 3, { bold: true })).toEqual(
      doc(run("h"), run("el", { bold: true }), run("lo"), run("world", { fg: 31 })),
    );
  });

  it("works across several runs", () => {
    expect(applyStyle(base, 3, 7, { bg: 40 })).toEqual(
      doc(run("hel"), run("lo", { bg: 40 }), run("wo", { fg: 31, bg: 40 }), run("rld", { fg: 31 })),
    );
  });

  it("merges when result equals neighbour", () => {
    expect(applyStyle(base, 0, 5, { fg: 31 })).toEqual(doc(run("helloworld", { fg: 31 })));
  });

  it("never splits a surrogate pair or emoji sequence", () => {
    const d = doc(run("a😀b👍🏽c"));
    const r = applyStyle(d, 2, 2 + 1, { fg: 32 }); // middle of 😀
    expect(r).toEqual(doc(run("a"), run("😀", { fg: 32 }), run("b👍🏽c")));
    const r2 = applyStyle(d, 5, 6, { fg: 33 }); // inside 👍🏽
    expect(r2[1]).toEqual(run("👍🏽", { fg: 33 }));
  });

  it("clamps out-of-range offsets", () => {
    expect(applyStyle(doc(run("ab")), -5, 99, { bold: true })).toEqual(
      doc(run("ab", { bold: true })),
    );
  });
});

describe("toggle", () => {
  it("sets when range is mixed, removes when all set", () => {
    const d = doc(run("ab", { bold: true }), run("cd"));
    const on = toggle(d, 0, 4, "bold");
    expect(on).toEqual(doc(run("abcd", { bold: true })));
    expect(toggle(on, 0, 4, "bold")).toEqual(doc(run("abcd")));
    expect(toggle(doc(run("ab", { underline: true })), 0, 2, "underline")).toEqual(doc(run("ab")));
  });
});

describe("edit operations", () => {
  it("insertText inherits nothing implicitly and normalizes", () => {
    expect(insertText(doc(run("ac")), 1, "b", S())).toEqual(doc(run("abc")));
    expect(insertText([], 0, "x", S({ fg: 31 }))).toEqual(doc(run("x", { fg: 31 })));
    expect(insertText(doc(run("ac")), 1, "b", S({ fg: 31 }))).toEqual(
      doc(run("a"), run("b", { fg: 31 }), run("c")),
    );
  });

  it("insertDoc inserts styled content", () => {
    expect(insertDoc(doc(run("ab")), 2, doc(run("c", { bold: true })))).toEqual(
      doc(run("ab"), run("c", { bold: true })),
    );
  });

  it("deleteRange removes across runs", () => {
    expect(deleteRange(doc(run("ab"), run("cd", { fg: 31 })), 1, 3)).toEqual(
      doc(run("a"), run("d", { fg: 31 })),
    );
  });

  it("deleteRange removes a whole emoji", () => {
    expect(plainText(deleteRange(doc(run("a😀b")), 1, 2))).toBe("ab");
  });

  it("clearStyle resets", () => {
    expect(clearStyle(doc(run("ab", { fg: 31, bold: true })), 0, 1)).toEqual(
      doc(run("a"), run("b", { fg: 31, bold: true })),
    );
  });

  it("sliceDoc and docLength", () => {
    const d = doc(run("ab"), run("cd", { fg: 31 }));
    expect(sliceDoc(d, 1, 3)).toEqual(doc(run("b"), run("c", { fg: 31 })));
    expect(docLength(d)).toBe(4);
  });

  it("snapOffset floors to a grapheme boundary", () => {
    expect(snapOffset(doc(run("a😀")), 2)).toBe(1);
    expect(snapOffset(doc(run("a")), 9)).toBe(1);
  });
});

describe("queries", () => {
  const d = doc(run("ab", { fg: 31 }), run("cd", { fg: 31, bold: true }));

  it("styleAt uses the character to the left", () => {
    expect(styleAt(d, 0)).toEqual(S({ fg: 31 }));
    expect(styleAt(d, 2)).toEqual(S({ fg: 31 }));
    expect(styleAt(d, 3)).toEqual(S({ fg: 31, bold: true }));
    expect(styleAt(d, 99)).toEqual(S({ fg: 31, bold: true }));
    expect(isDefaultStyle(styleAt([], 0))).toBe(true);
  });

  it("rangeStyle reports mixed attributes", () => {
    expect(rangeStyle(d, 0, 4)).toEqual({ fg: 31, bg: null, bold: "mixed", underline: false });
    expect(rangeStyle(d, 3, 3)).toEqual(S({ fg: 31, bold: true }));
  });

  it("findStyleRanges", () => {
    const x = doc(run("a", { fg: 31 }), run("b"), run("c", { fg: 31 }));
    expect(findStyleRanges(x, (s) => s.fg === 31)).toEqual([
      { start: 0, end: 1 },
      { start: 2, end: 3 },
    ]);
  });

  it("replaceColor swaps one layer", () => {
    expect(replaceColor(d, "fg", 31, 34)).toEqual(
      doc(run("ab", { fg: 34 }), run("cd", { fg: 34, bold: true })),
    );
    expect(replaceColor(doc(run("a", { bg: 41 })), "bg", 41, null)).toEqual(doc(run("a")));
  });

  it("optimizeDoc merges invisible whitespace into the previous run", () => {
    expect(optimizeDoc(doc(run("a", { fg: 31 }), run(" "), run("b", { fg: 31 })))).toEqual(
      doc(run("a b", { fg: 31 })),
    );
    expect(optimizeDoc(doc(run(" "), run("a", { fg: 31 })))).toEqual(
      doc(run(" "), run("a", { fg: 31 })),
    );
  });

  it("graphemes splits user-perceived characters", () => {
    expect(graphemes("a👍🏽б")).toEqual(["a", "👍🏽", "б"]);
  });
});

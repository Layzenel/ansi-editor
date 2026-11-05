import { describe, expect, it } from "vitest";
import {
  canRedo,
  canUndo,
  createHistory,
  HISTORY_LIMIT,
  push,
  redo,
  undo,
} from "../src/core/history";
import { alternate, effectUnits, rainbow } from "../src/core/effects";
import {
  hasTripleBackticks,
  lengthInfo,
  limitLevel,
  messageLimit,
  optimizeWithSavings,
} from "../src/core/limits";
import { serialize } from "../src/core/serializer";
import { codeFor, colorIndex, isBgCode, isFgCode, paletteCssVars } from "../src/core/palette";
import { doc, run } from "./helpers";

describe("history", () => {
  it("undoes and redoes", () => {
    let h = createHistory(0);
    h = push(h, 1);
    h = push(h, 2);
    expect(canUndo(h)).toBe(true);
    h = undo(h);
    expect(h.present).toBe(1);
    expect(canRedo(h)).toBe(true);
    h = redo(h);
    expect(h.present).toBe(2);
    expect(redo(h)).toBe(h);
    expect(undo(createHistory(0)).present).toBe(0);
  });

  it("coalesces typing in the same group within a second", () => {
    let h = createHistory("");
    h = push(h, "a", { group: "type", now: 1000 });
    h = push(h, "ab", { group: "type", now: 1500 });
    expect(h.past).toEqual([""]);
    h = push(h, "abc", { group: "type", now: 3000 });
    expect(h.past).toEqual(["", "ab"]);
  });

  it("breakAfter closes the group", () => {
    let h = createHistory("");
    h = push(h, "a ", { group: "type", now: 0, breakAfter: true });
    h = push(h, "a b", { group: "type", now: 10 });
    expect(h.past).toEqual(["", "a "]);
  });

  it("keeps at most the limit", () => {
    let h = createHistory(0);
    for (let i = 1; i <= HISTORY_LIMIT + 20; i++) h = push(h, i);
    expect(h.past).toHaveLength(HISTORY_LIMIT);
  });
});

describe("effects", () => {
  it("rainbow colors characters and skips spaces", () => {
    const r = rainbow(doc(run("ab c")), 0, 4);
    expect(r).toEqual(doc(run("a", { fg: 31 }), run("b", { fg: 33 }), run(" "), run("c", { fg: 32 })));
  });

  it("rainbow on background and by word", () => {
    const r = rainbow(doc(run("ab cd")), 0, 5, { step: "word", layer: "bg" });
    expect(r).toEqual(doc(run("ab", { bg: 41 }), run(" "), run("cd", { bg: 43 })));
  });

  it("alternate by line keeps other text intact", () => {
    const r = alternate(doc(run("x\ny\nz")), 0, 5, { colors: [2, 5], step: "line" });
    expect(r).toEqual(
      doc(run("x", { fg: 32 }), run("\n"), run("y", { fg: 35 }), run("\n"), run("z", { fg: 32 })),
    );
  });

  it("applies only to the range and is deterministic", () => {
    const d = doc(run("hello", { bold: true }));
    const a = rainbow(d, 1, 3);
    expect(a).toEqual(rainbow(d, 1, 3));
    expect(a[0]).toEqual(run("h", { bold: true }));
    expect(rainbow(d, 2, 2)).toBe(d);
    expect(rainbow(d, 0, 5, { colors: [] })).toBe(d);
  });

  it("char units keep spaces when asked", () => {
    expect(effectUnits("a b", "char", false)).toHaveLength(3);
  });
});

describe("limits", () => {
  it("picks the limit", () => {
    expect(messageLimit("auto", 0)).toBe(2000);
    expect(messageLimit("auto", 2)).toBe(4000);
    expect(messageLimit("auto", 3)).toBe(2000);
    expect(messageLimit("4000", null)).toBe(4000);
    expect(messageLimit("2000", 2)).toBe(2000);
  });

  it("levels", () => {
    expect(limitLevel(10, 100)).toBe("ok");
    expect(limitLevel(90, 100)).toBe("warning");
    expect(limitLevel(101, 100)).toBe("error");
  });

  it("length equals the final string length", () => {
    const d = doc(run("hi", { fg: 31 }), run(" there\t", { bold: true }));
    const info = lengthInfo(d, {}, 2000);
    expect(info.total).toBe(serialize(d).length);
  });

  it("optimize reports savings", () => {
    const d = doc(run("a", { fg: 31 }), run(" "), run("b", { fg: 31 }));
    const r = optimizeWithSavings(d, { aggressive: false });
    expect(r.saved).toBeGreaterThan(0);
    expect(hasTripleBackticks("a```")).toBe(true);
  });
});

describe("palette", () => {
  it("helpers", () => {
    expect(codeFor("fg", 1)).toBe(31);
    expect(codeFor("bg", 7)).toBe(47);
    expect(colorIndex(45)).toBe(5);
    expect(isFgCode(37)).toBe(true);
    expect(isFgCode(38)).toBe(false);
    expect(isBgCode(40)).toBe(true);
    expect(paletteCssVars()).toContain("--ansi-fg-31: #dc322f");
    expect(paletteCssVars()).toContain("--ansi-bg-47: #fdf6e3");
  });
});

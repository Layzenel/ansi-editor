import {
  applyStyle,
  clearStyle,
  docLength,
  findStyleRanges,
  rangeStyle,
  styleAt,
  toggle,
  type Doc,
  type Range,
  type RangeStyle,
  type Style,
  DEFAULT_STYLE,
} from "../core/model";
import type { BgCode, ColorCode, FgCode, Layer } from "../core/palette";
import { canRedo, canUndo } from "../core/history";
import { editorReducer, initEditorState, type EditorState } from "./editorState";
import type { EditMeta } from "./RichEditor";

const { useCallback, useMemo, useReducer } = BdApi.React;

const ordered = (r: Range): Range => ({
  start: Math.min(r.start, r.end),
  end: Math.max(r.start, r.end),
});

/** Editor state + style commands. Commands target the pipette ranges, the selection, or the typing style. */
export function useEditor(initialDoc: Doc) {
  const [state, dispatch] = useReducer(editorReducer, initialDoc, initEditorState);
  const doc = state.history.present.doc;
  const sel = ordered(state.sel);
  const collapsed = sel.start === sel.end;

  const typingStyle: Style = state.pending ?? styleAt(doc, sel.start);
  const targets: Range[] | null = state.multi ?? (collapsed ? null : [sel]);

  const edit = useCallback(
    (next: Doc, nextSel: Range, meta: EditMeta & { keepMulti?: boolean } = {}) =>
      dispatch({ type: "edit", doc: next, sel: nextSel, ...meta }),
    [],
  );

  const mapTargets = (fn: (d: Doc, r: Range) => Doc) => {
    if (!targets) return;
    const next = targets.reduce(fn, doc);
    edit(next, state.sel, { keepMulti: !!state.multi });
  };

  const patchStyle = (patch: Partial<Style>) => {
    if (targets) mapTargets((d, r) => applyStyle(d, r.start, r.end, patch));
    else dispatch({ type: "pending", style: { ...typingStyle, ...patch } });
  };

  const toggleAttr = (attr: "bold" | "underline") => {
    if (!targets) {
      dispatch({ type: "pending", style: { ...typingStyle, [attr]: !typingStyle[attr] } });
    } else if (targets.length === 1) {
      mapTargets((d, r) => toggle(d, r.start, r.end, attr));
    } else {
      const all = targets.every((r) => rangeStyle(doc, r.start, r.end)[attr] === true);
      mapTargets((d, r) => applyStyle(d, r.start, r.end, { [attr]: !all }));
    }
  };

  const resetStyle = () => {
    if (targets) mapTargets((d, r) => clearStyle(d, r.start, r.end));
    else dispatch({ type: "pending", style: { ...DEFAULT_STYLE } });
  };

  /** Pipette: select every range with the same color in that layer. */
  const selectSameColor = (layer: Layer, code: ColorCode | null) => {
    const ranges = findStyleRanges(doc, (s) => s[layer] === code);
    if (!ranges.length) return;
    if (ranges.length === 1) dispatch({ type: "select", sel: ranges[0] });
    else dispatch({ type: "multi", ranges });
  };

  const pickColor = (layer: Layer, code: ColorCode | null, alt: boolean) => {
    if (alt) selectSameColor(layer, code);
    else patchStyle({ [layer]: code } as Partial<Style>);
  };

  /** Indicator state: the selection's common style, or the typing style for a caret. */
  const indicator: RangeStyle = useMemo(() => {
    if (!targets) return { ...typingStyle };
    if (targets.length === 1) return rangeStyle(doc, targets[0].start, targets[0].end);
    const parts = targets.map((r) => rangeStyle(doc, r.start, r.end));
    const merge = <K extends keyof RangeStyle>(k: K): RangeStyle[K] =>
      parts.every((p) => p[k] === parts[0][k]) ? parts[0][k] : ("mixed" as RangeStyle[K]);
    return { fg: merge("fg"), bg: merge("bg"), bold: merge("bold"), underline: merge("underline") };
  }, [doc, targets, typingStyle]);

  /** Colors present in the target ranges (for partial swatch state). */
  const present = useMemo(() => {
    const fg = new Set<FgCode | null>();
    const bg = new Set<BgCode | null>();
    let pos = 0;
    for (const run of doc) {
      const end = pos + run.text.length;
      if (targets?.some((r) => r.start < end && r.end > pos)) {
        fg.add(run.style.fg);
        bg.add(run.style.bg);
      }
      pos = end;
    }
    return { fg, bg };
  }, [doc, targets]);

  const replaceAll = (next: Doc) => {
    const end = docLength(next);
    edit(next, { start: end, end });
  };

  return {
    state: state as EditorState,
    dispatch,
    doc,
    sel,
    typingStyle,
    indicator,
    present,
    canUndo: canUndo(state.history),
    canRedo: canRedo(state.history),
    edit,
    replaceAll,
    patchStyle,
    toggleAttr,
    resetStyle,
    pickColor,
  };
}

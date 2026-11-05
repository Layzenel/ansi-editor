import { createHistory, push, redo, undo, type History } from "../core/history";
import { docLength, type Doc, type Range, type Style } from "../core/model";

export interface Snapshot {
  doc: Doc;
  sel: Range;
}

export interface EditorState {
  history: History<Snapshot>;
  sel: Range;
  /** Style chosen with a collapsed caret; applies to the next typed text. */
  pending: Style | null;
  /** Multi-range selection from the pipette (Alt+click on a swatch). */
  multi: Range[] | null;
  /** True once the doc changed since opening / the last export. */
  dirty: boolean;
}

export type EditorAction =
  | { type: "select"; sel: Range }
  | {
      type: "edit";
      doc: Doc;
      sel: Range;
      group?: string | null;
      breakAfter?: boolean;
      keepMulti?: boolean;
    }
  | { type: "pending"; style: Style | null }
  | { type: "multi"; ranges: Range[] | null }
  | { type: "undo" }
  | { type: "redo" }
  | { type: "clean" };

export function initEditorState(doc: Doc): EditorState {
  const end = docLength(doc);
  const sel = { start: end, end };
  return { history: createHistory({ doc, sel }), sel, pending: null, multi: null, dirty: false };
}

const sameRange = (a: Range, b: Range) => a.start === b.start && a.end === b.end;

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "select":
      if (sameRange(state.sel, action.sel)) return state;
      return { ...state, sel: action.sel, pending: null, multi: null };
    case "edit": {
      const history = push(
        state.history,
        { doc: action.doc, sel: action.sel },
        { group: action.group ?? null, breakAfter: action.breakAfter },
      );
      return {
        ...state,
        history,
        sel: action.sel,
        pending: null,
        multi: action.keepMulti ? state.multi : null,
        dirty: true,
      };
    }
    case "pending":
      return { ...state, pending: action.style };
    case "multi":
      return { ...state, multi: action.ranges };
    case "undo":
    case "redo": {
      const history = action.type === "undo" ? undo(state.history) : redo(state.history);
      if (history === state.history) return state;
      return {
        ...state,
        history,
        sel: history.present.sel,
        pending: null,
        multi: null,
        dirty: true,
      };
    }
    case "clean":
      return { ...state, dirty: false };
  }
}

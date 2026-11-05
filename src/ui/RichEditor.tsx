import {
  deleteRange,
  docLength,
  replaceRange,
  snapRange,
  styleAt,
  type Doc,
  type Range,
  type Style,
} from "../core/model";
import { graphemeBoundaries } from "../core/graphemes";
import { hasAnsi, parseMessage } from "../core/parser";
import { getSelectionOffsets, rangeOffsets, setSelectionOffsets } from "./selection";
import { renderInto } from "./render";
import { t } from "../i18n";

const { useEffect, useLayoutEffect, useRef, useState } = BdApi.React;

export interface EditMeta {
  group?: string | null;
  breakAfter?: boolean;
}

export interface RichEditorProps {
  doc: Doc;
  sel: Range;
  multi: Range[] | null;
  pending: Style | null;
  literalEscapes: boolean;
  onEdit(doc: Doc, sel: Range, meta?: EditMeta): void;
  onSelect(sel: Range): void;
  onUndo(): void;
  onRedo(): void;
  editorRef: { current: HTMLDivElement | null };
}

/** Converts pasted/dropped text to a document: ANSI is parsed, plain text gets the typing style. */
function pastedDoc(text: string, style: Style, literalEscapes: boolean): Doc {
  if (hasAnsi(text, literalEscapes)) return parseMessage(text, 0, { literalEscapes }).doc;
  return [{ text, style }];
}

export function RichEditor(props: RichEditorProps) {
  const ref = props.editorRef;
  const latest = useRef(props);
  latest.current = props;
  const composing = useRef<Range | null>(null);
  const [renderTick, setRenderTick] = useState(0);

  // Model -> DOM. Only on content changes, so selection moves don't rebuild the DOM.
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || composing.current) return;
    renderInto(root, props.doc, props.multi);
    root.toggleAttribute("data-empty", docLength(props.doc) === 0);
    if (document.activeElement === root) setSelectionOffsets(root, props.sel.start, props.sel.end);
  }, [props.doc, props.multi, renderTick]);

  // Selection state -> DOM.
  useLayoutEffect(() => {
    const root = ref.current;
    if (root && document.activeElement === root && !composing.current) {
      setSelectionOffsets(root, props.sel.start, props.sel.end);
    }
  }, [props.sel.start, props.sel.end]);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const currentSel = (): Range => getSelectionOffsets(root) ?? latest.current.sel;
    const typingStyle = (at: number) => latest.current.pending ?? styleAt(latest.current.doc, at);

    const insert = (content: Doc, range: Range, meta: EditMeta) => {
      const { doc, onEdit } = latest.current;
      const snapped = snapRange(doc, range.start, range.end);
      const next = replaceRange(doc, snapped.start, snapped.end, content);
      // Caret goes right after the inserted content: everything after the old range stays as is.
      const caret = docLength(next) - (docLength(doc) - snapped.end);
      onEdit(next, { start: caret, end: caret }, meta);
    };

    const insertText = (text: string, meta: EditMeta = {}) => {
      const range = currentSel();
      const style = typingStyle(Math.min(range.start, range.end));
      insert([{ text, style }], range, meta);
    };

    const remove = (range: Range) => {
      const { doc, onEdit } = latest.current;
      const lo = Math.min(range.start, range.end);
      const hi = Math.max(range.start, range.end);
      if (lo === hi) return;
      onEdit(deleteRange(doc, lo, hi), { start: lo, end: lo }, { group: "delete" });
    };

    /** Range for a delete when the browser does not report target ranges. */
    const fallbackDeleteRange = (sel: Range, forward: boolean): Range => {
      if (sel.start !== sel.end) return sel;
      const text = latest.current.doc.map((r) => r.text).join("");
      const b = graphemeBoundaries(text);
      if (forward) return { start: sel.start, end: b.find((x) => x > sel.start) ?? sel.start };
      return { start: [...b].reverse().find((x) => x < sel.start) ?? 0, end: sel.start };
    };

    const onBeforeInput = (e: InputEvent) => {
      if (e.isComposing || e.inputType === "insertCompositionText") return;
      e.preventDefault();
      const type = e.inputType;
      if (type === "insertText" || type === "insertReplacementText") {
        const text = e.data ?? e.dataTransfer?.getData("text/plain") ?? "";
        if (text) insertText(text, { group: "type", breakAfter: /\s/.test(text) });
      } else if (type === "insertLineBreak" || type === "insertParagraph") {
        insertText("\n", { group: "type", breakAfter: true });
      } else if (type.startsWith("delete")) {
        const targets = e.getTargetRanges?.() ?? [];
        const r = targets.length ? rangeOffsets(root, targets[0]) : null;
        remove(r ?? fallbackDeleteRange(currentSel(), type.endsWith("Forward")));
      } else if (type === "historyUndo") {
        latest.current.onUndo();
      } else if (type === "historyRedo") {
        latest.current.onRedo();
      }
      // insertFromPaste/Drop are handled by the paste/drop listeners; format* are ignored.
    };

    const onPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData?.getData("text/plain") ?? "";
      if (!text) return;
      const range = currentSel();
      const style = typingStyle(Math.min(range.start, range.end));
      insert(pastedDoc(text, style, latest.current.literalEscapes), range, {});
    };

    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      const text = e.dataTransfer?.getData("text/plain") ?? "";
      if (!text) return;
      const range = currentSel();
      insert(pastedDoc(text, typingStyle(range.start), latest.current.literalEscapes), range, {});
    };

    const onCompositionStart = () => {
      composing.current = currentSel();
    };

    const onCompositionEnd = (e: CompositionEvent) => {
      const range = composing.current ?? latest.current.sel;
      composing.current = null;
      const text = e.data ?? "";
      if (text) insert([{ text, style: typingStyle(Math.min(range.start, range.end)) }], range, {});
      // The browser mutated the DOM during composition: rebuild it from the model.
      setRenderTick((n) => n + 1);
    };

    const onSelectionChange = () => {
      if (composing.current) return;
      const s = getSelectionOffsets(root);
      if (s) latest.current.onSelect(s);
    };

    const onDragStart = (e: DragEvent) => e.preventDefault();

    root.addEventListener("beforeinput", onBeforeInput);
    root.addEventListener("paste", onPaste);
    root.addEventListener("drop", onDrop);
    root.addEventListener("dragstart", onDragStart);
    root.addEventListener("compositionstart", onCompositionStart);
    root.addEventListener("compositionend", onCompositionEnd);
    document.addEventListener("selectionchange", onSelectionChange);
    return () => {
      root.removeEventListener("beforeinput", onBeforeInput);
      root.removeEventListener("paste", onPaste);
      root.removeEventListener("drop", onDrop);
      root.removeEventListener("dragstart", onDragStart);
      root.removeEventListener("compositionstart", onCompositionStart);
      root.removeEventListener("compositionend", onCompositionEnd);
      document.removeEventListener("selectionchange", onSelectionChange);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="ansiEditor-editor ansiEditor-code"
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      role="textbox"
      aria-multiline="true"
      aria-label={t("view.editor")}
      data-placeholder={t("view.placeholder")}
      tabIndex={0}
    />
  );
}

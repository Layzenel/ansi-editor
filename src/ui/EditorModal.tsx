import { docLength, plainText, replaceRange, styleAt, type Doc, type Style } from "../core/model";
import { extractAnsiBlocks, parseAnsi, parseMessage, type ParseResult } from "../core/parser";
import { serialize, type SerializeOptions } from "../core/serializer";
import { hasTripleBackticks, lengthInfo, messageLimit, optimizeWithSavings } from "../core/limits";
import { storage, type Preset, type Settings } from "../storage";
import {
  copyText,
  editMessage,
  insertIntoTextArea,
  readClipboard,
  sendMessage,
} from "../discord/insert";
import { channelDraft, currentChannelId, currentUser, hasPendingReply } from "../discord/modules";
import type { EditTarget } from "../discord/contextMenu";
import { useEditor } from "./useEditor";
import { RichEditor } from "./RichEditor";
import { Toolbar, type Panel } from "./Toolbar";
import { Preview } from "./Preview";
import { RawView } from "./RawView";
import { Footer, type CopyKind } from "./Footer";
import { EffectsPanel } from "./EffectsPanel";
import { PresetsPanel } from "./PresetsPanel";
import { ConfirmDialog } from "./ConfirmDialog";
import { CloseIcon } from "./icons";
import { t } from "../i18n";

const { useEffect, useMemo, useRef, useState } = BdApi.React;

export interface EditorOptions {
  /** ANSI content to open (context menu, recent). */
  content?: string;
  /** Edit an existing message's block. */
  edit?: EditTarget;
}

type View = "editor" | "preview" | "code";
const NARROW_WIDTH = 900;
const DRAFT_DEBOUNCE_MS = 500;

/** Lossless form for draft/recent storage. */
const STORE_OPTS: Partial<SerializeOptions> = {
  wrap: false,
  aggressive: false,
  tabSize: 0,
  escapeBackticks: false,
  trailingReset: true,
};

function toast(message: string, type: "info" | "success" | "warning" | "error" = "info") {
  BdApi.UI.showToast(message, { type });
}

function warnParse(r: ParseResult) {
  if (r.warnings.unsupportedCodes > 0)
    toast(t("import.warnings", { n: r.warnings.unsupportedCodes }), "warning");
}

function initialDoc(opts: EditorOptions, literalEscapes: boolean): Doc {
  if (opts.edit) return parseAnsi(opts.edit.block.content).doc;
  if (opts.content !== undefined) {
    const r = parseAnsi(opts.content, { literalEscapes });
    warnParse(r);
    return r.doc;
  }
  return parseAnsi(storage.getDraft()).doc;
}

function useSettings(): Settings {
  const [s, setS] = useState(storage.getSettings());
  useEffect(() => storage.onSettingsChange(setS), []);
  return s;
}

function useNarrow(): boolean {
  const [narrow, setNarrow] = useState(window.innerWidth < NARROW_WIDTH);
  useEffect(() => {
    const on = () => setNarrow(window.innerWidth < NARROW_WIDTH);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return narrow;
}

const isTextField = (el: EventTarget | null) =>
  el instanceof HTMLInputElement ||
  el instanceof HTMLTextAreaElement ||
  el instanceof HTMLSelectElement;

export function EditorModal({ options, onClose }: { options: EditorOptions; onClose(): void }) {
  const settings = useSettings();
  const narrow = useNarrow();
  const ed = useEditor(useMemo(() => initialDoc(options, settings.literalEscapes), []));
  const { doc, sel, state } = ed;

  const editorRef = useRef<HTMLDivElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [view, setView] = useState<View>("editor");
  const [sideView, setSideView] = useState<"preview" | "code">("preview");
  const [confirm, setConfirm] = useState<{ text: string; yes(): void } | null>(null);
  const [presets, setPresetsState] = useState<Preset[]>(() => storage.getPresets());
  const [recent, setRecent] = useState<string[]>(() => storage.getRecent());
  const [closing, setClosing] = useState(false);
  const channelId = options.edit?.channelId ?? currentChannelId();
  const [importOffer, setImportOffer] = useState<string | null>(null);

  const serializeOpts: Partial<SerializeOptions> = {
    trailingReset: settings.trailingReset,
    aggressive: settings.aggressive,
    tabSize: settings.tabSize,
    escapeBackticks: true,
  };
  const limit = messageLimit(settings.charLimit, currentUser()?.premiumType);
  const info = useMemo(
    () => lengthInfo(doc, { ...serializeOpts, wrap: true }, limit),
    [doc, settings, limit],
  );
  const body = useMemo(() => serialize(doc, { ...serializeOpts, wrap: false }), [doc, settings]);
  const replying = !options.edit && hasPendingReply(channelId);
  const layout = narrow && settings.layout === "side" ? "tabs" : settings.layout;

  // Offer to import an ANSI block already typed in the message box.
  useEffect(() => {
    if (options.edit || options.content !== undefined || settings.importOnOpen === "never") return;
    const draft = channelDraft(channelId);
    if (!extractAnsiBlocks(draft).length) return;
    if (settings.importOnOpen === "always") importFromText(draft);
    else setImportOffer(draft);
  }, []);

  // Autosave the draft (not while editing an existing message).
  useEffect(() => {
    if (options.edit) return;
    const id = setTimeout(() => storage.setDraft(serialize(doc, STORE_OPTS)), DRAFT_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [doc]);

  // Remember the window size.
  useEffect(() => {
    const box = boxRef.current;
    if (!box || typeof ResizeObserver === "undefined") return;
    let id: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(id);
      id = setTimeout(
        () => storage.setUi({ width: box.offsetWidth, height: box.offsetHeight }),
        300,
      );
    });
    ro.observe(box);
    return () => (clearTimeout(id), ro.disconnect());
  }, []);

  // Keep focus inside the modal: after switching views or closing a panel, return to the editor.
  useEffect(() => {
    if (!panel && !confirm) editorRef.current?.focus();
  }, [view, panel, confirm]);

  // If focus still escapes to <body> (e.g. a focused control unmounted), Escape must keep working.
  const escRef = useRef<() => void>(() => {});
  escRef.current = () => (panel ? setPanel(null) : confirm ? setConfirm(null) : requestClose());
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || document.activeElement !== document.body) return;
      e.preventDefault();
      escRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const ui = useMemo(() => storage.getUi(), []);

  function importFromText(text: string) {
    const r = parseMessage(text, 0, { literalEscapes: settings.literalEscapes });
    warnParse(r);
    ed.replaceAll(r.doc);
  }

  const ask = (text: string, yes: () => void) => setConfirm({ text, yes });

  const close = () => {
    setClosing(true);
    setTimeout(onClose, 150);
  };
  const requestClose = () => (state.dirty ? ask(t("confirm.discard"), close) : close());

  const finish = () => {
    const stored = serialize(doc, STORE_OPTS);
    storage.addRecent(stored);
    setRecent(storage.getRecent());
    ed.dispatch({ type: "clean" });
  };

  const doInsert = async () => {
    await insertIntoTextArea(info.output);
    finish();
    if (!options.edit) storage.setDraft("");
    close();
  };

  const doSend = async () => {
    if (info.level === "error") return;
    if (replying) return doInsert();
    const ok = await sendMessage(info.output, channelId);
    finish();
    storage.setDraft("");
    if (ok) toast(t("toast.sent"), "success");
    close();
  };

  const doSave = async () => {
    const target = options.edit;
    if (!target || info.level === "error") return;
    const { content, block } = target;
    const next = content.slice(0, block.start) + info.output + content.slice(block.end);
    const ok = await editMessage(target.channelId, target.messageId, next);
    finish();
    if (ok) toast(t("toast.saved"), "success");
    close();
  };

  const doCopy = async (kind: CopyKind) => {
    const text = kind === "wrapped" ? info.output : kind === "raw" ? body : plainText(doc);
    const ok = await copyText(text);
    if (ok) finish();
    toast(ok ? t("toast.copied") : t("toast.noModules"), ok ? "success" : "error");
  };

  const primaryAction = options.edit ? "save" : settings.primaryAction;
  const doPrimary = () => {
    if (primaryAction === "save") return doSave();
    if (primaryAction === "send") return doSend();
    if (primaryAction === "copy") return doCopy("wrapped");
    return doInsert();
  };

  const doOptimize = () => {
    const r = optimizeWithSavings(doc, { ...serializeOpts, wrap: true });
    if (r.saved > 0) {
      ed.edit(r.doc, state.sel);
      toast(t("toast.optimized", { n: r.saved }), "success");
    } else toast(t("toast.nothingToOptimize"));
  };

  const importClipboard = async () => {
    const text = await readClipboard();
    if (!text) return toast(t("toast.clipboardEmpty"), "warning");
    const r = parseMessage(text, 0, { literalEscapes: settings.literalEscapes });
    warnParse(r);
    const next = replaceRange(doc, sel.start, sel.end, r.doc);
    const caret = sel.start + docLength(r.doc);
    ed.edit(next, { start: caret, end: caret });
  };

  const applyPreset = (style: Style) => ed.patchStyle({ ...style });
  const savePresets = (p: Preset[]) => {
    setPresetsState(p);
    storage.setPresets(p);
  };

  const onKeyDown = (e: any) => {
    e.stopPropagation();
    const mod = e.ctrlKey || e.metaKey;
    if (e.key === "Escape") {
      e.preventDefault();
      if (panel) setPanel(null);
      else requestClose();
      return;
    }
    if (e.key === "Tab") return trapFocus(e);
    if (mod && e.code === "Enter") {
      e.preventDefault();
      doPrimary();
      return;
    }
    if (isTextField(e.target)) return;
    const run = (fn: () => void) => (e.preventDefault(), fn());
    if (mod && e.shiftKey && e.code === "KeyC") return run(() => doCopy("wrapped"));
    if (mod && e.shiftKey && e.code === "KeyZ") return run(() => ed.dispatch({ type: "redo" }));
    if (mod && e.code === "KeyY") return run(() => ed.dispatch({ type: "redo" }));
    if (mod && e.code === "KeyZ") return run(() => ed.dispatch({ type: "undo" }));
    if (mod && e.code === "KeyB") return run(() => ed.toggleAttr("bold"));
    if (mod && e.code === "KeyU") return run(() => ed.toggleAttr("underline"));
    if (mod && e.code === "Space") return run(ed.resetStyle);
    const digit = /^Digit([1-9])$/.exec(e.code);
    if (e.altKey && !mod && digit) {
      const preset = presets[Number(digit[1]) - 1];
      if (preset) run(() => applyPreset(preset.style));
    }
  };

  function trapFocus(e: any) {
    const box = boxRef.current;
    if (!box) return;
    const items = Array.from(
      box.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [tabindex="0"], input, select, textarea, [contenteditable="true"]',
      ),
    ).filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    const wrapTo = e.shiftKey
      ? document.activeElement === first
        ? last
        : null
      : document.activeElement === last
        ? first
        : null;
    if (wrapTo) {
      e.preventDefault();
      wrapTo.focus();
    }
  }

  const stop = (e: any) => e.stopPropagation();

  const editor = (
    <RichEditor
      editorRef={editorRef}
      doc={doc}
      sel={state.sel}
      multi={state.multi}
      pending={state.pending}
      literalEscapes={settings.literalEscapes}
      onEdit={(d, s, meta) => ed.edit(d, s, meta)}
      onSelect={(s) => ed.dispatch({ type: "select", sel: s })}
      onUndo={() => ed.dispatch({ type: "undo" })}
      onRedo={() => ed.dispatch({ type: "redo" })}
    />
  );
  const preview = <Preview body={body} />;
  const raw = <RawView output={info.output} onApply={importFromText} />;

  const tabButton = (v: string, label: string, active: boolean, onClick: () => void) => (
    <button
      key={v}
      type="button"
      role="tab"
      aria-selected={active}
      className={`ansiEditor-tab ${active ? "ansiEditor-tabActive" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  let content: ReactNode;
  if (layout === "side") {
    content = (
      <div className="ansiEditor-split2">
        <div className="ansiEditor-pane">{editor}</div>
        <div className="ansiEditor-pane">
          <div className="ansiEditor-tabs" role="tablist">
            {tabButton("preview", t("view.preview"), sideView === "preview", () =>
              setSideView("preview"),
            )}
            {tabButton("code", t("view.code"), sideView === "code", () => setSideView("code"))}
          </div>
          {sideView === "preview" ? preview : raw}
        </div>
      </div>
    );
  } else if (layout === "tabs") {
    content = (
      <div className="ansiEditor-pane">
        <div className="ansiEditor-tabs" role="tablist">
          {tabButton("editor", t("view.editor"), view === "editor", () => setView("editor"))}
          {tabButton("preview", t("view.preview"), view === "preview", () => setView("preview"))}
          {tabButton("code", t("view.code"), view === "code", () => setView("code"))}
        </div>
        {view === "editor" ? editor : view === "preview" ? preview : raw}
      </div>
    );
  } else {
    content = <div className="ansiEditor-pane">{editor}</div>;
  }

  return (
    <div
      className={`ansiEditor-backdrop ${closing ? "ansiEditor-closing" : ""}`}
      onMouseDown={(e) => e.target === e.currentTarget && requestClose()}
      onKeyDown={onKeyDown}
      onKeyUp={stop}
      onKeyPress={stop}
      onPaste={stop}
      onCopy={stop}
      onCut={stop}
    >
      <div
        ref={boxRef}
        className="ansiEditor-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t("modal.title")}
        style={{ width: ui.width, height: ui.height }}
      >
        <div className="ansiEditor-header">
          <h2 className="ansiEditor-title">
            {t("modal.title")}
            {options.edit && (
              <span className="ansiEditor-muted"> · {t("modal.editingMessage")}</span>
            )}
          </h2>
          <button
            type="button"
            className="ansiEditor-close"
            aria-label={t("modal.close")}
            onClick={requestClose}
          >
            <CloseIcon />
          </button>
        </div>
        <Toolbar
          style={ed.indicator}
          presentFg={ed.present.fg}
          presentBg={ed.present.bg}
          canUndo={ed.canUndo}
          canRedo={ed.canRedo}
          panel={panel}
          onFg={(c, alt) => ed.pickColor("fg", c, alt)}
          onBg={(c, alt) => ed.pickColor("bg", c, alt)}
          onBold={() => ed.toggleAttr("bold")}
          onUnderline={() => ed.toggleAttr("underline")}
          onResetStyle={ed.resetStyle}
          onClearAll={() => docLength(doc) && ask(t("confirm.clearAll"), () => ed.replaceAll([]))}
          onUndo={() => ed.dispatch({ type: "undo" })}
          onRedo={() => ed.dispatch({ type: "redo" })}
          onNew={() => {
            const fresh = () => (
              ed.replaceAll([]),
              ed.dispatch({ type: "clean" }),
              storage.setDraft("")
            );
            if (docLength(doc)) ask(t("confirm.new"), fresh);
            else fresh();
          }}
          onImportClipboard={importClipboard}
          onPanel={setPanel}
        />
        {importOffer !== null && (
          <div className="ansiEditor-banner" role="status">
            <span>{t("import.found")}</span>
            <button
              type="button"
              className="ansiEditor-btn ansiEditor-btnPrimary ansiEditor-btnSmall"
              onClick={() => (importFromText(importOffer), setImportOffer(null))}
            >
              {t("import.yes")}
            </button>
            <button
              type="button"
              className="ansiEditor-btn ansiEditor-btnSecondary ansiEditor-btnSmall"
              onClick={() => setImportOffer(null)}
            >
              {t("import.no")}
            </button>
          </div>
        )}
        <div className="ansiEditor-body">
          {content}
          {panel && (
            <div className="ansiEditor-drawer">
              {panel === "effects" ? (
                <EffectsPanel doc={doc} sel={sel} onApply={(d) => ed.edit(d, state.sel)} />
              ) : (
                <PresetsPanel
                  presets={presets}
                  recent={recent}
                  currentStyle={
                    sel.start === sel.end ? ed.typingStyle : styleAt(doc, sel.start + 1)
                  }
                  onApply={applyPreset}
                  onChange={savePresets}
                  onOpenRecent={(ansi) => ed.replaceAll(parseAnsi(ansi).doc)}
                />
              )}
            </div>
          )}
        </div>
        <Footer
          info={info}
          primary={primaryAction}
          replying={replying}
          hasBackticks={hasTripleBackticks(plainText(doc))}
          onInsert={doInsert}
          onSend={doSend}
          onSave={doSave}
          onCopy={doCopy}
          onOptimize={doOptimize}
        />
        {confirm && (
          <ConfirmDialog
            text={confirm.text}
            onNo={() => setConfirm(null)}
            onYes={() => {
              setConfirm(null);
              confirm.yes();
            }}
          />
        )}
      </div>
    </div>
  );
}

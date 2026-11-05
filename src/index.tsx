import meta from "./meta.json";
import css from "./styles/editor.css";
import { paletteCssVars } from "./core/palette";
import { storage } from "./storage";
import { TextAreaButton } from "./discord/textareaButton";
import { patchMessageContextMenu } from "./discord/contextMenu";
import { closeEditor, isEditorOpen, openEditor } from "./ui/openEditor";
import { buildSettingsPanel } from "./ui/SettingsPanel";
import { hotkeyFromEvent } from "./ui/hotkey";

const STYLE_ID = "AnsiEditor-styles";
const LOG = "[AnsiEditor]";

export default class AnsiEditor {
  private button: TextAreaButton | null = null;
  private unpatchMenu: (() => void) | null = null;

  start(): void {
    console.log(LOG, `starting v${meta.version}`);
    BdApi.DOM.addStyle(STYLE_ID, `${paletteCssVars()}\n${css}`);
    this.button = new TextAreaButton(() => openEditor());
    this.button.start().catch((e) => console.error(LOG, "button init failed", e));
    try {
      this.unpatchMenu = patchMessageContextMenu({
        open: (content) => openEditor({ content }),
        edit: (target) => openEditor({ edit: target }),
      });
    } catch (e) {
      console.error(LOG, "context menu init failed", e);
    }
    window.addEventListener("keydown", this.onGlobalKey, true);
  }

  stop(): void {
    window.removeEventListener("keydown", this.onGlobalKey, true);
    this.button?.stop();
    this.button = null;
    this.unpatchMenu?.();
    this.unpatchMenu = null;
    closeEditor();
    BdApi.DOM.removeStyle(STYLE_ID);
    storage.clearCache();
    console.log(LOG, "stopped");
  }

  getSettingsPanel(): ReactNode {
    return buildSettingsPanel();
  }

  /** Global open hotkey; only while the Discord window has focus. */
  private onGlobalKey = (e: KeyboardEvent): void => {
    const hotkey = storage.getSettings().hotkey;
    if (!hotkey || isEditorOpen() || !document.hasFocus()) return;
    if (hotkeyFromEvent(e) !== hotkey) return;
    e.preventDefault();
    e.stopPropagation();
    openEditor();
  };
}

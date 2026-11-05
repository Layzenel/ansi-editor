import type { BgCode, ColorCode, FgCode } from "../core/palette";
import type { RangeStyle } from "../core/model";
import { ColorPalette, keepFocus } from "./ColorPalette";
import {
  BoldIcon,
  ClipboardIcon,
  FileIcon,
  RedoIcon,
  ResetIcon,
  SparkIcon,
  StarIcon,
  TrashIcon,
  UnderlineIcon,
  UndoIcon,
} from "./icons";
import { Tip } from "./Tooltip";
import { t, type StringKey } from "../i18n";

export type Panel = "effects" | "presets" | null;

export interface ToolbarProps {
  style: RangeStyle;
  presentFg: Set<FgCode | null>;
  presentBg: Set<BgCode | null>;
  canUndo: boolean;
  canRedo: boolean;
  panel: Panel;
  onFg(code: ColorCode | null, alt: boolean): void;
  onBg(code: ColorCode | null, alt: boolean): void;
  onBold(): void;
  onUnderline(): void;
  onResetStyle(): void;
  onClearAll(): void;
  onUndo(): void;
  onRedo(): void;
  onNew(): void;
  onImportClipboard(): void;
  onPanel(p: Panel): void;
}

interface IconButtonProps {
  label: StringKey;
  icon: ReactNode;
  onClick(): void;
  pressed?: boolean | "mixed";
  disabled?: boolean;
}

function IconButton({ label, icon, onClick, pressed, disabled }: IconButtonProps) {
  const text = t(label);
  return (
    <Tip text={text}>
      {(tip) => (
        <button
          {...tip}
          type="button"
          aria-label={text}
          aria-pressed={pressed}
          disabled={disabled}
          className={[
            "ansiEditor-iconButton",
            pressed === true ? "ansiEditor-pressed" : "",
            pressed === "mixed" ? "ansiEditor-partial" : "",
          ].join(" ")}
          onMouseDown={keepFocus}
          onClick={onClick}
        >
          {icon}
        </button>
      )}
    </Tip>
  );
}

const toPressed = (v: boolean | "mixed") => (v === "mixed" ? "mixed" : v);

export function Toolbar(p: ToolbarProps) {
  return (
    <div className="ansiEditor-toolbar" role="toolbar" aria-label={t("modal.title")}>
      <div className="ansiEditor-toolGroup">
        <span className="ansiEditor-toolLabel">{t("toolbar.textColor")}</span>
        <ColorPalette layer="fg" value={p.style.fg} present={p.presentFg} onPick={p.onFg} />
      </div>
      <div className="ansiEditor-toolGroup">
        <span className="ansiEditor-toolLabel">{t("toolbar.bgColor")}</span>
        <ColorPalette layer="bg" value={p.style.bg} present={p.presentBg} onPick={p.onBg} />
      </div>
      <div className="ansiEditor-toolGroup ansiEditor-toolButtons">
        <IconButton
          label="toolbar.bold"
          icon={<BoldIcon />}
          pressed={toPressed(p.style.bold)}
          onClick={p.onBold}
        />
        <IconButton
          label="toolbar.underline"
          icon={<UnderlineIcon />}
          pressed={toPressed(p.style.underline)}
          onClick={p.onUnderline}
        />
        <IconButton label="toolbar.resetStyle" icon={<ResetIcon />} onClick={p.onResetStyle} />
        <span className="ansiEditor-divider" />
        <IconButton
          label="toolbar.undo"
          icon={<UndoIcon />}
          disabled={!p.canUndo}
          onClick={p.onUndo}
        />
        <IconButton
          label="toolbar.redo"
          icon={<RedoIcon />}
          disabled={!p.canRedo}
          onClick={p.onRedo}
        />
        <span className="ansiEditor-divider" />
        <IconButton
          label="toolbar.effects"
          icon={<SparkIcon />}
          pressed={p.panel === "effects"}
          onClick={() => p.onPanel(p.panel === "effects" ? null : "effects")}
        />
        <IconButton
          label="toolbar.presets"
          icon={<StarIcon />}
          pressed={p.panel === "presets"}
          onClick={() => p.onPanel(p.panel === "presets" ? null : "presets")}
        />
        <span className="ansiEditor-divider" />
        <IconButton
          label="toolbar.importClipboard"
          icon={<ClipboardIcon />}
          onClick={p.onImportClipboard}
        />
        <IconButton label="toolbar.new" icon={<FileIcon />} onClick={p.onNew} />
        <IconButton label="toolbar.clearAll" icon={<TrashIcon />} onClick={p.onClearAll} />
      </div>
    </div>
  );
}

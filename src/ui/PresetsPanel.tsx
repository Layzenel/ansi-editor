import { parseAnsi } from "../core/parser";
import { plainText, type Style } from "../core/model";
import type { Preset } from "../storage";
import { styleClasses } from "./render";
import { t } from "../i18n";

const { useState } = BdApi.React;

export interface PresetsPanelProps {
  presets: Preset[];
  recent: string[];
  currentStyle: Style;
  onApply(style: Style): void;
  onChange(presets: Preset[]): void;
  onOpenRecent(ansi: string): void;
}

export function PresetsPanel(p: PresetsPanelProps) {
  const [name, setName] = useState("");
  const add = () => {
    const n = name.trim() || `${t("presets.title")} ${p.presets.length + 1}`;
    p.onChange([...p.presets, { name: n, style: { ...p.currentStyle } }]);
    setName("");
  };

  return (
    <div className="ansiEditor-panel" role="region" aria-label={t("toolbar.presets")}>
      <div className="ansiEditor-panelTitle">{t("presets.title")}</div>
      {p.presets.length === 0 && <div className="ansiEditor-muted">{t("presets.empty")}</div>}
      <ul className="ansiEditor-list">
        {p.presets.map((preset, i) => (
          <li key={i} className="ansiEditor-listItem">
            <button
              type="button"
              className="ansiEditor-listMain"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => p.onApply(preset.style)}
            >
              {i < 9 && <kbd className="ansiEditor-kbd">Alt+{i + 1}</kbd>}
              <span className={`ansiEditor-code ansiEditor-sample ${styleClasses(preset.style)}`}>
                {preset.name}
              </span>
            </button>
            <button
              type="button"
              className="ansiEditor-btn ansiEditor-btnSmall"
              aria-label={t("presets.delete")}
              onClick={() => p.onChange(p.presets.filter((_, j) => j !== i))}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <div className="ansiEditor-panelRow">
        <input
          className="ansiEditor-input"
          placeholder={t("presets.namePlaceholder")}
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button type="button" className="ansiEditor-btn ansiEditor-btnSecondary" onClick={add}>
          {t("presets.add")}
        </button>
      </div>
      <div className="ansiEditor-panelTitle">{t("presets.recent")}</div>
      {p.recent.length === 0 && <div className="ansiEditor-muted">{t("presets.recentEmpty")}</div>}
      <ul className="ansiEditor-list">
        {p.recent.map((ansi, i) => {
          const text = plainText(parseAnsi(ansi).doc).replace(/\s+/g, " ").trim();
          return (
            <li key={i} className="ansiEditor-listItem">
              <button
                type="button"
                className="ansiEditor-listMain"
                onClick={() => p.onOpenRecent(ansi)}
              >
                <span className="ansiEditor-ellipsis">{text || "…"}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

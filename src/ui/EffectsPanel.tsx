import {
  DEFAULT_ALTERNATE,
  DEFAULT_RAINBOW,
  applyColorCycle,
  type ColorCycleOptions,
  type EffectStep,
} from "../core/effects";
import { sliceDoc, docLength, type Doc, type Range } from "../core/model";
import { codeFor, type Layer } from "../core/palette";
import { serialize } from "../core/serializer";
import { colorName } from "./ColorPalette";
import { Preview } from "./Preview";
import { t } from "../i18n";

const { useMemo, useState } = BdApi.React;

type Effect = "rainbow" | "alternate";
const PREVIEW_CHARS = 120;

export interface EffectsPanelProps {
  doc: Doc;
  sel: Range;
  onApply(doc: Doc): void;
}

function Select<T extends string>(props: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange(v: T): void;
}) {
  return (
    <label className="ansiEditor-field">
      <span>{props.label}</span>
      <select
        className="ansiEditor-select"
        value={props.value}
        onChange={(e) => props.onChange(e.currentTarget.value as T)}
      >
        {props.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function EffectsPanel({ doc, sel, onApply }: EffectsPanelProps) {
  const [effect, setEffect] = useState<Effect>("rainbow");
  const [opts, setOpts] = useState<Record<Effect, ColorCycleOptions>>({
    rainbow: DEFAULT_RAINBOW,
    alternate: DEFAULT_ALTERNATE,
  });
  const cur = opts[effect];
  const set = (patch: Partial<ColorCycleOptions>) =>
    setOpts({ ...opts, [effect]: { ...cur, ...patch } });

  const hasSelection = sel.start !== sel.end;
  const range: Range = hasSelection
    ? { start: Math.min(sel.start, sel.end), end: Math.max(sel.start, sel.end) }
    : { start: 0, end: docLength(doc) };
  const maxColors = effect === "alternate" ? 4 : 8;
  const minColors = effect === "alternate" ? 2 : 1;

  const preview = useMemo(() => {
    const part = sliceDoc(doc, range.start, Math.min(range.end, range.start + PREVIEW_CHARS));
    const applied = applyColorCycle(part, 0, docLength(part), cur);
    return serialize(applied, { wrap: false, aggressive: false });
  }, [doc, range.start, range.end, cur]);

  const steps: { value: EffectStep; label: string }[] = [
    { value: "char", label: t("effects.step.char") },
    { value: "word", label: t("effects.step.word") },
    { value: "line", label: t("effects.step.line") },
  ];

  return (
    <div className="ansiEditor-panel" role="region" aria-label={t("toolbar.effects")}>
      <div className="ansiEditor-tabs" role="tablist">
        {(["rainbow", "alternate"] as Effect[]).map((e) => (
          <button
            key={e}
            type="button"
            role="tab"
            aria-selected={effect === e}
            className={`ansiEditor-tab ${effect === e ? "ansiEditor-tabActive" : ""}`}
            onClick={() => setEffect(e)}
          >
            {t(`effects.${e}`)}
          </button>
        ))}
      </div>
      <div className="ansiEditor-panelRow">
        <Select
          label={t("effects.step")}
          value={cur.step}
          options={steps}
          onChange={(step) => set({ step })}
        />
        <Select<Layer>
          label={t("effects.layer")}
          value={cur.layer}
          options={[
            { value: "fg", label: t("effects.layer.fg") },
            { value: "bg", label: t("effects.layer.bg") },
          ]}
          onChange={(layer) => set({ layer })}
        />
        <label className="ansiEditor-check">
          <input
            type="checkbox"
            checked={cur.skipSpaces}
            onChange={(e) => set({ skipSpaces: e.currentTarget.checked })}
          />
          {t("effects.skipSpaces")}
        </label>
      </div>
      <div className="ansiEditor-panelRow" aria-label={t("effects.colors")}>
        <span className="ansiEditor-toolLabel">{t("effects.colors")}</span>
        {cur.colors.map((c, i) => (
          <select
            key={i}
            className="ansiEditor-select ansiEditor-colorSelect"
            style={{ backgroundColor: `var(--ansi-${cur.layer}-${codeFor(cur.layer, c)})` }}
            value={c}
            aria-label={`${t("effects.colors")} ${i + 1}`}
            onChange={(e) => {
              const colors = [...cur.colors];
              colors[i] = Number(e.currentTarget.value);
              set({ colors });
            }}
          >
            {Array.from({ length: 8 }, (_, idx) => (
              <option key={idx} value={idx}>
                {colorName(cur.layer, codeFor(cur.layer, idx))}
              </option>
            ))}
          </select>
        ))}
        <button
          type="button"
          className="ansiEditor-btn ansiEditor-btnSmall"
          disabled={cur.colors.length >= maxColors}
          aria-label={t("effects.addColor")}
          onClick={() =>
            set({ colors: [...cur.colors, (cur.colors[cur.colors.length - 1] + 1) % 8] })
          }
        >
          +
        </button>
        <button
          type="button"
          className="ansiEditor-btn ansiEditor-btnSmall"
          disabled={cur.colors.length <= minColors}
          aria-label={t("effects.removeColor")}
          onClick={() => set({ colors: cur.colors.slice(0, -1) })}
        >
          −
        </button>
      </div>
      <Preview body={preview} />
      <div className="ansiEditor-panelRow ansiEditor-panelFooter">
        <span className="ansiEditor-muted">
          {t(hasSelection ? "effects.target.selection" : "effects.target.all")}
        </span>
        <button
          type="button"
          className="ansiEditor-btn ansiEditor-btnPrimary"
          disabled={range.start === range.end}
          onClick={() => onApply(applyColorCycle(doc, range.start, range.end, cur))}
        >
          {t("effects.apply")}
        </button>
      </div>
    </div>
  );
}

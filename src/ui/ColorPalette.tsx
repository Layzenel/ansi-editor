import { BG_CODES, COLOR_IDS, FG_CODES, type ColorCode, type Layer } from "../core/palette";
import type { Mixed } from "../core/model";
import { t, type StringKey } from "../i18n";
import { Tip } from "./Tooltip";

export function colorName(layer: Layer, code: ColorCode): string {
  return t(`color.${layer}.${COLOR_IDS[code]}` as StringKey);
}

/** Keeps focus (and the selection) in the editor when clicking toolbar controls. */
export const keepFocus = (e: { preventDefault(): void }) => e.preventDefault();

interface SwatchProps {
  layer: Layer;
  code: ColorCode | null;
  active: boolean;
  partial: boolean;
  onPick(code: ColorCode | null, alt: boolean): void;
}

function Swatch({ layer, code, active, partial, onPick }: SwatchProps) {
  const name =
    code === null ? t(layer === "fg" ? "toolbar.default" : "toolbar.noBg") : colorName(layer, code);
  const label = code === null ? name : `${code} · ${name}`;
  const state = active ? (partial ? ` (${t("toolbar.partial")})` : "") : "";
  return (
    <Tip text={label + state}>
      {(tip) => (
        <button
          {...tip}
          type="button"
          aria-label={label}
          aria-pressed={active}
          className={[
            "ansiEditor-swatch",
            code === null ? "ansiEditor-swatchNone" : `ansiEditor-swatch-${code}`,
            active ? "ansiEditor-swatchActive" : "",
            partial ? "ansiEditor-swatchPartial" : "",
          ].join(" ")}
          onMouseDown={keepFocus}
          onClick={(e) => onPick(code, e.altKey)}
        />
      )}
    </Tip>
  );
}

export interface ColorPaletteProps {
  layer: Layer;
  /** Value under the caret / of the selection ("mixed" = several). */
  value: Mixed<ColorCode | null>;
  /** Colors present in a mixed selection (for "partial" state). */
  present?: Set<ColorCode | null>;
  onPick(code: ColorCode | null, alt: boolean): void;
}

export function ColorPalette({ layer, value, present, onPick }: ColorPaletteProps) {
  const codes: (ColorCode | null)[] = [null, ...(layer === "fg" ? FG_CODES : BG_CODES)];
  return (
    <div
      className="ansiEditor-palette"
      role="group"
      aria-label={t(layer === "fg" ? "toolbar.textColor" : "toolbar.bgColor")}
    >
      {codes.map((code) => {
        const mixed = value === "mixed";
        const active = mixed ? !!present?.has(code) : value === code;
        return (
          <Swatch
            key={String(code)}
            layer={layer}
            code={code}
            active={active}
            partial={mixed && active}
            onPick={onPick}
          />
        );
      })}
    </div>
  );
}

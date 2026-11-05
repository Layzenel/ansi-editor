/** The only SGR color codes Discord renders inside an ```ansi block. */
export type FgCode = 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37;
export type BgCode = 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47;
export type ColorCode = FgCode | BgCode;
export type Layer = "fg" | "bg";

export const FG_CODES: readonly FgCode[] = [30, 31, 32, 33, 34, 35, 36, 37];
export const BG_CODES: readonly BgCode[] = [40, 41, 42, 43, 44, 45, 46, 47];

/**
 * Preview colors (Solarized, as used by rebane2001's generator).
 * Single source of truth: verify against real Discord rendering before release.
 */
export const PALETTE: Readonly<Record<ColorCode, string>> = {
  30: "#4f545c",
  31: "#dc322f",
  32: "#859900",
  33: "#b58900",
  34: "#268bd2",
  35: "#d33682",
  36: "#2aa198",
  37: "#ffffff",
  40: "#002b36",
  41: "#cb4b16",
  42: "#586e75",
  43: "#657b83",
  44: "#839496",
  45: "#6c71c4",
  46: "#93a1a1",
  47: "#fdf6e3",
};

/** Stable, language-independent color identifiers (used as i18n keys). */
export const COLOR_IDS: Readonly<Record<ColorCode, string>> = {
  30: "gray",
  31: "red",
  32: "green",
  33: "yellow",
  34: "blue",
  35: "pink",
  36: "cyan",
  37: "white",
  40: "firefly",
  41: "orange",
  42: "marbleBlue",
  43: "grayTurquoise",
  44: "gray",
  45: "indigo",
  46: "lightGray",
  47: "white",
};

/** Index 0..7 of a color inside its layer. */
export function colorIndex(code: ColorCode): number {
  return code % 10;
}

/** Builds the fg or bg code for a palette index 0..7. */
export function codeFor(layer: Layer, index: number): ColorCode {
  return ((layer === "fg" ? 30 : 40) + (index & 7)) as ColorCode;
}

export function isFgCode(n: number): n is FgCode {
  return Number.isInteger(n) && n >= 30 && n <= 37;
}

export function isBgCode(n: number): n is BgCode {
  return Number.isInteger(n) && n >= 40 && n <= 47;
}

/** CSS custom properties for every palette color, so user themes can override them. */
export function paletteCssVars(): string {
  const lines = (Object.keys(PALETTE) as unknown as ColorCode[]).map((code) => {
    const layer = Number(code) < 40 ? "fg" : "bg";
    return `  --ansi-${layer}-${code}: ${PALETTE[code]};`;
  });
  return `:root {\n${lines.join("\n")}\n}`;
}

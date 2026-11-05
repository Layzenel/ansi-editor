import type { Style } from "./core/model";
import { isBgCode, isFgCode } from "./core/palette";
import type { LimitSetting } from "./core/limits";
import { t } from "./i18n";

const PLUGIN = "AnsiEditor";
const VERSION = 1;

export type PrimaryAction = "insert" | "send" | "copy";
export type Layout = "side" | "tabs" | "editor";

export interface Settings {
  primaryAction: PrimaryAction;
  buttonPosition: "start" | "end";
  editButton: boolean;
  charLimit: LimitSetting;
  importOnOpen: "ask" | "always" | "never";
  layout: Layout;
  trailingReset: boolean;
  aggressive: boolean;
  tabSize: 0 | 2 | 4;
  literalEscapes: boolean;
  contextMenu: boolean;
  hotkey: string;
}

export const DEFAULT_SETTINGS: Settings = {
  primaryAction: "insert",
  buttonPosition: "start",
  editButton: false,
  charLimit: "auto",
  importOnOpen: "ask",
  layout: "side",
  trailingReset: true,
  aggressive: true,
  tabSize: 4,
  literalEscapes: true,
  contextMenu: true,
  hotkey: "Ctrl+Shift+A",
};

export interface Preset {
  name: string;
  style: Style;
}

export interface UiState {
  width: number;
  height: number;
}

export const DEFAULT_UI: UiState = { width: 900, height: 600 };

interface Envelope<T> {
  version: number;
  data: T;
}

const ENUMS: Partial<Record<keyof Settings, readonly unknown[]>> = {
  primaryAction: ["insert", "send", "copy"],
  buttonPosition: ["start", "end"],
  charLimit: ["auto", "2000", "4000"],
  importOnOpen: ["ask", "always", "never"],
  layout: ["side", "tabs", "editor"],
  tabSize: [0, 2, 4],
};

/** Keeps only valid fields; anything else falls back to the default. */
export function validateSettings(raw: unknown): Settings {
  const out: Settings = { ...DEFAULT_SETTINGS };
  if (!raw || typeof raw !== "object") return out;
  const src = raw as Record<string, unknown>;
  for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof Settings)[]) {
    const v = src[key];
    const allowed = ENUMS[key];
    const ok = allowed ? allowed.includes(v) : typeof v === typeof DEFAULT_SETTINGS[key];
    if (ok) (out as unknown as Record<string, unknown>)[key] = v;
  }
  return out;
}

function validStyle(s: any): s is Style {
  return (
    s &&
    (s.fg === null || isFgCode(s.fg)) &&
    (s.bg === null || isBgCode(s.bg)) &&
    typeof s.bold === "boolean" &&
    typeof s.underline === "boolean"
  );
}

function validatePresets(raw: unknown): Preset[] {
  if (!Array.isArray(raw)) throw new Error("presets");
  return raw.filter((p) => p && typeof p.name === "string" && validStyle(p.style));
}

function validateStrings(raw: unknown): string[] {
  if (!Array.isArray(raw)) throw new Error("strings");
  return raw.filter((s) => typeof s === "string");
}

function validateUi(raw: any): UiState {
  const n = (v: unknown, d: number) => (typeof v === "number" && v > 0 ? v : d);
  return { width: n(raw?.width, DEFAULT_UI.width), height: n(raw?.height, DEFAULT_UI.height) };
}

let warned = false;

/** Loads an envelope, migrating/validating; damaged data resets to the fallback with a toast. */
function load<T>(key: string, fallback: T, validate: (raw: unknown) => T): T {
  let raw: unknown;
  try {
    raw = BdApi.Data.load(PLUGIN, key);
  } catch {
    raw = undefined;
  }
  if (raw === undefined || raw === null) return fallback;
  try {
    const env = raw as Envelope<unknown>;
    if (typeof env !== "object" || typeof env.version !== "number") throw new Error("envelope");
    // Future migrations go here: if (env.version < 2) env.data = migrateV1(env.data) …
    return validate(env.data);
  } catch (e) {
    console.warn("[AnsiEditor] damaged data for", key, e);
    if (!warned) {
      warned = true;
      BdApi.UI.showToast(t("toast.dataReset"), { type: "warning" });
    }
    return fallback;
  }
}

function save<T>(key: string, data: T): void {
  try {
    BdApi.Data.save(PLUGIN, key, { version: VERSION, data } satisfies Envelope<T>);
  } catch (e) {
    console.error("[AnsiEditor] failed to save", key, e);
  }
}

type Listener = (s: Settings) => void;
const listeners = new Set<Listener>();
let settingsCache: Settings | null = null;

export const storage = {
  getSettings(): Settings {
    settingsCache ??= load("settings", { ...DEFAULT_SETTINGS }, validateSettings);
    return settingsCache;
  },
  updateSettings(patch: Partial<Settings>): void {
    settingsCache = validateSettings({ ...storage.getSettings(), ...patch });
    save("settings", settingsCache);
    listeners.forEach((l) => l(settingsCache!));
  },
  onSettingsChange(l: Listener): () => void {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getPresets: () => load("presets", [] as Preset[], validatePresets),
  setPresets: (p: Preset[]) => save("presets", p),
  getRecent: () => load("recent", [] as string[], validateStrings),
  addRecent(ansi: string): void {
    if (!ansi) return;
    const list = [ansi, ...storage.getRecent().filter((s) => s !== ansi)].slice(0, 20);
    save("recent", list);
  },
  getDraft: () => load("draft", "", (raw) => (typeof raw === "string" ? raw : "")),
  setDraft: (ansi: string) => save("draft", ansi),
  getUi: () => load("ui", { ...DEFAULT_UI }, validateUi),
  setUi: (ui: UiState) => save("ui", ui),
  resetAll(): void {
    for (const key of ["settings", "presets", "snippets", "recent", "draft", "ui"]) {
      try {
        BdApi.Data.delete(PLUGIN, key);
      } catch {
        /* ignore */
      }
    }
    settingsCache = null;
    listeners.forEach((l) => l(storage.getSettings()));
  },
  clearCache(): void {
    settingsCache = null;
    listeners.clear();
  },
};

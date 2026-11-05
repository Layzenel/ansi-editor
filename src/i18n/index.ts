import { en, type StringKey } from "./en";
import { ru } from "./ru";

export type { StringKey };

function locale(): string {
  try {
    const store = BdApi.Webpack.getStore?.("LocaleStore");
    if (store?.locale) return String(store.locale);
  } catch {
    /* ignore */
  }
  return document.documentElement.lang || navigator.language || "en";
}

/** Translates a key for the current Discord client language, filling {placeholders}. */
export function t(key: StringKey, vars: Record<string, string | number> = {}): string {
  const table: Record<StringKey, string> = locale().toLowerCase().startsWith("ru") ? ru : en;
  const s = table[key] ?? en[key] ?? key;
  return s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));
}

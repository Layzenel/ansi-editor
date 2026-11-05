/** Hotkey strings look like "Ctrl+Shift+A" and are matched by physical key (layout-independent). */

/** Built-in Discord desktop shortcuts we must not take over. */
export const DISCORD_SHORTCUTS = [
  "Ctrl+K",
  "Ctrl+T",
  "Ctrl+I",
  "Ctrl+E",
  "Ctrl+P",
  "Ctrl+/",
  "Ctrl+'",
  "Ctrl+Shift+M",
  "Ctrl+Shift+D",
  "Ctrl+Shift+U",
  "Ctrl+Shift+N",
  "Ctrl+Shift+T",
  "Ctrl+Shift+I",
  "Ctrl+Shift+H",
  "Ctrl+Shift+Alt+Up",
  "Ctrl+Shift+Alt+Down",
  "Ctrl+Alt+Up",
  "Ctrl+Alt+Down",
  "Ctrl+Enter",
  "Ctrl+Shift+/",
  "Ctrl+R",
];

function keyName(code: string): string | null {
  if (/^Key[A-Z]$/.test(code)) return code.slice(3);
  if (/^Digit\d$/.test(code)) return code.slice(5);
  if (/^F\d{1,2}$/.test(code)) return code;
  const map: Record<string, string> = {
    Slash: "/",
    Quote: "'",
    Period: ".",
    Comma: ",",
    Semicolon: ";",
    BracketLeft: "[",
    BracketRight: "]",
    Backquote: "`",
    Minus: "-",
    Equal: "=",
    ArrowUp: "Up",
    ArrowDown: "Down",
    ArrowLeft: "Left",
    ArrowRight: "Right",
    Space: "Space",
    Enter: "Enter",
  };
  return map[code] ?? null;
}

/** Formats a keyboard event as a hotkey string, or null for lone modifiers. */
export function hotkeyFromEvent(e: KeyboardEvent): string | null {
  const key = keyName(e.code);
  if (!key) return null;
  const parts: string[] = [];
  if (e.ctrlKey || e.metaKey) parts.push("Ctrl");
  if (e.shiftKey) parts.push("Shift");
  if (e.altKey) parts.push("Alt");
  if (!parts.length) return null;
  parts.push(key);
  return parts.join("+");
}

export const isDiscordShortcut = (hotkey: string) => DISCORD_SHORTCUTS.includes(hotkey);
